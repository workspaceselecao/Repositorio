'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DashboardLayout from '../../../components/DashboardLayout'
import { ProtectedRoute } from '../../../components/ProtectedRoute'
import JobExtractor from '../../../components/JobExtractor'
import FormularioVaga from '../../../components/FormularioVaga'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { 
  Search, 
  FileText, 
  Plus, 
  ExternalLink,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NovaVagaPage() {
  const [activeTab, setActiveTab] = useState('extract')
  const [vagaCriada, setVagaCriada] = useState(null)
  const router = useRouter()

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

  const handleVagaCriada = (vaga) => {
    setVagaCriada(vaga)
    toast.success('Vaga criada com sucesso!')
  }

  const handleVoltar = () => {
    router.push('/vagas')
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
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleVoltar}
                    variant="outline"
                    size="icon"
                    className="hover:bg-muted"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <motion.h1 
                      className="text-4xl font-bold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Nova Vaga
                    </motion.h1>
                    <motion.p 
                      className="mt-2 text-muted-foreground text-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Adicione uma nova vaga ao sistema
                    </motion.p>
                  </div>
                </div>
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
                {/* Success Message */}
                {vagaCriada && (
                  <motion.div variants={itemVariants}>
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <div>
                            <h3 className="text-lg font-semibold text-green-900">
                              Vaga criada com sucesso!
                            </h3>
                            <p className="text-green-700">
                              A vaga "{vagaCriada.cargo}" foi adicionada ao sistema.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Navigation Tabs */}
                <motion.div variants={itemVariants}>
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="border-b border-border">
                        <nav className="flex space-x-8 px-6">
                          <motion.button
                            onClick={() => setActiveTab('extract')}
                            className={`${
                              activeTab === 'extract'
                                ? 'border-chart-1 text-chart-1'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-200`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Search className="h-5 w-5 mr-2" />
                            Extrair do Gupy
                          </motion.button>
                          <motion.button
                            onClick={() => setActiveTab('manual')}
                            className={`${
                              activeTab === 'manual'
                                ? 'border-chart-2 text-chart-2'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-all duration-200`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FileText className="h-5 w-5 mr-2" />
                            Criar Manualmente
                          </motion.button>
                        </nav>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Tab Content */}
                <motion.div variants={itemVariants}>
                  {activeTab === 'extract' && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Search className="h-5 w-5 text-chart-1" />
                          <span>Extrair Vaga do Gupy</span>
                        </CardTitle>
                        <CardDescription>
                          Cole o link da vaga do Gupy para extrair automaticamente todas as informações
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <JobExtractor onVagaCriada={handleVagaCriada} />
                      </CardContent>
                    </Card>
                  )}

                  {activeTab === 'manual' && (
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-chart-2" />
                          <span>Criar Vaga Manualmente</span>
                        </CardTitle>
                        <CardDescription>
                          Preencha o formulário para adicionar uma nova vaga ao sistema
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <FormularioVaga onVagaCriada={handleVagaCriada} />
                      </CardContent>
                    </Card>
                  )}
                </motion.div>

                {/* Help Section */}
                <motion.div variants={itemVariants}>
                  <Card className="border-0 shadow-lg bg-muted/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <ExternalLink className="h-5 w-5 text-chart-3" />
                        <span>Como usar</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Extração Automática</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Cole o link da vaga do Gupy</li>
                            <li>• O sistema extrai automaticamente todas as informações</li>
                            <li>• Você pode editar os dados antes de salvar</li>
                            <li>• Ideal para vagas do Gupy</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Criação Manual</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Preencha todos os campos obrigatórios</li>
                            <li>• Use os campos de texto para descrições detalhadas</li>
                            <li>• Ideal para vagas de outros sites</li>
                            <li>• Controle total sobre os dados</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </div>
          </main>
        </motion.div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}