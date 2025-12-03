/**
 * Chain state calculation utilities
 * Requirements: 9.1, 9.2, 9.3 - Chain visibility based on subtask state
 */

import type { Task } from '../types';

export type ChainState = 'chained' | 'broken' | 'none';

/**
 * Determines the chain state for a task based on its subtasks.
 * 
 * @param task - The task to evaluate
 * @returns ChainState:
 *   - 'chained': Task has subtasks and at least one is incomplete
 *   - 'broken': Task has subtasks and all are complete
 *   - 'none': Task has no subtasks
 */
export function getChainState(task: Task): ChainState {
  // No subtasks = no chains
  if (task.subtasks.length === 0) {
    return 'none';
  }
  
  // Check if all subtasks are complete
  const allComplete = task.subtasks.every(subtask => subtask.completed);
  
  return allComplete ? 'broken' : 'chained';
}

/**
 * Checks if a task should display chains (has incomplete subtasks)
 */
export function hasChains(task: Task): boolean {
  return getChainState(task) === 'chained';
}

/**
 * Checks if a task's chains are broken (all subtasks complete)
 */
export function hasBrokenChains(task: Task): boolean {
  return getChainState(task) === 'broken';
}
