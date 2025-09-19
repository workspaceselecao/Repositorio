'use client'

import { useData } from '../contexts/DataContext'
import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { SkeletonList, SkeletonCard } from './PracticalLoading'
import { 
  Users, 
  Briefcase, 
  BarChart3, 
  TrendingUp,
  Building2,
  Activity
} from 'lucide-react'

/**
 * Dashboard com carregamento progressivo
 * Mostra skeleton loading enquanto carrega dados
 */
export function ProgressiveDashboard() {
  const { vagas, clientes, loading, error } = useData()

  // Calcular totais
  const totalVagas = useMemo(() => vagas.length, [vagas])
  const totalClientes = useMemo(() => clientes.length, [clientes])

  // Dados skeleton para loading
  const skeletonStats = [
    { title: "Total de Vagas", icon: Briefcase, color: "text-blue-600" },
    { title: "Clientes Ativos", icon: Users, color: "text-green-600" },
    { title: "Análises", icon: BarChart3, color: "text-purple-600" }
  ]

  const stats = [
    {
      title: "Total de Vagas",
      value: totalVagas,
      description: "Vagas cadastradas no sistema",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Clientes Ativos",
      value: totalClientes,
      description: "Empresas cadastradas",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      iconBg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Análises",
      value: "Em breve",
      description: "Relatórios e insights",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      iconBg: "bg-purple-100 dark:bg-purple-900/30"
    }
  ]

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Erro ao carregar dados
          </h2>
          <p className="text-muted-foreground mb-4">
            {error.message || 'Ocorreu um erro inesperado'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="mt-2 text-muted-foreground">
                Visão geral do sistema de vagas
              </p>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-muted/50 rounded-lg">
              <Activity className="h-4 w-4 text-chart-2" />
              <span className="text-sm font-medium">
                {loading ? 'Carregando...' : 'Atualizado'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {loading ? (
              // Skeleton loading para stats
              skeletonStats.map((stat, index) => (
                <SkeletonCard key={index} className="h-32" />
              ))
            ) : (
              // Stats reais
              stats.map((stat, index) => (
                <Card key={stat.title} className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground mt-2">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.description}
                        </p>
                      </div>
                      <div className={`${stat.iconBg} p-3 rounded-xl`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Recent Activity */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-chart-5" />
                <span>Atividade Recente</span>
              </CardTitle>
              <CardDescription>
                Últimas atualizações no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <SkeletonList count={3} />
              ) : (
                <div className="space-y-4">
                  {[
                    { 
                      icon: Building2, 
                      color: 'chart-1', 
                      title: `${totalVagas} vagas cadastradas`, 
                      desc: 'Total de vagas no sistema',
                      time: 'Hoje'
                    },
                    { 
                      icon: Users, 
                      color: 'chart-2', 
                      title: `${totalClientes} clientes ativos`, 
                      desc: 'Empresas cadastradas',
                      time: 'Hoje'
                    },
                    { 
                      icon: Activity, 
                      color: 'chart-3', 
                      title: 'Sistema otimizado', 
                      desc: 'Performance melhorada',
                      time: 'Agora'
                    }
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors group"
                    >
                      <div className={`w-2 h-2 bg-${activity.color} rounded-full`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.desc}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
