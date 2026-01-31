import { useState, useEffect, useCallback } from 'react';
import type { CrackRecord, CrackClassification, CrackEditData } from '../../types/crack';
import type { EditValidationErrors } from '../../utils/validation';
import { validateCrackEdit, hasErrors } from '../../utils/validation';
import { ClassificationSelect } from '../crack-form/ClassificationSelect';
import { LocationSelect } from '../crack-form/LocationSelect';
import { Alert } from '../ui/Alert';

interface CrackDetailModalProps {
  record: CrackRecord;
  onClose: () => void;
  onUpdate: (id: string, data: CrackEditData) => Promise<void>;
  onDelete: (id: string, imagePath: string) => Promise<void>;
}

const classificationConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Good: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Fair: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  Poor: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  Bad: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

export function CrackDetailModal({ record, onClose, onUpdate, onDelete }: CrackDetailModalProps) {
  const config = classificationConfig[record.classification] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    dot: 'bg-gray-500',
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<CrackEditData>({
    label: record.label,
    description: record.description,
    classification: record.classification,
    location: record.location,
    datetime: record.datetime,
  });
  const [editErrors, setEditErrors] = useState<EditValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCancelEdit = useCallback(() => {
    setEditData({
      label: record.label,
      description: record.description,
      classification: record.classification,
      location: record.location,
      datetime: record.datetime,
    });
    setEditErrors({});
    setActionError(null);
    setIsEditing(false);
  }, [record]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else if (isEditing) {
          handleCancelEdit();
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, isEditing, showDeleteConfirm, handleCancelEdit]);

  const updateEditField = <K extends keyof CrackEditData>(field: K, value: CrackEditData[K]) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
    setEditErrors((prev) => {
      const next = { ...prev };
      delete next[field as keyof EditValidationErrors];
      return next;
    });
  };

  const handleSave = async () => {
    const errors = validateCrackEdit(editData);
    if (hasErrors(errors)) {
      setEditErrors(errors);
      return;
    }

    setIsSaving(true);
    setActionError(null);
    try {
      await onUpdate(record.id, editData);
      setIsEditing(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update record');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setActionError(null);
    try {
      await onDelete(record.id, record.imagePath);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete record');
      setIsDeleting(false);
    }
  };

  const inputClass = (error?: string) =>
    `w-full rounded-lg border px-3 py-3 text-sm min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      error ? 'border-red-300 bg-red-50' : 'border-gray-300'
    }`;

  const fieldError = (error?: string) =>
    error ? (
      <p className="flex items-center gap-1 text-sm text-red-600 mt-1">
        <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        {error}
      </p>
    ) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={!isEditing && !showDeleteConfirm ? onClose : undefined}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={isEditing ? handleCancelEdit : onClose}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative bg-gray-100">
          <img
            src={record.imageUrl}
            alt={record.label}
            className="w-full object-contain max-h-[50vh]"
          />
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {actionError && (
            <Alert type="error" message={actionError} onDismiss={() => setActionError(null)} />
          )}

          {isEditing ? (
            /* ── Edit Mode ── */
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Label</label>
                <input
                  type="text"
                  value={editData.label}
                  onChange={(e) => updateEditField('label', e.target.value)}
                  className={inputClass(editErrors.label)}
                />
                {fieldError(editErrors.label)}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ClassificationSelect
                  value={editData.classification}
                  onChange={(v) => updateEditField('classification', (v || record.classification) as CrackClassification)}
                  error={editErrors.classification}
                />
                <LocationSelect
                  value={editData.location}
                  onChange={(v) => updateEditField('location', v)}
                  error={editErrors.location}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Date & Time</label>
                <input
                  type="datetime-local"
                  value={editData.datetime}
                  onChange={(e) => updateEditField('datetime', e.target.value)}
                  className={inputClass(editErrors.datetime)}
                />
                {fieldError(editErrors.datetime)}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => updateEditField('description', e.target.value)}
                  rows={4}
                  className={`${inputClass(editErrors.description)} resize-none`}
                />
                {fieldError(editErrors.description)}
              </div>

              {/* Save / Cancel */}
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? (
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            /* ── View Mode ── */
            <>
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {record.label}
                </h2>
                <span className={`inline-flex flex-shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
                  {record.classification}
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {record.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  {record.datetime
                    ? new Date(record.datetime).toLocaleString()
                    : 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
                  <svg className="h-4 w-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z" />
                  </svg>
                  {record.imageName}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-1.5 text-sm font-medium text-gray-900">Description</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                  {record.description}
                </p>
              </div>

              {/* Action buttons / Delete confirmation */}
              <div className="border-t border-gray-100 pt-4">
                {showDeleteConfirm ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <span>Are you sure you want to delete this record? This action cannot be undone.</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                      >
                        {isDeleting ? (
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        )}
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
