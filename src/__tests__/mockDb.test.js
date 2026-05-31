import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const localStorageMock = (function() {
  let store = {};
  return {
    getItem(key) { return store[key] || null; },
    setItem(key, value) { store[key] = value.toString(); },
    removeItem(key) { delete store[key]; },
    clear() { store = {}; }
  };
})();
global.localStorage = localStorageMock;
global.window = { dispatchEvent: () => {} };

import { initDb, getDb, updateDb, logAction } from '../db/mockDb.js';

describe('mockDb tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('initDb seeds data on first call', () => {
    initDb();
    const dbString = localStorage.getItem('ecomeal_db');
    expect(dbString).toBeTruthy();
    const db = JSON.parse(dbString);
    expect(db.mealPlans.length).toBe(3);
    expect(db._seeded).toBe(true);
  });

  it('initDb does not re-seed if _seeded flag exists', () => {
    localStorage.setItem('ecomeal_db', JSON.stringify({ _seeded: true, existingData: true }));
    initDb();
    const db = JSON.parse(localStorage.getItem('ecomeal_db'));
    expect(db.existingData).toBe(true);
    expect(db.mealPlans).toBeUndefined(); // Should not have been overwritten with full seed
  });

  it('updateDb persists data to localStorage', () => {
    initDb();
    const db = getDb();
    db.customField = 'testValue';
    updateDb(db);
    const updatedDb = JSON.parse(localStorage.getItem('ecomeal_db'));
    expect(updatedDb.customField).toBe('testValue');
  });

  it('Custom plan added via updateDb appears on next getDb call', () => {
    initDb();
    const db = getDb();
    const newPlan = { id: 'test-1', title: 'Test Plan' };
    db.userPlans.push(newPlan);
    updateDb(db);

    const db2 = getDb();
    expect(db2.userPlans).toContainEqual(newPlan);
  });

  it('Saved article toggle saves and unsaves correctly (using updateDb manually)', () => {
    initDb();
    let db = getDb();

    // Save
    db.savedArticles.push('article-1');
    updateDb(db);
    expect(getDb().savedArticles).toContain('article-1');

    // Unsave
    db = getDb();
    db.savedArticles = db.savedArticles.filter(id => id !== 'article-1');
    updateDb(db);
    expect(getDb().savedArticles).not.toContain('article-1');
  });

  it('logAction prepends to auditLogs array', () => {
    initDb();
    const initialLogCount = getDb().auditLogs.length;
    logAction('Test action');
    const db = getDb();
    expect(db.auditLogs.length).toBe(initialLogCount + 1);
    expect(db.auditLogs[0].action).toBe('Test action');
  });

});
