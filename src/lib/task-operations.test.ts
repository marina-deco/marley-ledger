import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  addTaskToState,
  updateTaskInState,
  addSubtaskToState,
  toggleSubtaskInState,
  completeTaskInState,
} from './task-operations';
import {
  validTitleArb,
  invalidTitleArb,
  persistedStateArb,
  nonEmptyTasksArb,
  createPersistedState,
} from './test-utils';
import type { PersistedState } from '../types';

import { saveState, loadState } from './storage';
import { createMockLocalStorage } from './test-utils';

// Setup mock localStorage for persistence tests
let mockStorage: Storage;
let originalWindow: typeof globalThis.window;

function setupStorage() {
  mockStorage = createMockLocalStorage();
  originalWindow = globalThis.window;
  Object.defineProperty(globalThis, 'window', {
    value: { localStorage: mockStorage },
    writable: true,
    configurable: true,
  });
}

function cleanupStorage() {
  Object.defineProperty(globalThis, 'window', {
    value: originalWindow,
    writable: true,
    configurable: true,
  });
}

describe('Task Operations', () => {
  /**
   * **Feature: marleys-ledger, Property 1: Adding valid task grows task list**
   * 
   * *For any* task list and *for any* non-empty, non-whitespace task description,
   * adding the task should result in the task list length increasing by exactly one,
   * and the new task should have the provided description.
   * 
   * **Validates: Requirements 1.1**
   */
  describe('Property 1: Adding valid task grows task list', () => {
    it('increases task list length by one for valid titles', () => {
      fc.assert(
        fc.property(
          persistedStateArb,
          validTitleArb,
          (state: PersistedState, title: string) => {
            const initialLength = state.tasks.length;
            const newState = addTaskToState(state, title);
            
            expect(newState.tasks.length).toBe(initialLength + 1);
            expect(newState.tasks[newState.tasks.length - 1].title).toBe(title.trim());
          }
        ),
        { numRuns: 100 }
      );
    });

    it('does not change task list for invalid titles', () => {
      fc.assert(
        fc.property(
          persistedStateArb,
          invalidTitleArb,
          (state: PersistedState, title: string) => {
            const newState = addTaskToState(state, title);
            
            expect(newState.tasks.length).toBe(state.tasks.length);
            expect(newState).toEqual(state);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});


  /**
   * **Feature: marleys-ledger, Property 5: Task update persistence**
   * 
   * *For any* existing task and *for any* new valid title, updating the task title
   * should persist the change such that reloading returns the updated title.
   * 
   * **Validates: Requirements 3.3**
   */
  describe('Property 5: Task update persistence', () => {
    it('persists task title updates through save/load cycle', () => {
      setupStorage();
      
      try {
        fc.assert(
          fc.property(
            nonEmptyTasksArb,
            validTitleArb,
            (tasks, newTitle) => {
              const state: PersistedState = createPersistedState({ tasks });
              const taskToUpdate = tasks[0];
              
              // Update the task
              const updatedState = updateTaskInState(state, taskToUpdate.id, { 
                title: newTitle.trim() 
              });
              
              // Save and reload
              saveState(updatedState);
              const loadedState = loadState();
              
              // Find the updated task
              const loadedTask = loadedState.tasks.find(t => t.id === taskToUpdate.id);
              expect(loadedTask).toBeDefined();
              expect(loadedTask?.title).toBe(newTitle.trim());
            }
          ),
          { numRuns: 100 }
        );
      } finally {
        cleanupStorage();
      }
    });
  });


  /**
   * **Feature: marleys-ledger, Property 6: Adding subtask grows subtask list**
   * 
   * *For any* task and *for any* non-empty subtask description,
   * adding the subtask should increase the task's subtask count by exactly one.
   * 
   * **Validates: Requirements 4.1**
   */
  describe('Property 6: Adding subtask grows subtask list', () => {
    it('increases subtask count by one for valid titles', () => {
      fc.assert(
        fc.property(
          nonEmptyTasksArb,
          validTitleArb,
          (tasks, subtaskTitle) => {
            const state: PersistedState = createPersistedState({ tasks });
            const targetTask = tasks[0];
            const initialSubtaskCount = targetTask.subtasks.length;
            
            const newState = addSubtaskToState(state, targetTask.id, subtaskTitle);
            const updatedTask = newState.tasks.find(t => t.id === targetTask.id);
            
            expect(updatedTask).toBeDefined();
            expect(updatedTask?.subtasks.length).toBe(initialSubtaskCount + 1);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('does not add subtask for invalid titles', () => {
      fc.assert(
        fc.property(
          nonEmptyTasksArb,
          invalidTitleArb,
          (tasks, subtaskTitle) => {
            const state: PersistedState = createPersistedState({ tasks });
            const targetTask = tasks[0];
            const initialSubtaskCount = targetTask.subtasks.length;
            
            const newState = addSubtaskToState(state, targetTask.id, subtaskTitle);
            const updatedTask = newState.tasks.find(t => t.id === targetTask.id);
            
            expect(updatedTask?.subtasks.length).toBe(initialSubtaskCount);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: marleys-ledger, Property 7: Subtask toggle inverts completion**
   * 
   * *For any* subtask with completion status S, toggling the subtask
   * should result in completion status !S.
   * 
   * **Validates: Requirements 4.3**
   */
  describe('Property 7: Subtask toggle inverts completion', () => {
    it('inverts subtask completion status', () => {
      fc.assert(
        fc.property(
          nonEmptyTasksArb.filter(tasks => tasks.some(t => t.subtasks.length > 0)),
          (tasks) => {
            // Find a task with subtasks
            const taskWithSubtasks = tasks.find(t => t.subtasks.length > 0)!;
            const subtask = taskWithSubtasks.subtasks[0];
            const initialStatus = subtask.completed;
            
            const state: PersistedState = createPersistedState({ tasks });
            const newState = toggleSubtaskInState(state, taskWithSubtasks.id, subtask.id);
            
            const updatedTask = newState.tasks.find(t => t.id === taskWithSubtasks.id);
            const updatedSubtask = updatedTask?.subtasks.find(s => s.id === subtask.id);
            
            expect(updatedSubtask?.completed).toBe(!initialStatus);
          }
        ),
        { numRuns: 100 }
      );
    });
  });


  /**
   * **Feature: marleys-ledger, Property 8: Saving soul removes task and increments saved count**
   * 
   * *For any* task list with N tasks and saved count S, completing a task as "saved"
   * should result in N-1 tasks and saved count S+1.
   * 
   * **Validates: Requirements 5.1**
   */
  describe('Property 8: Saving soul removes task and increments saved count', () => {
    it('removes task and increments savedSouls when accomplished=true', () => {
      fc.assert(
        fc.property(
          nonEmptyTasksArb,
          fc.nat({ max: 100 }),
          fc.nat({ max: 100 }),
          (tasks, savedSouls, lostSouls) => {
            const state: PersistedState = createPersistedState({ 
              tasks, 
              savedSouls, 
              lostSouls 
            });
            const taskToComplete = tasks[0];
            const initialTaskCount = tasks.length;
            
            const newState = completeTaskInState(state, taskToComplete.id, true);
            
            expect(newState.tasks.length).toBe(initialTaskCount - 1);
            expect(newState.savedSouls).toBe(savedSouls + 1);
            expect(newState.lostSouls).toBe(lostSouls); // unchanged
            expect(newState.tasks.find(t => t.id === taskToComplete.id)).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: marleys-ledger, Property 9: Losing soul removes task and increments lost count**
   * 
   * *For any* task list with N tasks and lost count L, completing a task as "lost"
   * should result in N-1 tasks and lost count L+1.
   * 
   * **Validates: Requirements 5.2**
   */
  describe('Property 9: Losing soul removes task and increments lost count', () => {
    it('removes task and increments lostSouls when accomplished=false', () => {
      fc.assert(
        fc.property(
          nonEmptyTasksArb,
          fc.nat({ max: 100 }),
          fc.nat({ max: 100 }),
          (tasks, savedSouls, lostSouls) => {
            const state: PersistedState = createPersistedState({ 
              tasks, 
              savedSouls, 
              lostSouls 
            });
            const taskToComplete = tasks[0];
            const initialTaskCount = tasks.length;
            
            const newState = completeTaskInState(state, taskToComplete.id, false);
            
            expect(newState.tasks.length).toBe(initialTaskCount - 1);
            expect(newState.lostSouls).toBe(lostSouls + 1);
            expect(newState.savedSouls).toBe(savedSouls); // unchanged
            expect(newState.tasks.find(t => t.id === taskToComplete.id)).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });
  });
