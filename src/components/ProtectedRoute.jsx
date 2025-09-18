'use client'

import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProtectedRoute({ children }) {
  const { user, loading, isRedirecting } = useAuth()
  const { loading: dataLoading } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

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
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isRedirecting && user) {
      router.push('/dashboard')
    }
  }, [user, loading, isRedirecting, router])

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