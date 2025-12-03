/**
 * Input validation utilities for Marley's Ledger
 * Requirements: 1.2 - Empty tasks should be rejected
 */

/**
 * Validates a task title.
 * Returns true if the title is valid (non-empty after trimming).
 * Returns false for empty strings or whitespace-only strings.
 */
export function isValidTaskTitle(title: string): boolean {
  return title.trim().length > 0;
}

/**
 * Validates a subtask title.
 * Returns true if the title is valid (non-empty after trimming).
 * Returns false for empty strings or whitespace-only strings.
 */
export function isValidSubtaskTitle(title: string): boolean {
  return title.trim().length > 0;
}
