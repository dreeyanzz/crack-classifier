import { useState, useCallback } from 'react';
import type { ExifData } from '../types/crack';
import { extractExifData } from '../utils/exif';

interface UseExifExtractionReturn {
  exifData: ExifData | null;
  isExtracting: boolean;
  extract: (file: File) => Promise<ExifData>;
  reset: () => void;
}

export function useExifExtraction(): UseExifExtractionReturn {
  const [exifData, setExifData] = useState<ExifData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const extract = useCallback(async (file: File): Promise<ExifData> => {
    setIsExtracting(true);
    try {
      const data = await extractExifData(file);
      setExifData(data);
      return data;
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setExifData(null);
  }, []);

  return { exifData, isExtracting, extract, reset };
}
