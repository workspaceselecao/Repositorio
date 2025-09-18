'use client'

import { useState, useEffect, useCallback, useMemo  } from 'react'
import { XMarkIcon, CheckIcon  } from '@heroicons/react/24/outline'
import { useClientesCache } from '../hooks/useSupabaseCache' // Importar o hook de cache

export default function SeletorClientes({ 
  clientesSelecionados, 
  onClientesChange, 
  maxClientes = 3 
}) {
  const { data: clientesData, loading: clientesLoading } = useClientesCache() // Usar o hook de cache
  const clientes = clientesData || []

  const toggleCliente = useCallback((cliente) => {
    if (clientesSelecionados.includes(cliente)) {
      // Remover cliente
      onClientesChange(clientesSelecionados.filter(c => c !== cliente))
    } else {
      // Adicionar cliente (limitado ao máximo)
      if (clientesSelecionados.length < maxClientes) {
        onClientesChange([...clientesSelecionados, cliente])
      }
    }
  }, [clientesSelecionados, onClientesChange, maxClientes])

  const removerCliente = useCallback((cliente) => {
    onClientesChange(clientesSelecionados.filter(c => c !== cliente))
  }, [clientesSelecionados, onClientesChange])

  const limparSelecao = useCallback(() => {
    onClientesChange([])
  }, [onClientesChange])

  if (clientesLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Selecionar Clientes para Comparação
        </h3>
        {clientesSelecionados.length > 0 && (
          <button
            onClick={limparSelecao}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Limpar seleção
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Selecione até {maxClientes} clientes para comparar suas vagas.
          <span className="ml-2 text-blue-600 font-medium">
            ({clientesSelecionados.length}/{maxClientes} selecionados)
          </span>
        </p>
      </div>

      {/* Clientes selecionados */}
      {clientesSelecionados.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Selecionados:</p>
          <div className="flex flex-wrap gap-2">
            {clientesSelecionados.map((cliente) => (
              <span
                key={cliente}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {cliente}
                <button
                  onClick={() => removerCliente(cliente)}
                  className="ml-2 hover:text-blue-600"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lista de clientes disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {clientes.map((cliente) => {
          const selecionado = clientesSelecionados.includes(cliente.nome)
          const desabilitado = !selecionado && clientesSelecionados.length >= maxClientes

          return (
            <button
              key={cliente.nome}
              onClick={() => toggleCliente(cliente.nome)}
              disabled={desabilitado}
              className={`
                relative flex items-center justify-between p-3 text-left rounded-md border transition-colors
                ${selecionado
                  ? 'bg-blue-50 border-blue-200 text-blue-900'
                  : desabilitado
                  ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }
              `}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {cliente.nome}
                </p>
                <p className="text-xs text-gray-500">
                  {cliente.totalVagas} {cliente.totalVagas === 1 ? 'vaga' : 'vagas'}
                </p>
              </div>
              
              {selecionado && (
                <CheckIcon className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
              )}
            </button>
          )
        })}
      </div>

      {clientes.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p>Nenhum cliente encontrado</p>
          <p className="text-sm mt-1">Importe dados primeiro na página Lista de Clientes</p>
        </div>
      )}
    </div>
  )
}