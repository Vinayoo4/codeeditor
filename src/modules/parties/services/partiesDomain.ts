/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Domain Logic Layer
 */

import { PartySummaryResponse } from '../api/dto';
import { Party, PartyHistoryEntry, QuickPartyOption } from '../types';

/**
 * Calculates global balance totals and counts for all parties.
 */
export function buildPartySummary(parties: Party[]): PartySummaryResponse {
  let totalCustomers = 0;
  let totalSuppliers = 0;
  let totalVendors = 0;
  let totalLeads = 0;
  let totalReceivables = 0;
  let totalPayables = 0;
  let activeCount = 0;
  let archivedCount = 0;

  for (const party of parties) {
    if (party.status === 'archived') {
      archivedCount++;
      continue;
    }

    activeCount++;

    if (party.type === 'customer') totalCustomers++;
    else if (party.type === 'supplier') totalSuppliers++;
    else if (party.type === 'vendor') totalVendors++;
    else if (party.type === 'lead') totalLeads++;

    // Balance rules:
    // Positive balance = receivable (amount owed to us)
    // Negative balance = payable (amount we owe)
    if (party.currentBalance > 0) {
      totalReceivables += party.currentBalance;
    } else if (party.currentBalance < 0) {
      totalPayables += Math.abs(party.currentBalance);
    }
  }

  return {
    totalParties: parties.length,
    totalCustomers,
    totalSuppliers,
    totalVendors,
    totalLeads,
    totalReceivables,
    totalPayables,
    netBalance: totalReceivables - totalPayables,
    activeCount,
    archivedCount,
  };
}

/**
 * Applies a financial or ledger balance change to a party and returns updated balance.
 */
export function applyBalanceChange(currentBalance: number, changeAmount: number): number {
  return Number((currentBalance + changeAmount).toFixed(2));
}

/**
 * Provides a readable balance status snapshot string & indicator.
 */
export function getPartyBalanceSnapshot(party: Party): {
  label: string;
  amount: number;
  formattedAmount: string;
  variant: 'receivable' | 'payable' | 'settled';
} {
  const balance = party.currentBalance || 0;
  const absVal = Math.abs(balance);
  const formatted = `$${absVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (balance > 0) {
    return {
      label: 'Owes You',
      amount: balance,
      formattedAmount: formatted,
      variant: 'receivable',
    };
  } else if (balance < 0) {
    return {
      label: 'You Owe',
      amount: balance,
      formattedAmount: formatted,
      variant: 'payable',
    };
  }

  return {
    label: 'Settled ($0.00)',
    amount: 0,
    formattedAmount: '$0.00',
    variant: 'settled',
  };
}

/**
 * Converts parties list to quick selection options for Sales & Expense pickers.
 */
export function getPartiesForPicker(
  parties: Party[],
  filterType?: 'customer' | 'supplier' | 'vendor' | 'all'
): QuickPartyOption[] {
  return parties
    .filter((p) => p.status === 'active')
    .filter((p) => {
      if (!filterType || filterType === 'all') return true;
      if (filterType === 'supplier') return p.type === 'supplier' || p.type === 'vendor';
      return p.type === filterType;
    })
    .map((p) => ({
      id: p.id,
      partyCode: p.partyCode,
      name: p.name,
      type: p.type,
      phone: p.phone,
      currentBalance: p.currentBalance,
      tags: p.tags,
    }));
}

/**
 * Constructs a formatted display timeline item for party history view.
 */
export function buildPartyTimelineItem(entry: PartyHistoryEntry): {
  title: string;
  sourceLabel: string;
  badgeColor: string;
  amountDisplay: string;
  isPositive: boolean;
  dateFormatted: string;
} {
  const dateObj = new Date(entry.createdAt);
  const dateFormatted = isNaN(dateObj.getTime())
    ? entry.createdAt
    : dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  let sourceLabel = 'Activity';
  let badgeColor = 'bg-slate-100 text-slate-700';

  switch (entry.sourceType) {
    case 'sale':
      sourceLabel = 'Sales Invoice';
      badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
      break;
    case 'expense':
      sourceLabel = 'Expense Record';
      badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300';
      break;
    case 'payment':
      sourceLabel = 'Payment Received / Made';
      badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      break;
    case 'manual':
    case 'adjustment':
      sourceLabel = 'Ledger Adjustment';
      badgeColor = 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300';
      break;
    case 'note':
      sourceLabel = 'System Note';
      badgeColor = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      break;
  }

  const isPositive = entry.amount >= 0;
  const absAmount = Math.abs(entry.amount);
  const amountDisplay = `${isPositive ? '+' : '-'}$${absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return {
    title: entry.title,
    sourceLabel,
    badgeColor,
    amountDisplay,
    isPositive,
    dateFormatted,
  };
}
