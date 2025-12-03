'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTasks } from '@/contexts/TaskContext'

interface Suggestion {
  id: string
  text: string
}

export default function SpiritConsultation() {
  const { addTask } = useTasks()
  const [goal, setGoal] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSuggestions([])
  }, [])

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isModalOpen, closeModal])

  const consultSpirits = async () => {
    if (!goal.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/spirits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: goal.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'The spirits could not be reached')
        return
      }

      const newSuggestions: Suggestion[] = data.suggestions.map(
        (text: string, index: number) => ({
          id: `${Date.now()}-${index}`,
          text,
        })
      )

      setSuggestions(newSuggestions)
      setIsModalOpen(true)
      setGoal('')
    } catch {
      setError('The spirits are disturbed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const acceptSuggestion = (suggestion: Suggestion) => {
    addTask(suggestion.text)
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id))
    if (suggestions.length <= 1) {
      closeModal()
    }
  }

  const dismissSuggestion = (suggestion: Suggestion) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id))
    if (suggestions.length <= 1) {
      closeModal()
    }
  }

  const dismissAll = () => {
    closeModal()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <>
      <div className="relative z-50 text-center px-8 py-4 mt-4">
        <div className="flex flex-col items-center">
          <p className="text-xl mb-3 text-gold drop-shadow-[0_0_10px_var(--color-gold)]">
            🔮 Consult the Spirits
          </p>
          <div className="flex gap-2 max-w-[500px] mx-auto">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && !isLoading && consultSpirits()
              }
              placeholder="Describe your goal..."
              className="flex-1 px-4 py-3 border-2 border-gold rounded-lg bg-deep-purple/80 text-pale-yellow text-base placeholder:text-sage disabled:opacity-60"
              disabled={isLoading}
            />
            <button
              onClick={consultSpirits}
              className="px-6 py-3 bg-linear-to-br from-deep-purple to-gold border-2 border-gold rounded-lg text-2xl cursor-pointer transition-all hover:scale-110 hover:shadow-[0_0_15px_var(--color-gold)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !goal.trim()}
            >
              {isLoading ? '✨' : '👻'}
            </button>
          </div>
          {error && <p className="text-coral mt-2 text-sm">{error}</p>}
        </div>

        {isLoading && (
          <div className="mt-4 text-pale-yellow">
            <div className="flex justify-center gap-4 mb-2">
              <span className="text-3xl animate-[spiritFloat_1.5s_ease-in-out_infinite]">
                👻
              </span>
              <span className="text-3xl animate-[spiritFloat_1.5s_ease-in-out_infinite_0.3s]">
                👻
              </span>
              <span className="text-3xl animate-[spiritFloat_1.5s_ease-in-out_infinite_0.6s]">
                👻
              </span>
            </div>
            <p>The spirits are contemplating...</p>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && suggestions.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div className="relative bg-deep-purple border-2 border-gold rounded-xl p-6 max-w-[550px] w-[90%] max-h-[80vh] overflow-y-auto hide-scrollbar shadow-[0_0_30px_var(--color-gold)]">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-pale-yellow hover:text-coral transition-colors text-xl"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="flex justify-between items-center mb-4 pr-8">
              <h3 className="text-gold m-0 text-xl italic">
                The Spirits Suggest:
              </h3>
              <button
                onClick={dismissAll}
                className="px-3 py-1 bg-transparent border border-coral rounded text-coral text-xs cursor-pointer hover:bg-coral hover:text-deep-purple transition-colors"
              >
                Dismiss All
              </button>
            </div>
            <ul className="list-none p-0 m-0">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="group flex items-center justify-between p-3 rounded hover:bg-white/5 border-b border-gold/30 gap-4 last:border-b-0"
                >
                  <span className="flex-1 text-left font-serif text-lg tracking-wide text-amber-50">
                    {suggestion.text}
                  </span>
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => acceptSuggestion(suggestion)}
                      className="px-2 py-1 bg-transparent border border-amber-600 rounded text-amber-500 text-sm cursor-pointer transition-all hover:bg-amber-600 hover:text-stone-900"
                      title="Accept this task"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => dismissSuggestion(suggestion)}
                      className="px-2 py-1 bg-transparent border border-stone-600 rounded text-stone-400 text-sm cursor-pointer transition-all hover:bg-stone-600 hover:text-white"
                      title="Dismiss"
                    >
                      ✗
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
