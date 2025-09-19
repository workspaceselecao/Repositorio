'use client'

import { useState, useEffect, useRef } from 'react'
import { LoadingSpinner } from './ui/loading-spinner'

/**
 * Componente de loading prático e eficiente
 * Remove loops infinitos e implementa estratégias inteligentes
 */
export function PracticalLoading({ 
  loading, 
  children, 
  fallback = null,
  minLoadingTime = 300,
  maxLoadingTime = 10000,
  showProgress = false
}) {
  const [showLoading, setShowLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoadingComplete, setIsLoadingComplete] = useState(false)
  
  const loadingStartTime = useRef(null)
  const timeoutRef = useRef(null)
  const progressIntervalRef = useRef(null)
  const maxTimeoutRef = useRef(null)

  useEffect(() => {
    if (loading) {
      // Iniciar loading
      if (!loadingStartTime.current) {
        loadingStartTime.current = Date.now()
        setShowLoading(true)
        setIsLoadingComplete(false)
        setLoadingProgress(0)

        // Iniciar progresso simulado
        if (showProgress) {
          progressIntervalRef.current = setInterval(() => {
            setLoadingProgress(prev => {
              const elapsed = Date.now() - loadingStartTime.current
              const progress = Math.min((elapsed / maxLoadingTime) * 100, 95)
              return Math.floor(progress)
            })
          }, 100)
        }

        // Timeout máximo para evitar loading infinito
        maxTimeoutRef.current = setTimeout(() => {
          console.warn('Loading timeout - forçando conclusão')
          setShowLoading(false)
          setIsLoadingComplete(true)
          setLoadingProgress(100)
        }, maxLoadingTime)
      }
    } else {
      // Loading terminou
      if (loadingStartTime.current) {
        const elapsed = Date.now() - loadingStartTime.current
        
        // Limpar timeouts
        if (maxTimeoutRef.current) {
          clearTimeout(maxTimeoutRef.current)
        }
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
        }

        if (elapsed < minLoadingTime) {
          // Aguardar tempo mínimo
          timeoutRef.current = setTimeout(() => {
            setShowLoading(false)
            setIsLoadingComplete(true)
            setLoadingProgress(100)
            loadingStartTime.current = null
          }, minLoadingTime - elapsed)
        } else {
          // Concluir imediatamente
          setShowLoading(false)
          setIsLoadingComplete(true)
          setLoadingProgress(100)
          loadingStartTime.current = null
        }
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current)
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [loading, minLoadingTime, maxLoadingTime, showProgress])

  // Loading em andamento
  if (showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="relative">
            <LoadingSpinner size="xl" />
            {showProgress && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium text-foreground">
                  {loadingProgress}%
                </span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-muted-foreground">Carregando dados...</p>
            {showProgress && (
              <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Loading concluído mas ainda processando
  if (!loading && !isLoadingComplete) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Finalizando...</p>
        </div>
      </div>
    )
  }

  // Conteúdo pronto
  return <>{children}</>
}

/**
 * Componente de skeleton loading para dados específicos
 */
export function SkeletonCard({ className = "" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-muted rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
            <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente de skeleton para lista
 */
export function SkeletonList({ count = 3, className = "" }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

/**
 * Hook para loading com retry automático
 */
export function useRetryLoading(fetcher, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    ...loadingOptions
  } = options

  const [retryCount, setRetryCount] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const loadingState = useOptimizedLoading(fetcher, loadingOptions)

  const retry = () => {
    if (retryCount < maxRetries) {
      setIsRetrying(true)
      setRetryCount(prev => prev + 1)
      
      setTimeout(() => {
        loadingState.refresh()
        setIsRetrying(false)
      }, retryDelay * Math.pow(2, retryCount))
    }
  }

  return {
    ...loadingState,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries,
    retry
  }
}
