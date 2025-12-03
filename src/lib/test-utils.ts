import * as fc from 'fast-check';
import type { Task, Subtask, PersistedState } from '../types';

// Re-export PersistedState for convenience
export type { PersistedState };

// ============================================
// Generators for Property-Based Testing
// ============================================

/**
 * Generator for valid non-empty, non-whitespace strings
 */
export const validTitleArb = fc.string({ minLength: 1 })
  .filter(s => s.trim().length > 0);

/**
 * Generator for invalid (empty or whitespace-only) strings
 */
export const invalidTitleArb = fc.oneof(
  fc.constant(''),
  fc.array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 20 })
    .map(chars => chars.join(''))
);

/**
 * Generator for unique IDs (timestamp-based format)
 */
export const idArb = fc.tuple(fc.nat(), fc.nat()).map(
  ([a, b]) => `${a}-${b}`
);

/**
 * Generator for Subtask objects
 */
export const subtaskArb: fc.Arbitrary<Subtask> = fc.record({
  id: idArb,
  title: validTitleArb,
  completed: fc.boolean(),
});

/**
 * Generator for Task objects
 */
export const taskArb: fc.Arbitrary<Task> = fc.record({
  id: idArb,
  title: validTitleArb,
  completed: fc.boolean(),
  subtasks: fc.array(subtaskArb, { maxLength: 10 }),
  createdAt: fc.nat(),
});


/**
 * Generator for PersistedState objects
 */
export const persistedStateArb: fc.Arbitrary<PersistedState> = fc.record({
  tasks: fc.array(taskArb, { maxLength: 20 }),
  savedSouls: fc.nat({ max: 1000 }),
  lostSouls: fc.nat({ max: 1000 }),
});

/**
 * Generator for a non-empty array of tasks
 */
export const nonEmptyTasksArb = fc.array(taskArb, { minLength: 1, maxLength: 20 });

// ============================================
// localStorage Mock Helpers
// ============================================

const STORAGE_KEY = 'marleys-ledger-state';

/**
 * Creates a mock localStorage object for testing
 */
export function createMockLocalStorage(): Storage {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null => {
      return store[key] ?? null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key: (index: number): string | null => {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    },
  };
}

/**
 * Sets up mock localStorage on the global object
 * Returns a cleanup function to restore original localStorage
 */
export function setupMockLocalStorage(): { 
  mockStorage: Storage; 
  cleanup: () => void 
} {
  const mockStorage = createMockLocalStorage();
  const originalLocalStorage = globalThis.localStorage;

  Object.defineProperty(globalThis, 'localStorage', {
    value: mockStorage,
    writable: true,
    configurable: true,
  });

  return {
    mockStorage,
    cleanup: () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: originalLocalStorage,
        writable: true,
        configurable: true,
      });
    },
  };
}

/**
 * Saves state to localStorage
 */
export function saveStateToStorage(state: PersistedState, storage: Storage = localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Loads state from localStorage
 * Returns null if no state exists or if parsing fails
 */
export function loadStateFromStorage(storage: Storage = localStorage): PersistedState | null {
  try {
    const data = storage.getItem(STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as PersistedState;
  } catch {
    return null;
  }
}

/**
 * Clears the persisted state from localStorage
 */
export function clearStoredState(storage: Storage = localStorage): void {
  storage.removeItem(STORAGE_KEY);
}

/**
 * Helper to create a task with specific properties
 */
export function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Test Task',
    completed: false,
    subtasks: [],
    createdAt: Date.now(),
    ...overrides,
  };
}

/**
 * Helper to create a subtask with specific properties
 */
export function createSubtask(overrides: Partial<Subtask> = {}): Subtask {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Test Subtask',
    completed: false,
    ...overrides,
  };
}

/**
 * Helper to create an initial persisted state
 */
export function createPersistedState(overrides: Partial<PersistedState> = {}): PersistedState {
  return {
    tasks: [],
    savedSouls: 0,
    lostSouls: 0,
    ...overrides,
  };
}
