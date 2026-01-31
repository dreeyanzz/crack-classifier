import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { CrackRecord, CrackFormData } from '../types/crack';

const COLLECTION_NAME = 'crack_records';

export async function addCrackRecord(
  formData: CrackFormData,
  imageUrl: string,
  imagePath: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    label: formData.label,
    description: formData.description,
    classification: formData.classification,
    location: formData.location,
    datetime: formData.datetime,
    imageName: formData.imageName,
    imageUrl,
    imagePath,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getCrackRecords(): Promise<CrackRecord[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt as Timestamp,
  })) as CrackRecord[];
}
