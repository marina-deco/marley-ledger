import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateScaleTilt, getScaleState, MAX_TILT_ANGLE } from './scale';

describe('Scale Calculations', () => {
  /**
   * **Feature: marleys-ledger, Property 11: Scale tilt direction matches soul balance**
   * 
   * *For any* savedSouls count S and lostSouls count L, the scale tilt should be
   * negative (left/saved side down) when S > L, positive (right/lost side down)
   * when L > S, and zero when S == L.
   * 
   * **Validates: Requirements 8.2, 8.3, 8.4**
   */
  describe('Property 11: Scale tilt direction matches soul balance', () => {
    it('returns negative tilt when saved > lost', () => {
      fc.assert(
        fc.property(
          fc.nat({ max: 1000 }),
          fc.nat({ max: 1000 }),
          (base, extra) => {
            const saved = base + extra + 1; // ensure saved > lost
            const lost = base;
            const tilt = calculateScaleTilt(saved, lost);
            
            expect(tilt).toBeLessThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns positive tilt when lost > saved', () => {
      fc.assert(
        fc.property(
          fc.nat({ max: 1000 }),
          fc.nat({ max: 1000 }),
          (base, extra) => {
            const saved = base;
            const lost = base + extra + 1; // ensure lost > saved
            const tilt = calculateScaleTilt(saved, lost);
            
            expect(tilt).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns zero tilt when saved == lost', () => {
      fc.assert(
        fc.property(
          fc.nat({ max: 1000 }),
          (count) => {
            const tilt = calculateScaleTilt(count, count);
            expect(tilt).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('tilt is bounded by MAX_TILT_ANGLE', () => {
      fc.assert(
        fc.property(
          fc.nat({ max: 10000 }),
          fc.nat({ max: 10000 }),
          (saved, lost) => {
            const tilt = calculateScaleTilt(saved, lost);
            expect(Math.abs(tilt)).toBeLessThanOrEqual(MAX_TILT_ANGLE);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('getScaleState', () => {
    it('returns correct state based on balance', () => {
      expect(getScaleState(5, 3)).toBe('saved');
      expect(getScaleState(3, 5)).toBe('lost');
      expect(getScaleState(5, 5)).toBe('balanced');
      expect(getScaleState(0, 0)).toBe('balanced');
    });
  });
});
