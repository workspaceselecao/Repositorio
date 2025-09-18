'use client'

import { useState  } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import NovoUsuarioForm from '../../components/NovoUsuarioForm'
import ListaUsuarios from '../../components/ListaUsuarios'
import { PlusIcon, UserGroupIcon, ArrowDownTrayIcon, Cog6ToothIcon  } from '@heroicons/react/24/outline'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<'usuarios' | 'backup' | 'sistema'>('usuarios')
  const [showNewUserForm, setShowNewUserForm] = useState(false)

  const handleUserCreated = () => {
    setShowNewUserForm(false)
    // Forçar recarregamento da lista de usuários
    window.location.reload()
  }

  const handleBackup = () => {
    alert('Funcionalidade de backup em desenvolvimento')
  }

  return (
    <DashboardLayout requiredRole="ADMIN">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Configurações do Sistema
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Área restrita para administradores
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleBackup}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Backup
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('usuarios')}
                  className={`${
                    activeTab === 'usuarios'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  Gerenciar Usuários
                </button>
                <button
                  onClick={() => setActiveTab('sistema')}
                  className={`${
                    activeTab === 'sistema'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Cog6ToothIcon className="h-5 w-5 mr-2" />
                  Configurações Gerais
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'usuarios' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Gerenciamento de Usuários
                    </h3>
                    <button
                      onClick={() => setShowNewUserForm(!showNewUserForm)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Novo Usuário
                    </button>
                  </div>
                  
                  {showNewUserForm && (
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h4 className="text-md font-medium text-gray-900 mb-4">
                        Cadastrar Novo Usuário
                      </h4>
                      <NovoUsuarioForm onSuccess={handleUserCreated} />
                    </div>
                  )}
                  
                  <div className="px-6 py-4">
                    <ListaUsuarios />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sistema' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                
                {/* Backup do Sistema */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    💾 Backup do Sistema
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Fazer backup e restaurar dados do sistema.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>• Export completo das vagas</p>
                    <p>• Backup das configurações</p>
                    <p>• Histórico de backups realizados</p>
                  </div>
                  <button
                    onClick={handleBackup}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Fazer Backup
                  </button>
                </div>

                {/* Estatísticas do Sistema */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    📊 Estatísticas do Sistema
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Visualizar métricas e estatísticas do uso.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Total de vagas cadastradas: Em breve</p>
                    <p>• Usuários ativos no sistema: Em breve</p>
                    <p>• Relatórios de utilização: Em breve</p>
                  </div>
                </div>

                {/* Configurações Gerais */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    ⚙️ Configurações Gerais
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Configurações globais do sistema.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Configurações de email: Em desenvolvimento</p>
                    <p>• Parâmetros do sistema: Em desenvolvimento</p>
                    <p>• Logs de atividade: Em desenvolvimento</p>
                  </div>
                </div>

                {/* Logs do Sistema */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    📋 Logs do Sistema
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Visualizar logs e atividades do sistema.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Logs de autenticação: Em desenvolvimento</p>
                    <p>• Logs de operações: Em desenvolvimento</p>
                    <p>• Logs de erro: Em desenvolvimento</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}