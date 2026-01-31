import { useState, useCallback } from 'react';
import { useCrackRecords } from '../../hooks/useCrackRecords';
import { updateCrackRecord, deleteCrackRecord } from '../../services/firestoreService';
import { deleteCrackImage } from '../../services/storageService';
import { CrackCard } from './CrackCard';
import { CrackDetailModal } from './CrackDetailModal';
import { EmptyState } from './EmptyState';
import { Spinner } from '../ui/Spinner';
import { Alert } from '../ui/Alert';
import type { CrackRecord, CrackEditData } from '../../types/crack';

interface CrackListProps {
  onGoToForm?: () => void;
}

export function CrackList({ onGoToForm }: CrackListProps) {
  const { records, isLoading, error, refresh } = useCrackRecords();
  const [selectedRecord, setSelectedRecord] = useState<CrackRecord | null>(null);

  const handleUpdate = useCallback(async (id: string, data: CrackEditData) => {
    await updateCrackRecord(id, data);
    setSelectedRecord((prev) => (prev ? { ...prev, ...data } : null));
    await refresh();
  }, [refresh]);

  const handleDelete = useCallback(async (id: string, imagePath: string) => {
    await deleteCrackImage(imagePath);
    await deleteCrackRecord(id);
    setSelectedRecord(null);
    await refresh();
  }, [refresh]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Crack Records</h2>
            <p className="text-sm text-gray-500">
              {records.length} record{records.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          <svg className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <Alert type="error" message={error} onDismiss={() => refresh()} />
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size="lg" />
          <p className="mt-3 text-sm text-gray-500">Loading records...</p>
        </div>
      ) : records.length === 0 ? (
        <EmptyState onGoToForm={onGoToForm} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <CrackCard key={record.id} record={record} onClick={() => setSelectedRecord(record)} />
          ))}
        </div>
      )}

      {selectedRecord && (
        <CrackDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
