'use client'

import { ChartBarIcon } from '@heroicons/react/24/outline'

export default function VagaListControls({
  viewMode,
  setViewMode,
  itemsPerPage,
  setItemsPerPage,
  setShowPerformanceDashboard,
  totalItems,
  totalVagasRaw
}) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-blue-900 font-medium">
          Mostrando <span className="font-bold text-blue-950">{totalItems}</span> vagas
          {totalItems !== totalVagasRaw && (
            <span className="text-blue-700 font-medium"> (filtradas de {totalVagasRaw} total)</span>
          )}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-blue-900">Visualização:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-medium"
            >
              <option value="expanded">Expandida (1 por linha)</option>
              <option value="paginated">Paginada</option>
              <option value="virtualized">Virtualizada</option>
            </select>
          </div>

          <button
            onClick={() => setShowPerformanceDashboard(true)}
            className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
          >
            <ChartBarIcon className="h-4 w-4" />
            Performance
          </button>

          {(viewMode === 'paginated' || viewMode === 'expanded') && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-blue-900">Itens por página:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white font-medium"
              >
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}