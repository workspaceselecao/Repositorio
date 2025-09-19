'use client'

import { useEffect, useRef, useState } from 'react'
import { useRenderTracker } from '../hooks/useDebounce'

export default function PerformanceMonitor({ children, componentName = 'PerformanceMonitor' }) {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    avgRenderTime: 0,
    memoryUsage: 0,
    isSlow: false
  })
  
  const trackRender = useRenderTracker(componentName, 30)
  const renderTimes = useRef([])
  const startTime = useRef(Date.now())
  const lastRenderTime = useRef(Date.now())

  // Track render performance
  useEffect(() => {
    const now = Date.now()
    const renderTime = now - lastRenderTime.current
    
    renderTimes.current.push(renderTime)
    if (renderTimes.current.length > 20) {
      renderTimes.current.shift()
    }
    
    const avgRenderTime = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
    const isSlow = avgRenderTime > 100 // Considerar lento se > 100ms
    
    setMetrics(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1,
      lastRenderTime: renderTime,
      avgRenderTime: Math.round(avgRenderTime),
      isSlow
    }))
    
    lastRenderTime.current = now
    trackRender()
  })

  // Monitor memory usage
  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = performance.memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
        }))
      }
    }

    checkMemory()
    const interval = setInterval(checkMemory, 5000) // Check every 5 seconds

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
          renderCount: 0,
          lastRenderTime: 0
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

  // Show warning if performance is poor
  useEffect(() => {
    if (metrics.isSlow && metrics.renderCount > 10) {
      console.warn('⚠️ Performance Warning:', {
        component: componentName,
        renderCount: metrics.renderCount,
        avgRenderTime: metrics.avgRenderTime,
        memoryUsage: metrics.memoryUsage
      })
    }
  }, [metrics, componentName])

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
