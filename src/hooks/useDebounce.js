import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Hook para debouncing de valores
 * @param {any} value - Valor a ser debounced
 * @param {number} delay - Delay em milissegundos
 * @returns {any} - Valor debounced
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para debouncing de funções
 * @param {Function} callback - Função a ser debounced
 * @param {number} delay - Delay em milissegundos
 * @param {Array} deps - Dependências da função
 * @returns {Function} - Função debounced
 */
export function useDebouncedCallback(callback, delay = 500, deps = []) {
  const timeoutRef = useRef(null)
  const callbackRef = useRef(callback)

  // Atualizar referência da função quando ela mudar
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedCallback = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }, [delay, ...(deps || [])])

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedCallback
}

/**
 * Hook para throttling de funções
 * @param {Function} callback - Função a ser throttled
 * @param {number} limit - Limite de tempo em milissegundos
 * @param {Array} deps - Dependências da função
 * @returns {Function} - Função throttled
 */
export function useThrottledCallback(callback, limit = 1000, deps = []) {
  const inThrottle = useRef(false)
  const callbackRef = useRef(callback)

  // Atualizar referência da função quando ela mudar
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const throttledCallback = useCallback((...args) => {
    if (!inThrottle.current) {
      callbackRef.current(...args)
      inThrottle.current = true
      setTimeout(() => inThrottle.current = false, limit)
    }
  }, [limit, ...(deps || [])])

  return throttledCallback
}

/**
 * Hook para detectar loops infinitos em re-renders (DESABILITADO)
 * @param {string} componentName - Nome do componente para debug
 * @param {number} maxRenders - Número máximo de renders antes de alertar
 * @returns {Function} - Função para registrar render
 */
export function useRenderTracker(componentName = 'Component', maxRenders = 50) {
  // Retornar função vazia para evitar loops
  return useCallback(() => {
    // Função vazia - desabilitada para evitar loops
  }, [])
}

/**
 * Hook para prevenir loops infinitos em useEffect
 * @param {Function} effect - Função do useEffect
 * @param {Array} deps - Dependências do useEffect
 * @param {number} maxCalls - Número máximo de chamadas por minuto
 */
export function useStableEffect(effect, deps = [], maxCalls = 10) {
  const callCount = useRef(0)
  const lastCallTime = useRef(Date.now())
  const timeoutRef = useRef(null)

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime.current

    // Reset contador se passou mais de 1 minuto
    if (timeSinceLastCall > 60000) {
      callCount.current = 0
    }

    // Verificar se excedeu o limite de chamadas
    if (callCount.current >= maxCalls) {
      console.warn('⚠️ useEffect chamado muitas vezes, ignorando para prevenir loop infinito')
      return
    }

    callCount.current += 1
    lastCallTime.current = now

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Executar effect com timeout para evitar bloqueio
    timeoutRef.current = setTimeout(() => {
      try {
        effect()
      } catch (error) {
        console.error('Erro no useEffect estável:', error)
      }
    }, 0)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, deps || [])
}