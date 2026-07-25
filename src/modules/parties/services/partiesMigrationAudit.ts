/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Legacy Migration & Audit Engine
 *
 * Checks for any legacy contacts/customers/suppliers stored in localStorage or previous schema
 * versions and transforms them into the unified Dexie IndexedDB Party model.
 */

import { db } from '../../../db/database';
import { Party } from '../types';

export interface MigrationAuditResult {
  migratedCount: number;
  skippedCount: number;
  logs: string[];
}

export async function auditAndMigrateLegacyParties(): Promise<MigrationAuditResult> {
  const logs: string[] = [];
  let migratedCount = 0;
  let skippedCount = 0;

  try {
    // 1. Inspect localStorage legacy keys
    const legacyKeys = ['legacy_contacts', 'business_os_customers', 'business_os_suppliers'];
    for (const key of legacyKeys) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              if (item && item.name) {
                // Check if exists in DB by name or phone
                const existing = await db.parties
                  .where('name')
                  .equalsIgnoreCase(item.name.trim())
                  .first();

                if (!existing) {
                  const newCode = `PRT-LEG-${Math.floor(100 + Math.random() * 900)}`;
                  const now = new Date().toISOString();
                  const newParty: Party = {
                    id: `prt_leg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
                    partyCode: newCode,
                    name: item.name.trim(),
                    type: (item.type as any) || 'customer',
                    phone: item.phone || '',
                    email: item.email || '',
                    city: item.city || '',
                    openingBalance: item.balance || 0,
                    currentBalance: item.balance || 0,
                    status: 'active',
                    tags: ['legacy-migrated'],
                    createdAt: now,
                    updatedAt: now,
                  };

                  await db.parties.put(newParty);
                  migratedCount++;
                  logs.push(`Migrated legacy record "${item.name}" -> ${newCode}`);
                } else {
                  skippedCount++;
                  logs.push(`Skipped legacy record "${item.name}" (Already exists)`);
                }
              }
            }
          }
          // Clear legacy key to avoid duplicate migration runs
          localStorage.removeItem(key);
        } catch (e) {
          logs.push(`Error parsing legacy key "${key}": ${String(e)}`);
        }
      }
    }

    // 2. Audit current DB integrity
    const allParties = await db.parties.toArray();
    for (const party of allParties) {
      let needsFix = false;
      const updates: Partial<Party> = {};

      if (!party.partyCode) {
        updates.partyCode = `PRT-${Math.floor(1000 + Math.random() * 9000)}`;
        needsFix = true;
      }
      if (party.currentBalance === undefined || isNaN(party.currentBalance)) {
        updates.currentBalance = 0;
        needsFix = true;
      }

      if (needsFix) {
        await db.parties.update(party.id, updates);
        logs.push(`Audited & repaired integrity fields for "${party.name}" (${party.id})`);
      }
    }

    if (logs.length === 0) {
      logs.push('Audit complete: Database schema is fully aligned and zero legacy conflicts remain.');
    }
  } catch (err) {
    logs.push(`Migration Audit warning: ${String(err)}`);
  }

  return {
    migratedCount,
    skippedCount,
    logs,
  };
}
