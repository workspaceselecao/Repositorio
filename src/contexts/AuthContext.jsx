'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Função para carregar o perfil do usuário
  const loadUserProfile = async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Erro ao carregar perfil do usuário:', error)
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error)
      setProfile(null)
    }
  }

  useEffect(() => {
    // Verificar sessão inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user?.id) {
        await loadUserProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user?.id) {
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    setIsRedirecting(true)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (data?.user) {
      await loadUserProfile(data.user.id)
      // Aguardar um pouco para garantir que os dados sejam carregados
      setTimeout(() => {
        setIsRedirecting(false)
      }, 1000)
    } else {
      setIsRedirecting(false)
    }
    
    return { data, error }
  }

  const signUp = async (email, password, name, role = 'RH') => {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        return { data: null, error: authError }
      }

      if (authData?.user) {
        // Criar perfil do usuário na tabela users
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email,
              name,
              role
            }
          ])

        if (profileError) {
          console.error('Erro ao criar perfil do usuário:', profileError)
          return { data: null, error: profileError }
        }

        return { data: authData, error: null }
      }

      return { data: authData, error: null }
    } catch (error) {
      console.error('Erro no signUp:', error)
      return { data: null, error }
    }
  }


  const updateUserProfile = async (userId, updates) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)

      if (error) {
        return { data: null, error }
      }

      // Atualizar o perfil local se for o usuário atual
      if (user?.id === userId) {
        setProfile(prev => ({ ...prev, ...updates }))
      }

      return { data, error: null }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  const value = {
    user,
    profile,
    loading,
    isRedirecting,
    signIn,
    signUp,
    signOut,
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