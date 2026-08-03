/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Data Transfer Objects (DTOs) for API Contract Packaging.
 * All DTOs are strict, JSON-serializable types.
 */

import { Party, PartyHistoryEntry, PartyStatus, PartyType } from '../types';

export interface CreatePartyInput {
  name: string;
  type: PartyType;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  gstin?: string;
  openingBalance?: number;
  notes?: string;
  tags?: string[];
  website?: string;
  whatsapp?: string;
  relatedPartyIds?: string[];
  relatedCatalogItemIds?: string[];
}

export interface UpdatePartyInput {
  id: string;
  name?: string;
  type?: PartyType;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  gstin?: string;
  notes?: string;
  tags?: string[];
  status?: PartyStatus;
  website?: string;
  whatsapp?: string;
  relatedPartyIds?: string[];
  relatedCatalogItemIds?: string[];
}

export interface PartyListQuery {
  search?: string;
  type?: PartyType | 'all';
  status?: PartyStatus | 'all';
  city?: string;
  tag?: string;
  sortBy?: 'name' | 'code' | 'balance' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PartySummaryResponse {
  totalParties: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalVendors: number;
  totalLeads: number;
  totalReceivables: number; // Sum of positive customer balances (owed to us)
  totalPayables: number;    // Sum of supplier/vendor balances (we owe)
  netBalance: number;       // totalReceivables - totalPayables
  activeCount: number;
  archivedCount: number;
}

export interface PartyListResponse {
  data: Party[];
  total: number;
  page: number;
  limit: number;
  summary: PartySummaryResponse;
}

export interface PartyDetailResponse {
  data: Party;
  historySummary: {
    totalEntries: number;
    totalSalesCount: number;
    totalExpensesCount: number;
    lastActivityDate?: string;
  };
}

export interface PartyHistoryResponse {
  partyId: string;
  entries: PartyHistoryEntry[];
  totalCount: number;
}

export interface ArchivePartyResponse {
  success: boolean;
  partyId: string;
  status: PartyStatus;
  updatedAt: string;
}

export interface DuplicatePartyResponse {
  success: boolean;
  originalPartyId: string;
  newParty: Party;
}

export interface RecordAdjustmentInput {
  partyId: string;
  amount: number; // positive = debit, negative = credit/payment
  title: string;
  sourceType: 'manual' | 'adjustment' | 'payment' | 'sale' | 'expense' | 'note';
  sourceId?: string;
  note?: string;
}
