'use client'

import { useTasks } from '@/stores/taskStore'
import SoulScale from './SoulScale'
import LedgerVerdict from './LedgerVerdict'

export default function Header() {
  const { savedSouls, lostSouls } = useTasks()

  return (
    <header className="relative z-50 text-center p-8 bg-linear-to-b from-deep-purple to-transparent pointer-events-none">
      <h1 className="font-(family-name:--font-creepster) text-6xl m-0 mb-4 text-gold drop-shadow-lg pointer-events-auto">
        Marley&apos;s Ledger
      </h1>
      <div className="pointer-events-auto">
        <SoulScale savedSouls={savedSouls} lostSouls={lostSouls} />
      </div>
      <div className="flex gap-8 justify-center text-2xl pointer-events-auto">
        <span
          className="text-pale-pink cursor-help transition-all hover:scale-105"
          title="Tasks you redeemed by finishing them."
        >
          Saved: {savedSouls}
        </span>
        <span
          className="text-coral cursor-help transition-all hover:scale-105"
          title="Tasks you abandoned… each one a new link in the chain."
        >
          Lost: {lostSouls}
        </span>
      </div>
      <div className="pointer-events-auto">
        <LedgerVerdict savedSouls={savedSouls} lostSouls={lostSouls} />
      </div>
    </header>
  )
}
