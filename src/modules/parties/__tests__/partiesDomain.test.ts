import { describe, it, expect } from 'vitest';
import { validateCreatePartyInput } from '../services/partiesValidation';
import { buildPartySummary, applyBalanceChange } from '../services/partiesDomain';
import { Party } from '../types';

describe('Parties Validation', () => {
  it('validates party name requirement', () => {
    const errors = validateCreatePartyInput({
      name: '',
      type: 'customer',
      openingBalance: 0,
      tags: [],
    });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'name' }));
  });

  it('validates email format if provided', () => {
    const errors = validateCreatePartyInput({
      name: 'Acme Corp',
      type: 'customer',
      email: 'invalid-email',
      openingBalance: 0,
      tags: [],
    });
    expect(errors).toContainEqual(expect.objectContaining({ field: 'email' }));
  });

  it('passes valid party data', () => {
    const errors = validateCreatePartyInput({
      name: 'Acme Corp',
      type: 'customer',
      email: 'contact@acme.com',
      phone: '+1 555 123 4567',
      openingBalance: 500,
      tags: ['vip'],
    });
    expect(errors.length).toBe(0);
  });
});

describe('Parties Domain Logic', () => {
  it('calculates balance change correctly', () => {
    const balance = applyBalanceChange(100, -50);
    expect(balance).toBe(50);
    const balance2 = applyBalanceChange(50.50, 100);
    expect(balance2).toBe(150.5);
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
      {
        id: '3',
        partyCode: 'P003',
        name: 'Archived Customer',
        type: 'customer',
        status: 'archived',
        currentBalance: 0,
        openingBalance: 0,
        tags: [],
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    const summary = buildPartySummary(sampleParties);
    expect(summary.totalParties).toBe(3);
    expect(summary.totalCustomers).toBe(1);
    expect(summary.totalReceivables).toBe(500);
    expect(summary.totalPayables).toBe(200);
    expect(summary.netBalance).toBe(300);
    expect(summary.activeCount).toBe(2);
    expect(summary.archivedCount).toBe(1);
  });
});
