import { useState, useEffect, useCallback  } from 'react'

class CacheManager {
  constructor(maxSize = 100) {
    this.cache = new Map()
    this.maxSize = maxSize
  }

  set(key, data, ttl = 5 * 60 * 1000) {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const keys = Array.from(this.cache.keys())
      if (keys.length > 0) {
        const oldestKey = keys[0]
        this.cache.delete(oldestKey)
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  has(key) {
    const item = this.cache.get(key)
    return item ? Date.now() - item.timestamp <= item.ttl : false
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }

  // Clean expired items
  cleanup() {
    const now = Date.now()
    for (const [key, item] of Array.from(this.cache.entries())) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
const globalCache = new CacheManager()

// Cleanup expired items every 5 minutes
setInterval(() => {
  globalCache.cleanup()
}, 5 * 60 * 1000)

export function useCache(
  key,
  fetcher,
  options = {}
) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options

  const fetchData = useCallback(async () => {
    // Check cache first
    const cachedData = globalCache.get(key)
    if (cachedData) {
      setData(cachedData)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      globalCache.set(key, result, ttl)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [key, ttl]) // Removido fetcher das dependências para evitar loops

  const refetch = useCallback(async () => {
    globalCache.clear() // Clear cache for this key
    await fetchData()
  }, [fetchData])

  const clearCache = useCallback(() => {
    globalCache.clear()
    setData(null)
  }, [])

  useEffect(() => {
    fetchData()
  }, [key]) // Usar apenas key como dependência para evitar loops

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  }
}

// Hook for manual cache management
export function useCacheManager() {
  return {
    get: globalCache.get.bind(globalCache),
    set: globalCache.set.bind(globalCache),
    has: globalCache.has.bind(globalCache),
    clear: globalCache.clear.bind(globalCache),
    size: globalCache.size.bind(globalCache)
  }
}
