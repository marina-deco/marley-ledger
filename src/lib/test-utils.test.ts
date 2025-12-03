import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  validTitleArb,
  invalidTitleArb,
  taskArb,
  subtaskArb,
  persistedStateArb,
  createMockLocalStorage,
  saveStateToStorage,
  loadStateFromStorage,
  createTask,
  createSubtask,
  createPersistedState,
} from './test-utils';

describe('Test Utilities', () => {
  describe('Generators', () => {
    it('validTitleArb generates non-empty, non-whitespace strings', () => {
      fc.assert(
        fc.property(validTitleArb, (title) => {
          expect(title.trim().length).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });

    it('invalidTitleArb generates empty or whitespace-only strings', () => {
      fc.assert(
        fc.property(invalidTitleArb, (title) => {
          expect(title.trim().length).toBe(0);
        }),
        { numRuns: 100 }
      );
    });

    it('taskArb generates valid Task objects', () => {
      fc.assert(
        fc.property(taskArb, (task) => {
          expect(task).toHaveProperty('id');
          expect(task).toHaveProperty('title');
          expect(task).toHaveProperty('completed');
          expect(task).toHaveProperty('subtasks');
          expect(task).toHaveProperty('createdAt');
          expect(typeof task.id).toBe('string');
          expect(typeof task.title).toBe('string');
          expect(typeof task.completed).toBe('boolean');
          expect(Array.isArray(task.subtasks)).toBe(true);
          expect(typeof task.createdAt).toBe('number');
        }),
        { numRuns: 100 }
      );
    });

    it('subtaskArb generates valid Subtask objects', () => {
      fc.assert(
        fc.property(subtaskArb, (subtask) => {
          expect(subtask).toHaveProperty('id');
          expect(subtask).toHaveProperty('title');
          expect(subtask).toHaveProperty('completed');
          expect(typeof subtask.id).toBe('string');
          expect(typeof subtask.title).toBe('string');
          expect(typeof subtask.completed).toBe('boolean');
        }),
        { numRuns: 100 }
      );
    });

    it('persistedStateArb generates valid PersistedState objects', () => {
      fc.assert(
        fc.property(persistedStateArb, (state) => {
          expect(state).toHaveProperty('tasks');
          expect(state).toHaveProperty('savedSouls');
          expect(state).toHaveProperty('lostSouls');
          expect(Array.isArray(state.tasks)).toBe(true);
          expect(typeof state.savedSouls).toBe('number');
          expect(typeof state.lostSouls).toBe('number');
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('localStorage Mock', () => {
    it('createMockLocalStorage creates a working storage mock', () => {
      const storage = createMockLocalStorage();
      
      expect(storage.getItem('test')).toBeNull();
      
      storage.setItem('test', 'value');
      expect(storage.getItem('test')).toBe('value');
      
      storage.removeItem('test');
      expect(storage.getItem('test')).toBeNull();
    });

    it('saveStateToStorage and loadStateFromStorage round-trip correctly', () => {
      const storage = createMockLocalStorage();
      const state = createPersistedState({
        tasks: [createTask({ title: 'Test' })],
        savedSouls: 5,
        lostSouls: 3,
      });

      saveStateToStorage(state, storage);
      const loaded = loadStateFromStorage(storage);

      expect(loaded).toEqual(state);
    });
  });

  describe('Helper Functions', () => {
    it('createTask creates a valid task with defaults', () => {
      const task = createTask();
      expect(task.title).toBe('Test Task');
      expect(task.completed).toBe(false);
      expect(task.subtasks).toEqual([]);
    });

    it('createTask allows overrides', () => {
      const task = createTask({ title: 'Custom', completed: true });
      expect(task.title).toBe('Custom');
      expect(task.completed).toBe(true);
    });

    it('createSubtask creates a valid subtask with defaults', () => {
      const subtask = createSubtask();
      expect(subtask.title).toBe('Test Subtask');
      expect(subtask.completed).toBe(false);
    });

    it('createPersistedState creates valid state with defaults', () => {
      const state = createPersistedState();
      expect(state.tasks).toEqual([]);
      expect(state.savedSouls).toBe(0);
      expect(state.lostSouls).toBe(0);
    });
  });
});
