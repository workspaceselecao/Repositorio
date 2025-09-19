'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/DashboardLayout'
import ListaVagas from '../../components/ListaVagas'
import ImportarDados from '../../components/ImportarDados'
import { useCache } from '../../contexts/CacheContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { 
  ArrowDownTrayIcon, 
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function VagasPage() {
  const { vagas, clientes, sites, loading, isLoaded } = useCache()
  const [showImport, setShowImport] = useState(false)
  const [vagasParaExport, setVagasParaExport] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

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

  const handleImportToggle = () => {
    setShowImport(!showImport)
    if (!showImport) {
      toast.success('Modo de importação ativado')
    } else {
      toast.info('Modo de importação desativado')
    }
  }

  const handleExport = () => {
    if (vagasParaExport.length === 0) {
      toast.error('Nenhuma vaga selecionada para exportar')
      return
    }
    toast.success(`${vagasParaExport.length} vagas preparadas para exportação`)
  }

  return (
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
                  Lista de Vagas
                </motion.h1>
                <motion.p 
                  className="mt-2 text-muted-foreground text-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Gerencie todas as vagas cadastradas no sistema
                </motion.p>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleImportToggle}
                    variant={showImport ? "secondary" : "default"}
                    className="bg-gradient-to-r from-chart-2 to-chart-3 hover:from-chart-2/90 hover:to-chart-3/90"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    {showImport ? 'Ocultar Importação' : 'Importar Dados'}
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    Exportar ({vagasParaExport.length})
                  </Button>
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
                    value: vagasParaExport.length, 
                    icon: DocumentTextIcon, 
                    color: 'chart-1',
                    bgColor: 'bg-chart-1/10'
                  },
                  { 
                    title: 'Importadas Hoje', 
                    value: '12', 
                    icon: ArrowDownTrayIcon, 
                    color: 'chart-2',
                    bgColor: 'bg-chart-2/10'
                  },
                  { 
                    title: 'Categorias', 
                    value: '8', 
                    icon: FunnelIcon, 
                    color: 'chart-3',
                    bgColor: 'bg-chart-3/10'
                  },
                  { 
                    title: 'Clientes', 
                    value: '15', 
                    icon: ChartBarIcon, 
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

              {/* Search and Filters */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 bg-gradient-to-r from-muted/30 to-muted/10">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Buscar vagas por cargo, empresa ou categoria..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={filterCategory}
                          onChange={(e) => setFilterCategory(e.target.value)}
                          className="px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                        >
                          <option value="all">Todas as categorias</option>
                          <option value="tecnologia">Tecnologia</option>
                          <option value="vendas">Vendas</option>
                          <option value="marketing">Marketing</option>
                          <option value="rh">Recursos Humanos</option>
                        </select>
                        <Button variant="outline" className="px-6">
                          <FunnelIcon className="h-4 w-4 mr-2" />
                          Filtrar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Import Section */}
              {showImport && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2 border-dashed border-chart-2/50 bg-chart-2/5">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-chart-2">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                        <span>Importar Dados</span>
                      </CardTitle>
                      <CardDescription>
                        Importe vagas em lote através de arquivo Excel ou CSV
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ImportarDados />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Vagas List */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <DocumentTextIcon className="h-5 w-5 text-chart-1" />
                          <span>Lista de Vagas</span>
                        </CardTitle>
                        <CardDescription>
                          {searchTerm || filterCategory !== 'all' 
                            ? `Filtros aplicados: ${searchTerm ? `"${searchTerm}"` : ''} ${filterCategory !== 'all' ? `• ${filterCategory}` : ''}`
                            : 'Todas as vagas cadastradas no sistema'
                          }
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-chart-1/10 text-chart-1">
                          {vagasParaExport.length} selecionadas
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ListaVagas onVagasChange={setVagasParaExport} />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </motion.div>
    </DashboardLayout>
  )
}