import { BARANGAYS } from '../../constants/barangays';

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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-3 text-sm min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        } ${!value ? 'text-gray-500' : ''}`}
      >
        <option value="">Select barangay</option>
        {BARANGAYS.map((b) => (
          <option key={b} value={b}>
            {b}
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
