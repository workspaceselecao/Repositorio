'use client'

import { useState, useEffect, useMemo } from 'react'

export default function FiltrosComparativo({ 
  filtros, 
  onFiltrosChange, 
  vagasDisponiveis // Receber as vagas já carregadas
}) {
  const [opcoesFiltros, setOpcoesFiltros] = useState({
    sites: [],
    categorias: [],
    cargos: [],
    produtos: []
  })

  // Recalcular opções de filtro sempre que as vagas disponíveis mudarem
  useEffect(() => {
    if (vagasDisponiveis && vagasDisponiveis.length > 0) {
      const sites = Array.from(new Set(vagasDisponiveis.map(v => v.site).filter(Boolean)))
      const categorias = Array.from(new Set(vagasDisponiveis.map(v => v.categoria).filter(Boolean)))
      const cargos = Array.from(new Set(vagasDisponiveis.map(v => v.cargo).filter(Boolean)))
      const produtos = Array.from(new Set(vagasDisponiveis.map(v => v.produto).filter(Boolean)))

      setOpcoesFiltros({
        sites: sites.sort(),
        categorias: categorias.sort(),
        cargos: cargos.sort(),
        produtos: produtos.sort()
      })
    } else {
      setOpcoesFiltros({
        sites: [],
        categorias: [],
        cargos: [],
        produtos: []
      })
    }
  }, [vagasDisponiveis])

  const handleFiltroChange = (campo, valor) => {
    onFiltrosChange({
      ...filtros,
      [campo]: valor
    })
  }

  const limparFiltros = () => {
    onFiltrosChange({
      site: '',
      categoria: '',
      cargo: '',
      produto: ''
    })
  }

  // Se não houver vagas disponíveis, não mostrar os filtros
  if (vagasDisponiveis.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhuma vaga para filtrar. Selecione clientes e aguarde o carregamento.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtro por Site */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Site
          </label>
          <select
            value={filtros.site || ''}
            onChange={(e) => handleFiltroChange('site', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os sites</option>
            {opcoesFiltros.sites.map(site => (
              <option key={site} value={site}>{site}</option>
            ))}
          </select>
        </div>

        {/* Filtro por Categoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            value={filtros.categoria || ''}
            onChange={(e) => handleFiltroChange('categoria', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas as categorias</option>
            {opcoesFiltros.categorias.map(categoria => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
        </div>

        {/* Filtro por Cargo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cargo
          </label>
          <select
            value={filtros.cargo || ''}
            onChange={(e) => handleFiltroChange('cargo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os cargos</option>
            {opcoesFiltros.cargos.map(cargo => (
              <option key={cargo} value={cargo}>{cargo}</option>
            ))}
          </select>
        </div>

        {/* Filtro por Produto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Produto
          </label>
          <select
            value={filtros.produto || ''}
            onChange={(e) => handleFiltroChange('produto', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os produtos</option>
            {opcoesFiltros.produtos.map(produto => (
              <option key={produto} value={produto}>{produto}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Botão para limpar filtros */}
      <div className="flex justify-end">
        <button
          onClick={limparFiltros}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  )
}