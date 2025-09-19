import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook otimizado para gerenciar loading sem loops infinitos
 * Implementa estratégias práticas de carregamento automático
 */
export function useOptimizedLoading(fetcher, options = {}) {
  const {
    key = 'default',
    ttl = 5 * 60 * 1000, // 5 minutos
    enableCache = true,
    enableAutoRefresh = true,
    refreshInterval = 2 * 60 * 1000, // 2 minutos
    maxRetries = 3,
    retryDelay = 1000
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  
  const isInitialized = useRef(false)
  const isLoading = useRef(false)
  const abortController = useRef(null)
  const refreshIntervalRef = useRef(null)
  const retryTimeoutRef = useRef(null)

  // Função para salvar no cache
  const saveToCache = useCallback((dataToSave) => {
    if (!enableCache || typeof window === 'undefined') return
    
    try {
      const cacheKey = `optimized_loading_${key}`
      const cacheData = {
        data: dataToSave,
        timestamp: Date.now(),
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Erro ao salvar no cache:', error)
    }
  }, [key, enableCache])

  // Função para carregar do cache
  const loadFromCache = useCallback(() => {
    if (!enableCache || typeof window === 'undefined') return null
    
    try {
      const cacheKey = `optimized_loading_${key}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const parsed = JSON.parse(cached)
        const now = Date.now()
        
        if (now - parsed.timestamp < ttl) {
          return parsed
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar do cache:', error)
    }
    return null
  }, [key, enableCache, ttl])

  // Função principal de busca
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (isLoading.current && !forceRefresh) return
    
    // Tentar cache primeiro
    if (!forceRefresh) {
      const cached = loadFromCache()
      if (cached) {
        setData(cached.data)
        setLastUpdated(cached.lastUpdated)
        setError(null)
        setRetryCount(0)
        return
      }
    }

    // Cancelar requisição anterior
    if (abortController.current) {
      abortController.current.abort()
    }

    abortController.current = new AbortController()
    isLoading.current = true
    setLoading(true)
    setError(null)

    try {
      const result = await fetcher(abortController.current.signal)
      
      if (!abortController.current.signal.aborted) {
        setData(result)
        setLastUpdated(new Date().toISOString())
        setRetryCount(0)
        saveToCache(result)
      }
    } catch (err) {
      if (!abortController.current.signal.aborted) {
        setError(err)
        
        // Tentar novamente se não excedeu o limite
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1)
          retryTimeoutRef.current = setTimeout(() => {
            fetchData(true)
          }, retryDelay * Math.pow(2, retryCount)) // Backoff exponencial
        }
      }
    } finally {
      if (!abortController.current.signal.aborted) {
        setLoading(false)
        isLoading.current = false
      }
    }
  }, [fetcher, loadFromCache, saveToCache, retryCount, maxRetries, retryDelay])

  // Inicializar dados
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      fetchData()
    }
  }, [fetchData])

  // Auto-refresh se habilitado
  useEffect(() => {
    if (!enableAutoRefresh || !data) return

    refreshIntervalRef.current = setInterval(() => {
      fetchData(true)
    }, refreshInterval)

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [enableAutoRefresh, refreshInterval, fetchData, data])

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort()
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  const refresh = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      const cacheKey = `optimized_loading_${key}`
      localStorage.removeItem(cacheKey)
    }
    setData(null)
    setLastUpdated(null)
  }, [key])

  return {
    data,
    loading,
    error,
    lastUpdated,
    retryCount,
    refresh,
    clearCache
  }
}

/**
 * Hook para carregamento progressivo (skeleton loading)
 */
export function useProgressiveLoading(fetcher, options = {}) {
  const { skeletonData = null, ...loadingOptions } = options
  
  const loadingState = useOptimizedLoading(fetcher, loadingOptions)
  
  // Mostrar skeleton enquanto carrega
  const displayData = loadingState.loading && skeletonData ? skeletonData : loadingState.data
  
  return {
    ...loadingState,
    data: displayData,
    isSkeleton: loadingState.loading && skeletonData
  }
}

/**
 * Hook para carregamento em background
 */
export function useBackgroundLoading(fetcher, options = {}) {
  const { 
    enableBackgroundRefresh = true,
    backgroundInterval = 30 * 1000, // 30 segundos
    ...loadingOptions 
  } = options
  
  const loadingState = useOptimizedLoading(fetcher, loadingOptions)
  
  useEffect(() => {
    if (!enableBackgroundRefresh || !loadingState.data) return

    const interval = setInterval(() => {
      // Refresh silencioso em background
      loadingState.refresh()
    }, backgroundInterval)

    return () => clearInterval(interval)
  }, [enableBackgroundRefresh, backgroundInterval, loadingState])

  return loadingState
}
