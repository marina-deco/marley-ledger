'use client'

import { useState } from 'react'
import { useTasks } from '@/stores/taskStore'
import Ghost from './Ghost'
import TaskModal from './TaskModal'
import { Task } from '@/types'

export default function GhostArena() {
  const { tasks, lostSouls } = useTasks()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  return (
    <>
      <div className="fixed top-1/2 left-1/2 w-0 h-0 z-10">
        {tasks.map((task, index) => (
          <Ghost
            key={task.id}
            task={task}
            index={index}
            total={tasks.length}
            onClick={() => setSelectedTask(task)}
            lostCount={lostSouls}
          />
        ))}
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  )
}
