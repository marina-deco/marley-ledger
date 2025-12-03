import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, Subtask } from '@/types'
import { isValidTaskTitle, isValidSubtaskTitle } from '@/lib/validation'

interface TaskState {
  tasks: Task[]
  savedSouls: number
  lostSouls: number
  addTask: (title: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  addSubtask: (taskId: string, title: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  completeTask: (id: string, accomplished: boolean) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      savedSouls: 0,
      lostSouls: 0,

      addTask: (title: string) => {
        if (!isValidTaskTitle(title)) return

        const newTask: Task = {
          id: Date.now().toString(),
          title: title.trim(),
          completed: false,
          subtasks: [],
          createdAt: Date.now(),
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
      },

      updateTask: (id: string, updates: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }))
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      addSubtask: (taskId: string, title: string) => {
        if (!isValidSubtaskTitle(title)) return

        const newSubtask: Subtask = {
          id: Date.now().toString(),
          title: title.trim(),
          completed: false,
        }
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, subtasks: [...task.subtasks, newSubtask] }
              : task
          ),
        }))
      },

      toggleSubtask: (taskId: string, subtaskId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map((sub) =>
                    sub.id === subtaskId
                      ? { ...sub, completed: !sub.completed }
                      : sub
                  ),
                }
              : task
          ),
        }))
      },

      completeTask: (id: string, accomplished: boolean) => {
        const { deleteTask } = get()
        set((state) => ({
          savedSouls: accomplished ? state.savedSouls + 1 : state.savedSouls,
          lostSouls: accomplished ? state.lostSouls : state.lostSouls + 1,
        }))
        deleteTask(id)
      },
    }),
    {
      name: 'marleys-ledger-state',
      skipHydration: true, // We'll manually hydrate to avoid SSR issues
    }
  )
)

// Backward-compatible hook alias
export const useTasks = useTaskStore
