'use client'

import { useState } from 'react'
import { XMarkIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics'

export default function PerformanceDashboard({ isOpen, onClose }) {
  const {
    getMetrics,
    clearMetrics,
    exportMetrics 
  } = usePerformanceMetrics()
  
  const [selectedType, setSelectedType] = useState('all')
  const [timeRange, setTimeRange] = useState(5) // minutes

  const filteredMetrics = getMetrics(selectedType === 'all' ? undefined : selectedType)
    .filter(m => Date.now() - m.timestamp < timeRange * 60 * 1000)

  const renderMetrics = filteredMetrics.reduce((acc, metric) => {
    if (!acc[metric.name]) {
      acc[metric.name] = []
    }
    acc[metric.name].push(metric)
    return acc
  }, {})

  const calculateStats = (values) => {
    if (values.length === 0) return { avg: 0, min: 0, max: 0, latest: 0, count: 0 }
    
    const sum = values.reduce((acc, val) => acc + val.value, 0)
    const avg = sum / values.length
    const min = Math.min(...values.map(v => v.value))
    const max = Math.max(...values.map(v => v.value))
    const latest = values[values.length - 1].value

    return { avg, min, max, latest, count: values.length }
  }

  const formatValue = (value, type) => {
    if (type === 'memory') {
      return `${value.toFixed(2)} MB`
    }
    if (type === 'render' || type === 'api' || type === 'user') {
      return `${value.toFixed(2)} ms`
    }
    return value.toFixed(2)
  }

  const getStatusColor = (value, type) => {
    if (type === 'memory') {
      if (value > 100) return 'text-red-600'
      if (value > 50) return 'text-yellow-600'
      return 'text-green-600'
    }
    if (type === 'render' || type === 'api' || type === 'user') {
      if (value > 1000) return 'text-red-600'
      if (value > 500) return 'text-yellow-600'
      return 'text-green-600'
    }
    return 'text-gray-600'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Dashboard de Performance
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Controles */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Métrica
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="api">API</option>
              <option value="user">Usuário</option>
              <option value="memory">Memória</option>
              <option value="render">Renderização</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período (minutos)
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5 min</option>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={60}>1 hora</option>
            </select>
          </div>

          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => {
                const data = exportMetrics()
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Exportar
            </button>
            <button
              onClick={clearMetrics}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div className="space-y-6">
          {Object.keys(renderMetrics).length === 0 ? (
            <div className="text-center py-8">
              <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhuma métrica encontrada
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Execute algumas ações na aplicação para ver as métricas de performance.
              </p>
            </div>
          ) : (
            Object.entries(renderMetrics).map(([metricName, metricData]) => {
              const stats = calculateStats(metricData)
              return (
                <div key={metricName} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {metricName}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">M</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Média</p>
                          <p className={`text-lg font-semibold ${getStatusColor(stats.avg, metricData[0]?.type || '')}`}>
                            {formatValue(stats.avg, metricData[0]?.type || '')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-sm">M</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Mínimo</p>
                          <p className={`text-lg font-semibold ${getStatusColor(stats.min, metricData[0]?.type || '')}`}>
                            {formatValue(stats.min, metricData[0]?.type || '')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-semibold text-sm">M</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Máximo</p>
                          <p className={`text-lg font-semibold ${getStatusColor(stats.max, metricData[0]?.type || '')}`}>
                            {formatValue(stats.max, metricData[0]?.type || '')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold text-sm">L</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-500">Último</p>
                          <p className={`text-lg font-semibold ${getStatusColor(stats.latest, metricData[0]?.type || '')}`}>
                            {formatValue(stats.latest, metricData[0]?.type || '')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p>Total de medições: <span className="font-semibold">{stats.count}</span></p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}