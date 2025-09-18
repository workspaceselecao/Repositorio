'use client'

import { useState, useEffect  } from 'react'
import { WifiIcon, NoSymbolIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    let timeoutId = null

    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)
      
      if (!online) {
        setShowIndicator(true)
        // Limpar timeout anterior se existir
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
      } else {
        // Mostrar brevemente que voltou online, depois ocultar
        setShowIndicator(true)
        // Limpar timeout anterior se existir
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => setShowIndicator(false), 3000)
      }
    }

    // Definir status inicial
    setIsOnline(navigator.onLine)

    // Listeners para mudanças de conectividade
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      // Limpar timeout ao desmontar
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  if (!showIndicator) {
    return null
  }

  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
        isOnline 
          ? 'bg-green-600 text-white' 
          : 'bg-red-600 text-white'
      }`}
    >
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <>
            <CheckCircleIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Conexão restaurada</span>
          </>
        ) : (
          <>
            <NoSymbolIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Modo offline - Dados em cache</span>
          </>
        )}
      </div>
    </div>
  )
}