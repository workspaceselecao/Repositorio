import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppFocus } from './useAppFocus'

/**
 * Hook para gerenciar dados de forma estável, evitando loops infinitos
 * e mantendo persistência entre mudanças de foco
 */
export function useStableData(fetcher, options = {}) {
  const {
    key = 'default',
    ttl = 5 * 60 * 1000, // 5 minutos
    enablePersistence = true,
    enableFocusRefresh = true,
    refreshOnFocus = true
  } = options

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  
  const isInitialized = useRef(false)
  const isLoading = useRef(false)
  const abortController = useRef(null)
  const { isFocused, shouldRefresh } = useAppFocus()

  // Função para salvar dados no localStorage
  const saveToStorage = useCallback((dataToSave) => {
    if (!enablePersistence || typeof window === 'undefined') return
    
    try {
      const storageKey = `stable_data_${key}`
      const dataToStore = {
        data: dataToSave,
        lastUpdated: new Date().toISOString(),
        timestamp: Date.now()
      }
      localStorage.setItem(storageKey, JSON.stringify(dataToStore))
    } catch (error) {
      console.warn('Erro ao salvar dados no localStorage:', error)
    }
  }, [key, enablePersistence])

  // Função para carregar dados do localStorage
  const loadFromStorage = useCallback(() => {
    if (!enablePersistence || typeof window === 'undefined') return null
    
    try {
      const storageKey = `stable_data_${key}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        const now = Date.now()
        
        // Verificar se os dados não são muito antigos
        if (now - parsed.timestamp < ttl) {
          return parsed
        }
      }
    } catch (error) {
      console.warn('Erro ao carregar dados do localStorage:', error)
    }
    return null
  }, [key, enablePersistence, ttl])

  // Função principal para buscar dados
  const fetchData = useCallback(async (forceRefresh = false) => {
    if (isLoading.current && !forceRefresh) return
    
    // Tentar carregar do cache primeiro
    if (!forceRefresh) {
      const cached = loadFromStorage()
      if (cached) {
        setData(cached.data)
        setLastUpdated(cached.lastUpdated)
        setLoading(false)
        return
      }
    }

    // Cancelar requisição anterior se existir
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
        saveToStorage(result)
      }
    } catch (err) {
      if (!abortController.current.signal.aborted) {
        setError(err)
        console.error('Erro ao buscar dados:', err)
      }
    } finally {
      if (!abortController.current.signal.aborted) {
        setLoading(false)
        isLoading.current = false
      }
    }
  }, [fetcher, loadFromStorage, saveToStorage])

  // Inicializar dados
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true
      fetchData()
    }
  }, [fetchData])

  // Detectar mudanças de foco usando o hook personalizado
  useEffect(() => {
    if (!enableFocusRefresh || !isFocused || !lastUpdated) return

    const lastUpdateTime = new Date(lastUpdated).getTime()
    
    if (shouldRefresh(lastUpdateTime, ttl)) {
      console.log('Recarregando dados devido a mudança de foco')
      fetchData(true)
    }
  }, [isFocused, lastUpdated, shouldRefresh, enableFocusRefresh, ttl, fetchData])

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort()
      }
    }
  }, [])

  const refresh = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      const storageKey = `stable_data_${key}`
      localStorage.removeItem(storageKey)
    }
    setData(null)
    setLastUpdated(null)
  }, [key])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    clearCache
  }
}
