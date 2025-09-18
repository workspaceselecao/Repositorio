'use client'

import { useMemo } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { useClientesCache, useSitesCache } from '../../hooks/useSupabaseCache'

export default function VagaFilters({
  searchTerm,
  setSearchTerm,
  filterCliente,
  setFilterCliente,
  filterSite,
  setFilterSite,
}) {
  const { data: clientes = [], loading: clientesLoading } = useClientesCache()
  const { data: sites = [], loading: sitesLoading } = useSitesCache()

  const clientesNomes = useMemo(() => clientes?.map(c => c.nome) || [], [clientes])
  const sitesNomes = useMemo(() => sites || [], [sites])

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilterCliente('')
    setFilterSite('')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            placeholder="Buscar por cargo, cliente ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <select
            value={filterCliente}
            onChange={(e) => setFilterCliente(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={clientesLoading}
          >
            <option value="">Todos os clientes</option>
            {clientesNomes.map(cliente => (
              <option key={cliente} value={cliente}>{cliente}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site
          </label>
          <select
            value={filterSite}
            onChange={(e) => setFilterSite(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={sitesLoading}
          >
            <option value="">Todos os sites</option>
            {sitesNomes.map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>
      </div>

      {(searchTerm || filterCliente || filterSite) && (
        <div className="mt-4">
          <button
            onClick={handleClearFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  )
}