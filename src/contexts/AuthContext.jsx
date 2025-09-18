'use client'

import { createContext, useContext, useEffect, useState  } from 'react'
import { supabase  } from '../lib/supabase'
import { useCache } from '../hooks/useCache'
import { CACHE_KEYS } from '../hooks/useSupabaseCache'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { set: setCache, get: getCache, has: hasCache } = useCacheManager()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await loadUserProfile(session.user.email)
      }
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.email)
        } else {
          setUser(null)
          setProfile(null)
          // Clear user-related cache on sign out
          setCache(CACHE_KEYS.USERS, null, 0); // Invalidate user cache
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (email) => {
    try {
      // Verificar se as variáveis de ambiente estão configuradas
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Variáveis de ambiente do Supabase não configuradas')
        return
      }

      // Tentar carregar do cache primeiro
      const cachedProfile = getCache(`${CACHE_KEYS.USERS}-${email}`);
      if (cachedProfile) {
        setProfile(cachedProfile);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.error('Erro ao carregar perfil do usuário:', error)
        // Se o usuário não existe na tabela users, o trigger handle_new_user deveria ter criado.
        // Se ainda assim não existir, pode ser um problema de configuração do trigger ou RLS.
        // Não vamos tentar criar aqui no cliente para evitar redundância com o trigger.
        return
      }

      if (data) {
        setProfile(data)
        setCache(`${CACHE_KEYS.USERS}-${email}`, data); // Cache the profile
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error)
    }
  }

  const signIn = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Erro interno do servidor' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signUp = async (email, password, name, role) => {
    try {
      // Primeiro, criar o usuário na tabela auth
      // O trigger 'on_auth_user_created' no Supabase cuidará de inserir o perfil em public.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name, // Passar nome para o meta_data do usuário auth
            role: role  // Passar role para o meta_data do usuário auth
          }
        }
      })

      if (authError) {
        return { error: authError.message }
      }

      // Não é necessário inserir em public.users aqui, o trigger já faz isso.
      // Apenas garantir que o usuário auth foi criado.
      if (authData.user) {
        // O perfil será carregado automaticamente pelo onAuthStateChange
        return {}
      }

      return { error: 'Erro desconhecido ao criar usuário.' }
    } catch (error) {
      return { error: 'Erro interno do servidor' }
    }
  }

  const updateUserProfile = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data); // Update local state
      setCache(`${CACHE_KEYS.USERS}-${data.email}`, data); // Update cache
      return { data };
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { error: error.message };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signOut,
    signUp,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}