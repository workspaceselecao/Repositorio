'use client'

import { useAuth  } from '../contexts/AuthContext'
import { useRouter  } from 'next/navigation'
import { useEffect  } from 'react'

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('ProtectedRoute - Effect triggered:', { user: !!user, profile: !!profile, loading, requiredRole, redirectTo });

    if (!loading) {
      if (!user) {
        console.log('ProtectedRoute: Nenhum usuário autenticado, redirecionando para login.');
        router.push(redirectTo);
        return;
      }

      // Se o usuário existe, mas o perfil ainda não foi carregado, aguarde.
      // Isso pode acontecer se loadUserProfile levar um momento.
      if (!profile) {
        console.log('ProtectedRoute: Usuário autenticado, mas perfil ainda não carregado. Aguardando...');
        return; 
      }

      if (requiredRole && profile?.role !== requiredRole) {
        console.log(`ProtectedRoute: A função do usuário (${profile?.role}) não corresponde à função exigida (${requiredRole}), redirecionando para o dashboard.`);
        router.push('/dashboard');
        return;
      }
      console.log('ProtectedRoute: Usuário autenticado e autorizado.');
    } else {
      console.log('ProtectedRoute: Ainda carregando o estado de autenticação. Aguardando...');
    }
  }, [user, profile, loading, requiredRole, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não houver usuário ou o perfil não corresponder à função exigida, não renderize o conteúdo protegido.
  // O useEffect já deve ter tratado o redirecionamento.
  if (!user || (requiredRole && profile?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}

export function PublicRoute({ 
  children, 
  redirectTo = '/dashboard' 
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('PublicRoute - Effect triggered:', { user: !!user, loading, redirectTo });
    if (!loading && user) {
      console.log('PublicRoute: Usuário autenticado, redirecionando para o dashboard.');
      router.push(redirectTo);
    } else if (!loading && !user) {
      console.log('PublicRoute: Nenhum usuário, permanecendo na página pública.');
    } else {
      console.log('PublicRoute: Ainda carregando o estado de autenticação. Aguardando...');
    }
  }, [user, loading, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se houver usuário autenticado, não renderize o conteúdo público.
  // O useEffect já deve ter tratado o redirecionamento.
  if (user) {
    return null;
  }

  return <>{children}</>;
}