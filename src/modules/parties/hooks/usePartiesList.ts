/**
 * SALTEDHASH Business OS - Module 6: Parties
 * React Hook for Party List querying, searching, filtering & statistics.
 */

import { useCallback, useEffect, useState } from 'react';
import { PartyListQuery, PartyListResponse } from '../api/dto';
import { partiesService } from '../api/partiesService';
import { Party } from '../types';

export function usePartiesList(initialQuery: PartyListQuery = {}) {
  const [query, setQuery] = useState<PartyListQuery>({
    search: '',
    type: 'all',
    status: 'active',
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    ...initialQuery,
  });

  const [data, setData] = useState<PartyListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await partiesService.getParties(query);
      setData(res);
    } catch (err) {
      setError(String((err as Error).message || err));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchParties();
  }, [fetchParties]);

  const updateQuery = (newQuery: Partial<PartyListQuery>) => {
    setQuery((prev) => ({ ...prev, ...newQuery }));
  };

  const resetQuery = () => {
    setQuery({
      search: '',
      type: 'all',
      status: 'active',
      sortBy: 'updatedAt',
      sortOrder: 'desc',
    });
  };

  return {
    parties: data?.data || [],
    total: data?.total || 0,
    summary: data?.summary,
    query,
    loading,
    error,
    updateQuery,
    resetQuery,
    refresh: fetchParties,
  };
}
