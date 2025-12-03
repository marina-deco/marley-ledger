/**
 * localStorage utilities for Marley's Ledger
 * Requirements: 7.1, 7.4, 7.5 - Data persistence
 */

import type { PersistedState } from '../types';

const STORAGE_KEY = 'marleys-ledger-state';

/**
 * Default state when no persisted state exists
 */
export const DEFAULT_STATE: PersistedState = {
  tasks: [],
  savedSouls: 0,
  lostSouls: 0,
};

/**
 * Checks if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Saves state to localStorage.
 * Serializes the state to JSON format.
 * Silently fails if localStorage is unavailable.
 * 
 * Requirements: 7.3, 7.4
 */
export function saveState(state: PersistedState): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  
  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Silently fail if storage is full or unavailable
  }
}

/**
 * Loads state from localStorage.
 * Parses JSON and restores task objects with all properties.
 * Returns default state if localStorage is unavailable or data is corrupted.
 * 
 * Requirements: 7.1, 7.2, 7.5
 */
export function loadState(): PersistedState {
  if (!isLocalStorageAvailable()) {
    return { ...DEFAULT_STATE };
  }
  
  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY);
    
    if (serialized === null) {
      return { ...DEFAULT_STATE };
    }
    
    const parsed = JSON.parse(serialized) as PersistedState;
    
    // Validate the parsed data has required properties
    if (!isValidPersistedState(parsed)) {
      return { ...DEFAULT_STATE };
    }
    
    return parsed;
  } catch {
    // Return default state if parsing fails (corrupted data)
    return { ...DEFAULT_STATE };
  }
}

/**
 * Validates that an object is a valid PersistedState
 */
function isValidPersistedState(obj: unknown): obj is PersistedState {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  const state = obj as Record<string, unknown>;
  
  return (
    Array.isArray(state.tasks) &&
    typeof state.savedSouls === 'number' &&
    typeof state.lostSouls === 'number'
  );
}

/**
 * Clears all persisted state from localStorage
 */
export function clearState(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}
