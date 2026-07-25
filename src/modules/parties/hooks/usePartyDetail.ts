/**
 * SALTEDHASH Business OS - Module 6: Parties
 * React Hook for single Party Detail, History, and Actions.
 */

import { useCallback, useEffect, useState } from 'react';
import { PartyDetailResponse } from '../api/dto';
import { partiesService } from '../api/partiesService';
import { PartyHistoryEntry } from '../types';

export function usePartyDetail(partyId: string | null) {
  const [detail, setDetail] = useState<PartyDetailResponse | null>(null);
  const [history, setHistory] = useState<PartyHistoryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!partyId) {
      setDetail(null);
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [resDetail, resHistory] = await Promise.all([
        partiesService.getPartyById(partyId),
        partiesService.getPartyHistory(partyId),
      ]);
      setDetail(resDetail);
      setHistory(resHistory.entries);
    } catch (err) {
      setError(String((err as Error).message || err));
    } finally {
      setLoading(false);
    }
  }, [partyId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const archiveParty = async () => {
    if (!partyId) return;
    try {
      await partiesService.archiveParty(partyId);
      await fetchDetail();
    } catch (err) {
      setError(String((err as Error).message || err));
    }
  };

  const duplicateParty = async () => {
    if (!partyId) return null;
    try {
      const res = await partiesService.duplicateParty(partyId);
      return res.newParty;
    } catch (err) {
      setError(String((err as Error).message || err));
      return null;
    }
  };

  const addAdjustment = async (
    amount: number,
    title: string,
    sourceType: 'manual' | 'adjustment' | 'payment' | 'sale' | 'expense' | 'note',
    note?: string
  ) => {
    if (!partyId) return;
    try {
      await partiesService.recordAdjustment({
        partyId,
        amount,
        title,
        sourceType,
        note,
      });
      await fetchDetail();
    } catch (err) {
      setError(String((err as Error).message || err));
    }
  };

  return {
    party: detail?.data || null,
    historySummary: detail?.historySummary,
    history,
    loading,
    error,
    refresh: fetchDetail,
    archiveParty,
    duplicateParty,
    addAdjustment,
  };
}
