/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Unit Tests for Domain Logic, Schema Validation, and Selectors
 */

import { validatePartyForm, validateAdjustBalanceInput } from '../services/partiesValidation';
import {
  calculateLedgerBalance,
  calculatePartySummary,
  applyBalanceChange,
  validatePartyTypeTransition,
} from '../services/partiesDomain';
import { Party } from '../types';

describe('Parties Validation', () => {
  it('validates party name requirement', () => {
    const res = validatePartyForm({
      name: '',
      type: 'customer',
      status: 'active',
      openingBalance: 0,
      tags: [],
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.name).toBeDefined();
  });

  it('validates email format if provided', () => {
    const res = validatePartyForm({
      name: 'Acme Corp',
      type: 'customer',
      status: 'active',
      email: 'invalid-email',
      openingBalance: 0,
      tags: [],
    });
    expect(res.isValid).toBe(false);
    expect(res.errors.email).toBeDefined();
  });

  it('passes valid party data', () => {
    const res = validatePartyForm({
      name: 'Acme Corp',
      type: 'customer',
      status: 'active',
      email: 'contact@acme.com',
      phone: '+1 555 123 4567',
      openingBalance: 500,
      tags: ['vip'],
    });
    expect(res.isValid).toBe(true);
    expect(Object.keys(res.errors)).toHaveLength(0);
  });
});

describe('Parties Domain Logic', () => {
  it('calculates total balance correctly from ledger entries', () => {
    const balance = calculateLedgerBalance(100, [
      { id: '1', partyId: 'p1', amount: 200, title: 'Sale', sourceType: 'sale', timestamp: '2026-01-01' },
      { id: '2', partyId: 'p1', amount: -50, title: 'Payment', sourceType: 'payment', timestamp: '2026-01-02' },
    ]);
    expect(balance).toBe(250);
  });

  it('calculates party summary positions', () => {
    const sampleParties: Party[] = [
      {
        id: '1',
        partyCode: 'P001',
        name: 'Customer A',
        type: 'customer',
        status: 'active',
        currentBalance: 500,
        openingBalance: 0,
        tags: [],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      {
        id: '2',
        partyCode: 'P002',
        name: 'Supplier B',
        type: 'supplier',
        status: 'active',
        currentBalance: -200,
        openingBalance: 0,
        tags: [],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    const summary = calculatePartySummary(sampleParties);
    expect(summary.totalParties).toBe(2);
    expect(summary.totalReceivables).toBe(500);
    expect(summary.totalPayables).toBe(200);
    expect(summary.netLedgerPosition).toBe(300);
  });

  it('prevents illegal party type transitions with active balance', () => {
    const result = validatePartyTypeTransition('customer', 'lead', 150);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('outstanding balance');
  });
});
