import exifr from 'exifr';
import type { ExifData } from '../types/crack';

export async function extractExifData(file: File): Promise<ExifData> {
  const result: ExifData = {
    datetime: null,
  };

  try {
    const parsed = await exifr.parse(file, {
      pick: ['DateTimeOriginal', 'CreateDate', 'ModifyDate'],
    });
    if (parsed) {
      const dateValue =
        parsed.DateTimeOriginal ?? parsed.CreateDate ?? parsed.ModifyDate;
      if (dateValue instanceof Date) {
        result.datetime = dateValue;
      }
    }
  } catch {
    // Datetime data not available - expected for many photos
  }

  return result;
}

export function formatDatetimeForInput(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getFileNameParts(filename: string): {
  name: string;
  extension: string;
} {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) {
    return { name: filename, extension: '' };
  }
  return {
    name: filename.substring(0, lastDot),
    extension: filename.substring(lastDot),
  };
}
