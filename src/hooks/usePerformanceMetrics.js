import { useState, useEffect, useCallback, useRef  } from 'react'

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState([])
  const renderStartTime = useRef(0)

  const addMetric = useCallback((name, value, type) => {
    const metric = {
      name,
      value,
      timestamp: Date.now(),
      type
    }

    setMetrics(prev => {
      const newMetrics = [...prev, metric]
      // Manter apenas os últimos 1000 métricas para evitar vazamento de memória
      return newMetrics.slice(-1000)
    })
  }, [])

  const getMetrics = useCallback((type) => {
    if (type) {
      return metrics.filter(m => m.type === type)
    }
    return metrics
  }, [metrics])

  const getAverageMetric = useCallback((name, type) => {
    const filteredMetrics = getMetrics(type).filter(m => m.name === name)
    if (filteredMetrics.length === 0) return 0
    
    const sum = filteredMetrics.reduce((acc, m) => acc + m.value, 0)
    return sum / filteredMetrics.length
  }, [getMetrics])

  const clearMetrics = useCallback(() => {
    setMetrics([])
  }, [])

  const exportMetrics = useCallback(() => {
    return JSON.stringify(metrics, null, 2)
  }, [metrics])

  // Monitorar render times
  useEffect(() => {
    renderStartTime.current = performance.now()
  })

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current
    addMetric('component-render', renderTime, 'render')
  })

  return {
    metrics,
    addMetric,
    getMetrics,
    getAverageMetric,
    clearMetrics,
    exportMetrics
  }
}

// Hook para medir performance de API calls
export function useAPIPerformance() {
  const { addMetric } = usePerformanceMetrics()

  const measureAPICall = useCallback(async (apiCall, name) => {
    const startTime = performance.now()
    
    try {
      const result = await apiCall()
      const endTime = performance.now()
      const duration = endTime - startTime
      
      addMetric(`api-${name}`, duration, 'api')
      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      addMetric(`api-${name}-error`, duration, 'api')
      throw error
    }
  }, [addMetric])

  return { measureAPICall }
}

// Hook para medir performance de operações do usuário
export function useUserPerformance() {
  const { addMetric } = usePerformanceMetrics()

  const measureUserAction = useCallback((action, name) => {
    const startTime = performance.now()
    action()
    const endTime = performance.now()
    const duration = endTime - startTime
    
    addMetric(`user-${name}`, duration, 'user')
  }, [addMetric])

  return { measureUserAction }
}

// Hook para monitorar memória
export function useMemoryMonitor() {
  const { addMetric } = usePerformanceMetrics()

  useEffect(() => {
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = performance.memory
        addMetric('memory-used', memory.usedJSHeapSize / 1024 / 1024, 'memory') // MB
        addMetric('memory-total', memory.totalJSHeapSize / 1024 / 1024, 'memory') // MB
        addMetric('memory-limit', memory.jsHeapSizeLimit / 1024 / 1024, 'memory') // MB
      }
    }

    // Monitorar memória a cada 30 segundos
    const interval = setInterval(monitorMemory, 30000)
    monitorMemory() // Medir imediatamente

    return () => clearInterval(interval)
  }, [addMetric])

  return { addMetric }
}
