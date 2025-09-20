'use client'

import { useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function useSimpleNavigation() {
  const router = useRouter()
  const lastNavigation = useRef({ path: null, timestamp: 0 })

  const navigate = useCallback((path, options = {}) => {
    const now = Date.now()
    const timeSinceLastNav = now - lastNavigation.current.timestamp
    
    // Se for a mesma rota e passou menos de 200ms, ignorar
    if (lastNavigation.current.path === path && timeSinceLastNav < 200) {
      return
    }

    lastNavigation.current = { path, timestamp: now }
    
    try {
      router.push(path, options)
    } catch (error) {
      console.error('Navigation error:', error)
    }
  }, [router])

  const replace = useCallback((path, options = {}) => {
    try {
      router.replace(path, options)
    } catch (error) {
      console.error('Replace navigation error:', error)
    }
  }, [router])

  return {
    navigate,
    replace
  }
}
