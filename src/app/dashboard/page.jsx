'use client'

import DashboardLayout from '../../components/DashboardLayout'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { useData } from '../../contexts/DataContext'
import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import ChartDemo from '../../components/ChartDemo'
import { 
  Users, 
  Briefcase, 
  BarChart3, 
  TrendingUp, 
  Plus,
  ArrowRight,
  Building2,
  Calendar,
  Target
} from 'lucide-react'

export default function DashboardPage() {
  const { vagas, clientes, loading } = useData()

  // Calcular totais
  const totalVagas = useMemo(() => vagas.length, [vagas])
  const totalClientes = useMemo(() => clientes.length, [clientes])

  const stats = [
    {
      title: "Total de Vagas",
      value: loading ? '...' : totalVagas,
      description: "Vagas cadastradas no sistema",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      iconBg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Clientes Ativos",
      value: loading ? '...' : totalClientes,
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

  const quickActions = [
    {
      title: "Nova Vaga",
      description: "Cadastrar nova vaga de emprego",
      icon: Plus,
      href: "/vagas/nova",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
    },
    {
      title: "Ver Clientes",
      description: "Gerenciar lista de clientes",
      icon: Building2,
      href: "/vagas",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30"
    },
    {
      title: "Comparativo",
      description: "Análise comparativa de vagas",
      icon: Target,
      href: "/comparativo",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-900/30"
    }
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {/* Header */}
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground animate-fade-in">
                  Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground animate-fade-in">
                  Visão geral do sistema de vagas
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-muted/30">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {stats.map((stat, index) => (
                <Card key={stat.title} className="animate-fade-in hover:shadow-lg transition-all duration-300">
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
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Ações Rápidas</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {quickActions.map((action, index) => (
                  <Card 
                    key={action.title} 
                    className={`${action.bgColor} cursor-pointer transition-all duration-300 hover:shadow-lg animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`${action.iconBg} p-2 rounded-lg`}>
                              <action.icon className={`h-5 w-5 ${action.color}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {action.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Chart Demo */}
            <ChartDemo />

            {/* Recent Activity */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Atividade Recente</span>
                </CardTitle>
                <CardDescription>
                  Últimas atualizações no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Tema Blue v3 implementado
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cores otimizadas para melhor contraste
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Agora
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {totalVagas} vagas cadastradas
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total de vagas no sistema
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Hoje
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {totalClientes} clientes ativos
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Empresas cadastradas
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Hoje
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </DashboardLayout>
    </ProtectedRoute>
  )
}