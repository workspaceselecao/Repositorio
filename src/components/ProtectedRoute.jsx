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
    if (!loading) {
      if (!user) {
        router.push(redirectTo)
        return
      }

      if (requiredRole && profile?.role !== requiredRole) {
        router.push('/dashboard')
        return
      }
    }
  }, [user, profile, loading, requiredRole, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && profile?.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}



export function PublicRoute({ 
  children, 
  redirectTo = '/dashboard' 
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo)
    }
  }, [user, loading, redirectTo, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return <>{children}</>
}