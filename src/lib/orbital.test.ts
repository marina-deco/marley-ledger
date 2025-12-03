import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { calculateBaseAngle, calculateOrbitValues } from './orbital';

describe('Orbital Calculations', () => {
  /**
   * **Feature: marleys-ledger, Property 4: Ghost orbital distribution**
   * 
   * *For any* number of ghosts N > 0 and *for any* ghost at index i,
   * the base angle should be (360 / N) * i degrees, ensuring even distribution.
   * 
   * **Validates: Requirements 2.2**
   */
  describe('Property 4: Ghost orbital distribution', () => {
    it('distributes ghosts evenly around the orbit', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }), // total ghosts
          fc.integer({ min: 0, max: 99 }),  // index
          (total, indexRaw) => {
            const index = indexRaw % total; // ensure index < total
            const baseAngle = calculateBaseAngle(index, total);
            const expectedAngle = (360 / total) * index;
            
            expect(baseAngle).toBeCloseTo(expectedAngle, 10);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('ensures adjacent ghosts have equal angular spacing', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 100 }), // need at least 2 ghosts
          (total) => {
            const expectedSpacing = 360 / total;
            
            for (let i = 0; i < total - 1; i++) {
              const angle1 = calculateBaseAngle(i, total);
              const angle2 = calculateBaseAngle(i + 1, total);
              const spacing = angle2 - angle1;
              
              expect(spacing).toBeCloseTo(expectedSpacing, 10);
            }
          }
        ),
        { numRuns: 50 }
      );
    });

    it('first ghost starts at 0 degrees', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          (total) => {
            const baseAngle = calculateBaseAngle(0, total);
            expect(baseAngle).toBe(0);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('calculateOrbitValues', () => {
    it('returns valid orbit values', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc.integer({ min: 0, max: 99 }),
          fc.integer({ min: 1, max: 100 }),
          (taskId, indexRaw, total) => {
            const index = indexRaw % total;
            const values = calculateOrbitValues(taskId, index, total);
            
            expect(values.baseAngle).toBeGreaterThanOrEqual(0);
            expect(values.baseAngle).toBeLessThan(360);
            expect(values.orbitRadius).toBeGreaterThanOrEqual(250);
            expect(values.duration).toBeGreaterThanOrEqual(20);
            expect(Math.abs(values.direction)).toBe(1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
