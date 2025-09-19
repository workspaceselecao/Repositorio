'use client'

import { useEffect, useRef, useState } from 'react'

export default function PerformanceMonitor({ children, componentName = 'PerformanceMonitor' }) {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    avgRenderTime: 0,
    memoryUsage: 0,
    isSlow: false
  })
  
  const renderTimes = useRef([])
  const startTime = useRef(Date.now())
  const lastRenderTime = useRef(Date.now())
  const renderCount = useRef(0)

  // Monitor memory usage apenas uma vez por minuto
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = performance.memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1020) // MB
        }))
      }
    }

    checkMemory()
    const interval = setInterval(checkMemory, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Monitor page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('📊 Performance Monitor - Page became visible')
        // Reset metrics when page becomes visible
        setMetrics(prev => ({
          ...prev,
          renderCount: 0
        }))
        renderTimes.current = []
        startTime.current = Date.now()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Monitor focus changes
  useEffect(() => {
    const handleFocus = () => {
      console.log('📊 Performance Monitor - Window gained focus')
    }

    const handleBlur = () => {
      console.log('📊 Performance Monitor - Window lost focus')
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  // Development-only performance overlay
  if (process.env.NODE_ENV === 'development' && metrics.renderCount > 0) {
    return (
      <div className="relative">
        {children}
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded-lg font-mono z-50">
          <div>Renders: {metrics.renderCount}</div>
          <div>Avg: {metrics.avgRenderTime}ms</div>
          <div>Last: {metrics.lastRenderTime}ms</div>
          {metrics.memoryUsage > 0 && <div>Memory: {metrics.memoryUsage}MB</div>}
          {metrics.isSlow && <div className="text-red-400">⚠️ Slow</div>}
        </div>
      </div>
    )
  }

  return children
}