'use client'

import { useEffect, useState } from 'react'

export function CacheClearer() {
  const [isClearing, setIsClearing] = useState(false)
  const [clearResults, setClearResults] = useState({})

  const clearAllCaches = async () => {
    setIsClearing(true)
    const results = {}
    
    try {
      // Limpar localStorage
      console.log('🧹 Limpando localStorage...')
      localStorage.clear()
      results.localStorage = 'Limpo'
      
      // Limpar sessionStorage
      console.log('🧹 Limpando sessionStorage...')
      sessionStorage.clear()
      results.sessionStorage = 'Limpo'
      
      // Limpar cache do service worker
      console.log('🧹 Limpando cache do service worker...')
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations()
          for (let registration of registrations) {
            await registration.unregister()
          }
          results.serviceWorker = 'Removido'
        } catch (error) {
          results.serviceWorker = `Erro: ${error.message}`
        }
      } else {
        results.serviceWorker = 'Não disponível'
      }
      
      // Limpar cache do navegador (se possível)
      console.log('🧹 Tentando limpar cache do navegador...')
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys()
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          )
          results.browserCache = 'Limpo'
        } catch (error) {
          results.browserCache = `Erro: ${error.message}`
        }
      } else {
        results.browserCache = 'Não disponível'
      }
      
      // Forçar reload da página
      console.log('🔄 Recarregando página...')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      
    } catch (error) {
      results.error = error.message
    } finally {
      setIsClearing(false)
    }
    
    setClearResults(results)
  }

  const forceReload = () => {
    window.location.reload()
  }

  return (
    <div className="fixed top-4 right-4 bg-red-50 border border-red-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2 text-red-800">🧹 Limpeza de Cache</h3>
      
      <div className="space-y-2 text-xs">
        <button
          onClick={clearAllCaches}
          disabled={isClearing}
          className="w-full bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          {isClearing ? 'Limpando...' : 'Limpar Tudo'}
        </button>
        
        <button
          onClick={forceReload}
          className="w-full bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
        >
          Recarregar Página
        </button>
        
        {Object.keys(clearResults).length > 0 && (
          <div className="pt-2 border-t border-red-200">
            <div className="font-semibold text-red-800">Resultados:</div>
            <div className="space-y-1">
              {Object.entries(clearResults).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key}:</span>
                  <span className="text-green-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="text-xs text-red-600 mt-2">
          ⚠️ Use apenas se o login não funcionar
        </div>
      </div>
    </div>
  )
}
