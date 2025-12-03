'use client'

import { useState, useMemo, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

// Client-side mount detection without useEffect setState
const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

interface LedgerVerdictProps {
  savedSouls: number
  lostSouls: number
}

export default function LedgerVerdict({
  savedSouls,
  lostSouls,
}: LedgerVerdictProps) {
  const [showModal, setShowModal] = useState(false)
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot
  )
  const total = savedSouls + lostSouls

  const verdict = useMemo(() => {
    if (total === 0) return null

    const ratio = savedSouls / total

    if (ratio >= 0.7) {
      return {
        message: 'Your chains grow lighter. Marley would be proud.',
        tone: 'hopeful' as const,
      }
    } else if (ratio >= 0.5) {
      return {
        message: 'The balance holds... for now.',
        tone: 'neutral' as const,
      }
    } else {
      return {
        message: 'Careful… the chains grow heavier with each lost soul.',
        tone: 'warning' as const,
      }
    }
  }, [savedSouls, total])

  const closeModal = () => setShowModal(false)

  if (total < 3) return null

  const modalContent =
    showModal && mounted ? (
      <div
        className="fixed inset-0 bg-black/95 flex items-center justify-center z-99999"
        onClick={closeModal}
      >
        <div
          className="bg-deep-purple border-3 border-gold rounded-2xl p-8 max-w-[400px] w-[90%] text-center font-sans"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-gold text-3xl m-0 mb-6">Tonight&apos;s Ledger</h2>

          <div className="mb-6">
            <div className="flex h-[30px] rounded-full overflow-hidden bg-black/30 mb-4">
              <div
                className="bg-amber-200 transition-all duration-500"
                style={{ width: `${(savedSouls / total) * 100}%` }}
              />
              <div
                className="bg-slate-700 transition-all duration-500"
                style={{ width: `${(lostSouls / total) * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-xl">
              <span className="text-pale-pink">{savedSouls} Saved</span>
              <span className="text-coral">{lostSouls} Lost</span>
            </div>
          </div>

          {verdict && (
            <p
              className={`text-lg italic tracking-wider mb-6 p-4 rounded-lg ${
                verdict.tone === 'hopeful'
                  ? 'text-pale-pink bg-pale-pink/10'
                  : verdict.tone === 'warning'
                  ? 'text-coral bg-coral/10'
                  : 'text-amber-100 bg-amber-100/10'
              }`}
            >
              {verdict.message}
            </p>
          )}

          <button
            onClick={closeModal}
            className="px-6 py-3 bg-brown border border-amber-700/50 rounded-lg text-pale-yellow text-base cursor-pointer font-sans hover:bg-amber-900/40 transition-colors"
          >
            Close the Ledger
          </button>
        </div>
      </div>
    ) : null

  return (
    <>
      <button
        className="mt-2 px-4 py-1.5 bg-transparent border border-gold rounded-full text-gold text-sm font-sans cursor-pointer transition-all hover:bg-gold hover:text-deep-purple"
        onClick={() => setShowModal(true)}
      >
        View Tonight&apos;s Ledger
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  )
}
