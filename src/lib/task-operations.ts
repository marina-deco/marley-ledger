/**
 * Pure functions for task operations
 * These can be tested independently of React state
 */

import type { Task, Subtask, PersistedState } from '../types';
import { isValidTaskTitle, isValidSubtaskTitle } from './validation';

/**
 * Creates a new task with the given title
 * Returns null if the title is invalid
 */
export function createTask(title: string): Task | null {
  if (!isValidTaskTitle(title)) {
    return null;
  }
  
  return {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    subtasks: [],
    createdAt: Date.now(),
  };
}

/**
 * Adds a task to the state
 * Returns the new state, or the original state if the title is invalid
 */
export function addTaskToState(
  state: PersistedState,
  title: string
): PersistedState {
  const newTask = createTask(title);
  
  if (!newTask) {
    return state;
  }
  
  return {
    ...state,
    tasks: [...state.tasks, newTask],
  };
}

/**
 * Updates a task in the state
 */
export function updateTaskInState(
  state: PersistedState,
  taskId: string,
  updates: Partial<Task>
): PersistedState {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updates } : task
    ),
  };
}


/**
 * Deletes a task from the state
 */
export function deleteTaskFromState(
  state: PersistedState,
  taskId: string
): PersistedState {
  return {
    ...state,
    tasks: state.tasks.filter((task) => task.id !== taskId),
  };
}

/**
 * Creates a new subtask with the given title
 * Returns null if the title is invalid
 */
export function createSubtask(title: string): Subtask | null {
  if (!isValidSubtaskTitle(title)) {
    return null;
  }
  
  return {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
  };
}

/**
 * Adds a subtask to a task in the state
 * Returns the original state if the title is invalid or task not found
 */
export function addSubtaskToState(
  state: PersistedState,
  taskId: string,
  title: string
): PersistedState {
  const newSubtask = createSubtask(title);
  
  if (!newSubtask) {
    return state;
  }
  
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId
        ? { ...task, subtasks: [...task.subtasks, newSubtask] }
        : task
    ),
  };
}

/**
 * Toggles a subtask's completion status
 */
export function toggleSubtaskInState(
  state: PersistedState,
  taskId: string,
  subtaskId: string
): PersistedState {
  return {
    ...state,
    tasks: state.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map((sub) =>
              sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
            ),
          }
        : task
    ),
  };
}

/**
 * Completes a task (saves or loses the soul)
 */
export function completeTaskInState(
  state: PersistedState,
  taskId: string,
  accomplished: boolean
): PersistedState {
  const newState = deleteTaskFromState(state, taskId);
  
  if (accomplished) {
    return {
      ...newState,
      savedSouls: newState.savedSouls + 1,
    };
  } else {
    return {
      ...newState,
      lostSouls: newState.lostSouls + 1,
    };
  }
}
