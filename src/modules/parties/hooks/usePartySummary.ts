/**
 * SALTEDHASH Business OS - Module 6: Parties
 * React Hook for Global Summary Analytics
 */

import { useCallback, useEffect, useState } from 'react';
import { PartySummaryResponse } from '../api/dto';
import { partiesService } from '../api/partiesService';

export function usePartySummary() {
  const [summary, setSummary] = useState<PartySummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await partiesService.getPartySummary();
      setSummary(res);
    } catch (err) {
      setError(String((err as Error).message || err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    loading,
    error,
    refresh: fetchSummary,
  };
}
