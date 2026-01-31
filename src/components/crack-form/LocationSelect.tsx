import { useState, useRef, useEffect, useMemo } from 'react';
import { useBarangays } from '../../hooks/useBarangays';

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function LocationSelect({
  value,
  onChange,
  error,
}: LocationSelectProps) {
  const { barangays, loading, addBarangay, isCustom, getCustomId, removeBarangay } = useBarangays();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
      search
        ? barangays.filter((b) =>
            b.toLowerCase().includes(search.toLowerCase())
          )
        : [...barangays],
    [search, barangays]
  );

  const exactMatch = useMemo(
    () =>
      search.trim()
        ? barangays.some((b) => b.toLowerCase() === search.trim().toLowerCase())
        : true,
    [search, barangays]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
        setAddError('');
        setConfirmingDelete(null);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
        setAddError('');
        setConfirmingDelete(null);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  const handleAdd = async () => {
    const name = search.trim();
    if (!name) return;

    setIsAdding(true);
    setAddError('');
    const result = await addBarangay(name);
    setIsAdding(false);

    if (result.success) {
      onChange(name);
      setSearch('');
      setIsOpen(false);
    } else {
      setAddError(result.error || 'Failed to add');
    }
  };

  const handleRemoveClick = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDelete(name);
  };

  const handleConfirmRemove = async (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = getCustomId(name);
    if (!id) return;

    await removeBarangay(id);
    setConfirmingDelete(null);
    if (value === name) {
      onChange('');
    }
  };

  const handleCancelRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDelete(null);
  };

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <span className="text-gray-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </span>
        Location (Barangay)
        <span className="text-red-500 ml-0.5">*</span>
      </label>

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-sm min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          }`}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || 'Select barangay'}
          </span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg animate-[slideDown_0.15s_ease-out]">
            {/* Search */}
            <div className="border-b border-gray-100 p-2">
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-2">
                <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setAddError('');
                  }}
                  placeholder="Search or add barangay..."
                  className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setAddError('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {addError && (
                <p className="mt-1.5 text-xs text-red-600">{addError}</p>
              )}
            </div>

            {/* Options */}
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  Loading barangays...
                </div>
              ) : filtered.length === 0 && !search.trim() ? (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  No barangays available
                </div>
              ) : (
                <>
                  {filtered.map((b) => (
                    <div key={b}>
                      {confirmingDelete === b ? (
                        <div className="flex items-center justify-between gap-2 bg-red-50 px-3 py-2.5">
                          <span className="text-sm text-red-700 truncate">
                            Remove "{b}"?
                          </span>
                          <span className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleConfirmRemove(b, e)}
                              className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelRemove}
                              className="rounded border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onChange(b);
                            setIsOpen(false);
                            setSearch('');
                            setAddError('');
                            setConfirmingDelete(null);
                          }}
                          className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-blue-50 ${
                            value === b ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {b}
                            {isCustom(b) && (
                              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                                Custom
                              </span>
                            )}
                          </span>
                          <span className="flex items-center gap-1.5">
                            {isCustom(b) && (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => handleRemoveClick(b, e)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    handleRemoveClick(b, e as unknown as React.MouseEvent);
                                  }
                                }}
                                className="flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                                title="Remove custom barangay"
                              >
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </span>
                            )}
                            {value === b && (
                              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </span>
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add new barangay option */}
                  {search.trim() && !exactMatch && (
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={isAdding}
                      className="flex w-full items-center gap-2 border-t border-gray-100 px-3 py-2.5 text-sm text-blue-600 transition-colors hover:bg-blue-50 disabled:opacity-50"
                    >
                      {isAdding ? (
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      )}
                      {isAdding ? 'Adding...' : `Add "${search.trim()}"`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-sm text-red-600">
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
