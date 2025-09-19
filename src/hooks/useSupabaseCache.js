import { useCallback  } from 'react'
import { supabase  } from '../lib/supabase'
import { useCache  } from './useCache'
import { useAuth } from '../contexts/AuthContext' // Importar useAuth

// Cache keys constants
export const CACHE_KEYS = {
  VAGAS: 'vagas',
  CLIENTES: 'clientes',
  SITES: 'sites',
  USERS: 'users',
  VAGAS_BY_CLIENTE: (cliente) => `vagas-cliente-${cliente}`,
  VAGAS_FILTERED: (filters) => `vagas-filtered-${filters}`
}

export function useVagasCache(options = {}) {
  const { user } = useAuth(); // Obter usuário do AuthContext
  const fetcher = useCallback(async () => {
    if (!user) return []; // Não buscar se não estiver autenticado
    const { data, error } = await supabase
      .from('vagas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }, [user]) // Adicionar user às dependências

  return useCache(CACHE_KEYS.VAGAS, fetcher, {
    ttl: 2 * 60 * 1000, // 2 minutes
    ...options
  })
}

export function useClientesCache(options = {}) {
  const { user } = useAuth(); // Obter usuário do AuthContext
  const fetcher = useCallback(async () => {
    if (!user) return []; // Não buscar se não estiver autenticado
    const { data, error } = await supabase
      .from('vagas')
      .select('cliente')
      .order('cliente')

    if (error) throw error

    // Process data to get unique clients with counts
    const clientesMap = (data || []).reduce((acc, vaga) => {
      const cliente = vaga.cliente
      acc[cliente] = (acc[cliente] || 0) + 1
      return acc
    }, {})

    return Object.entries(clientesMap)
      .map(([nome, totalVagas]) => ({ nome, totalVagas }))
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }, [user]) // Adicionar user às dependências

  return useCache(CACHE_KEYS.CLIENTES, fetcher, {
    ttl: 5 * 60 * 1000, // 5 minutes
    ...options
  })
}

export function useSitesCache(options = {}) {
  const { user } = useAuth(); // Obter usuário do AuthContext
  const fetcher = useCallback(async () => {
    if (!user) return []; // Não buscar se não estiver autenticado
    const { data, error } = await supabase
      .from('vagas')
      .select('site')
      .order('site')

    if (error) throw error

    // Get unique sites
    const sites = Array.from(new Set((data || []).map(v => v.site))).sort()
    return sites
  }, [user]) // Adicionar user às dependências

  return useCache(CACHE_KEYS.SITES, fetcher, {
    ttl: 5 * 60 * 1000, // 5 minutes
    ...options
  })
}

export function useUsersCache(options = {}) {
  const { user } = useAuth(); // Obter usuário do AuthContext
  const fetcher = useCallback(async () => {
    if (!user) return []; // Não buscar se não estiver autenticado
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }, [user]) // Adicionar user às dependências

  return useCache(CACHE_KEYS.USERS, fetcher, {
    ttl: 10 * 60 * 1000, // 10 minutes
    ...options
  })
}

export function useVagasByClienteCache(
  clientes,
  options = {}
) {
  const { user } = useAuth(); // Obter usuário do AuthContext
  const fetcher = useCallback(async () => {
    if (!user || clientes.length === 0) return []; // Não buscar se não estiver autenticado ou sem clientes
    
    const { data, error } = await supabase
      .from('vagas')
      .select('*')
      .in('cliente', clientes)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }, [clientes, user]) // Adicionar user às dependências
  
  const cacheKey = CACHE_KEYS.VAGAS_BY_CLIENTE(clientes.sort().join(','))
  
  return useCache(cacheKey, fetcher, {
    ttl: 2 * 60 * 1000, // 2 minutes
    ...options
  })
}