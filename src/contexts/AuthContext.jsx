'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useCacheManager } from '../hooks/useCache'
import { CACHE_KEYS } from '../hooks/useSupabaseCache'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { set: setCache, get: getCache } = useCacheManager()

  const loadUserProfile = useCallback(async (userAuth) => {
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('Variáveis de ambiente do Supabase não configuradas')
        return
      }

      const cachedProfile = getCache(`${CACHE_KEYS.USERS}-${userAuth.id}`);
      if (cachedProfile) {
        setProfile(cachedProfile);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userAuth.id)
        .single()

      if (error) {
        console.error('Erro ao carregar perfil do usuário:', error)
        return
      }

      if (data) {
        setProfile(data)
        setCache(`${CACHE_KEYS.USERS}-${userAuth.id}`, data);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error)
    }
  }, [getCache, setCache]);

  useEffect(() => {
    const getInitialSession = async () => {
      setLoading(true); // Garante que loading seja true no início
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Erro ao obter sessão inicial:", sessionError);
      }
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false); // Garante que loading seja false após a verificação inicial
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Evento de mudança de estado de autenticação:', event, 'Sessão:', session);
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setCache(CACHE_KEYS.USERS, null, 0); // Invalida o cache do usuário ao deslogar
        }
        setLoading(false); // Garante que loading seja false após qualquer mudança de estado
      }
    );

    return () => subscription.unsubscribe();
  }, [loadUserProfile, setCache]);

  const signIn = async (email, password) => {
    try {
      setLoading(true); // Define loading como true durante a tentativa de login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false); // Reseta loading em caso de erro
        return { error: error.message };
      }

      // Se o login for bem-sucedido, atualiza explicitamente o usuário e carrega o perfil
      // O listener onAuthStateChange também deve capturar isso, mas isso garante uma atualização imediata
      if (data.user) {
        setUser(data.user);
        await loadUserProfile(data.user);
      }
      
      setLoading(false); // Reseta loading após login bem-sucedido
      return {};
    } catch (error) {
      setLoading(false); // Reseta loading em caso de qualquer erro interno
      return { error: 'Erro interno do servidor' };
    }
  };

  const signOut = async () => {
    setLoading(true); // Define loading como true durante o logout
    await supabase.auth.signOut();
    setLoading(false); // Reseta loading após o logout
  };

  const signUp = async (email, password, name, role) => {
    try {
      setLoading(true); // Define loading como true durante a tentativa de cadastro
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: role
          }
        }
      });

      if (authError) {
        setLoading(false); // Reseta loading em caso de erro
        return { error: authError.message };
      }

      if (authData.user) {
        setUser(authData.user);
        await loadUserProfile(authData.user);
      }
      
      setLoading(false); // Reseta loading após cadastro bem-sucedido
      return {};
    } catch (error) {
      setLoading(false); // Reseta loading em caso de qualquer erro interno
      return { error: 'Erro interno do servidor' };
    }
  };

  const updateUserProfile = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      setCache(`${CACHE_KEYS.USERS}-${data.id}`, data);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}