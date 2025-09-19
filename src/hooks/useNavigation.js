'use client'

import { useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDebouncedCallback } from './useDebounce'

export function useNavigation() {
  const router = useRouter()
  const isNavigating = useRef(false)
  const navigationTimeout = useRef(null)
  const lastNavigation = useRef({ path: null, timestamp: 0 })
  const navigationCount = useRef(0)

  // Debounced navigation para evitar múltiplas chamadas
  const debouncedNavigate = useDebouncedCallback((path, options) => {
    const now = Date.now()
    const timeSinceLastNav = now - lastNavigation.current.timestamp
    
    // Se for a mesma rota e passou menos de 1000ms, ignorar
    if (lastNavigation.current.path === path && timeSinceLastNav < 1000) {
      return
    }

    // Reset contador se passou mais de 10 segundos
    if (timeSinceLastNav > 10000) {
      navigationCount.current = 0
    }

    // Verificar se há muitas navegações em pouco tempo
    if (navigationCount.current > 5) {
      console.warn('⚠️ Muitas navegações detectadas, possível loop infinito')
      return
    }

    navigationCount.current += 1
    lastNavigation.current = { path, timestamp: now }

    router.push(path, options)
  }, 200)

  const navigate = useCallback((path, options = {}) => {
    if (isNavigating.current) {
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
    }, 2000)

    debouncedNavigate(path, options)
  }, [debouncedNavigate])

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

  // Função para resetar estado de navegação (útil para recovery)
  const resetNavigation = useCallback(() => {
    isNavigating.current = false
    navigationCount.current = 0
    lastNavigation.current = { path: null, timestamp: 0 }
    
    if (navigationTimeout.current) {
      clearTimeout(navigationTimeout.current)
      navigationTimeout.current = null
    }
  }, [])

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
    resetNavigation,
    isNavigating: isNavigating.current
  }
}
