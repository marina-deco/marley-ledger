'use client'

import { ChainState } from '@/lib/chains'

interface GhostChainsProps {
  chainState: ChainState
}

export default function GhostChains({ chainState }: GhostChainsProps) {
  if (chainState === 'none') {
    return null
  }

  const isChained = chainState === 'chained'
  const isBroken = chainState === 'broken'

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-10 ${
        isBroken ? 'chains-broken' : ''
      }`}
    >
      {/* Left chain */}
      <svg
        className={`absolute -left-2.5 top-5 drop-shadow-sm ${
          isBroken ? 'animate-[chainFall_0.8s_ease-in_forwards] origin-top' : ''
        }`}
        viewBox="0 0 20 60"
        width="20"
        height="60"
      >
        {[0, 15, 30, 45].map((y, i) => (
          <ellipse
            key={i}
            cx="10"
            cy={y + 7}
            rx="6"
            ry="8"
            fill="none"
            className="stroke-sage"
            strokeWidth="3"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </svg>

      {/* Right chain */}
      <svg
        className={`absolute -right-2.5 top-5 drop-shadow-sm ${
          isBroken ? 'animate-[chainFall_0.8s_ease-in_forwards] origin-top' : ''
        }`}
        viewBox="0 0 20 60"
        width="20"
        height="60"
      >
        {[0, 15, 30, 45].map((y, i) => (
          <ellipse
            key={i}
            cx="10"
            cy={y + 7}
            rx="6"
            ry="8"
            fill="none"
            className="stroke-sage"
            strokeWidth="3"
            style={{ animationDelay: `${i * 0.1 + 0.05}s` }}
          />
        ))}
      </svg>

      {/* Horizontal chain across ghost */}
      {isChained && (
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          viewBox="0 0 120 20"
          width="120"
          height="20"
        >
          {[0, 20, 40, 60, 80, 100].map((x, i) => (
            <ellipse
              key={i}
              cx={x + 10}
              cy="10"
              rx="8"
              ry="5"
              fill="none"
              className="stroke-sage"
              strokeWidth="2"
            />
          ))}
        </svg>
      )}
    </div>
  )
}
