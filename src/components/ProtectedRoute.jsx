'use client'

import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { useNavigation } from '../hooks/useNavigation'
import { PracticalLoading } from './PracticalLoading'
import { useEffect } from 'react'

export function ProtectedRoute({ children }) {
  const { user, loading, isRedirecting } = useAuth()
  const { loading: dataLoading } = useData()
  const { navigate } = useNavigation()

  useEffect(() => {
    if (!loading && !isRedirecting && !user) {
      navigate('/login')
    }
  }, [user, loading, isRedirecting, navigate])

  // Se está autenticando ou redirecionando, mostrar loading
  if (loading || isRedirecting) {
    return (
      <PracticalLoading 
        loading={true}
        minLoadingTime={500}
        maxLoadingTime={5000}
        showProgress={isRedirecting}
      >
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {isRedirecting ? 'Redirecionando...' : 'Carregando...'}
            </p>
          </div>
        </div>
      </PracticalLoading>
    )
  }

  if (!user) {
    return null
  }

  // Usar PracticalLoading para dados com timeout
  return (
    <PracticalLoading 
      loading={dataLoading}
      minLoadingTime={300}
      maxLoadingTime={8000}
      showProgress={true}
    >
      {children}
    </PracticalLoading>
  )
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