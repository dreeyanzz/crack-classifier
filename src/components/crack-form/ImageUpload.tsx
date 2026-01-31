import { useRef, useState, type DragEvent } from 'react';
import { Spinner } from '../ui/Spinner';

interface ImageUploadProps {
  preview: string | null;
  onFileSelect: (file: File) => void;
  isExtracting: boolean;
  error?: string;
}

export function ImageUpload({
  preview,
  onFileSelect,
  isExtracting,
  error,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-1.5">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
            : error
              ? 'border-red-300 bg-red-50/30'
              : preview
                ? 'border-gray-200 hover:border-blue-400'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-72 w-full object-contain p-2"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 transition-all group-hover:bg-black/40">
              <div className="translate-y-2 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-full bg-white/90 p-3 shadow-lg">
                  <svg className="h-6 w-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <p className="mt-2 text-sm font-medium text-white">Replace photo</p>
              </div>
            </div>
            {/* Extracting overlay */}
            {isExtracting && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <div className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
                  <Spinner size="sm" />
                  Scanning photo data...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 sm:py-10">
            <div className="rounded-full bg-blue-50 p-4 group-hover:bg-blue-100 transition-colors">
              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <p className="mt-3 text-sm font-medium text-gray-700">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, JPEG up to 10MB
            </p>
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
