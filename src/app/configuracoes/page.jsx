'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import UserManagement from '../../components/UserManagement'
import ExportExcel from '../../components/ExportExcel'
import ConfigErrorBoundary from '../../components/ConfigErrorBoundary'
import { ArrowDownTrayIcon, Cog6ToothIcon, ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline'
import { useVagasCache } from '../../hooks/useSupabaseCache'
import { useCacheManager } from '../../hooks/useCache'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('usuarios')
  const { data: allVagas = [], loading: vagasLoading, error: vagasError } = useVagasCache()
  const { clear: clearAppCache } = useCacheManager()

  // Se houver erro ao carregar vagas, mostrar mensagem
  if (vagasError) {
    console.error('Erro ao carregar vagas:', vagasError)
  }

  const handleClearCache = () => {
    clearAppCache()
    alert('Cache da aplicação limpo com sucesso!')
  }

  // Preparar dados para exportação de todas as vagas
  const vagasParaExport = (allVagas || []).map(vaga => ({
    id: vaga.id,
    cliente: vaga.cliente,
    site: vaga.site,
    categoria: vaga.categoria,
    cargo: vaga.cargo,
    produto: vaga.produto,
    descricao: vaga.descricao_vaga || '',
    responsabilidades: vaga.responsabilidades_atribuicoes || '',
    requisitos: vaga.requisitos_qualificacoes || '',
    beneficios: vaga.beneficios || '',
    salario: vaga.salario || '',
    localizacao: vaga.local_trabalho || '',
    horario: vaga.horario_trabalho || '',
    jornada: vaga.jornada_trabalho || '',
    etapas: vaga.etapas_processo || '',
    created_at: vaga.created_at
  }));

  // Se estiver carregando, mostrar loading
  if (vagasLoading) {
    return (
      <DashboardLayout requiredRole="ADMIN">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando configurações...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <ConfigErrorBoundary>
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
                {/* Botão de backup usando ExportExcel */}
                <ExportExcel
                  vagas={vagasParaExport}
                  filename="backup-vagas-completo"
                  buttonText="Backup Completo (Excel)"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                />
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
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Gerenciar Usuários
                  </button>
                  <button
                    onClick={() => setActiveTab('backup')}
                    className={`${
                      activeTab === 'backup'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                  >
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Backup do Sistema
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
                <div className="py-6">
                  <UserManagement />
                </div>
              )}

              {activeTab === 'backup' && (
                <div className="space-y-6 py-6">
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        💾 Backup Completo do Sistema
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Faça backup de todos os dados do sistema incluindo vagas e configurações.
                      </p>
                    </div>
                    
                    <div className="px-6 py-4 space-y-6">
                      {/* Backup de Vagas */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-md font-medium text-gray-900 mb-2">
                          📋 Backup das Vagas
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Exportar todas as vagas cadastradas no sistema ({(allVagas || []).length} registros).
                        </p>
                        <ExportExcel
                          vagas={vagasParaExport}
                          filename={`backup-vagas-${new Date().toISOString().split('T')[0]}`}
                          buttonText="Fazer Backup das Vagas"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        />
                      </div>

                      {/* Backup Completo */}
                      <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                        <h4 className="text-md font-medium text-green-900 mb-2">
                          🚀 Backup Completo
                        </h4>
                        <p className="text-sm text-green-700 mb-4">
                          Fazer backup completo do sistema com todos os dados disponíveis.
                        </p>
                        <ExportExcel
                          vagas={vagasParaExport}
                          filename={`backup-completo-${new Date().toISOString().split('T')[0]}`}
                          buttonText="Fazer Backup Completo"
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Histórico de Backups */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        📊 Histórico de Backups
                      </h3>
                      <p className="mt-2 text-sm text-gray-600">
                        Visualizar histórico de backups realizados (funcionalidade em desenvolvimento).
                      </p>
                    </div>
                    <div className="px-6 py-4">
                      <div className="text-center py-8 text-gray-500">
                        <p>Histórico de backups será implementado em breve.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sistema' && (
                <div className="space-y-6 py-6">
                  {/* Informações do Sistema */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      📊 Informações do Sistema
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Total de Vagas</p>
                            <p className="text-2xl font-bold text-blue-600">{(allVagas || []).length}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-900">Usuários Ativos</p>
                            <p className="text-2xl font-bold text-green-600">-</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-purple-900">Uptime</p>
                            <p className="text-2xl font-bold text-purple-600">99.9%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gerenciamento de Cache */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      🧹 Gerenciamento de Cache
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Limpa o cache de dados da aplicação para garantir que as informações mais recentes sejam carregadas.
                    </p>
                    <button
                      onClick={handleClearCache}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                    >
                      <ArchiveBoxXMarkIcon className="h-4 w-4 mr-2" />
                      Limpar Cache da Aplicação
                    </button>
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
                      <p>• Notificações do sistema: Em desenvolvimento</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </DashboardLayout>
    </ConfigErrorBoundary>
  )
}