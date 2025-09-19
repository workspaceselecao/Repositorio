'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CacheContext = createContext(undefined)

// Configurações do cache
const CACHE_CONFIG = {
  VERSION: '2.0.0',
  EXPIRY_TIME: 30 * 60 * 1000, // 30 minutos
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000
}

// Chaves do localStorage
const CACHE_KEYS = {
  VAGAS: 'cache_vagas',
  USERS: 'cache_users',
  NEWS: 'cache_news',
  METADATA: 'cache_metadata'
}

// Funções de cache
const saveToCache = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      version: CACHE_CONFIG.VERSION
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
  } catch (error) {
    console.warn('Erro ao salvar cache:', error)
  }
}

const loadFromCache = (key) => {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null
    
    const { data, timestamp, version } = JSON.parse(cached)
    
    // Verificar se o cache é válido
    const isExpired = Date.now() - timestamp > CACHE_CONFIG.EXPIRY_TIME
    const isVersionValid = version === CACHE_CONFIG.VERSION
    
    if (isExpired || !isVersionValid) {
      localStorage.removeItem(key)
      return null
    }
    
    return data
  } catch (error) {
    console.warn('Erro ao carregar cache:', error)
    localStorage.removeItem(key)
    return null
  }
}

const clearAllCache = () => {
  try {
    Object.values(CACHE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.warn('Erro ao limpar cache:', error)
  }
}

export function CacheProvider({ children }) {
  const { user } = useAuth()
  const [cache, setCache] = useState({
    vagas: [],
    users: [],
    news: [],
    metadata: {
      lastUpdated: null,
      isLoaded: false,
      isLoading: false
    }
  })
  
  const [isInitialized, setIsInitialized] = useState(false)
  const retryCount = useRef(0)
  const loadingPromise = useRef(null)

  // Função para carregar dados do Supabase
  const loadDataFromSupabase = useCallback(async (forceRefresh = false) => {
    if (!user) return

    // Se já está carregando, retornar a promise existente
    if (loadingPromise.current && !forceRefresh) {
      return loadingPromise.current
    }

    // Verificar cache primeiro (se não for refresh forçado)
    if (!forceRefresh) {
      const cachedVagas = loadFromCache(CACHE_KEYS.VAGAS)
      const cachedUsers = loadFromCache(CACHE_KEYS.USERS)
      const cachedNews = loadFromCache(CACHE_KEYS.NEWS)
      const cachedMetadata = loadFromCache(CACHE_KEYS.METADATA)

      if (cachedVagas && cachedUsers && cachedNews && cachedMetadata) {
        setCache({
          vagas: cachedVagas,
          users: cachedUsers,
          news: cachedNews,
          metadata: {
            ...cachedMetadata,
            isLoaded: true,
            isLoading: false
          }
        })
        setIsInitialized(true)
        return
      }
    }

    // Criar nova promise de carregamento
    loadingPromise.current = (async () => {
      try {
        setCache(prev => ({
          ...prev,
          metadata: { ...prev.metadata, isLoading: true }
        }))

        // Carregar todos os dados em paralelo
        const [vagasResult, usersResult, newsResult] = await Promise.all([
          supabase.from('vagas').select('*').order('created_at', { ascending: false }),
          supabase.from('users').select('*').order('created_at', { ascending: false }),
          supabase.from('news').select('*').order('created_at', { ascending: false }).eq('is_active', true)
        ])

        // Verificar erros
        if (vagasResult.error) throw new Error(`Erro ao carregar vagas: ${vagasResult.error.message}`)
        if (usersResult.error) throw new Error(`Erro ao carregar usuários: ${usersResult.error.message}`)
        if (newsResult.error) throw new Error(`Erro ao carregar notícias: ${newsResult.error.message}`)

        const newData = {
          vagas: vagasResult.data || [],
          users: usersResult.data || [],
          news: newsResult.data || [],
          metadata: {
            lastUpdated: new Date().toISOString(),
            isLoaded: true,
            isLoading: false
          }
        }

        // Salvar no cache
        saveToCache(CACHE_KEYS.VAGAS, newData.vagas)
        saveToCache(CACHE_KEYS.USERS, newData.users)
        saveToCache(CACHE_KEYS.NEWS, newData.news)
        saveToCache(CACHE_KEYS.METADATA, newData.metadata)

        setCache(newData)
        setIsInitialized(true)
        retryCount.current = 0

      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        
        // Tentar novamente se não excedeu o limite
        if (retryCount.current < CACHE_CONFIG.MAX_RETRIES) {
          retryCount.current++
          console.log(`Tentativa ${retryCount.current} de ${CACHE_CONFIG.MAX_RETRIES}`)
          
          setTimeout(() => {
            loadDataFromSupabase(true)
          }, CACHE_CONFIG.RETRY_DELAY * retryCount.current)
        } else {
          // Falha definitiva
          setCache(prev => ({
            ...prev,
            metadata: {
              ...prev.metadata,
              isLoading: false,
              error: error.message
            }
          }))
        }
      } finally {
        loadingPromise.current = null
      }
    })()

    return loadingPromise.current
  }, [user])

  // Carregar dados quando o usuário fizer login
  useEffect(() => {
    if (user && !isInitialized) {
      loadDataFromSupabase()
    } else if (!user) {
      // Limpar cache quando usuário sair
      setCache({
        vagas: [],
        users: [],
        news: [],
        metadata: {
          lastUpdated: null,
          isLoaded: false,
          isLoading: false
        }
      })
      setIsInitialized(false)
      clearAllCache()
    }
  }, [user, isInitialized, loadDataFromSupabase])

  // Funções para manipular dados (otimizadas)
  const addVaga = useCallback((novaVaga) => {
    setCache(prev => {
      const newVagas = [novaVaga, ...prev.vagas]
      saveToCache(CACHE_KEYS.VAGAS, newVagas)
      return {
        ...prev,
        vagas: newVagas,
        metadata: {
          ...prev.metadata,
          lastUpdated: new Date().toISOString()
        }
      }
    })
  }, [])

  const updateVaga = useCallback((vagaAtualizada) => {
    setCache(prev => {
      const newVagas = prev.vagas.map(v => v.id === vagaAtualizada.id ? vagaAtualizada : v)
      saveToCache(CACHE_KEYS.VAGAS, newVagas)
      return {
        ...prev,
        vagas: newVagas,
        metadata: {
          ...prev.metadata,
          lastUpdated: new Date().toISOString()
        }
      }
    })
  }, [])

  const removeVaga = useCallback((vagaId) => {
    setCache(prev => {
      const newVagas = prev.vagas.filter(v => v.id !== vagaId)
      saveToCache(CACHE_KEYS.VAGAS, newVagas)
      return {
        ...prev,
        vagas: newVagas,
        metadata: {
          ...prev.metadata,
          lastUpdated: new Date().toISOString()
        }
      }
    })
  }, [])

  const addUser = useCallback((novoUsuario) => {
    setCache(prev => {
      const newUsers = [novoUsuario, ...prev.users]
      saveToCache(CACHE_KEYS.USERS, newUsers)
      return {
        ...prev,
        users: newUsers,
        metadata: {
          ...prev.metadata,
          lastUpdated: new Date().toISOString()
        }
      }
    })
  }, [])

  const updateUser = useCallback((usuarioAtualizado) => {
    setCache(prev => {
      const newUsers = prev.users.map(u => u.id === usuarioAtualizado.id ? usuarioAtualizado : u)
      saveToCache(CACHE_KEYS.USERS, newUsers)
      return {
        ...prev,
        users: newUsers,
        metadata: {
          ...prev.metadata,
          lastUpdated: new Date().toISOString()
        }
      }
    })
  }, [])

  const removeUser = useCallback((usuarioId) => {
    setCache(prev => {
      const newUsers = prev.users.filter(u => u.id !== usuarioId)
      saveToCache(CACHE_KEYS.USERS, newUsers)
      return {
        ...prev,
        users: newUsers,
        metadata: {
          ...prev.metadata,
          lastUpdated: new Date().toISOString()
        }
      }
    })
  }, [])

  const addNews = useCallback((novaNoticia) => {
    setCache(prev => {
      const newNews = [novaNoticia, ...prev.news]
      saveToCache(CACHE_KEYS.NEWS, newNews)
      return {
        ...prev,
        news: newNews,
        metadata: {
          ...prev.metadata,
          lastUpdated: new Date().toISOString()
        }
      }
    })
  }, [])

  const updateNews = useCallback((noticiaAtualizada) => {
    setCache(prev => {
      const newNews = prev.news.map(n => n.id === noticiaAtualizada.id ? noticiaAtualizada : n)
      saveToCache(CACHE_KEYS.NEWS, newNews)
      return {
        ...prev,
        news: newNews,
        metadata: {
          ...prev.metadata,
          lastUpdated: new Date().toISOString()
        }
      }
    })
  }, [])

  const removeNews = useCallback((noticiaId) => {
    setCache(prev => {
      const newNews = prev.news.filter(n => n.id !== noticiaId)
      saveToCache(CACHE_KEYS.NEWS, newNews)
      return {
        ...prev,
        news: newNews,
        metadata: {
          ...prev.metadata,
          lastUpdated: new Date().toISOString()
        }
      }
    })
  }, [])

  // Função para refresh forçado
  const refreshData = useCallback(() => {
    return loadDataFromSupabase(true)
  }, [loadDataFromSupabase])

  // Função para limpar cache
  const clearCache = useCallback(() => {
    clearAllCache()
    setCache({
      vagas: [],
      users: [],
      news: [],
      metadata: {
        lastUpdated: null,
        isLoaded: false,
        isLoading: false
      }
    })
    setIsInitialized(false)
  }, [])

  // Funções de consulta otimizadas
  const getVagasByCliente = useCallback((clientes) => {
    if (!clientes || clientes.length === 0) return []
    return cache.vagas.filter(vaga => clientes.includes(vaga.cliente))
  }, [cache.vagas])

  const getVagasFiltradas = useCallback((filtros) => {
    return cache.vagas.filter(vaga => {
      const matchSite = filtros.site ? vaga.site === filtros.site : true
      const matchCategoria = filtros.categoria ? vaga.categoria === filtros.categoria : true
      const matchCargo = filtros.cargo ? vaga.cargo === filtros.cargo : true
      const matchProduto = filtros.produto ? vaga.produto === filtros.produto : true
      return matchSite && matchCategoria && matchCargo && matchProduto
    })
  }, [cache.vagas])

  // Processar dados derivados
  const clientes = cache.vagas.reduce((acc, vaga) => {
    const cliente = vaga.cliente
    if (cliente) {
      acc[cliente] = (acc[cliente] || 0) + 1
    }
    return acc
  }, {})

  const clientesList = Object.entries(clientes)
    .map(([nome, totalVagas]) => ({ nome, totalVagas }))
    .sort((a, b) => a.nome.localeCompare(b.nome))

  const sites = Array.from(new Set(cache.vagas.map(v => v.site).filter(Boolean))).sort()

  const value = {
    // Dados
    vagas: cache.vagas,
    users: cache.users,
    news: cache.news,
    clientes: clientesList,
    sites,
    
    // Estados
    loading: cache.metadata.isLoading,
    isLoaded: cache.metadata.isLoaded,
    lastUpdated: cache.metadata.lastUpdated,
    error: cache.metadata.error,
    
    // Funções de manipulação
    addVaga,
    updateVaga,
    removeVaga,
    addUser,
    updateUser,
    removeUser,
    addNews,
    updateNews,
    removeNews,
    
    // Funções de consulta
    getVagasByCliente,
    getVagasFiltradas,
    
    // Controle de cache
    refreshData,
    clearCache
  }

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>
}

export function useCache() {
  const context = useContext(CacheContext)
  if (context === undefined) {
    throw new Error('useCache deve ser usado dentro de um CacheProvider')
  }
  return context
}
