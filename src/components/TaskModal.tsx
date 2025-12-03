'use client'

import { useState } from 'react'
import { Task } from '@/types'
import { useTasks } from '@/contexts/TaskContext'

interface TaskModalProps {
  task: Task
  onClose: () => void
}

const SAVED_MESSAGES = [
  'A soul redeemed.',
  'Another debt paid.',
  'Marley approves… grudgingly.',
  'The chains grow lighter.',
  'Well done, mortal.',
]

const LOST_MESSAGES = [
  'Another link in the chain.',
  'Marley shakes his head.',
  'The ledger grows heavier…',
  'A soul slips away…',
  'The darkness deepens.',
]

export default function TaskModal({ task, onClose }: TaskModalProps) {
  const { tasks, updateTask, addSubtask, toggleSubtask, completeTask } =
    useTasks()
  const [title, setTitle] = useState(task.title)

  // Get the current task from context to reflect subtask updates
  const currentTask = tasks.find((t) => t.id === task.id) || task
  const [subtaskInput, setSubtaskInput] = useState('')
  const [judgment, setJudgment] = useState<{
    type: 'saved' | 'lost'
    message: string
  } | null>(null)

  const handleSave = () => {
    updateTask(task.id, { title })
  }

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      addSubtask(task.id, subtaskInput)
      setSubtaskInput('')
    }
  }

  const handleBanish = (accomplished: boolean) => {
    const messages = accomplished ? SAVED_MESSAGES : LOST_MESSAGES
    const message = messages[Math.floor(Math.random() * messages.length)]

    setJudgment({ type: accomplished ? 'saved' : 'lost', message })

    if (!accomplished) {
      document.body.classList.add('screen-darken')
      setTimeout(() => document.body.classList.remove('screen-darken'), 400)
    }

    setTimeout(() => {
      completeTask(task.id, accomplished)
      onClose()
    }, 600)
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-1000"
      onClick={onClose}
    >
      <div
        className="bg-deep-purple border-4 border-gold rounded-2xl p-8 max-w-[500px] w-[90%] max-h-[80vh] overflow-y-auto hide-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-gold text-3xl m-0 mb-6 text-center">
          {currentTask.title}
        </h2>

        <div className="mb-8">
          <label className="block text-pale-yellow text-xl mb-2">
            Edit Task
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-full p-3 border-2 border-brown rounded-lg bg-sage text-deep-purple text-base font-sans"
          />
        </div>

        <div className="mb-8">
          <label className="block text-pale-yellow text-xl mb-2">
            Subtasks
          </label>
          <div className="my-4">
            {currentTask.subtasks.map((subtask) => (
              <label
                key={subtask.id}
                className="flex items-center gap-2 p-2 text-pale-yellow font-sans cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => toggleSubtask(task.id, subtask.id)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span
                  className={subtask.completed ? 'line-through opacity-60' : ''}
                >
                  {subtask.title}
                </span>
              </label>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={subtaskInput}
              onChange={(e) => setSubtaskInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
              placeholder="Enter subtask"
              className="flex-1 p-3 border-2 border-brown rounded-lg bg-sage text-deep-purple text-sm font-sans pl-2 border-l-2 border-l-amber-600"
            />
            <button
              onClick={handleAddSubtask}
              className="px-6 py-3 bg-brown border-none rounded-lg text-pale-yellow text-base cursor-pointer transition-opacity hover:opacity-80"
            >
              Add Subtask
            </button>
          </div>
        </div>

        {judgment ? (
          <div
            className={`text-center p-8 animate-[fadeIn_0.6s_ease-out] ${
              judgment.type === 'saved'
                ? 'bg-linear-to-br from-pale-pink/20 to-transparent'
                : 'bg-linear-to-br from-coral/20 to-transparent'
            }`}
          >
            <div
              className={`text-3xl font-bold animate-[counterFly_0.5s_ease-out] ${
                judgment.type === 'saved' ? 'text-pale-pink' : 'text-coral'
              }`}
            >
              +1 {judgment.type === 'saved' ? 'Saved' : 'Lost'}
            </div>
            <p className="mt-4 italic text-pale-yellow opacity-0 animate-[fadeIn_0.4s_ease-out_0.2s_forwards]">
              {judgment.message}
            </p>
          </div>
        ) : (
          <div className="flex gap-4 flex-wrap justify-center mt-8">
            <button
              onClick={() => handleBanish(true)}
              className="px-6 py-4 bg-amber-600 hover:bg-amber-500 border-none rounded-lg text-stone-900 font-bold text-lg cursor-pointer transition-all"
              title="Task accomplished - Save this soul!"
            >
              ✓ Saved Soul
            </button>
            <button
              onClick={() => handleBanish(false)}
              className="px-6 py-4 bg-stone-700 hover:bg-stone-600 border-none rounded-lg text-stone-300 text-lg cursor-pointer transition-all"
              title="Task not accomplished - Soul is lost"
            >
              ✗ Lost Soul
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-transparent border border-stone-600 rounded-lg text-pale-yellow text-base cursor-pointer transition-colors hover:text-white"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
