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
}

export function useCrackRecords(): UseCrackRecordsReturn {
  const [records, setRecords] = useState<CrackRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCrackRecords();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load records');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateRecordLocally = useCallback((id: string, data: CrackEditData) => {
    setRecords((prev) => 
      prev.map((record) => 
        record.id === id ? { ...record, ...data } : record
      )
    );
  }, []);

  const deleteRecordLocally = useCallback((id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { records, isLoading, error, refresh, updateRecordLocally, deleteRecordLocally };
}
