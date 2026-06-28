import { describe, it, expect } from 'vitest';
import { splitFullName, getDepartmentForId } from '../src/utils/helpers';
import { DEPARTMENTS } from '../src/utils/constants';

describe('Utility Helpers Tests', () => {
  describe('splitFullName', () => {
    it('should split standard first and last names', () => {
      const result = splitFullName('Leanne Graham');
      expect(result.firstName).toBe('Leanne');
      expect(result.lastName).toBe('Graham');
    });

    it('should split three-part names, preserving the trailing space components', () => {
      const result = splitFullName('Mrs. Dennis Schulist');
      expect(result.firstName).toBe('Mrs.');
      expect(result.lastName).toBe('Dennis Schulist');
    });

    it('should handle single names with empty last name', () => {
      const result = splitFullName('Chelsey');
      expect(result.firstName).toBe('Chelsey');
      expect(result.lastName).toBe('');
    });

    it('should trim surrounding whitespace', () => {
      const result = splitFullName('   Kurtis Weissnat   ');
      expect(result.firstName).toBe('Kurtis');
      expect(result.lastName).toBe('Weissnat');
    });

    it('should handle empty or null names', () => {
      expect(splitFullName('').firstName).toBe('');
      expect(splitFullName(null).firstName).toBe('');
      expect(splitFullName(undefined).firstName).toBe('');
    });
  });

  describe('getDepartmentForId', () => {
    it('should determine departments deterministically based on ID', () => {
      expect(getDepartmentForId(1)).toBe(DEPARTMENTS[0]);
      expect(getDepartmentForId(2)).toBe(DEPARTMENTS[1]);
      
      // Loop over index bounds to confirm modulus works
      const count = DEPARTMENTS.length;
      expect(getDepartmentForId(count + 1)).toBe(DEPARTMENTS[0]);
      expect(getDepartmentForId(count * 2 + 3)).toBe(DEPARTMENTS[2]);
    });

    it('should default to first department for invalid IDs', () => {
      expect(getDepartmentForId(null)).toBe(DEPARTMENTS[0]);
      expect(getDepartmentForId('not-an-id')).toBe(DEPARTMENTS[0]);
    });
  });
});
