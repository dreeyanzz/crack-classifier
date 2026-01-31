import type { Timestamp } from 'firebase/firestore';

export type CrackClassification = 'Good' | 'Fair' | 'Poor' | 'Bad';

export interface CrackRecord {
  id: string;
  label: string;
  description: string;
  classification: CrackClassification;
  location: string;
  datetime: string;
  imageUrl: string;
  imageName: string;
  imagePath: string;
  createdAt: Timestamp;
}

export interface CrackFormData {
  label: string;
  description: string;
  classification: CrackClassification | '';
  location: string;
  datetime: string;
  imageName: string;
}

export interface ExifData {
  datetime: Date | null;
}
