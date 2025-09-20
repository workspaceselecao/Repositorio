'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function FiltrosAvancadosComparativo({ 
  clientesSelecionados, 
  filtros, 
  onFiltrosChange, 
  vagasDisponiveis 
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filtrosPorCliente, setFiltrosPorCliente] = useState({})

  // Inicializar filtros para cada cliente
  useEffect(() => {
    const novosFiltros = {}
    clientesSelecionados.forEach(cliente => {
      novosFiltros[cliente] = {
        site: '',
        categoria: '',
        cargo: '',
        produto: ''
      }
    })
    setFiltrosPorCliente(novosFiltros)
  }, [clientesSelecionados])

  // Calcular opções de filtro para cada cliente
  const opcoesPorCliente = useMemo(() => {
    const opcoes = {}
    
    clientesSelecionados.forEach(cliente => {
      const vagasDoCliente = vagasDisponiveis.filter(vaga => vaga.cliente === cliente)
      
      opcoes[cliente] = {
        sites: Array.from(new Set(vagasDoCliente.map(v => v.site).filter(Boolean))).sort(),
        categorias: Array.from(new Set(vagasDoCliente.map(v => v.categoria).filter(Boolean))).sort(),
        cargos: Array.from(new Set(vagasDoCliente.map(v => v.cargo).filter(Boolean))).sort(),
        produtos: Array.from(new Set(vagasDoCliente.map(v => v.produto).filter(Boolean))).sort()
      }
    })
    
    return opcoes
  }, [clientesSelecionados, vagasDisponiveis])

  const handleFiltroChange = (cliente, campo, valor) => {
    const novosFiltros = {
      ...filtrosPorCliente,
      [cliente]: {
        ...filtrosPorCliente[cliente],
        [campo]: valor
      }
    }
    setFiltrosPorCliente(novosFiltros)
    
    // Aplicar filtros globais (intersecção dos filtros de todos os clientes)
    const filtrosGlobais = {}
    Object.keys(filtros).forEach(campo => {
      const valores = Object.values(novosFiltros).map(f => f[campo]).filter(Boolean)
      if (valores.length === clientesSelecionados.length && new Set(valores).size === 1) {
        filtrosGlobais[campo] = valores[0]
      } else {
        filtrosGlobais[campo] = ''
      }
    })
    
    onFiltrosChange(filtrosGlobais, novosFiltros)
  }

  const limparFiltrosCliente = (cliente) => {
    const novosFiltros = {
      ...filtrosPorCliente,
      [cliente]: {
        site: '',
        categoria: '',
        cargo: '',
        produto: ''
      }
    }
    setFiltrosPorCliente(novosFiltros)
    onFiltrosChange({ site: '', categoria: '', cargo: '', produto: '' })
  }

  const limparTodosFiltros = () => {
    const novosFiltros = {}
    clientesSelecionados.forEach(cliente => {
      novosFiltros[cliente] = {
        site: '',
        categoria: '',
        cargo: '',
        produto: ''
      }
    })
    setFiltrosPorCliente(novosFiltros)
    onFiltrosChange({ site: '', categoria: '', cargo: '', produto: '' }, novosFiltros)
  }

  if (clientesSelecionados.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Botão para expandir/recolher filtros */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <FunnelIcon className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Filtros Avançados</h3>
            <p className="text-sm text-gray-600">Filtre vagas por cliente individualmente</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {Object.values(filtrosPorCliente).some(f => Object.values(f).some(v => v)) && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Ativo
            </span>
          )}
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
          )}
        </div>
      </motion.button>

      {/* Container de filtros expansível */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              {/* Header com botão de limpar todos */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Filtros por Cliente</h4>
                  <p className="text-sm text-gray-600">Configure filtros específicos para cada cliente</p>
                </div>
                <button
                  onClick={limparTodosFiltros}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Limpar Todos</span>
                </button>
              </div>

              {/* Grid de filtros por cliente */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {clientesSelecionados.map((cliente, index) => {
                  const opcoesCliente = opcoesPorCliente[cliente] || { sites: [], categorias: [], cargos: [], produtos: [] }
                  const filtrosCliente = filtrosPorCliente[cliente] || { site: '', categoria: '', cargo: '', produto: '' }
                  const temFiltrosAtivos = Object.values(filtrosCliente).some(v => v)

                  return (
                    <motion.div
                      key={cliente}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-4"
                    >
                      {/* Header do cliente */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' : 
                            index === 1 ? 'bg-green-500' : 
                            'bg-purple-500'
                          }`}></div>
                          <h5 className="font-medium text-gray-900">{cliente}</h5>
                        </div>
                        {temFiltrosAtivos && (
                          <button
                            onClick={() => limparFiltrosCliente(cliente)}
                            className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                          >
                            Limpar
                          </button>
                        )}
                      </div>

                      {/* Filtros do cliente */}
                      <div className="space-y-3">
                        {/* Site */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Site
                          </label>
                          <select
                            value={filtrosCliente.site || ''}
                            onChange={(e) => handleFiltroChange(cliente, 'site', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          >
                            <option value="">Todos os sites</option>
                            {opcoesCliente.sites.map(site => (
                              <option key={site} value={site}>{site}</option>
                            ))}
                          </select>
                        </div>

                        {/* Categoria */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Categoria
                          </label>
                          <select
                            value={filtrosCliente.categoria || ''}
                            onChange={(e) => handleFiltroChange(cliente, 'categoria', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          >
                            <option value="">Todas as categorias</option>
                            {opcoesCliente.categorias.map(categoria => (
                              <option key={categoria} value={categoria}>{categoria}</option>
                            ))}
                          </select>
                        </div>

                        {/* Cargo */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Cargo
                          </label>
                          <select
                            value={filtrosCliente.cargo || ''}
                            onChange={(e) => handleFiltroChange(cliente, 'cargo', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          >
                            <option value="">Todos os cargos</option>
                            {opcoesCliente.cargos.map(cargo => (
                              <option key={cargo} value={cargo}>{cargo}</option>
                            ))}
                          </select>
                        </div>

                        {/* Produto */}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Produto
                          </label>
                          <select
                            value={filtrosCliente.produto || ''}
                            onChange={(e) => handleFiltroChange(cliente, 'produto', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                          >
                            <option value="">Todos os produtos</option>
                            {opcoesCliente.produtos.map(produto => (
                              <option key={produto} value={produto}>{produto}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Resumo dos filtros ativos */}
              {Object.values(filtrosPorCliente).some(f => Object.values(f).some(v => v)) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <h6 className="text-sm font-medium text-blue-900 mb-2">Filtros Ativos:</h6>
                  <div className="flex flex-wrap gap-2">
                    {clientesSelecionados.map(cliente => {
                      const filtrosCliente = filtrosPorCliente[cliente] || {}
                      const filtrosAtivos = Object.entries(filtrosCliente)
                        .filter(([_, valor]) => valor)
                        .map(([campo, valor]) => `${campo}: ${valor}`)
                      
                      if (filtrosAtivos.length === 0) return null
                      
                      return (
                        <div key={cliente} className="text-xs">
                          <span className="font-medium text-blue-800">{cliente}:</span>{' '}
                          <span className="text-blue-700">{filtrosAtivos.join(', ')}</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
