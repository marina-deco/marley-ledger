export interface Task {
  id: string;
  title: string;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface PersistedState {
  tasks: Task[];
  savedSouls: number;
  lostSouls: number;
}
