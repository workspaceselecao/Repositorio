'use client'

import { useAuth } from '../contexts/AuthContext'
import Sidebar from './Sidebar'
import InstallPWA from './InstallPWA'
import OfflineIndicator from './OfflineIndicator'
import { useEffect } from 'react'

export default function DashboardLayout({ children, requiredRole = null }) {
  const { user, profile } = useAuth()

  // Verificar se o usuário tem a permissão necessária
  const hasPermission = () => {
    if (!requiredRole) return true
    if (!profile) return false
    return profile.role === requiredRole
  }

  // Verificar se o usuário está logado
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você precisa estar logado para acessar esta página.</p>
        </div>
      </div>
    )
  }

  // Verificar permissões específicas
  if (requiredRole && !hasPermission()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-2">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-gray-500">
            Permissão necessária: {requiredRole}
          </p>
          <p className="text-gray-500">
            Seu perfil: {profile?.role || 'Não definido'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <InstallPWA />
      <OfflineIndicator />
    </div>
  )
}