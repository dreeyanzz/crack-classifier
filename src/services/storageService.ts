import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_+/g, '_');
}

export async function uploadCrackImage(
  file: File,
  imageName: string
): Promise<{ imageUrl: string; imagePath: string }> {
  const sanitized = sanitizeFilename(imageName);
  const imagePath = `Images/${sanitized}`;
  const storageRef = ref(storage, imagePath);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  const imageUrl = await getDownloadURL(snapshot.ref);

  return { imageUrl, imagePath };
}

export async function deleteCrackImage(imagePath: string): Promise<void> {
  const storageRef = ref(storage, imagePath);
  await deleteObject(storageRef);
}
