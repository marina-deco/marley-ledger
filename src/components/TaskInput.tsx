'use client'

import { useState } from 'react'
import { useTasks } from '@/stores/taskStore'

export default function TaskInput() {
  const { addTask } = useTasks()
  const [input, setInput] = useState('')

  const handleAddTask = () => {
    if (input.trim()) {
      addTask(input)
      setInput('')
    }
  }

  return (
    <div className="relative z-50 text-center flex flex-col items-center justify-center px-8 py-4">
      <p className="text-2xl mb-4 text-pale-yellow">
        What&apos;s haunting you?
      </p>
      <div className="flex gap-2 max-w-[500px] mx-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          placeholder="Enter your task..."
          className="flex-1 p-4 border-3 border-brown rounded-lg bg-stone-800 text-stone-200 text-base font-sans placeholder:text-stone-500 focus:ring-2 focus:ring-yellow-600 focus:outline-none"
        />
        <button
          onClick={handleAddTask}
          className="px-8 py-4 bg-gold border-none rounded-lg text-deep-purple text-2xl cursor-pointer transition-all duration-200 hover:bg-yellow-500 hover:scale-110 active:scale-95"
        >
          →
        </button>
      </div>
    </div>
  )
}
