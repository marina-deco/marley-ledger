'use client'

import { useEffect } from 'react'
import { useTaskStore } from './taskStore'

export default function StoreHydration() {
  useEffect(() => {
    useTaskStore.persist.rehydrate()
  }, [])

  return null
}
