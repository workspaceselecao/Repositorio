'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function FiltrosComparativo({ 
  filtros, 
  onFiltrosChange, 
  clientesSelecionados 
}) {
  const [opcoesFiltros, setOpcoesFiltros] = useState({
    sites: [],
    categorias: [],
    cargos: [],
    produtos: []
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (clientesSelecionados.length > 0) {
      carregarOpcoesFiltros()
    }
  }, [clientesSelecionados])

  const carregarOpcoesFiltros = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('vagas')
        .select('site, categoria, cargo, produto')
        .in('cliente', clientesSelecionados)

      if (error) {
        console.error('Erro ao carregar opções de filtros:', error)
        return
      }

      // Extrair valores únicos para cada campo
      const sites = Array.from(new Set(data?.map(v => v.site).filter(Boolean) || []))
      const categorias = Array.from(new Set(data?.map(v => v.categoria).filter(Boolean) || []))
      const cargos = Array.from(new Set(data?.map(v => v.cargo).filter(Boolean) || []))
      const produtos = Array.from(new Set(data?.map(v => v.produto).filter(Boolean) || []))

      setOpcoesFiltros({
        sites: sites.sort(),
        categorias: categorias.sort(),
        cargos: cargos.sort(),
        produtos: produtos.sort()
      })
    } catch (error) {
      console.error('Erro ao carregar opções de filtros:', error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando filtros...</span>
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