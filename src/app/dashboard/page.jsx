'use client'

import DashboardLayout from '../../components/DashboardLayout'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { useCache } from '../../contexts/CacheContext'
import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import NewsSection from '../../components/NewsSection'
import { motion } from 'framer-motion'
import { 
  Users, 
  Briefcase, 
  BarChart3, 
  TrendingUp, 
  ArrowRight,
  Building2,
  Calendar,
  Target,
  Activity,
  Zap,
  Star
} from 'lucide-react'

export default function DashboardPage() {
  const { vagas, clientes, loading, isLoaded } = useCache()

  // Calcular totais
  const totalVagas = useMemo(() => vagas.length, [vagas])
  const totalClientes = useMemo(() => clientes.length, [clientes])


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
              <div className="flex items-center justify-between">
                <div>
                  <motion.h1 
                    className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Dashboard
                  </motion.h1>
                  <motion.p 
                    className="mt-2 text-muted-foreground"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Visão geral do sistema de vagas
                  </motion.p>
                </div>
                <motion.div 
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center space-x-2 px-4 py-2 bg-muted/50 rounded-lg">
                    <Calendar className="h-4 w-4 text-chart-2" />
                    <span className="text-sm font-medium">
                      {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button size="sm" className="bg-gradient-to-r from-primary to-chart-2">
                      <Activity className="h-4 w-4 mr-2" />
                      Atualizar
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {/* Stats Cards */}
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8"
              >
                {stats.map((stat, index) => (
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
                            <p className="text-xs text-muted-foreground mt-1">
                              {stat.description}
                            </p>
                          </div>
                          <motion.div 
                            className={`${stat.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform`}
                            whileHover={{ rotate: 5 }}
                          >
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* News Section */}
              <motion.div variants={itemVariants}>
                <NewsSection />
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={containerVariants} className="mb-8">
                <motion.h2 
                  variants={itemVariants}
                  className="text-2xl font-bold text-foreground mb-6 flex items-center space-x-2"
                >
                  <Zap className="h-6 w-6 text-chart-4" />
                  <span>Ações Rápidas</span>
                </motion.h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.title}
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className="group cursor-pointer"
                    >
                      <Card className={`${action.bgColor} h-full hover:shadow-xl transition-all duration-300 border-0`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <motion.div 
                                  className={`${action.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform`}
                                  whileHover={{ rotate: 10 }}
                                >
                                  <action.icon className={`h-5 w-5 ${action.color}`} />
                                </motion.div>
                                <div>
                                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {action.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {action.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <motion.div
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>


              {/* Recent Activity */}
              <motion.div variants={itemVariants}>
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
                    <div className="space-y-4">
                      {[
                        { 
                          icon: Star, 
                          color: 'chart-1', 
                          title: 'Tema Blue v3 implementado', 
                          desc: 'Cores otimizadas para melhor contraste',
                          time: 'Agora'
                        },
                        { 
                          icon: Activity, 
                          color: 'chart-2', 
                          title: `${totalVagas} vagas cadastradas`, 
                          desc: 'Total de vagas no sistema',
                          time: 'Hoje'
                        },
                        { 
                          icon: Users, 
                          color: 'chart-3', 
                          title: `${totalClientes} clientes ativos`, 
                          desc: 'Empresas cadastradas',
                          time: 'Hoje'
                        }
                      ].map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors group"
                        >
                          <motion.div 
                            className={`w-2 h-2 bg-${activity.color} rounded-full`}
                            whileHover={{ scale: 1.5 }}
                          />
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
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>
        </motion.div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}