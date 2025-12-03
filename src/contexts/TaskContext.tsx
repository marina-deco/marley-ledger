'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useSyncExternalStore,
} from 'react'
import { Task, Subtask } from '@/types'
import { saveState, loadState, PersistedState } from '@/lib/storage'
import { isValidTaskTitle, isValidSubtaskTitle } from '@/lib/validation'

interface TaskContextType {
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

const TaskContext = createContext<TaskContextType | undefined>(undefined)

// External store for localStorage sync
const defaultState: PersistedState = { tasks: [], savedSouls: 0, lostSouls: 0 }
const getServerSnapshot = () => defaultState
const getSnapshot = () => loadState()
const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const initialState = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const [tasks, setTasks] = useState<Task[]>(initialState.tasks)
  const [savedSouls, setSavedSouls] = useState(initialState.savedSouls)
  const [lostSouls, setLostSouls] = useState(initialState.lostSouls)

  // Persist state to localStorage on change
  useEffect(() => {
    saveState({ tasks, savedSouls, lostSouls })
  }, [tasks, savedSouls, lostSouls])

  const addTask = (title: string) => {
    // Validate input - reject empty/whitespace titles
    if (!isValidTaskTitle(title)) {
      return
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      subtasks: [],
      createdAt: Date.now(),
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    )
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const addSubtask = (taskId: string, title: string) => {
    // Validate input - reject empty/whitespace titles
    if (!isValidSubtaskTitle(title)) {
      return
    }

    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newSubtask: Subtask = {
            id: Date.now().toString(),
            title: title.trim(),
            completed: false,
          }
          return { ...task, subtasks: [...task.subtasks, newSubtask] }
        }
        return task
      })
    )
  }

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map((sub) =>
              sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
            ),
          }
        }
        return task
      })
    )
  }

  const completeTask = (id: string, accomplished: boolean) => {
    if (accomplished) {
      setSavedSouls(savedSouls + 1)
    } else {
      setLostSouls(lostSouls + 1)
    }
    deleteTask(id)
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        savedSouls,
        lostSouls,
        addTask,
        updateTask,
        deleteTask,
        addSubtask,
        toggleSubtask,
        completeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used within TaskProvider')
  return context
}
