'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { ArrowDownTrayIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useVagasCache } from '../hooks/useSupabaseCache'

export default function ImportarDados() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { user } = useAuth()
  const { refetch: refetchVagas } = useVagasCache() // Obter a função refetch do cache de vagas

  const handleImport = async () => {
    if (!user) {
      alert('Você precisa estar logado para importar dados')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/import-vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({ vagas: [] }) // O corpo pode ser vazio se o JSON for lido do servidor
      })

      const data = await response.json()
      setResult(data)

      if (data.success) {
        // Em vez de recarregar a página, refetch os dados das vagas
        refetchVagas()
      }

    } catch (error) {
      console.error('Erro na importação:', error)
      setResult({
        success: false,
        message: 'Erro ao importar dados: ' + error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Importar Dados de Vagas
          </h3>
          <p className="text-sm text-gray-500">
            Importe vagas de fontes externas para o sistema
          </p>
        </div>
        <button
          onClick={handleImport}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Importando...
            </>
          ) : (
            <>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Importar Dados
            </>
          )}
        </button>
      </div>

      {result && (
        <div className={`mt-4 p-4 rounded-md ${
          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {result.success ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3">
              <h4 className={`font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success ? 'Importação realizada com sucesso!' : 'Erro na importação'}
              </h4>
              <p className={`text-sm mt-1 ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>
              
              {result.detalhesErros && result.detalhesErros.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-red-800 mb-2">Detalhes dos erros:</p>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {result.detalhesErros.slice(0, 5).map((erro, index) => (
                      <li key={index}>{erro}</li>
                    ))}
                    {result.detalhesErros.length > 5 && (
                      <li>... e mais {result.detalhesErros.length - 5} erros</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}