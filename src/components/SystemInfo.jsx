'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUsersCache, useVagasCache } from '../hooks/useSupabaseCache'

export default function SystemInfo() {
  const { profile } = useAuth()
  const { data: users = [] } = useUsersCache()
  const { data: vagas = [] } = useVagasCache()
  const [systemInfo, setSystemInfo] = useState({
    uptime: '',
    memory: '',
    version: '1.0.0'
  })

  useEffect(() => {
    // Simular informações do sistema
    const startTime = Date.now()
    const updateUptime = () => {
      const uptime = Date.now() - startTime
      const hours = Math.floor(uptime / (1000 * 60 * 60))
      const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60))
      setSystemInfo(prev => ({
        ...prev,
        uptime: `${hours}h ${minutes}m`,
        memory: `${Math.round((performance.memory?.usedJSHeapSize || 0) / 1024 / 1024)}MB`
      }))
    }

    updateUptime()
    const interval = setInterval(updateUptime, 60000) // Atualizar a cada minuto

    return () => clearInterval(interval)
  }, [])

  const adminUsers = users.filter(user => user.role === 'ADMIN').length
  const rhUsers = users.filter(user => user.role === 'RH').length

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Estatísticas do Sistema */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          📊 Estatísticas do Sistema
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total de vagas:</span>
            <span className="text-sm font-medium text-gray-900">{vagas.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Usuários ADMIN:</span>
            <span className="text-sm font-medium text-purple-600">{adminUsers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Usuários RH:</span>
            <span className="text-sm font-medium text-green-600">{rhUsers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Total de usuários:</span>
            <span className="text-sm font-medium text-gray-900">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Informações Técnicas */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          🔧 Informações Técnicas
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Versão do sistema:</span>
            <span className="text-sm font-medium text-gray-900">{systemInfo.version}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Uptime:</span>
            <span className="text-sm font-medium text-gray-900">{systemInfo.uptime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Memória em uso:</span>
            <span className="text-sm font-medium text-gray-900">{systemInfo.memory}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Ambiente:</span>
            <span className="text-sm font-medium text-blue-600">
              {process.env.NODE_ENV === 'production' ? 'Produção' : 'Desenvolvimento'}
            </span>
          </div>
        </div>
      </div>

      {/* Status do Usuário Atual */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          👤 Usuário Atual
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Nome:</span>
            <span className="text-sm font-medium text-gray-900">{profile?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="text-sm font-medium text-gray-900">{profile?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Função:</span>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              profile?.role === 'ADMIN' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {profile?.role || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Logs de Atividade */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          📝 Logs de Atividade
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>Sistema de logs será implementado em breve.</p>
          <p className="text-sm mt-2">
            Aqui serão exibidos os logs de atividade dos usuários.
          </p>
        </div>
      </div>
    </div>
  )
}
