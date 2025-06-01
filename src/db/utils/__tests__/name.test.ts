import { getName } from '../name';

describe('getName', () => {
  it('should return the first part of the name before "til"', () => {
    expect(getName('Salt til kartofler')).toBe('Salt');
  });

  it('should return the first part of the name before parentheses', () => {
    expect(getName('Salt (til kartofler)')).toBe('Salt');
  });

  it('should remove asterisks', () => {
    expect(getName('*Salt til kartofler')).toBe('Salt');
  });

  it('should return the original name if no separators are found', () => {
    expect(getName('Salt')).toBe('Salt');
  });

  it('should handle empty strings', () => {
    expect(getName('')).toBe('');
  });

  it('should handle names with multiple separators', () => {
    expect(getName('Salt til kartofler (med smør)')).toBe('Salt');
  });
});
