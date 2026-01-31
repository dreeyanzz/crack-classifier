import { useState, useRef, useEffect } from 'react';
import type { CrackClassification } from '../../types/crack';

const CLASSIFICATIONS: {
  value: CrackClassification;
  label: string;
  dot: string;
  bg: string;
  ring: string;
}[] = [
  { value: 'Good', label: 'Good', dot: 'bg-green-500', bg: 'hover:bg-green-50', ring: 'ring-green-200' },
  { value: 'Fair', label: 'Fair', dot: 'bg-yellow-500', bg: 'hover:bg-yellow-50', ring: 'ring-yellow-200' },
  { value: 'Poor', label: 'Poor', dot: 'bg-orange-500', bg: 'hover:bg-orange-50', ring: 'ring-orange-200' },
  { value: 'Bad', label: 'Bad', dot: 'bg-red-500', bg: 'hover:bg-red-50', ring: 'ring-red-200' },
];

interface ClassificationSelectProps {
  value: CrackClassification | '';
  onChange: (value: CrackClassification | '') => void;
  error?: string;
}

export function ClassificationSelect({
  value,
  onChange,
  error,
}: ClassificationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = CLASSIFICATIONS.find((c) => c.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <span className="text-gray-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </span>
        Classification
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
          {selected ? (
            <span className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${selected.dot}`} />
              {selected.label}
            </span>
          ) : (
            <span className="text-gray-500">Select classification</span>
          )}
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
            {CLASSIFICATIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  onChange(c.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${c.bg} ${
                  value === c.value ? `bg-gray-50 font-medium ring-1 ring-inset ${c.ring}` : 'text-gray-700'
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                {c.label}
                {value === c.value && (
                  <svg className="ml-auto h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            ))}
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
