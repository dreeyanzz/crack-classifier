import { useState } from 'react';
import type { CrackRecord } from '../../types/crack';

interface CrackCardProps {
  record: CrackRecord;
  onClick: () => void;
}

const classificationConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Good: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  Fair: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  Poor: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  Bad: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
};

export function CrackCard({ record, onClick }: CrackCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const config = classificationConfig[record.classification] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    dot: 'bg-gray-500',
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      className="cursor-pointer group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-gray-300"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200">
            <div className="flex h-full items-center justify-center">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z" />
              </svg>
            </div>
          </div>
        )}
        <img
          src={record.imageUrl}
          alt={record.label}
          className={`h-full w-full object-cover transition-transform group-hover:scale-105 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        {/* Classification badge on image */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm ${config.bg} ${config.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {record.classification}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {record.label}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {record.location}
        </div>

        <p className="line-clamp-2 text-sm text-gray-600 leading-relaxed">
          {record.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M18 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75z" />
            </svg>
            <span className="truncate max-w-[40%]">{record.imageName}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {record.datetime
              ? new Date(record.datetime).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>
        {record.updatedAt && (
          <div className="flex items-center gap-1 text-xs text-gray-400 pt-2 border-t border-gray-100">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Updated {new Date(record.updatedAt.toDate()).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}
