'use client'

import { useMemo, useRef, useEffect } from 'react'
import { calculateScaleTilt, getScaleState } from '@/lib/scale'

interface SoulScaleProps {
  savedSouls: number
  lostSouls: number
}

export default function SoulScale({ savedSouls, lostSouls }: SoulScaleProps) {
  const prevRef = useRef({ saved: savedSouls, lost: lostSouls })
  const scaleRef = useRef<HTMLDivElement>(null)

  const tilt = useMemo(
    () => calculateScaleTilt(savedSouls, lostSouls),
    [savedSouls, lostSouls]
  )

  const state = useMemo(
    () => getScaleState(savedSouls, lostSouls),
    [savedSouls, lostSouls]
  )

  useEffect(() => {
    if (
      savedSouls !== prevRef.current.saved ||
      lostSouls !== prevRef.current.lost
    ) {
      prevRef.current = { saved: savedSouls, lost: lostSouls }

      if (scaleRef.current) {
        scaleRef.current.classList.add('scale-105')
        setTimeout(() => {
          scaleRef.current?.classList.remove('scale-105')
        }, 600)
      }
    }
  }, [savedSouls, lostSouls])

  return (
    <div
      ref={scaleRef}
      className="flex justify-center mb-4 transition-transform duration-500 hover:rotate-1"
      aria-label={`Soul balance: ${state}`}
    >
      <svg
        viewBox="0 0 200 120"
        className="w-[150px] h-[90px] drop-shadow-md transition-transform duration-500 animate-pulse"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {/* Center pillar */}
        <rect x="95" y="40" width="10" height="60" className="fill-brown" />

        {/* Base */}
        <rect
          x="70"
          y="95"
          width="60"
          height="10"
          rx="3"
          className="fill-brown"
        />

        {/* Beam */}
        <rect
          x="20"
          y="35"
          width="160"
          height="8"
          rx="2"
          className="fill-gold"
        />

        {/* Center ornament */}
        <circle cx="100" cy="39" r="8" className="fill-gold" />
        <circle cx="100" cy="39" r="4" className="fill-deep-purple" />

        {/* Left chain */}
        <line
          x1="35"
          y1="43"
          x2="35"
          y2="65"
          className="stroke-sage"
          strokeWidth="2"
        />

        {/* Right chain */}
        <line
          x1="165"
          y1="43"
          x2="165"
          y2="65"
          className="stroke-sage"
          strokeWidth="2"
        />

        {/* Left pan (saved souls) */}
        <ellipse
          cx="35"
          cy="75"
          rx="25"
          ry="8"
          className={`fill-pale-pink ${
            state === 'saved'
              ? 'animate-[panGlow_1.5s_ease-in-out_infinite]'
              : ''
          }`}
        />

        {/* Right pan (lost souls) */}
        <ellipse
          cx="165"
          cy="75"
          rx="25"
          ry="8"
          className={`fill-coral ${
            state === 'lost'
              ? 'animate-[panGlow_1.5s_ease-in-out_infinite]'
              : ''
          }`}
        />

        {/* Soul indicators on pans */}
        <text
          x="35"
          y="78"
          textAnchor="middle"
          fontSize="10"
          className="fill-deep-purple"
        >
          {savedSouls}
        </text>
        <text
          x="165"
          y="78"
          textAnchor="middle"
          fontSize="10"
          className="fill-deep-purple"
        >
          {lostSouls}
        </text>
      </svg>
    </div>
  )
}
