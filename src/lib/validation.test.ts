import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { isValidTaskTitle, isValidSubtaskTitle } from './validation';
import { validTitleArb, invalidTitleArb } from './test-utils';

describe('Input Validation', () => {
  /**
   * **Feature: marleys-ledger, Property 2: Empty/whitespace tasks are rejected**
   * 
   * *For any* string composed entirely of whitespace (including empty string),
   * attempting to add it should leave the task list unchanged.
   * 
   * **Validates: Requirements 1.2**
   */
  describe('Property 2: Empty/whitespace tasks are rejected', () => {
    it('rejects empty and whitespace-only strings', () => {
      fc.assert(
        fc.property(invalidTitleArb, (title) => {
          expect(isValidTaskTitle(title)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('accepts valid non-empty, non-whitespace strings', () => {
      fc.assert(
        fc.property(validTitleArb, (title) => {
          expect(isValidTaskTitle(title)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('isValidSubtaskTitle', () => {
    it('rejects empty and whitespace-only strings', () => {
      fc.assert(
        fc.property(invalidTitleArb, (title) => {
          expect(isValidSubtaskTitle(title)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('accepts valid non-empty, non-whitespace strings', () => {
      fc.assert(
        fc.property(validTitleArb, (title) => {
          expect(isValidSubtaskTitle(title)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });
});
