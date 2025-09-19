import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook para gerenciar o estado de foco da aplicação
 * e evitar recarregamentos desnecessários
 */
export function useAppFocus() {
  const [isFocused, setIsFocused] = useState(true)
  const [lastFocusTime, setLastFocusTime] = useState(Date.now())
  const focusTimeoutRef = useRef(null)
  const blurTimeoutRef = useRef(null)

  const handleFocus = useCallback(() => {
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current)
    }

    focusTimeoutRef.current = setTimeout(() => {
      setIsFocused(true)
      setLastFocusTime(Date.now())
    }, 100) // Pequeno delay para evitar mudanças muito rápidas
  }, [])

  const handleBlur = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current)
    }

    blurTimeoutRef.current = setTimeout(() => {
      setIsFocused(false)
    }, 100) // Pequeno delay para evitar mudanças muito rápidas
  }, [])

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      handleBlur()
    } else {
      handleFocus()
    }
  }, [handleFocus, handleBlur])

  useEffect(() => {
    // Listeners para mudanças de foco
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Verificar estado inicial
    if (document.hidden) {
      setIsFocused(false)
    }

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current)
      }
    }
  }, [handleFocus, handleBlur, handleVisibilityChange])

  // Função para verificar se deve recarregar dados
  const shouldRefresh = useCallback((lastUpdateTime, maxAge = 5 * 60 * 1000) => {
    if (!isFocused) return false
    
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdateTime
    const timeSinceLastFocus = now - lastFocusTime
    
    // Recarregar se:
    // 1. Os dados são muito antigos (mais que maxAge)
    // 2. A aplicação acabou de ganhar foco e os dados são antigos
    return timeSinceLastUpdate > maxAge || 
           (timeSinceLastFocus < 1000 && timeSinceLastUpdate > 2 * 60 * 1000)
  }, [isFocused, lastFocusTime])

  return {
    isFocused,
    lastFocusTime,
    shouldRefresh
  }
}
