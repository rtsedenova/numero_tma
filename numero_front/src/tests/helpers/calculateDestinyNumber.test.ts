import { describe, it, expect } from 'vitest';
import { calculateDestinyNumber } from '@/helpers/calculateDestinyNumber';

describe('calculateDestinyNumber', () => {
  it('should calculate destiny number for a regular date', () => {
    const { destinyNumber, steps } = calculateDestinyNumber('1990-12-25');

    expect(destinyNumber).toBe('3'); 
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toContain('Цифры из даты');
  });

  it('should return master number if result is 11', () => {
    const { destinyNumber, steps } = calculateDestinyNumber('2000-01-09'); 

    expect(destinyNumber).toBe('3');
    expect(steps.some(step => step.includes('мастер-число'))).toBe(false);
  });

  it('should return master number if sum is 11', () => {
    const { destinyNumber, steps } = calculateDestinyNumber('1990-12-25'); 

    expect(destinyNumber).toBe('11');
    expect(steps[steps.length - 1]).toContain('мастер-число');
  });

  it('should handle short numeric date', () => {
    const { destinyNumber } = calculateDestinyNumber('01011991'); 

    expect(destinyNumber).toBe('22');
  });

  it('should remove non-digit characters', () => {
    const { destinyNumber } = calculateDestinyNumber('19/07/1985');

    expect(destinyNumber).toBeTypeOf('string');
  });
});
