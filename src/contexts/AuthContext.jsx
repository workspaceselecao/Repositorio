'use client'

import { createContext, useContext, useEffect, useState  } from 'react'
import { supabase  } from '../lib/supabase'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

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

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.error('Erro ao carregar perfil do usuário:', error)
        // Se o usuário não existe na tabela users, criar um perfil básico
        if (error.code === 'PGRST116') {
          console.log('Usuário não encontrado na tabela users, criando perfil básico...')
          try {
            const { data: newProfile, error: insertError } = await supabase
              .from('users')
              .insert([{
                email,
                name: email.split('@')[0], // Usar parte do email como nome
                role: 'RH' // Role padrão
              }])
              .select()
              .single()

            if (insertError) {
              console.error('Erro ao criar perfil do usuário:', insertError)
            } else if (newProfile) {
              setProfile(newProfile)
            }
          } catch (insertErr) {
            console.error('Erro ao criar perfil do usuário:', insertErr)
          }
        }
        return
      }

      if (data) {
        setProfile(data)
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
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        return { error: authError.message }
      }

      // Depois, criar o perfil na tabela users
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              email,
              name,
              role,
            }
          ])

        if (profileError) {
          return { error: profileError.message }
        }
      }

      return {}
    } catch (error) {
      return { error: 'Erro interno do servidor' }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signOut,
    signUp,
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
