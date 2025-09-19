'use client'

import { useState, useEffect, useRef } from 'react'
import { LoadingSpinner } from './ui/loading-spinner'

/**
 * Componente de loading inteligente que evita loops visuais
 * e mostra loading apenas quando necessário
 */
export function SmartLoading({ 
  loading, 
  children, 
  minLoadingTime = 500,
  fallback = null 
}) {
  const [showLoading, setShowLoading] = useState(false)
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  const loadingStartTime = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (loading) {
      // Iniciar loading
      if (!loadingStartTime.current) {
        loadingStartTime.current = Date.now()
        setShowLoading(true)
        setIsLoadingComplete(false)
      }
    } else {
      // Loading terminou
      if (loadingStartTime.current) {
        const elapsed = Date.now() - loadingStartTime.current
        
        if (elapsed < minLoadingTime) {
          // Aguardar o tempo mínimo antes de esconder o loading
          timeoutRef.current = setTimeout(() => {
            setShowLoading(false)
            setIsLoadingComplete(true)
            loadingStartTime.current = null
          }, minLoadingTime - elapsed)
        } else {
          // Já passou o tempo mínimo, esconder imediatamente
          setShowLoading(false)
          setIsLoadingComplete(true)
          loadingStartTime.current = null
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [loading, minLoadingTime])

  // Se está carregando, mostrar loading
  if (showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está carregando e ainda não completou, mostrar fallback
  if (!loading && !isLoadingComplete) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Loading completo, mostrar conteúdo
  return <>{children}</>
}

/**
 * Hook para gerenciar loading de forma inteligente
 */
export function useSmartLoading(loading, options = {}) {
  const { minLoadingTime = 500 } = options
  const [showLoading, setShowLoading] = useState(false)
  const loadingStartTime = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (loading) {
      if (!loadingStartTime.current) {
        loadingStartTime.current = Date.now()
        setShowLoading(true)
      }
    } else {
      if (loadingStartTime.current) {
        const elapsed = Date.now() - loadingStartTime.current
        
        if (elapsed < minLoadingTime) {
          timeoutRef.current = setTimeout(() => {
            setShowLoading(false)
            loadingStartTime.current = null
          }, minLoadingTime - elapsed)
        } else {
          setShowLoading(false)
          loadingStartTime.current = null
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [loading, minLoadingTime])

  return showLoading
}
