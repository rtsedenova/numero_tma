import { describe, it, expect } from 'vitest';
import { calculateDestinyNumber } from '@/helpers/calculateDestinyNumber';

describe('calculateDestinyNumber', () => {
  it('should calculate destiny number for a regular date', () => {
    const { destinyNumber, steps } = calculateDestinyNumber('1990-12-25');

    expect(destinyNumber).toBe('11'); 
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0]).toContain('Цифры из даты');
    expect(steps.some(step => step.includes('мастер-число'))).toBe(true);
  });

  it('should correctly calculate a non-master number date', () => {
    const { destinyNumber, steps } = calculateDestinyNumber('2000-01-09'); 
    // 2 + 0 + 0 + 0 + 0 + 1 + 0 + 9 = 12 → 1 + 2 = 3

    expect(destinyNumber).toBe('3');
    expect(steps.some(step => step.includes('мастер-число'))).toBe(false);
  });

  it('should return master number if result is 22', () => {
    const { destinyNumber, steps } = calculateDestinyNumber('01011991');
    // 0 + 1 + 0 + 1 + 1 + 9 + 9 + 1 = 22

    expect(destinyNumber).toBe('22');
    expect(steps.some(step => step.includes('мастер-число'))).toBe(true);
  });

  it('should parse dates with slashes correctly and return correct number', () => {
    const { destinyNumber, steps } = calculateDestinyNumber('19/07/1985');
    // 1+9+0+7+1+9+8+5 = 40 → 4 + 0 = 4

    expect(destinyNumber).toBe('4');
    expect(steps[0]).toContain('Цифры из даты');
    expect(steps.some(step => step.includes('мастер-число'))).toBe(false);
  });
});
