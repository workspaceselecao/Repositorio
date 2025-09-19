'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { useOptimizedLoading } from '../hooks/useOptimizedLoading'

const DataContext = createContext(undefined)

export function DataProvider({ children }) {
  const { user } = useAuth()
  const [cacheVersion, setCacheVersion] = useState(0)

  // Função para buscar todos os dados
  const fetchAllData = useCallback(async (signal) => {
    if (!user) return {
      vagas: [],
      clientes: [],
      sites: [],
      users: [],
      loading: false,
      lastUpdated: null
    }

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

    return {
      vagas: vagas || [],
      clientes,
      sites,
      users: users || [],
      loading: false,
      lastUpdated: new Date().toISOString()
    }
  }, [user])

  // Usar o hook otimizado para gerenciar dados
  const { data, loading, error, lastUpdated, refresh } = useOptimizedLoading(fetchAllData, {
    key: `repositorio_data_${user?.id || 'anonymous'}`,
    ttl: 5 * 60 * 1000, // 5 minutos
    enableCache: true,
    enableAutoRefresh: true,
    refreshInterval: 2 * 60 * 1000, // 2 minutos
    maxRetries: 3,
    retryDelay: 1000
  })

  // Função para carregar todos os dados (mantida para compatibilidade)
  const loadAllData = useCallback(async (forceReload = false) => {
    if (forceReload) {
      refresh()
    }
  }, [refresh])

  // Função para invalidar cache
  const invalidateCache = useCallback(() => {
    setCacheVersion(prev => prev + 1)
  }, [])

  // Função para adicionar vaga
  const addVaga = useCallback((novaVaga) => {
    // Atualizar dados localmente e recarregar
    refresh()
  }, [refresh])

  // Função para atualizar vaga
  const updateVaga = useCallback((vagaAtualizada) => {
    // Atualizar dados localmente e recarregar
    refresh()
  }, [refresh])

  // Função para remover vaga
  const removeVaga = useCallback((vagaId) => {
    // Atualizar dados localmente e recarregar
    refresh()
  }, [refresh])

  // Função para adicionar usuário
  const addUser = useCallback((novoUsuario) => {
    // Atualizar dados localmente e recarregar
    refresh()
  }, [refresh])

  // Função para atualizar usuário
  const updateUser = useCallback((usuarioAtualizado) => {
    // Atualizar dados localmente e recarregar
    refresh()
  }, [refresh])

  // Função para remover usuário
  const removeUser = useCallback((usuarioId) => {
    // Atualizar dados localmente e recarregar
    refresh()
  }, [refresh])

  // Função para obter vagas por cliente
  const getVagasByCliente = useCallback((clientes) => {
    if (!clientes || clientes.length === 0 || !data) return []
    return data.vagas.filter(vaga => clientes.includes(vaga.cliente))
  }, [data])

  // Função para obter vagas filtradas
  const getVagasFiltradas = useCallback((filtros) => {
    if (!data) return []
    return data.vagas.filter(vaga => {
      const matchSite = filtros.site ? vaga.site === filtros.site : true
      const matchCategoria = filtros.categoria ? vaga.categoria === filtros.categoria : true
      const matchCargo = filtros.cargo ? vaga.cargo === filtros.cargo : true
      const matchProduto = filtros.produto ? vaga.produto === filtros.produto : true
      return matchSite && matchCategoria && matchCargo && matchProduto
    })
  }, [data])

  // Configurar atualizações em tempo real
  useEffect(() => {
    if (!user) return

    // Configurar listeners para mudanças em tempo real
    const vagasSubscription = supabase
      .channel('vagas_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'vagas' 
        }, 
        (payload) => {
          console.log('Mudança detectada na tabela vagas:', payload)
          refresh() // Usar refresh em vez de invalidateCache
        }
      )
      .subscribe()

    const usersSubscription = supabase
      .channel('users_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users' 
        }, 
        (payload) => {
          console.log('Mudança detectada na tabela users:', payload)
          refresh() // Usar refresh em vez de invalidateCache
        }
      )
      .subscribe()

    // Cleanup das subscriptions
    return () => {
      vagasSubscription.unsubscribe()
      usersSubscription.unsubscribe()
    }
  }, [user, refresh])

  const value = {
    // Dados
    vagas: data?.vagas || [],
    clientes: data?.clientes || [],
    sites: data?.sites || [],
    users: data?.users || [],
    loading: loading,
    lastUpdated: lastUpdated,
    error: error,
    
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
    refreshData: refresh
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
