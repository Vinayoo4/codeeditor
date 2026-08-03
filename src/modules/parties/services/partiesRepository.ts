/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Repository Layer for IndexedDB Persistence
 */

import { db, seedInitialPartiesData, generateSlug } from '../../../db/database';
import { Party, PartyHistoryEntry, PartySettings } from '../types';

export class PartiesRepository {
  /**
   * Generates next sequential party code (e.g. PRT-006).
   */
  static async getNextPartyCode(): Promise<string> {
    await seedInitialPartiesData();
    let settings = await db.settings.get('default');

    if (!settings) {
      settings = {
        id: 'default',
        nextPartyCodeNumber: 1,
        partyCodePrefix: 'PRT',
        allowCustomTypes: true,
        recentTypes: ['customer', 'supplier', 'vendor', 'lead', 'other'],
        updatedAt: new Date().toISOString(),
      };
      await db.settings.put(settings);
    }

    const num = settings.nextPartyCodeNumber || 1;
    const prefix = settings.partyCodePrefix || 'PRT';
    const codeStr = `${prefix}-${String(num).padStart(3, '0')}`;

    // Increment next code counter in settings
    await db.settings.update('default', {
      nextPartyCodeNumber: num + 1,
      updatedAt: new Date().toISOString(),
    });

    return codeStr;
  }

  /**
   * Creates and stores a party record.
   */
  static async createPartyRecord(party: Party): Promise<Party> {
    await seedInitialPartiesData();

    // Ensure slug, version, visible
    if (!party.slug) {
      party.slug = generateSlug(party.name, true);
    }
    if (typeof party.version === 'undefined') {
      party.version = 1;
    }
    if (typeof party.visible === 'undefined') {
      party.visible = party.status === 'active';
    }

    await db.parties.put(party);
    return party;
  }

  /**
   * Updates an existing party record in IndexedDB.
   */
  static async updatePartyRecord(id: string, updates: Partial<Party>): Promise<Party> {
    await seedInitialPartiesData();
    const existing = await db.parties.get(id);
    if (!existing) {
      throw new Error(`Party with ID "${id}" not found.`);
    }

    const updatedRecord: Party = {
      ...existing,
      ...updates,
      version: (existing.version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };

    // Sync visible with status if status changes and visible wasn't explicitly updated
    if (updates.status && updates.status !== existing.status && typeof updates.visible === 'undefined') {
      updatedRecord.visible = updates.status === 'active';
    }

    await db.parties.put(updatedRecord);
    return updatedRecord;
  }

  /**
   * Retrieves a party record by ID.
   */
  static async getPartyRecordById(id: string): Promise<Party | undefined> {
    await seedInitialPartiesData();
    return await db.parties.get(id);
  }

  /**
   * Lists all party records from IndexedDB.
   */
  static async listPartyRecords(): Promise<Party[]> {
    await seedInitialPartiesData();
    return await db.parties.toArray();
  }

  /**
   * Toggles or sets archive status.
   */
  static async archivePartyRecord(id: string): Promise<Party> {
    await seedInitialPartiesData();
    const party = await db.parties.get(id);
    if (!party) {
      throw new Error(`Party with ID "${id}" not found.`);
    }

    const newStatus = party.status === 'active' ? 'archived' : 'active';
    const updated = {
      ...party,
      status: newStatus as 'active' | 'archived',
      visible: newStatus === 'active',
      version: (party.version || 1) + 1,
      updatedAt: new Date().toISOString(),
    };

    await db.parties.put(updated);
    return updated;
  }

  /**
   * Duplicates a party record into a fresh copy with a new code and ID.
   */
  static async duplicatePartyRecord(id: string): Promise<Party> {
    await seedInitialPartiesData();
    const existing = await db.parties.get(id);
    if (!existing) {
      throw new Error(`Party with ID "${id}" not found.`);
    }

    const newCode = await this.getNextPartyCode();
    const newId = `prt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newName = `${existing.name} (Copy)`;
    const nowISO = new Date().toISOString();

    const duplicatedParty: Party = {
      ...existing,
      id: newId,
      slug: generateSlug(newName, true),
      partyCode: newCode,
      name: newName,
      currentBalance: 0,
      openingBalance: 0,
      status: 'active',
      visible: true,
      version: 1,
      relatedExpenseIds: [],
      relatedCatalogItemIds: [],
      relatedPartyIds: [],
      relatedTaskIds: [],
      lifetimeValue: 0,
      totalSpend: 0,
      totalRevenue: 0,
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    await db.parties.put(duplicatedParty);

    // Initial history entry for duplicated party
    await this.appendPartyHistoryEntry({
      id: `hist_${Date.now()}`,
      partyId: newId,
      sourceType: 'note',
      title: 'Party Duplicated',
      amount: 0,
      balanceAfter: 0,
      note: `Duplicated from party record ${existing.partyCode} (${existing.name})`,
      createdAt: nowISO,
    });

    return duplicatedParty;
  }

  /**
   * Appends a history entry.
   */
  static async appendPartyHistoryEntry(entry: PartyHistoryEntry): Promise<PartyHistoryEntry> {
    await seedInitialPartiesData();
    await db.historyEntries.put(entry);
    return entry;
  }

  /**
   * Fetches history entries for a given party ID ordered chronologically.
   */
  static async getHistoryByPartyId(partyId: string): Promise<PartyHistoryEntry[]> {
    await seedInitialPartiesData();
    const entries = await db.historyEntries.where('partyId').equals(partyId).toArray();
    return entries.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Fetches settings or default.
   */
  static async getSettings(): Promise<PartySettings> {
    await seedInitialPartiesData();
    const s = await db.settings.get('default');
    return (
      s || {
        id: 'default',
        nextPartyCodeNumber: 1,
        partyCodePrefix: 'PRT',
        allowCustomTypes: true,
        recentTypes: ['customer', 'supplier', 'vendor', 'lead', 'other'],
        updatedAt: new Date().toISOString(),
      }
    );
  }
}
