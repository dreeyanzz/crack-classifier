import { describe, it, expect } from 'vitest';
import { validateCrackForm, hasErrors } from './validation';
import type { CrackFormData } from '../types/crack';

const validFormData: CrackFormData = {
  label: 'Test crack',
  description: 'A crack on the road',
  classification: 'Poor',
  location: 'Basak',
  datetime: '2026-01-31T08:00',
  imageName: 'crack_photo',
};

describe('validateCrackForm', () => {
  it('returns no errors for valid data with image', () => {
    const errors = validateCrackForm(validFormData, true);
    expect(errors).toEqual({});
  });

  it('returns image error when no image is provided', () => {
    const errors = validateCrackForm(validFormData, false);
    expect(errors.image).toBe('Please upload an image');
  });

  it('returns label error when label is empty', () => {
    const errors = validateCrackForm({ ...validFormData, label: '' }, true);
    expect(errors.label).toBe('Label is required');
  });

  it('returns label error when label is whitespace only', () => {
    const errors = validateCrackForm({ ...validFormData, label: '   ' }, true);
    expect(errors.label).toBe('Label is required');
  });

  it('returns label error when label exceeds 100 characters', () => {
    const longLabel = 'a'.repeat(101);
    const errors = validateCrackForm({ ...validFormData, label: longLabel }, true);
    expect(errors.label).toBe('Label must be 100 characters or fewer');
  });

  it('accepts label at exactly 100 characters', () => {
    const label = 'a'.repeat(100);
    const errors = validateCrackForm({ ...validFormData, label }, true);
    expect(errors.label).toBeUndefined();
  });

  it('returns classification error when empty', () => {
    const errors = validateCrackForm({ ...validFormData, classification: '' }, true);
    expect(errors.classification).toBe('Please select a classification');
  });

  it('returns description error when empty', () => {
    const errors = validateCrackForm({ ...validFormData, description: '' }, true);
    expect(errors.description).toBe('Description is required');
  });

  it('returns location error when empty', () => {
    const errors = validateCrackForm({ ...validFormData, location: '' }, true);
    expect(errors.location).toBe('Please select a location');
  });

  it('returns datetime error when empty', () => {
    const errors = validateCrackForm({ ...validFormData, datetime: '' }, true);
    expect(errors.datetime).toBe('Date and time is required');
  });

  it('returns imageName error when empty', () => {
    const errors = validateCrackForm({ ...validFormData, imageName: '' }, true);
    expect(errors.imageName).toBe('Image name is required');
  });

  it('returns multiple errors at once', () => {
    const emptyData: CrackFormData = {
      label: '',
      description: '',
      classification: '',
      location: '',
      datetime: '',
      imageName: '',
    };
    const errors = validateCrackForm(emptyData, false);
    expect(Object.keys(errors).length).toBe(7);
  });
});

describe('hasErrors', () => {
  it('returns false for empty errors object', () => {
    expect(hasErrors({})).toBe(false);
  });

  it('returns true when errors exist', () => {
    expect(hasErrors({ label: 'Label is required' })).toBe(true);
  });

  it('returns true for multiple errors', () => {
    expect(hasErrors({ label: 'err', description: 'err' })).toBe(true);
  });
});
