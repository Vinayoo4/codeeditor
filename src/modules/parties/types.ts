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
  slug: string;
  partyCode: string;
  name: string;
  displayName?: string;
  legalName?: string;
  type: PartyType;
  category?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  region?: string;
  country?: string;
  gstin?: string;
  openingBalance?: number;
  currentBalance: number;
  notes?: string;
  tags?: string[];
  status: PartyStatus;
  visible: boolean;
  version: number;

  // Relationships
  ownerUserId?: string;
  relatedPartyIds?: string[];
  relatedCatalogItemIds?: string[];
  relatedExpenseIds?: string[];
  relatedTaskIds?: string[];

  // Aggregates & Interaction
  lifetimeValue?: number;
  totalSpend?: number;
  totalRevenue?: number;
  lastInteractionAt?: string;

  // Optional fields
  taxId?: string;
  billingInfo?: string;
  shippingInfo?: string;
  preferredLanguage?: string;
  communicationPreference?: string;
  paymentTerms?: string;
  creditLimit?: number;
  customFields?: Record<string, any>;

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
