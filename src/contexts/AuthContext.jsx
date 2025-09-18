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

      const cachedProfile = getCache(`${CACHE_KEYS.USERS}-${userAuth.email}`);
      if (cachedProfile) {
        setProfile(cachedProfile);
        return;
      }

      // Criar perfil básico a partir dos dados do Supabase Auth
      // Isso evita problemas com RLS e tabela users
      console.log('Criando perfil básico a partir do Supabase Auth...')
      const newProfile = {
        id: userAuth.id,
        email: userAuth.email,
        name: userAuth.user_metadata?.name || userAuth.email.split('@')[0],
        role: userAuth.user_metadata?.role || 'RH',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setProfile(newProfile)
      setCache(`${CACHE_KEYS.USERS}-${userAuth.email}`, newProfile)
      
      // Tentar inserir na tabela users em background (sem bloquear o login)
      // Comentado temporariamente devido a problemas de RLS
      /*
      try {
        const { data, error } = await supabase
          .from('users')
          .insert(newProfile)
          .select()
          .single()
        
        if (error && !error.message.includes('duplicate key')) {
          console.log('Aviso: Não foi possível inserir usuário na tabela users:', error.message)
        } else if (data) {
          console.log('Usuário inserido na tabela users com sucesso')
        }
      } catch (dbError) {
        console.log('Aviso: Erro ao inserir na tabela users:', dbError.message)
      }
      */
      
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

  const updateUserProfile = async (email, updates) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('email', email)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      setCache(`${CACHE_KEYS.USERS}-${email}`, data);
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