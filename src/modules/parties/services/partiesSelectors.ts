/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Selectors, Filtering, Search and Sorting helpers
 */

import { PartyListQuery } from '../api/dto';
import { Party } from '../types';

export function filterAndSortParties(parties: Party[], query: PartyListQuery = {}): Party[] {
  const {
    search = '',
    type = 'all',
    status = 'active',
    city = '',
    tag = '',
    sortBy = 'updatedAt',
    sortOrder = 'desc',
  } = query;

  let result = [...parties];

  // 1. Status Filter
  if (status !== 'all') {
    result = result.filter((p) => p.status === status);
  }

  // 2. Type Filter
  if (type !== 'all') {
    result = result.filter((p) => p.type === type);
  }

  // 3. City Filter
  if (city && city.trim()) {
    const cityLower = city.trim().toLowerCase();
    result = result.filter((p) => p.city && p.city.toLowerCase().includes(cityLower));
  }

  // 4. Tag Filter
  if (tag && tag.trim()) {
    const tagLower = tag.trim().toLowerCase();
    result = result.filter(
      (p) => p.tags && p.tags.some((t) => t.toLowerCase() === tagLower)
    );
  }

  // 5. Search query (matches name, code, phone, email, city, tags)
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.partyCode.toLowerCase().includes(q) ||
        (p.phone && p.phone.toLowerCase().includes(q)) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  // 6. Sorting
  result.sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'name') {
      cmp = a.name.localeCompare(b.name);
    } else if (sortBy === 'code') {
      cmp = a.partyCode.localeCompare(b.partyCode);
    } else if (sortBy === 'balance') {
      cmp = Math.abs(a.currentBalance) - Math.abs(b.currentBalance);
    } else if (sortBy === 'createdAt') {
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      // updatedAt default
      cmp = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    }

    return sortOrder === 'asc' ? cmp : -cmp;
  });

  return result;
}

export function extractUniqueCities(parties: Party[]): string[] {
  const citiesSet = new Set<string>();
  parties.forEach((p) => {
    if (p.city && p.city.trim()) {
      citiesSet.add(p.city.trim());
    }
  });
  return Array.from(citiesSet).sort();
}

export function extractUniqueTags(parties: Party[]): string[] {
  const tagsSet = new Set<string>();
  parties.forEach((p) => {
    if (p.tags) {
      p.tags.forEach((t) => {
        if (t.trim()) tagsSet.add(t.trim().toLowerCase());
      });
    }
  });
  return Array.from(tagsSet).sort();
}
