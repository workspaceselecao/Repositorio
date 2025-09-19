'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { useFocus } from '../components/FocusManager'

const DataContext = createContext(undefined)

// Cache persistente no localStorage
const CACHE_KEY = 'repositorio_data_cache'
const CACHE_VERSION = '1.0.0'

const saveToCache = (data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
  } catch (error) {
    console.warn('Erro ao salvar cache:', error)
  }
}

const loadFromCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null
    
    const { data, timestamp, version } = JSON.parse(cached)
    
    // Verificar se o cache é válido (24 horas)
    const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000
    const isVersionValid = version === CACHE_VERSION
    
    if (isExpired || !isVersionValid) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    
    return data
  } catch (error) {
    console.warn('Erro ao carregar cache:', error)
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

export function DataProvider({ children }) {
  const { user } = useAuth()
  const { isFocused, isVisible, isAppSleeping, wakeUp } = useFocus()
  const [data, setData] = useState({
    vagas: [],
    clientes: [],
    sites: [],
    users: [],
    loading: true,
    lastUpdated: null
  })
  const [cacheVersion, setCacheVersion] = useState(0)
  const isLoadingRef = useRef(false)
  const subscriptionsRef = useRef([])

  // Função para carregar todos os dados
  const loadAllData = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }))
      return
    }

    // Evitar carregamento desnecessário se já estiver carregando
    if (isLoadingRef.current && !forceRefresh) {
      return
    }

    // Tentar carregar do cache primeiro (se não for refresh forçado)
    if (!forceRefresh) {
      const cachedData = loadFromCache()
      if (cachedData) {
        setData(prev => ({ ...prev, ...cachedData, loading: false }))
        return
      }
    }

    try {
      isLoadingRef.current = true
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

      const newData = {
        vagas: vagas || [],
        clientes,
        sites,
        users: users || [],
        loading: false,
        lastUpdated: new Date().toISOString()
      }

      setData(newData)
      
      // Salvar no cache
      saveToCache(newData)

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setData(prev => ({ ...prev, loading: false }))
    } finally {
      isLoadingRef.current = false
    }
  }, [user])

  // Função para invalidar cache
  const invalidateCache = useCallback(() => {
    setCacheVersion(prev => prev + 1)
    // Limpar cache do localStorage
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch (error) {
      console.warn('Erro ao limpar cache:', error)
    }
  }, [])

  // Função para adicionar vaga
  const addVaga = useCallback((novaVaga) => {
    setData(prev => {
      const newData = {
        ...prev,
        vagas: [novaVaga, ...prev.vagas],
        lastUpdated: new Date().toISOString()
      }
      saveToCache(newData)
      return newData
    })
  }, [])

  // Função para atualizar vaga
  const updateVaga = useCallback((vagaAtualizada) => {
    setData(prev => {
      const newData = {
        ...prev,
        vagas: prev.vagas.map(v => v.id === vagaAtualizada.id ? vagaAtualizada : v),
        lastUpdated: new Date().toISOString()
      }
      saveToCache(newData)
      return newData
    })
  }, [])

  // Função para remover vaga
  const removeVaga = useCallback((vagaId) => {
    setData(prev => {
      const newData = {
        ...prev,
        vagas: prev.vagas.filter(v => v.id !== vagaId),
        lastUpdated: new Date().toISOString()
      }
      saveToCache(newData)
      return newData
    })
  }, [])

  // Função para adicionar usuário
  const addUser = useCallback((novoUsuario) => {
    setData(prev => {
      const newData = {
        ...prev,
        users: [novoUsuario, ...prev.users],
        lastUpdated: new Date().toISOString()
      }
      saveToCache(newData)
      return newData
    })
  }, [])

  // Função para atualizar usuário
  const updateUser = useCallback((usuarioAtualizado) => {
    setData(prev => {
      const newData = {
        ...prev,
        users: prev.users.map(u => u.id === usuarioAtualizado.id ? usuarioAtualizado : u),
        lastUpdated: new Date().toISOString()
      }
      saveToCache(newData)
      return newData
    })
  }, [])

  // Função para remover usuário
  const removeUser = useCallback((usuarioId) => {
    setData(prev => {
      const newData = {
        ...prev,
        users: prev.users.filter(u => u.id !== usuarioId),
        lastUpdated: new Date().toISOString()
      }
      saveToCache(newData)
      return newData
    })
  }, [])

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
  }, [user, loadAllData])

  // Recarregar dados quando a versão do cache mudar
  useEffect(() => {
    if (cacheVersion > 0) {
      loadAllData(true) // Forçar refresh
    }
  }, [cacheVersion, loadAllData])

  // Função para configurar subscriptions em tempo real
  const setupRealtimeSubscriptions = useCallback(() => {
    if (!user) return

    let debounceTimeout = null

    const handleRealtimeChange = () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      
      debounceTimeout = setTimeout(() => {
        console.log('Atualizando dados devido a mudança em tempo real')
        loadAllData(true) // Forçar refresh
      }, 1000) // Debounce de 1 segundo
    }

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
          handleRealtimeChange()
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
          handleRealtimeChange()
        }
      )
      .subscribe()

    // Armazenar referências para cleanup
    subscriptionsRef.current = [vagasSubscription, usersSubscription]

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      subscriptionsRef.current.forEach(sub => sub.unsubscribe())
      subscriptionsRef.current = []
    }
  }, [user, loadAllData])

  // Configurar subscriptions iniciais quando o usuário estiver logado e com foco
  useEffect(() => {
    if (user && isFocused && isVisible) {
      const cleanup = setupRealtimeSubscriptions()
      return cleanup
    }
  }, [user, isFocused, isVisible, setupRealtimeSubscriptions])

  // Tratamento para mudanças de foco usando FocusManager
  useEffect(() => {
    if (!user) return

    // Quando a aplicação volta ao foco após estar "dormindo"
    if (isFocused && isVisible && isAppSleeping()) {
      console.log('🌅 App woke up from sleep, checking for updates...')
      wakeUp()
      
      const lastUpdate = data.lastUpdated
      if (lastUpdate) {
        const timeSinceUpdate = Date.now() - new Date(lastUpdate).getTime()
        // Se passou mais de 2 minutos, atualizar dados
        if (timeSinceUpdate > 2 * 60 * 1000) {
          loadAllData(true)
        }
      }
    }
  }, [isFocused, isVisible, user, data.lastUpdated, loadAllData, isAppSleeping, wakeUp])

  // Pausar subscriptions quando a aplicação perde foco
  useEffect(() => {
    if (!user) return

    if (!isFocused || !isVisible) {
      console.log('⏸️ Pausing real-time subscriptions due to focus loss')
      // Pausar subscriptions
      subscriptionsRef.current.forEach(sub => {
        sub.unsubscribe()
      })
      subscriptionsRef.current = []
    } else {
      console.log('▶️ Resuming real-time subscriptions due to focus gain')
      // Reconfigurar subscriptions
      setupRealtimeSubscriptions()
    }
  }, [isFocused, isVisible, user, setupRealtimeSubscriptions])

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
