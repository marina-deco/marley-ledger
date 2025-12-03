import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getChainState, hasChains, hasBrokenChains } from './chains';
import { taskArb, subtaskArb, createTask, createSubtask } from './test-utils';
import type { Task, Subtask } from '../types';

describe('Chain Calculations', () => {
  /**
   * **Feature: marleys-ledger, Property 12: Chain visibility matches subtask state**
   * 
   * *For any* task with subtasks, chains should be visible if any subtask is incomplete,
   * and broken/hidden if all subtasks are complete.
   * 
   * **Validates: Requirements 9.1, 9.2, 9.3**
   */
  describe('Property 12: Chain visibility matches subtask state', () => {
    it('returns "none" for tasks without subtasks', () => {
      fc.assert(
        fc.property(
          taskArb.map(t => ({ ...t, subtasks: [] })),
          (task: Task) => {
            expect(getChainState(task)).toBe('none');
            expect(hasChains(task)).toBe(false);
            expect(hasBrokenChains(task)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('returns "chained" when any subtask is incomplete', () => {
      // Generate tasks with at least one incomplete subtask
      const taskWithIncompleteSubtask = fc.tuple(
        taskArb,
        fc.array(subtaskArb, { minLength: 1, maxLength: 5 })
      ).map(([task, subtasks]) => {
        // Ensure at least one subtask is incomplete
        const modifiedSubtasks = subtasks.map((s, i) => ({
          ...s,
          completed: i === 0 ? false : s.completed
        }));
        return { ...task, subtasks: modifiedSubtasks };
      });

      fc.assert(
        fc.property(taskWithIncompleteSubtask, (task: Task) => {
          expect(getChainState(task)).toBe('chained');
          expect(hasChains(task)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('returns "broken" when all subtasks are complete', () => {
      // Generate tasks with all subtasks complete
      const taskWithAllComplete = fc.tuple(
        taskArb,
        fc.array(subtaskArb, { minLength: 1, maxLength: 5 })
      ).map(([task, subtasks]) => ({
        ...task,
        subtasks: subtasks.map(s => ({ ...s, completed: true }))
      }));

      fc.assert(
        fc.property(taskWithAllComplete, (task: Task) => {
          expect(getChainState(task)).toBe('broken');
          expect(hasBrokenChains(task)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Edge cases', () => {
    it('handles single incomplete subtask', () => {
      const task = createTask({
        subtasks: [createSubtask({ completed: false })]
      });
      expect(getChainState(task)).toBe('chained');
    });

    it('handles single complete subtask', () => {
      const task = createTask({
        subtasks: [createSubtask({ completed: true })]
      });
      expect(getChainState(task)).toBe('broken');
    });

    it('handles mixed completion states', () => {
      const task = createTask({
        subtasks: [
          createSubtask({ completed: true }),
          createSubtask({ completed: false }),
          createSubtask({ completed: true })
        ]
      });
      expect(getChainState(task)).toBe('chained');
    });
  });
});
