'use client'

import { Task } from '@/types'
import { useMemo } from 'react'
import { getChainState } from '@/lib/chains'
import GhostChains from './GhostChains'

interface GhostProps {
  task: Task
  onClick: () => void
  index: number
  total: number
  lostCount: number
}

export default function Ghost({
  task,
  onClick,
  index,
  total,
  lostCount,
}: GhostProps) {
  // Generate a deterministic seed from the string ID to avoid hydration mismatches
  const seed = useMemo(() => {
    return task.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  }, [task.id])

  const orbitValues = useMemo(() => {
    const baseAngle = (360 / Math.max(total, 1)) * index
    const angleOffset = (seed % 30) - 15

    return {
      startAngle: baseAngle + angleOffset,
      orbitRadius: 250 + (index % 3) * 80,
      duration: 20 + (seed % 15),
      direction: seed % 2 === 0 ? 1 : -1,
    }
  }, [seed, index, total])

  const chainState = useMemo(() => getChainState(task), [task])

  const style = {
    position: 'absolute',
    '--orbit-radius': `${orbitValues.orbitRadius}px`,
    '--start-angle': `${orbitValues.startAngle}deg`,
    animationName: orbitValues.direction > 0 ? 'orbit' : 'orbitReverse',
    animationDuration: `${orbitValues.duration}s`,
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  } as React.CSSProperties

  return (
    <div
      className="absolute z-20 flex flex-col items-center p-4 cursor-pointer transition-all duration-300 outline-none hover:scale-110 hover:[animation-play-state:paused] hover:drop-shadow-[0_0_25px_rgba(244,232,161,0.8)] focus-visible:scale-110 focus-visible:[animation-play-state:paused] focus-visible:drop-shadow-[0_0_25px_rgba(244,232,161,0.8)]"
      style={style}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      aria-label={`Edit task: ${task.title}`}
    >
      <div className={`relative w-20 ${lostCount > 5 ? 'sepia-[.5]' : ''}`}>
        <GhostChains chainState={chainState} />

        {/* Switched to SVG for crisper edges and less DOM nesting */}
        <svg
          viewBox="0 0 100 120"
          className="w-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          {/* Body */}
          <path
            d="M10 50 Q10 10 50 10 T90 50 V90 Q90 110 80 100 T60 100 T40 100 T20 100 T10 90 Z"
            className="fill-pale-yellow transition-colors"
          />
          {/* Eyes */}
          <g className="fill-deep-purple">
            <circle cx="35" cy="45" r="6" />
            <circle cx="65" cy="45" r="6" />
          </g>
        </svg>
      </div>

      <p className="mt-2 text-pale-pink text-sm text-center font-sans font-medium leading-tight max-w-[120px] line-clamp-2">
        {task.title}
      </p>
    </div>
  )
}
