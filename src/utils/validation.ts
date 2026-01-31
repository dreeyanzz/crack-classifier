import type { CrackFormData, CrackEditData } from '../types/crack';

export interface ValidationErrors {
  label?: string;
  classification?: string;
  description?: string;
  location?: string;
  datetime?: string;
  imageName?: string;
  image?: string;
}

export function validateCrackForm(
  data: CrackFormData,
  hasImage: boolean
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!hasImage) {
    errors.image = 'Please upload an image';
  }

  if (!data.label.trim()) {
    errors.label = 'Label is required';
  } else if (data.label.trim().length > 100) {
    errors.label = 'Label must be 100 characters or fewer';
  }

  if (!data.classification) {
    errors.classification = 'Please select a classification';
  }

  if (!data.location) {
    errors.location = 'Please select a location';
  }

  if (!data.datetime) {
    errors.datetime = 'Date and time is required';
  }

  if (!data.imageName.trim()) {
    errors.imageName = 'Image name is required';
  }

  return errors;
}

export interface EditValidationErrors {
  label?: string;
  classification?: string;
  description?: string;
  location?: string;
  datetime?: string;
}

export function validateCrackEdit(data: CrackEditData): EditValidationErrors {
  const errors: EditValidationErrors = {};

  if (!data.label.trim()) {
    errors.label = 'Label is required';
  } else if (data.label.trim().length > 100) {
    errors.label = 'Label must be 100 characters or fewer';
  }

  if (!data.classification) {
    errors.classification = 'Please select a classification';
  }

  if (!data.location) {
    errors.location = 'Please select a location';
  }

  if (!data.datetime) {
    errors.datetime = 'Date and time is required';
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors | EditValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
