'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'

const FocusContext = createContext(undefined)

export function FocusProvider({ children }) {
  const [isFocused, setIsFocused] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [lastFocusTime, setLastFocusTime] = useState(Date.now())
  const [lastVisibilityTime, setLastVisibilityTime] = useState(Date.now())
  const focusTimeoutRef = useRef(null)
  const visibilityTimeoutRef = useRef(null)

  // Gerenciar foco da janela
  useEffect(() => {
    const handleFocus = () => {
      console.log('🎯 Window gained focus')
      setIsFocused(true)
      setLastFocusTime(Date.now())
      
      // Limpar timeout de perda de foco se existir
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
        focusTimeoutRef.current = null
      }
    }

    const handleBlur = () => {
      console.log('🎯 Window lost focus')
      
      // Usar timeout para evitar mudanças muito rápidas
      focusTimeoutRef.current = setTimeout(() => {
        setIsFocused(false)
      }, 100)
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current)
      }
    }
  }, [])

  // Gerenciar visibilidade da página
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('👁️ Page became visible')
        setIsVisible(true)
        setLastVisibilityTime(Date.now())
        
        // Limpar timeout de perda de visibilidade se existir
        if (visibilityTimeoutRef.current) {
          clearTimeout(visibilityTimeoutRef.current)
          visibilityTimeoutRef.current = null
        }
      } else {
        console.log('👁️ Page became hidden')
        
        // Usar timeout para evitar mudanças muito rápidas
        visibilityTimeoutRef.current = setTimeout(() => {
          setIsVisible(false)
        }, 100)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current)
      }
    }
  }, [])

  // Detectar quando a aplicação volta ao foco após muito tempo
  const getTimeSinceLastFocus = () => {
    return Date.now() - lastFocusTime
  }

  const getTimeSinceLastVisibility = () => {
    return Date.now() - lastVisibilityTime
  }

  // Verificar se a aplicação está "dormindo" (sem foco por muito tempo)
  const isAppSleeping = () => {
    const timeSinceFocus = getTimeSinceLastFocus()
    const timeSinceVisibility = getTimeSinceLastVisibility()
    
    return !isFocused && !isVisible && (timeSinceFocus > 30000 || timeSinceVisibility > 30000) // 30 segundos
  }

  // Forçar atualização quando a aplicação "acordar"
  const wakeUp = () => {
    console.log('🌅 App waking up from sleep')
    setLastFocusTime(Date.now())
    setLastVisibilityTime(Date.now())
  }

  const value = {
    isFocused,
    isVisible,
    lastFocusTime,
    lastVisibilityTime,
    getTimeSinceLastFocus,
    getTimeSinceLastVisibility,
    isAppSleeping,
    wakeUp
  }

  return (
    <FocusContext.Provider value={value}>
      {children}
    </FocusContext.Provider>
  )
}

export function useFocus() {
  const context = useContext(FocusContext)
  if (context === undefined) {
    throw new Error('useFocus deve ser usado dentro de um FocusProvider')
  }
  return context
}

// Hook para componentes que precisam reagir a mudanças de foco
export function useFocusEffect(effect, deps = []) {
  const { isFocused, isVisible } = useFocus()
  const prevFocused = useRef(isFocused)
  const prevVisible = useRef(isVisible)

  useEffect(() => {
    const focusChanged = prevFocused.current !== isFocused
    const visibilityChanged = prevVisible.current !== isVisible

    if (focusChanged || visibilityChanged) {
      effect({ isFocused, isVisible, focusChanged, visibilityChanged })
    }

    prevFocused.current = isFocused
    prevVisible.current = isVisible
  }, [isFocused, isVisible, effect, ...deps])
}

// Componente para mostrar indicador de estado de foco (apenas em desenvolvimento)
export function FocusIndicator() {
  const { isFocused, isVisible, getTimeSinceLastFocus, getTimeSinceLastVisibility } = useFocus()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  const timeSinceFocus = Math.round(getTimeSinceLastFocus() / 1000)
  const timeSinceVisibility = Math.round(getTimeSinceLastVisibility() / 1000)

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white text-xs p-2 rounded-lg font-mono z-50">
      <div className={`${isFocused ? 'text-green-400' : 'text-red-400'}`}>
        Focus: {isFocused ? 'ON' : 'OFF'} ({timeSinceFocus}s)
      </div>
      <div className={`${isVisible ? 'text-green-400' : 'text-red-400'}`}>
        Visible: {isVisible ? 'ON' : 'OFF'} ({timeSinceVisibility}s)
      </div>
    </div>
  )
}
