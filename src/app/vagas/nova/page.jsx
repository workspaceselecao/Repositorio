'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import DashboardLayout from '../../../components/DashboardLayout'
import AdicionarVagaForm from '../../../components/AdicionarVagaForm'
import { 
  ArrowLeftIcon,
  PlusIcon,
  LinkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function NovaVagaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSuccess = () => {
    setIsSubmitting(false)
    // Redirecionar para a lista de vagas após sucesso
    router.push('/vagas')
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={() => router.back()}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeftIcon className="h-5 w-5 text-muted-foreground" />
                </motion.button>
                
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
                    Cadastre uma nova vaga no sistema
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
              {/* Info Cards */}
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <LinkIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        Extração Automática
                      </h3>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Cole a URL da vaga e deixe o sistema extrair automaticamente as informações. 
                      Ideal para sites como Gupy, Vagas.com, LinkedIn Jobs e outros.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <DocumentTextIcon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                        Preenchimento Manual
                      </h3>
                    </div>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Preencha manualmente todos os campos da vaga. 
                      Perfeito quando você tem as informações em documentos ou PDFs.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Form */}
              <motion.div variants={itemVariants}>
                <AdicionarVagaForm onSuccess={handleSuccess} />
              </motion.div>

              {/* Tips */}
              <motion.div 
                variants={itemVariants}
                className="bg-muted/50 p-6 rounded-xl border border-border"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <PlusIcon className="h-5 w-5 mr-2 text-primary" />
                  Dicas para um bom cadastro
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Preencha pelo menos os campos obrigatórios (Cargo, Cliente, Categoria)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Use descrições claras e objetivas</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Inclua informações sobre salário e benefícios quando disponíveis</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Seja específico sobre requisitos técnicos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Mencione o local de trabalho (presencial, remoto, híbrido)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Descreva as etapas do processo seletivo</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </motion.div>
    </DashboardLayout>
  )
}
