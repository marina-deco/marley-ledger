import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { saveState, loadState, clearState, DEFAULT_STATE } from './storage';
import { 
  taskArb, 
  persistedStateArb, 
  createMockLocalStorage,
  createTask,
  createPersistedState,
} from './test-utils';
import type { Task, PersistedState } from '../types';

describe('Storage Utilities', () => {
  let originalLocalStorage: Storage;
  let mockStorage: Storage;

  beforeEach(() => {
    originalLocalStorage = globalThis.localStorage;
    mockStorage = createMockLocalStorage();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    });
    // Also set on window for the storage module
    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: mockStorage },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  /**
   * **Feature: marleys-ledger, Property 3: Task persistence round-trip**
   * 
   * *For any* valid task object, serializing to JSON and then deserializing
   * should produce an equivalent task object with all properties preserved.
   * 
   * **Validates: Requirements 1.4, 7.4, 7.5**
   */
  describe('Property 3: Task persistence round-trip', () => {
    it('preserves task properties through save/load cycle', () => {
      fc.assert(
        fc.property(taskArb, (task: Task) => {
          const state: PersistedState = {
            tasks: [task],
            savedSouls: 0,
            lostSouls: 0,
          };
          
          saveState(state);
          const loaded = loadState();
          
          expect(loaded.tasks).toHaveLength(1);
          expect(loaded.tasks[0]).toEqual(task);
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: marleys-ledger, Property 10: Full state persistence round-trip**
   * 
   * *For any* application state (tasks array, savedSouls, lostSouls),
   * persisting to localStorage and then restoring should produce an equivalent state.
   * 
   * **Validates: Requirements 5.4, 7.1, 7.2**
   */
  describe('Property 10: Full state persistence round-trip', () => {
    it('preserves full state through save/load cycle', () => {
      fc.assert(
        fc.property(persistedStateArb, (state: PersistedState) => {
          saveState(state);
          const loaded = loadState();
          
          expect(loaded).toEqual(state);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Basic Operations', () => {
    it('returns default state when no data exists', () => {
      const state = loadState();
      expect(state).toEqual(DEFAULT_STATE);
    });

    it('saves and loads state correctly', () => {
      const state = createPersistedState({
        tasks: [createTask({ title: 'Test Task' })],
        savedSouls: 5,
        lostSouls: 3,
      });

      saveState(state);
      const loaded = loadState();

      expect(loaded.tasks).toHaveLength(1);
      expect(loaded.tasks[0].title).toBe('Test Task');
      expect(loaded.savedSouls).toBe(5);
      expect(loaded.lostSouls).toBe(3);
    });

    it('clears state correctly', () => {
      const state = createPersistedState({
        tasks: [createTask()],
        savedSouls: 1,
      });

      saveState(state);
      clearState();
      const loaded = loadState();

      expect(loaded).toEqual(DEFAULT_STATE);
    });

    it('returns default state for corrupted JSON', () => {
      mockStorage.setItem('marleys-ledger-state', 'not valid json');
      const loaded = loadState();
      expect(loaded).toEqual(DEFAULT_STATE);
    });

    it('returns default state for invalid structure', () => {
      mockStorage.setItem('marleys-ledger-state', JSON.stringify({ foo: 'bar' }));
      const loaded = loadState();
      expect(loaded).toEqual(DEFAULT_STATE);
    });
  });
});
