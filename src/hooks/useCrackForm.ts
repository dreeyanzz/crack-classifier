import { useState, useCallback } from 'react';
import type { CrackFormData, CrackClassification } from '../types/crack';
import { useExifExtraction } from './useExifExtraction';
import { validateCrackForm, hasErrors } from '../utils/validation';
import type { ValidationErrors } from '../utils/validation';
import { formatDatetimeForInput, getFileNameParts } from '../utils/exif';
import { uploadCrackImage } from '../services/storageService';
import { addCrackRecord } from '../services/firestoreService';

const INITIAL_FORM_DATA: CrackFormData = {
  label: '',
  description: '',
  classification: '',
  location: '',
  datetime: '',
  length: '',
  width: '',
  depth: '',
  imageName: '',
};

export function useCrackForm() {
  const [formData, setFormData] = useState<CrackFormData>(INITIAL_FORM_DATA);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileExtension, setFileExtension] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState<'idle' | 'uploading' | 'saving'>('idle');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { exifData, isExtracting, extract, reset: resetExif } = useExifExtraction();

  const updateField = useCallback(
    <K extends keyof CrackFormData>(field: K, value: CrackFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof ValidationErrors];
        return next;
      });
    },
    []
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Clean up previous preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });

      // Set default image name from file
      const { name, extension } = getFileNameParts(file.name);
      setFileExtension(extension);
      setFormData((prev) => ({
        ...prev,
        imageName: prev.imageName || name,
      }));

      // Extract EXIF data
      const exif = await extract(file);

      // Auto-fill datetime if extracted and field is empty
      if (exif.datetime) {
        setFormData((prev) => ({
          ...prev,
          datetime: prev.datetime || formatDatetimeForInput(exif.datetime!),
        }));
      }
    },
    [imagePreview, extract]
  );

  const handleSubmit = useCallback(async () => {
    setSubmitSuccess(false);
    setSubmitError(null);

    const fullImageName = `${formData.imageName}${fileExtension}`;
    const dataToValidate = { ...formData, imageName: formData.imageName };
    const validationErrors = validateCrackForm(dataToValidate, !!imageFile);

    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStep('uploading');

    try {
      const { imageUrl, imagePath } = await uploadCrackImage(
        imageFile!,
        fullImageName
      );

      setSubmitStep('saving');

      await addCrackRecord(
        { ...formData, imageName: fullImageName },
        imageUrl,
        imagePath
      );

      // Reset form
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setFormData(INITIAL_FORM_DATA);
      setImageFile(null);
      setImagePreview(null);
      setFileExtension('');
      setErrors({});
      resetExif();
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to submit record'
      );
    } finally {
      setIsSubmitting(false);
      setSubmitStep('idle');
    }
  }, [formData, fileExtension, imageFile, imagePreview, resetExif]);

  return {
    formData,
    imageFile,
    imagePreview,
    fileExtension,
    errors,
    isSubmitting,
    submitStep,
    isExtracting,
    submitSuccess,
    submitError,
    exifData,
    updateField,
    handleFileSelect,
    handleSubmit,
    setSubmitSuccess,
    setSubmitError,
    updateClassification: (value: CrackClassification | '') =>
      updateField('classification', value),
    updateLocation: (value: string) => updateField('location', value),
  };
}
