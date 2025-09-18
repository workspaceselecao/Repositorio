'use client'

import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Evitar múltiplos redirecionamentos
    if (hasRedirected.current) return

    if (!loading) {
      if (!user) {
        hasRedirected.current = true
        router.push(redirectTo)
        return
      }

      if (requiredRole && profile?.role !== requiredRole) {
        hasRedirected.current = true
        router.push('/dashboard')
        return
      }
    }
  }, [user, profile, loading, requiredRole, redirectTo, router])

  // Reset do flag quando o usuário muda
  useEffect(() => {
    hasRedirected.current = false
  }, [user])

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
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Evitar múltiplos redirecionamentos
    if (hasRedirected.current) return

    if (!loading && user) {
      hasRedirected.current = true
      router.push(redirectTo)
    }
  }, [user, loading, redirectTo, router])

  // Reset do flag quando o usuário muda
  useEffect(() => {
    hasRedirected.current = false
  }, [user])

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