/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Service Implementation fulfilling IPartiesService contract.
 * Pure business logic + Repository integration, fully decoupled from React UI.
 */

import { IPartiesService } from './contracts';
import {
  ArchivePartyResponse,
  CreatePartyInput,
  DuplicatePartyResponse,
  PartyDetailResponse,
  PartyHistoryResponse,
  PartyListQuery,
  PartyListResponse,
  PartySummaryResponse,
  RecordAdjustmentInput,
  UpdatePartyInput,
} from './dto';
import { PartiesRepository } from '../services/partiesRepository';
import { applyBalanceChange, buildPartySummary } from '../services/partiesDomain';
import { filterAndSortParties } from '../services/partiesSelectors';
import { validateCreatePartyInput, validateUpdatePartyInput } from '../services/partiesValidation';
import { Party, PartyHistoryEntry } from '../types';

export class PartiesService implements IPartiesService {
  /**
   * Retrieves a paginated and filtered list of parties with summary analytics.
   */
  async getParties(query: PartyListQuery = {}): Promise<PartyListResponse> {
    const allParties = await PartiesRepository.listPartyRecords();
    const filteredParties = filterAndSortParties(allParties, query);
    const summary = buildPartySummary(allParties);

    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 100;
    const startIndex = (page - 1) * limit;
    const paginatedParties = filteredParties.slice(startIndex, startIndex + limit);

    return JSON.parse(
      JSON.stringify({
        data: paginatedParties,
        total: filteredParties.length,
        page,
        limit,
        summary,
      })
    );
  }

  /**
   * Fetches single party detail by ID.
   */
  async getPartyById(id: string): Promise<PartyDetailResponse> {
    const party = await PartiesRepository.getPartyRecordById(id);
    if (!party) {
      throw new Error(`Party with ID "${id}" was not found.`);
    }

    const history = await PartiesRepository.getHistoryByPartyId(id);
    const salesCount = history.filter((h) => h.sourceType === 'sale').length;
    const expensesCount = history.filter((h) => h.sourceType === 'expense').length;

    return JSON.parse(
      JSON.stringify({
        data: party,
        historySummary: {
          totalEntries: history.length,
          totalSalesCount: salesCount,
          totalExpensesCount: expensesCount,
          lastActivityDate: history.length > 0 ? history[0].createdAt : party.updatedAt,
        },
      })
    );
  }

  /**
   * Creates a new party record.
   */
  async createParty(input: CreatePartyInput): Promise<PartyDetailResponse> {
    const errors = validateCreatePartyInput(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map((e) => e.message).join(', ')}`);
    }

    const partyCode = await PartiesRepository.getNextPartyCode();
    const id = `prt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const openingBal = Number(input.openingBalance) || 0;

    const newParty: Party = {
      id,
      slug: '', // Will be generated in repository if empty
      partyCode,
      name: input.name.trim(),
      type: input.type,
      phone: input.phone?.trim() || '',
      email: input.email?.trim() || '',
      address: input.address?.trim() || '',
      city: input.city?.trim() || '',
      state: input.state?.trim() || '',
      gstin: input.gstin?.trim() || '',
      openingBalance: openingBal,
      currentBalance: openingBal,
      notes: input.notes?.trim() || '',
      tags: input.tags ? input.tags.map((t) => t.trim()).filter(Boolean) : [],
      status: 'active',
      visible: true,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    const savedParty = await PartiesRepository.createPartyRecord(newParty);

    // Initial history entry if opening balance exists or party is created
    await PartiesRepository.appendPartyHistoryEntry({
      id: `hist_${Date.now()}`,
      partyId: savedParty.id,
      sourceType: 'manual',
      title: 'Party Created in OS',
      amount: openingBal,
      balanceAfter: openingBal,
      note: openingBal !== 0 ? `Opening balance recorded: $${openingBal}` : 'New relationship record created.',
      createdAt: now,
    });

    return this.getPartyById(savedParty.id);
  }

  /**
   * Updates an existing party.
   */
  async updateParty(input: UpdatePartyInput): Promise<PartyDetailResponse> {
    const errors = validateUpdatePartyInput(input);
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.map((e) => e.message).join(', ')}`);
    }

    const updates: Partial<Party> = {};
    if (input.name !== undefined) updates.name = input.name.trim();
    if (input.type !== undefined) updates.type = input.type;
    if (input.phone !== undefined) updates.phone = input.phone.trim();
    if (input.email !== undefined) updates.email = input.email.trim();
    if (input.address !== undefined) updates.address = input.address.trim();
    if (input.city !== undefined) updates.city = input.city.trim();
    if (input.state !== undefined) updates.state = input.state.trim();
    if (input.gstin !== undefined) updates.gstin = input.gstin.trim();
    if (input.notes !== undefined) updates.notes = input.notes.trim();
    if (input.tags !== undefined)
      updates.tags = input.tags.map((t) => t.trim()).filter(Boolean);
    if (input.status !== undefined) updates.status = input.status;
    if (input.website !== undefined) updates.website = input.website.trim();
    if (input.whatsapp !== undefined) updates.whatsapp = input.whatsapp.trim();
    if (input.relatedPartyIds !== undefined) updates.relatedPartyIds = input.relatedPartyIds;
    if (input.relatedCatalogItemIds !== undefined) updates.relatedCatalogItemIds = input.relatedCatalogItemIds;

    await PartiesRepository.updatePartyRecord(input.id, updates);
    return this.getPartyById(input.id);
  }

  /**
   * Archives or restores a party.
   */
  async archiveParty(id: string): Promise<ArchivePartyResponse> {
    const party = await PartiesRepository.archivePartyRecord(id);
    return JSON.parse(
      JSON.stringify({
        success: true,
        partyId: party.id,
        status: party.status,
        updatedAt: party.updatedAt,
      })
    );
  }

  /**
   * Duplicates a party record.
   */
  async duplicateParty(id: string): Promise<DuplicatePartyResponse> {
    const newParty = await PartiesRepository.duplicatePartyRecord(id);
    return JSON.parse(
      JSON.stringify({
        success: true,
        originalPartyId: id,
        newParty,
      })
    );
  }

  /**
   * Returns global summary across parties.
   */
  async getPartySummary(query: PartyListQuery = {}): Promise<PartySummaryResponse> {
    const all = await PartiesRepository.listPartyRecords();
    const filtered = filterAndSortParties(all, query);
    return buildPartySummary(filtered);
  }

  /**
   * Returns activity history entries for a given party.
   */
  async getPartyHistory(partyId: string): Promise<PartyHistoryResponse> {
    const entries = await PartiesRepository.getHistoryByPartyId(partyId);
    return JSON.parse(
      JSON.stringify({
        partyId,
        entries,
        totalCount: entries.length,
      })
    );
  }

  /**
   * Records a manual or module ledger adjustment entry and updates the party's current balance.
   */
  async recordAdjustment(input: RecordAdjustmentInput): Promise<PartyHistoryEntry> {
    const party = await PartiesRepository.getPartyRecordById(input.partyId);
    if (!party) {
      throw new Error(`Party with ID "${input.partyId}" not found.`);
    }

    const newBalance = applyBalanceChange(party.currentBalance, input.amount);
    const now = new Date().toISOString();

    const historyEntry: PartyHistoryEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      partyId: input.partyId,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      title: input.title,
      amount: input.amount,
      balanceAfter: newBalance,
      note: input.note,
      createdAt: now,
    };

    await PartiesRepository.appendPartyHistoryEntry(historyEntry);
    await PartiesRepository.updatePartyRecord(input.partyId, {
      currentBalance: newBalance,
      updatedAt: now,
    });

    return JSON.parse(JSON.stringify(historyEntry));
  }
}

export const partiesService = new PartiesService();
