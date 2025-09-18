'use client'

import { useEffect, useState } from 'react'

export function EnvironmentCheck({ children }) {
  const [isConfigured, setIsConfigured] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkEnvironment = () => {
      // Verificar apenas no lado do cliente
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey ||
          supabaseUrl === 'https://your-project.supabase.co' ||
          supabaseKey === 'your-anon-key-here') { // Adicionado verificação para a chave placeholder
        setIsConfigured(false)
      }
      setIsLoading(false)
    }

    checkEnvironment()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
            Configuração Necessária
          </h1>
          <p className="text-gray-600 text-center mb-6">
            As variáveis de ambiente do Supabase não estão configuradas corretamente.
          </p>

          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Para corrigir, crie um arquivo `.env.local` na raiz do projeto com:</h3>
            <pre className="text-sm text-gray-700 bg-white p-3 rounded border overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://qdzrldxubcofobqmynab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development`}
            </pre>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Passos para resolver:</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Crie ou atualize o arquivo `.env.local` com suas credenciais Supabase reais.</li>
              <li>Reinicie o servidor de desenvolvimento (`npm run dev`).</li>
              <li>Recarregue esta página.</li>
            </ol>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}