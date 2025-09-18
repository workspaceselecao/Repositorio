'use client'

import { useEffect, useState } from 'react'

export function EnvironmentDebug() {
  const [envVars, setEnvVars] = useState({})
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setEnvVars({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV
    })
  }, [])

  if (!isClient) {
    return null
  }

  const hasValidConfig = envVars.supabaseUrl && envVars.supabaseKey

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2">🔧 Debug de Ambiente</h3>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Supabase URL:</span>
          <span className={envVars.supabaseUrl ? 'text-green-600' : 'text-red-600'}>
            {envVars.supabaseUrl ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Supabase Key:</span>
          <span className={envVars.supabaseKey ? 'text-green-600' : 'text-red-600'}>
            {envVars.supabaseKey ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>App URL:</span>
          <span className={envVars.appUrl ? 'text-green-600' : 'text-yellow-600'}>
            {envVars.appUrl ? '✅' : '⚠️'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Node ENV:</span>
          <span className="text-blue-600">{envVars.nodeEnv || 'undefined'}</span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-200">
        <div className={`text-xs font-medium ${hasValidConfig ? 'text-green-600' : 'text-red-600'}`}>
          {hasValidConfig ? '✅ Configuração OK' : '❌ Configuração Inválida'}
        </div>
        
        {!hasValidConfig && (
          <div className="text-xs text-red-600 mt-1">
            Configure as variáveis de ambiente no Vercel
          </div>
        )}
      </div>
    </div>
  )
}
