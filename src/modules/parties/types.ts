/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Core domain types and interfaces.
 */

export type PartyType = 'customer' | 'supplier' | 'vendor' | 'lead' | 'other';
export type PartyStatus = 'active' | 'archived';

export type HistorySourceType =
  | 'sale'
  | 'expense'
  | 'manual'
  | 'adjustment'
  | 'payment'
  | 'note';

export interface Party {
  id: string;
  partyCode: string;
  name: string;
  type: PartyType;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  gstin?: string;
  openingBalance?: number;
  currentBalance: number;
  notes?: string;
  tags?: string[];
  status: PartyStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface PartyHistoryEntry {
  id: string;
  partyId: string;
  sourceType: HistorySourceType;
  sourceId?: string;
  title: string;
  amount: number; // Positive = debit (adds to receivable or increases debt), Negative = credit/payment
  balanceAfter: number;
  note?: string;
  createdAt: string; // ISO string
}

export interface PartySettings {
  id?: string;
  nextPartyCodeNumber: number;
  partyCodePrefix: string;
  allowCustomTypes: boolean;
  recentTypes: string[];
  updatedAt: string;
}

export interface QuickPartyOption {
  id: string;
  partyCode: string;
  name: string;
  type: PartyType;
  phone?: string;
  currentBalance: number;
  tags?: string[];
}
