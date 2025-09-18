'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { useRealtimeUpdates } from '../hooks/useRealtimeUpdates'

const DataContext = createContext(undefined)

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [data, setData] = useState({
    vagas: [],
    clientes: [],
    sites: [],
    users: [],
    loading: true,
    lastUpdated: null
  })
  const [cacheVersion, setCacheVersion] = useState(0)

  // Configurar atualizações em tempo real
  useRealtimeUpdates()

  // Função para carregar todos os dados
  const loadAllData = useCallback(async () => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }))
      return
    }

    try {
      setData(prev => ({ ...prev, loading: true }))

      // Carregar vagas
      const { data: vagas, error: vagasError } = await supabase
        .from('vagas')
        .select('*')
        .order('created_at', { ascending: false })

      if (vagasError) throw vagasError

      // Carregar usuários
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      // Processar clientes a partir das vagas
      const clientesMap = (vagas || []).reduce((acc, vaga) => {
        const cliente = vaga.cliente
        if (cliente) {
          acc[cliente] = (acc[cliente] || 0) + 1
        }
        return acc
      }, {})

      const clientes = Object.entries(clientesMap)
        .map(([nome, totalVagas]) => ({ nome, totalVagas }))
        .sort((a, b) => a.nome.localeCompare(b.nome))

      // Processar sites a partir das vagas
      const sites = Array.from(new Set((vagas || []).map(v => v.site).filter(Boolean))).sort()

      setData({
        vagas: vagas || [],
        clientes,
        sites,
        users: users || [],
        loading: false,
        lastUpdated: new Date().toISOString()
      })

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setData(prev => ({ ...prev, loading: false }))
    }
  }, [user])

  // Função para invalidar cache
  const invalidateCache = useCallback(() => {
    setCacheVersion(prev => prev + 1)
  }, [])

  // Função para adicionar vaga
  const addVaga = useCallback((novaVaga) => {
    setData(prev => ({
      ...prev,
      vagas: [novaVaga, ...prev.vagas],
      lastUpdated: new Date().toISOString()
    }))
    invalidateCache()
  }, [invalidateCache])

  // Função para atualizar vaga
  const updateVaga = useCallback((vagaAtualizada) => {
    setData(prev => ({
      ...prev,
      vagas: prev.vagas.map(v => v.id === vagaAtualizada.id ? vagaAtualizada : v),
      lastUpdated: new Date().toISOString()
    }))
    invalidateCache()
  }, [invalidateCache])

  // Função para remover vaga
  const removeVaga = useCallback((vagaId) => {
    setData(prev => ({
      ...prev,
      vagas: prev.vagas.filter(v => v.id !== vagaId),
      lastUpdated: new Date().toISOString()
    }))
    invalidateCache()
  }, [invalidateCache])

  // Função para adicionar usuário
  const addUser = useCallback((novoUsuario) => {
    setData(prev => ({
      ...prev,
      users: [novoUsuario, ...prev.users],
      lastUpdated: new Date().toISOString()
    }))
    invalidateCache()
  }, [invalidateCache])

  // Função para atualizar usuário
  const updateUser = useCallback((usuarioAtualizado) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === usuarioAtualizado.id ? usuarioAtualizado : u),
      lastUpdated: new Date().toISOString()
    }))
    invalidateCache()
  }, [invalidateCache])

  // Função para remover usuário
  const removeUser = useCallback((usuarioId) => {
    setData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== usuarioId),
      lastUpdated: new Date().toISOString()
    }))
    invalidateCache()
  }, [invalidateCache])

  // Função para obter vagas por cliente
  const getVagasByCliente = useCallback((clientes) => {
    if (!clientes || clientes.length === 0) return []
    return data.vagas.filter(vaga => clientes.includes(vaga.cliente))
  }, [data.vagas])

  // Função para obter vagas filtradas
  const getVagasFiltradas = useCallback((filtros) => {
    return data.vagas.filter(vaga => {
      const matchSite = filtros.site ? vaga.site === filtros.site : true
      const matchCategoria = filtros.categoria ? vaga.categoria === filtros.categoria : true
      const matchCargo = filtros.cargo ? vaga.cargo === filtros.cargo : true
      const matchProduto = filtros.produto ? vaga.produto === filtros.produto : true
      return matchSite && matchCategoria && matchCargo && matchProduto
    })
  }, [data.vagas])

  // Carregar dados quando o usuário mudar
  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  // Recarregar dados quando a versão do cache mudar
  useEffect(() => {
    if (cacheVersion > 0) {
      loadAllData()
    }
  }, [cacheVersion, loadAllData])

  const value = {
    // Dados
    vagas: data.vagas,
    clientes: data.clientes,
    sites: data.sites,
    users: data.users,
    loading: data.loading,
    lastUpdated: data.lastUpdated,
    
    // Funções de manipulação
    addVaga,
    updateVaga,
    removeVaga,
    addUser,
    updateUser,
    removeUser,
    
    // Funções de consulta
    getVagasByCliente,
    getVagasFiltradas,
    
    // Controle de cache
    invalidateCache,
    refreshData: loadAllData
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData deve ser usado dentro de um DataProvider')
  }
  return context
}
