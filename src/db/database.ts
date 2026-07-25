/**
 * SALTEDHASH Business OS - Local-First IndexedDB Database using Dexie.js
 */

import Dexie, { Table } from 'dexie';
import { Party, PartyHistoryEntry, PartySettings } from '../modules/parties/types';

export class BusinessOSDatabase extends Dexie {
  parties!: Table<Party, string>;
  historyEntries!: Table<PartyHistoryEntry, string>;
  settings!: Table<PartySettings, string>;

  constructor() {
    super('SaltedHashBusinessOS_PartiesDB');

    // Schema version 1
    this.version(1).stores({
      parties: 'id, partyCode, name, type, status, phone, email, city, currentBalance, createdAt, updatedAt',
      historyEntries: 'id, partyId, sourceType, createdAt',
      settings: 'id',
    });
  }
}

export const db = new BusinessOSDatabase();

/**
 * Initial Seed Data for SALTEDHASH Business OS Parties Registry
 */
export async function seedInitialPartiesData(forceReset = false): Promise<void> {
  const existingCount = await db.parties.count();
  if (existingCount > 0 && !forceReset) {
    return; // Already populated
  }

  if (forceReset) {
    await db.parties.clear();
    await db.historyEntries.clear();
    await db.settings.clear();
  }

  const now = new Date();
  const subDays = (days: number) =>
    new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();

  // Settings
  await db.settings.put({
    id: 'default',
    nextPartyCodeNumber: 6,
    partyCodePrefix: 'PRT',
    allowCustomTypes: true,
    recentTypes: ['customer', 'supplier', 'vendor', 'lead', 'other'],
    updatedAt: now.toISOString(),
  });

  const seedParties: Party[] = [
    {
      id: 'prt_101',
      partyCode: 'PRT-001',
      name: 'Acme Retailers & Mart',
      type: 'customer',
      phone: '+1 (555) 234-5678',
      email: 'orders@acmeretail.com',
      address: '104 Market Street, Suite 2B',
      city: 'Austin',
      state: 'TX',
      gstin: 'US-TX-9823411',
      openingBalance: 500,
      currentBalance: 1450,
      notes: 'Key retail buyer. Prefers monthly credit cycle and PDF invoicing.',
      tags: ['wholesale', 'vip', 'net30'],
      status: 'active',
      createdAt: subDays(45),
      updatedAt: subDays(2),
    },
    {
      id: 'prt_102',
      partyCode: 'PRT-002',
      name: 'Apex Packaging Ltd',
      type: 'supplier',
      phone: '+1 (555) 876-5432',
      email: 'billing@apexpackaging.com',
      address: '88 Industrial Parkway',
      city: 'Chicago',
      state: 'IL',
      gstin: 'US-IL-3392811',
      openingBalance: -300,
      currentBalance: -820,
      notes: 'Primary eco-friendly box supplier. Minimum order quantity 500 units.',
      tags: ['raw-materials', 'recurring'],
      status: 'active',
      createdAt: subDays(60),
      updatedAt: subDays(5),
    },
    {
      id: 'prt_103',
      partyCode: 'PRT-003',
      name: 'Hyperion Logistics & Freight',
      type: 'vendor',
      phone: '+1 (555) 432-1098',
      email: 'dispatch@hyperionfreight.io',
      address: '402 Harbor View Blvd',
      city: 'Seattle',
      state: 'WA',
      gstin: 'US-WA-1120938',
      openingBalance: 0,
      currentBalance: -350,
      notes: 'Same-day regional courier partner. Contact: Marcus.',
      tags: ['freight', 'local'],
      status: 'active',
      createdAt: subDays(30),
      updatedAt: subDays(10),
    },
    {
      id: 'prt_104',
      partyCode: 'PRT-004',
      name: 'Nexa Digital Solutions',
      type: 'lead',
      phone: '+1 (555) 901-2345',
      email: 'contact@nexadigital.com',
      address: '77 Tech Drive, Floor 4',
      city: 'San Francisco',
      state: 'CA',
      gstin: '',
      openingBalance: 0,
      currentBalance: 0,
      notes: 'Prospective SaaS enterprise client. Requested custom catalog proposal.',
      tags: ['consulting', 'prospective'],
      status: 'active',
      createdAt: subDays(12),
      updatedAt: subDays(12),
    },
    {
      id: 'prt_105',
      partyCode: 'PRT-005',
      name: 'Legacy Hardware Corp',
      type: 'customer',
      phone: '+1 (555) 345-6789',
      email: 'accounts@legacyhardware.old',
      address: '12 Main St',
      city: 'Denver',
      state: 'CO',
      gstin: 'US-CO-7712399',
      openingBalance: 0,
      currentBalance: 0,
      notes: 'Account merged into Acme Retailers in Q1.',
      tags: ['inactive', 'legacy'],
      status: 'archived',
      createdAt: subDays(180),
      updatedAt: subDays(90),
    },
  ];

  await db.parties.bulkPut(seedParties);

  // Seed History
  const seedHistory: PartyHistoryEntry[] = [
    // Acme Retailers History
    {
      id: 'hist_1',
      partyId: 'prt_101',
      sourceType: 'manual',
      title: 'Opening Balance Recorded',
      amount: 500,
      balanceAfter: 500,
      note: 'Initial account migration opening balance',
      createdAt: subDays(45),
    },
    {
      id: 'hist_2',
      partyId: 'prt_101',
      sourceType: 'sale',
      sourceId: 'INV-2026-089',
      title: 'Credit Sale #INV-2026-089',
      amount: 1200,
      balanceAfter: 1700,
      note: '50x Eco Display Stand Units shipped',
      createdAt: subDays(20),
    },
    {
      id: 'hist_3',
      partyId: 'prt_101',
      sourceType: 'payment',
      title: 'Bank Wire Payment Received',
      amount: -250,
      balanceAfter: 1450,
      note: 'Partial payment received via ACH wire',
      createdAt: subDays(2),
    },

    // Apex Packaging History
    {
      id: 'hist_4',
      partyId: 'prt_102',
      sourceType: 'manual',
      title: 'Opening Payable Recorded',
      amount: -300,
      balanceAfter: -300,
      note: 'Opening payable balance',
      createdAt: subDays(60),
    },
    {
      id: 'hist_5',
      partyId: 'prt_102',
      sourceType: 'expense',
      sourceId: 'EXP-2026-042',
      title: 'Packaging Supplies Expense #EXP-2026-042',
      amount: -520,
      balanceAfter: -820,
      note: '1000 Custom Branded Boxes order',
      createdAt: subDays(5),
    },

    // Hyperion Freight History
    {
      id: 'hist_6',
      partyId: 'prt_103',
      sourceType: 'expense',
      sourceId: 'EXP-2026-015',
      title: 'Courier Shipping Services #EXP-2026-015',
      amount: -350,
      balanceAfter: -350,
      note: 'Express air shipment for Acme order',
      createdAt: subDays(10),
    },
  ];

  await db.historyEntries.bulkPut(seedHistory);
}
