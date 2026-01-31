import type { CrackClassification } from '../../types/crack';

const CLASSIFICATIONS: { value: CrackClassification; label: string; color: string }[] = [
  { value: 'Good', label: 'Good', color: 'text-green-600' },
  { value: 'Fair', label: 'Fair', color: 'text-yellow-600' },
  { value: 'Poor', label: 'Poor', color: 'text-orange-600' },
  { value: 'Bad', label: 'Bad', color: 'text-red-600' },
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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CrackClassification | '')}
        className={`w-full rounded-lg border px-3 py-3 text-sm min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error
            ? 'border-red-300 bg-red-50'
            : value
              ? CLASSIFICATIONS.find((c) => c.value === value)?.color || 'border-gray-300'
              : 'border-gray-300'
        } ${!value ? 'text-gray-500' : ''}`}
      >
        <option value="">Select classification</option>
        {CLASSIFICATIONS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
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
