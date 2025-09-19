'use client'

import { useAuth } from '../contexts/AuthContext'
import { useCache } from '../contexts/CacheContext'
import { useNavigation } from '../hooks/useNavigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }) {
  const { user, loading, isRedirecting } = useAuth()
  const { loading: dataLoading, isLoaded } = useCache()
  const { navigate } = useNavigation()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Mostrar loading enquanto está autenticando ou carregando dados
  if (loading || isRedirecting || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isRedirecting ? 'Redirecionando...' : 'Carregando...'}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

export function PublicRoute({ children }) {
  const { user, loading, isRedirecting } = useAuth()
  const { navigate } = useNavigation()

  useEffect(() => {
    if (!loading && !isRedirecting && user) {
      navigate('/dashboard')
    }
  }, [user, loading, isRedirecting, navigate])

  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isRedirecting ? 'Redirecionando...' : 'Carregando...'}
          </p>
        </div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return <>{children}</>
}