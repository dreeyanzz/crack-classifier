import type { Timestamp } from 'firebase/firestore';

export type CrackClassification = 'Good' | 'Fair' | 'Poor' | 'Bad';

export interface CrackRecord {
  id: string;
  label: string;
  description: string;
  classification: CrackClassification;
  location: string;
  datetime: string;
  length: string;
  width: string;
  depth: string;
  imageUrl: string;
  imageName: string;
  imagePath: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface CrackFormData {
  label: string;
  description: string;
  classification: CrackClassification | '';
  location: string;
  datetime: string;
  length: string;
  width: string;
  depth: string;
  imageName: string;
}

export interface CrackEditData {
  label: string;
  description: string;
  classification: CrackClassification;
  location: string;
  datetime: string;
  length: string;
  width: string;
  depth: string;
}

export interface ExifData {
  datetime: Date | null;
}
