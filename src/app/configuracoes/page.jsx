'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/DashboardLayout'
import UserManagement from '../../components/UserManagement'
import ExportExcel from '../../components/ExportExcel'
import ConfigErrorBoundary from '../../components/ConfigErrorBoundary'
import NewsSection from '../../components/NewsSection'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { 
  ArrowDownTrayIcon, 
  Cog6ToothIcon, 
  ArchiveBoxXMarkIcon,
  UsersIcon,
  ServerIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline'
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }

  const handleClearCache = () => {
    clearAppCache()
    toast.success('Cache da aplicação limpo com sucesso!')
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    toast.info(`Aba ${tab} selecionada`)
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
        <motion.div 
          className="min-h-screen flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div 
              className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p 
              className="mt-4 text-muted-foreground text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Carregando configurações...
            </motion.p>
          </div>
        </motion.div>
      </DashboardLayout>
    )
  }

  const tabs = [
    { id: 'usuarios', label: 'Usuários', icon: UsersIcon, color: 'chart-1' },
    { id: 'noticias', label: 'Notícias', icon: NewspaperIcon, color: 'chart-2' },
    { id: 'backup', label: 'Backup', icon: ArrowDownTrayIcon, color: 'chart-3' },
    { id: 'sistema', label: 'Sistema', icon: Cog6ToothIcon, color: 'chart-4' }
  ]

  return (
    <ConfigErrorBoundary>
      <DashboardLayout requiredRole="ADMIN">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background"
        >
          {/* Header */}
          <motion.header 
            variants={itemVariants}
            className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-10"
          >
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <motion.h1 
                    className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Configurações do Sistema
                  </motion.h1>
                  <motion.p 
                    className="mt-2 text-muted-foreground text-lg flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <ShieldCheckIcon className="h-5 w-5 text-chart-1" />
                    <span>Área restrita para administradores</span>
                  </motion.p>
                </div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <ExportExcel
                      vagas={vagasParaExport}
                      filename="backup-vagas-completo"
                      buttonText="Backup Completo"
                      className="bg-gradient-to-r from-chart-2 to-chart-3 hover:from-chart-2/90 hover:to-chart-3/90"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              <motion.div 
                variants={containerVariants}
                className="space-y-8"
              >
                {/* Stats Cards */}
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                  {[
                    { 
                      title: 'Total de Vagas', 
                      value: (allVagas || []).length, 
                      icon: DocumentTextIcon, 
                      color: 'chart-1',
                      bgColor: 'bg-chart-1/10'
                    },
                    { 
                      title: 'Usuários Ativos', 
                      value: '12', 
                      icon: UsersIcon, 
                      color: 'chart-2',
                      bgColor: 'bg-chart-2/10'
                    },
                    { 
                      title: 'Uptime', 
                      value: '99.9%', 
                      icon: ServerIcon, 
                      color: 'chart-3',
                      bgColor: 'bg-chart-3/10'
                    },
                    { 
                      title: 'Backups', 
                      value: '24', 
                      icon: ClockIcon, 
                      color: 'chart-4',
                      bgColor: 'bg-chart-4/10'
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      variants={cardVariants}
                      whileHover="hover"
                      className="group"
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {stat.title}
                              </p>
                              <motion.p 
                                className="text-3xl font-bold text-foreground mt-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                              >
                                {stat.value}
                              </motion.p>
                            </div>
                            <motion.div 
                              className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}
                              whileHover={{ rotate: 5 }}
                            >
                              <stat.icon className={`h-6 w-6 text-${stat.color}`} />
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Tabs Navigation */}
                <motion.div variants={itemVariants}>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="border-b border-border">
                        <nav className="flex space-x-8 px-6">
                          {tabs.map((tab) => (
                            <motion.button
                              key={tab.id}
                              onClick={() => handleTabChange(tab.id)}
                              className={`${
                                activeTab === tab.id
                                  ? `border-${tab.color} text-${tab.color}`
                                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-200`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <tab.icon className="h-5 w-5 mr-2" />
                              {tab.label}
                            </motion.button>
                          ))}
                        </nav>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Tab Content */}
                <motion.div variants={itemVariants}>
                  {activeTab === 'usuarios' && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <UsersIcon className="h-5 w-5 text-chart-1" />
                          <span>Gerenciar Usuários</span>
                        </CardTitle>
                        <CardDescription>
                          Controle de acesso e permissões do sistema
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <UserManagement />
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'noticias' && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <NewspaperIcon className="h-5 w-5 text-chart-2" />
                          <span>Gerenciar Notícias do Dashboard</span>
                        </CardTitle>
                        <CardDescription>
                          Configure as notícias que aparecem na página inicial do sistema
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <NewsSection isAdminView={true} />
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'backup' && (
                    <motion.div variants={containerVariants} className="space-y-6">
                      {/* Backup de Vagas */}
                      <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <DocumentTextIcon className="h-5 w-5 text-chart-2" />
                              <span>Backup das Vagas</span>
                            </CardTitle>
                            <CardDescription>
                              Exportar todas as vagas cadastradas no sistema
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                              <div>
                                <p className="font-medium text-foreground">
                                  {allVagas.length} registros disponíveis
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                              <Badge variant="secondary" className="bg-chart-2/10 text-chart-2">
                                Atualizado
                              </Badge>
                            </div>
                            <div className="flex gap-3">
                              <ExportExcel
                                vagas={vagasParaExport}
                                filename={`backup-vagas-${new Date().toISOString().split('T')[0]}`}
                                buttonText="Fazer Backup das Vagas"
                                className="bg-gradient-to-r from-chart-2 to-chart-3 hover:from-chart-2/90 hover:to-chart-3/90"
                              />
                              <Button variant="outline" className="border-chart-2 text-chart-2 hover:bg-chart-2 hover:text-white">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                Agendar Backup
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Backup Completo */}
                      <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg border-chart-3/20 bg-chart-3/5">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-chart-3">
                              <ServerIcon className="h-5 w-5" />
                              <span>Backup Completo do Sistema</span>
                            </CardTitle>
                            <CardDescription>
                              Backup completo incluindo vagas, usuários e configurações
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                                  <DocumentTextIcon className="h-5 w-5 text-chart-1" />
                                  <div>
                                    <p className="font-medium text-foreground">Vagas</p>
                                    <p className="text-sm text-muted-foreground">{allVagas.length} registros</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                                  <UsersIcon className="h-5 w-5 text-chart-2" />
                                  <div>
                                    <p className="font-medium text-foreground">Usuários</p>
                                    <p className="text-sm text-muted-foreground">12 registros</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-background/50 rounded-lg">
                                  <Cog6ToothIcon className="h-5 w-5 text-chart-3" />
                                  <div>
                                    <p className="font-medium text-foreground">Configurações</p>
                                    <p className="text-sm text-muted-foreground">Sistema</p>
                                  </div>
                                </div>
                              </div>
                              <ExportExcel
                                vagas={vagasParaExport}
                                filename={`backup-completo-${new Date().toISOString().split('T')[0]}`}
                                buttonText="Fazer Backup Completo"
                                className="bg-gradient-to-r from-chart-3 to-chart-4 hover:from-chart-3/90 hover:to-chart-4/90 w-full"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}

                  {activeTab === 'sistema' && (
                    <motion.div variants={containerVariants} className="space-y-6">
                      {/* Gerenciamento de Cache */}
                      <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <ArchiveBoxXMarkIcon className="h-5 w-5 text-chart-1" />
                              <span>Gerenciamento de Cache</span>
                            </CardTitle>
                            <CardDescription>
                              Limpe o cache para garantir dados atualizados
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">
                                  O cache armazena dados temporariamente para melhorar a performance. 
                                  Limpe quando necessário para garantir dados atualizados.
                                </p>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <ExclamationTriangleIcon className="h-4 w-4" />
                                  <span>Última limpeza: Nunca</span>
                                </div>
                              </div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  onClick={handleClearCache}
                                  className="bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90"
                                >
                                  <ArchiveBoxXMarkIcon className="h-4 w-4 mr-2" />
                                  Limpar Cache da Aplicação
                                </Button>
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Configurações Gerais */}
                      <motion.div variants={itemVariants}>
                        <Card className="border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                              <Cog6ToothIcon className="h-5 w-5 text-chart-3" />
                              <span>Configurações Gerais</span>
                            </CardTitle>
                            <CardDescription>
                              Configurações globais do sistema
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border border-border rounded-lg">
                                  <h4 className="font-medium text-foreground mb-2">Configurações de Email</h4>
                                  <p className="text-sm text-muted-foreground mb-3">Configurar notificações por email</p>
                                  <Badge variant="outline" className="text-muted-foreground">
                                    Em desenvolvimento
                                  </Badge>
                                </div>
                                <div className="p-4 border border-border rounded-lg">
                                  <h4 className="font-medium text-foreground mb-2">Parâmetros do Sistema</h4>
                                  <p className="text-sm text-muted-foreground mb-3">Ajustar configurações gerais</p>
                                  <Badge variant="outline" className="text-muted-foreground">
                                    Em desenvolvimento
                                  </Badge>
                                </div>
                                <div className="p-4 border border-border rounded-lg">
                                  <h4 className="font-medium text-foreground mb-2">Notificações</h4>
                                  <p className="text-sm text-muted-foreground mb-3">Configurar alertas do sistema</p>
                                  <Badge variant="outline" className="text-muted-foreground">
                                    Em desenvolvimento
                                  </Badge>
                                </div>
                                <div className="p-4 border border-border rounded-lg">
                                  <h4 className="font-medium text-foreground mb-2">Integrações</h4>
                                  <p className="text-sm text-muted-foreground mb-3">Conectar com serviços externos</p>
                                  <Badge variant="outline" className="text-muted-foreground">
                                    Em desenvolvimento
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </main>
        </motion.div>
      </DashboardLayout>
    </ConfigErrorBoundary>
  )
}