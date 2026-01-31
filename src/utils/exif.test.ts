import { describe, it, expect } from 'vitest';
import { formatDatetimeForInput, getFileNameParts } from './exif';

describe('formatDatetimeForInput', () => {
  it('formats a date correctly', () => {
    const date = new Date(2026, 0, 31, 8, 5); // Jan 31, 2026 08:05
    expect(formatDatetimeForInput(date)).toBe('2026-01-31T08:05');
  });

  it('pads single-digit months and days', () => {
    const date = new Date(2026, 2, 5, 3, 9); // Mar 5, 2026 03:09
    expect(formatDatetimeForInput(date)).toBe('2026-03-05T03:09');
  });

  it('handles midnight correctly', () => {
    const date = new Date(2026, 11, 25, 0, 0); // Dec 25, 2026 00:00
    expect(formatDatetimeForInput(date)).toBe('2026-12-25T00:00');
  });

  it('handles end of day correctly', () => {
    const date = new Date(2026, 5, 15, 23, 59); // Jun 15, 2026 23:59
    expect(formatDatetimeForInput(date)).toBe('2026-06-15T23:59');
  });
});

describe('getFileNameParts', () => {
  it('splits a standard filename', () => {
    expect(getFileNameParts('photo.jpg')).toEqual({
      name: 'photo',
      extension: '.jpg',
    });
  });

  it('handles filenames with multiple dots', () => {
    expect(getFileNameParts('my.crack.photo.png')).toEqual({
      name: 'my.crack.photo',
      extension: '.png',
    });
  });

  it('handles filenames with no extension', () => {
    expect(getFileNameParts('readme')).toEqual({
      name: 'readme',
      extension: '',
    });
  });

  it('handles dotfiles', () => {
    expect(getFileNameParts('.gitignore')).toEqual({
      name: '',
      extension: '.gitignore',
    });
  });

  it('handles empty string', () => {
    expect(getFileNameParts('')).toEqual({
      name: '',
      extension: '',
    });
  });
});
