import { useState, useEffect, useCallback } from 'react';
import type { CrackRecord, CrackEditData } from '../types/crack';
import { getCrackRecords } from '../services/firestoreService';

interface UseCrackRecordsReturn {
  records: CrackRecord[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateRecordLocally: (id: string, data: CrackEditData) => void;
  deleteRecordLocally: (id: string) => void;
  hasMore: boolean;
  loadMore: () => void;
  currentPage: number;
  totalRecords: number;
}

const RECORDS_PER_PAGE = 20;

export function useCrackRecords(): UseCrackRecordsReturn {
  const [allRecords, setAllRecords] = useState<CrackRecord[]>([]);
  const [displayedRecords, setDisplayedRecords] = useState<CrackRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCrackRecords();
      setAllRecords(data);
      setDisplayedRecords(data.slice(0, RECORDS_PER_PAGE));
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load records');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    const nextPage = currentPage + 1;
    const endIndex = nextPage * RECORDS_PER_PAGE;
    setDisplayedRecords(allRecords.slice(0, endIndex));
    setCurrentPage(nextPage);
  }, [currentPage, allRecords]);

  const hasMore = displayedRecords.length < allRecords.length;

  const updateRecordLocally = useCallback((id: string, data: CrackEditData) => {
    const updateRecords = (records: CrackRecord[]) =>
      records.map((record) =>
        record.id === id ? { ...record, ...data } : record
      );
    setAllRecords(updateRecords);
    setDisplayedRecords(updateRecords);
  }, []);

  const deleteRecordLocally = useCallback((id: string) => {
    const filterRecords = (records: CrackRecord[]) => records.filter((record) => record.id !== id);
    setAllRecords(filterRecords);
    setDisplayedRecords(filterRecords);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { 
    records: displayedRecords, 
    isLoading, 
    error, 
    refresh, 
    updateRecordLocally, 
    deleteRecordLocally,
    hasMore,
    loadMore,
    currentPage,
    totalRecords: allRecords.length,
  };
}
