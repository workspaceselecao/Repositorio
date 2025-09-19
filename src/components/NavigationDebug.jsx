'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationDebug() {
  const pathname = usePathname()
  const [navigationHistory, setNavigationHistory] = useState([])

  useEffect(() => {
    const timestamp = new Date().toISOString()
    setNavigationHistory(prev => [
      ...prev,
      { path: pathname, timestamp, action: 'navigate' }
    ])
    
    console.log('Navigation Debug:', {
      currentPath: pathname,
      timestamp,
      history: navigationHistory
    })
  }, [pathname])

  // Desabilitado temporariamente para evitar logs excessivos
  return null

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-2 rounded text-xs max-w-xs">
      <div className="font-bold">Navigation Debug:</div>
      <div>Current: {pathname}</div>
      <div>History: {navigationHistory.length} entries</div>
      <div className="text-xs opacity-75">
        Last: {navigationHistory[navigationHistory.length - 1]?.timestamp}
      </div>
    </div>
  )
}
