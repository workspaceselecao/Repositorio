'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/DashboardLayout'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import SeletorClientes from '../../components/SeletorClientes'
import ComparativoVagas from '../../components/ComparativoVagas'
import FiltrosComparativo from '../../components/FiltrosComparativo'
import ExportExcel from '../../components/ExportExcel'
import { useCache } from '../../contexts/CacheContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { 
  ChartBarIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  UsersIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function ComparativoPage() {
  const { vagas, clientes, loading, isLoaded } = useCache()
  const [clientesSelecionados, setClientesSelecionados] = useState([])
  const [filtros, setFiltros] = useState({
    site: '',
    categoria: '',
    cargo: '',
    produto: ''
  })
  const [vagasParaExport, setVagasParaExport] = useState([])
  const [viewMode, setViewMode] = useState('cards') // 'cards' ou 'charts'

  // Usar o CacheContext para obter dados
  const { getVagasByCliente, getVagasFiltradas } = useCache()
  
  // Obter vagas para os clientes selecionados
  const vagasParaFiltro = getVagasByCliente(clientesSelecionados)

  // Dados para gráficos de comparação
  const comparativoData = useMemo(() => {
    if (clientesSelecionados.length === 0) return []
    
    return clientesSelecionados.map(cliente => {
      const vagasCliente = vagasParaFiltro.filter(vaga => vaga.cliente === cliente)
      return {
        cliente,
        totalVagas: vagasCliente.length,
        categorias: vagasCliente.reduce((acc, vaga) => {
          acc[vaga.categoria] = (acc[vaga.categoria] || 0) + 1
          return acc
        }, {}),
        sites: vagasCliente.reduce((acc, vaga) => {
          acc[vaga.site] = (acc[vaga.site] || 0) + 1
          return acc
        }, {})
      }
    })
  }, [clientesSelecionados, vagasParaFiltro])

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

  const handleClientesChange = (novosClientes) => {
    setClientesSelecionados(novosClientes)
    if (novosClientes.length > 0) {
      toast.success(`${novosClientes.length} cliente(s) selecionado(s) para comparação`)
    }
  }

  const handleExport = () => {
    if (vagasParaExport.length === 0) {
      toast.error('Nenhuma vaga selecionada para exportar')
      return
    }
    toast.success(`Comparativo com ${vagasParaExport.length} vagas exportado com sucesso`)
  }

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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <motion.h1 
                    className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Comparativo de Clientes
                  </motion.h1>
                  <motion.p 
                    className="mt-2 text-muted-foreground text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Compare vagas entre diferentes clientes com visualizações avançadas
                  </motion.p>
                </div>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {clientesSelecionados.length > 0 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => setViewMode(viewMode === 'cards' ? 'charts' : 'cards')}
                        variant="outline"
                        className="border-chart-3 text-chart-3 hover:bg-chart-3 hover:text-white"
                      >
                        {viewMode === 'cards' ? (
                          <>
                            <ChartBarIcon className="h-4 w-4 mr-2" />
                            Ver Gráficos
                          </>
                        ) : (
                          <>
                            <EyeIcon className="h-4 w-4 mr-2" />
                            Ver Cards
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                  
                  {clientesSelecionados.length > 0 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <ExportExcel
                        vagas={vagasParaExport}
                        filename="comparativo-vagas"
                        buttonText="Exportar Comparativo"
                        className="bg-gradient-to-r from-chart-4 to-chart-5 hover:from-chart-4/90 hover:to-chart-5/90"
                      />
                    </motion.div>
                  )}
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
                {clientesSelecionados.length > 0 && (
                  <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                  >
                    {[
                      { 
                        title: 'Clientes Selecionados', 
                        value: clientesSelecionados.length, 
                        icon: UsersIcon, 
                        color: 'chart-1',
                        bgColor: 'bg-chart-1/10'
                      },
                      { 
                        title: 'Total de Vagas', 
                        value: vagasParaFiltro.length, 
                        icon: DocumentArrowDownIcon, 
                        color: 'chart-2',
                        bgColor: 'bg-chart-2/10'
                      },
                      { 
                        title: 'Categorias Únicas', 
                        value: new Set(vagasParaFiltro.map(v => v.categoria)).size, 
                        icon: FunnelIcon, 
                        color: 'chart-3',
                        bgColor: 'bg-chart-3/10'
                      },
                      { 
                        title: 'Sites Únicos', 
                        value: new Set(vagasParaFiltro.map(v => v.site)).size, 
                        icon: ArrowTrendingUpIcon, 
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
                )}

                {/* Seletor de Clientes */}
                <motion.div variants={itemVariants}>
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <UsersIcon className="h-5 w-5 text-chart-1" />
                        <span>Selecionar Clientes</span>
                      </CardTitle>
                      <CardDescription>
                        Escolha até 3 clientes para comparar suas vagas
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SeletorClientes 
                        clientesSelecionados={clientesSelecionados}
                        onClientesChange={handleClientesChange}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Filtros */}
                {clientesSelecionados.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <FunnelIcon className="h-5 w-5 text-chart-2" />
                          <span>Filtros de Comparação</span>
                        </CardTitle>
                        <CardDescription>
                          Aplique filtros para refinar a comparação
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FiltrosComparativo 
                          filtros={filtros}
                          onFiltrosChange={setFiltros}
                          vagasDisponiveis={vagasParaFiltro}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Visualizações */}
                {clientesSelecionados.length > 0 ? (
                  <>
                    {viewMode === 'charts' ? (
                      <motion.div variants={containerVariants} className="space-y-8">
                        {/* Gráfico de Comparação */}
                        <motion.div variants={itemVariants}>
                          <Card className="h-96">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <ChartBarIcon className="h-5 w-5 text-chart-3" />
                                <span>Comparação de Vagas por Cliente</span>
                              </CardTitle>
                              <CardDescription>
                                Distribuição de vagas entre os clientes selecionados
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={comparativoData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground)/0.2)" />
                                  <XAxis dataKey="cliente" stroke="hsl(var(--muted-foreground))" />
                                  <YAxis stroke="hsl(var(--muted-foreground))" />
                                  <Tooltip 
                                    contentStyle={{
                                      backgroundColor: 'hsl(var(--card))',
                                      border: '1px solid hsl(var(--border))',
                                      borderRadius: '8px'
                                    }}
                                  />
                                  <Bar dataKey="totalVagas" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Gráfico de Categorias */}
                        <motion.div variants={itemVariants}>
                          <Card className="h-96">
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <SparklesIcon className="h-5 w-5 text-chart-4" />
                                <span>Distribuição por Categoria</span>
                              </CardTitle>
                              <CardDescription>
                                Categorias mais comuns entre os clientes
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                  <Pie
                                    data={Object.entries(
                                      vagasParaFiltro.reduce((acc, vaga) => {
                                        acc[vaga.categoria] = (acc[vaga.categoria] || 0) + 1
                                        return acc
                                      }, {})
                                    ).map(([name, value]) => ({ name, value }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {Object.entries(
                                      vagasParaFiltro.reduce((acc, vaga) => {
                                        acc[vaga.categoria] = (acc[vaga.categoria] || 0) + 1
                                        return acc
                                      }, {})
                                    ).map((_, index) => (
                                      <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                                    ))}
                                  </Pie>
                                  <Tooltip 
                                    contentStyle={{
                                      backgroundColor: 'hsl(var(--card))',
                                      border: '1px solid hsl(var(--border))',
                                      borderRadius: '8px'
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div variants={itemVariants}>
                        <ComparativoVagas 
                          clientesSelecionados={clientesSelecionados}
                          filtros={filtros}
                          onVagasChange={setVagasParaExport}
                        />
                      </motion.div>
                    )}
                  </>
                ) : (
                  <motion.div variants={itemVariants}>
                    <Card className="border-0 shadow-lg">
                      <CardContent className="p-12 text-center">
                        <motion.div 
                          className="mx-auto w-24 h-24 bg-gradient-to-br from-chart-1/20 to-chart-2/20 rounded-full flex items-center justify-center mb-6"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <ChartBarIcon className="w-12 h-12 text-chart-1" />
                        </motion.div>
                        <motion.h3 
                          className="text-2xl font-bold text-foreground mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Nenhum cliente selecionado
                        </motion.h3>
                        <motion.p 
                          className="text-muted-foreground text-lg mb-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          Selecione até 3 clientes acima para começar a comparação
                        </motion.p>
                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                            <span>🔍 Filtros dinâmicos por SITE, CATEGORIA, CARGO, PRODUTO</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                            <span>📊 Cards expansíveis em até 3 colunas</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                            <span>🔄 Sincronização automática entre cards</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                            <span>📋 9 seções detalhadas de comparação</span>
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </main>
        </motion.div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}