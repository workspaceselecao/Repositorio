'use client'

import { useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useNavigation() {
  const router = useRouter()
  const isNavigating = useRef(false)
  const navigationTimeout = useRef(null)

  const navigate = useCallback((path, options = {}) => {
    if (isNavigating.current) {
      console.log('Navigation already in progress, ignoring:', path)
      return
    }

    isNavigating.current = true
    
    // Limpar timeout anterior se existir
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current)
    }

    // Timeout para resetar o estado de navegação
    navigationTimeout.current = setTimeout(() => {
      isNavigating.current = false
    }, 1000)

    console.log('Navigating to:', path)
    router.push(path, options)
  }, [router])

  const replace = useCallback((path, options = {}) => {
    if (isNavigating.current) {
      console.log('Navigation already in progress, ignoring replace:', path)
      return
    }

    isNavigating.current = true
    
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current)
    }

    navigationTimeout.current = setTimeout(() => {
      isNavigating.current = false
    }, 1000)

    console.log('Replacing with:', path)
    router.replace(path, options)
  }, [router])

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current)
      }
    }
  }, [])

  return {
    navigate,
    replace,
    isNavigating: isNavigating.current
  }
}
