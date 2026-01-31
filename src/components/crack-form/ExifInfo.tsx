import type { ExifData } from '../../types/crack';
import { Spinner } from '../ui/Spinner';

interface ExifInfoProps {
  exifData: ExifData | null;
  isExtracting: boolean;
}

export function ExifInfo({ exifData, isExtracting }: ExifInfoProps) {
  if (isExtracting) {
    return (
      <div className="mt-3 flex items-center gap-2.5 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
        <Spinner size="sm" />
        Scanning photo metadata...
      </div>
    );
  }

  if (!exifData) return null;

  const hasData = exifData.datetime;

  return (
    <div
      className={`mt-3 flex items-start gap-2.5 rounded-lg p-3 text-sm ${
        hasData
          ? 'bg-green-50 text-green-700'
          : 'bg-amber-50 text-amber-700'
      }`}
    >
      {hasData ? (
        <>
          <svg className="h-5 w-5 flex-shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-medium">Photo metadata found</p>
            <p className="mt-0.5 text-xs opacity-80">
              Date/time: {exifData.datetime!.toLocaleString()}
            </p>
          </div>
        </>
      ) : (
        <>
          <svg className="h-5 w-5 flex-shrink-0 mt-px" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <div>
            <p className="font-medium">No metadata found</p>
            <p className="mt-0.5 text-xs opacity-80">
              Please fill in the date and time manually.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
