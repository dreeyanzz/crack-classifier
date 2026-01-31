interface ImageNameFieldProps {
  value: string;
  extension: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ImageNameField({
  value,
  extension,
  onChange,
  error,
}: ImageNameFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        <span className="text-gray-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z" />
          </svg>
        </span>
        Image Name
        <span className="text-red-500 ml-0.5">*</span>
      </label>
      <div className="flex">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter image name"
          className={`flex-1 min-w-0 rounded-l-lg border px-3 py-3 text-sm min-h-[44px] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        />
        {extension && (
          <span className="inline-flex items-center rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 px-3 py-3 text-sm font-mono text-gray-500 min-h-[44px]">
            {extension}
          </span>
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
