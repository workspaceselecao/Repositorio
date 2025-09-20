'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { LoadingSpinner } from './ui/loading-spinner'
import { 
  LinkIcon, 
  DocumentTextIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const AdicionarVagaForm = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState('scrape')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    site: '',
    categoria: '',
    cargo: '',
    cliente: '',
    produto: '',
    descricao_vaga: '',
    responsabilidades_atribuicoes: '',
    requisitos_qualificacoes: '',
    salario: '',
    horario_trabalho: '',
    jornada_trabalho: '',
    beneficios: '',
    local_trabalho: '',
    etapas_processo: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleScrapeUrl = async () => {
    const url = formData.site
    if (!url) {
      toast.error('Por favor, insira uma URL válida')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/scrape-vaga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      })

      const result = await response.json()

      if (result.success) {
        const scrapedData = result.data
        
        // Preencher o formulário com os dados extraídos
        setFormData(prev => ({
          ...prev,
          cargo: scrapedData.titulo || prev.cargo,
          cliente: scrapedData.empresa || prev.cliente,
          descricao_vaga: scrapedData.descricao_vaga || prev.descricao_vaga,
          responsabilidades_atribuicoes: scrapedData.responsabilidades_atribuicoes || prev.responsabilidades_atribuicoes,
          requisitos_qualificacoes: scrapedData.requisitos_qualificacoes || prev.requisitos_qualificacoes,
          salario: scrapedData.salario || prev.salario,
          horario_trabalho: scrapedData.horario_trabalho || prev.horario_trabalho,
          beneficios: scrapedData.beneficios || prev.beneficios,
          local_trabalho: scrapedData.local_trabalho || prev.local_trabalho,
          etapas_processo: scrapedData.etapas_processo || prev.etapas_processo
        }))

        toast.success('Dados extraídos com sucesso! Revise e edite conforme necessário.')
      } else {
        toast.error(result.error || 'Erro ao extrair dados da URL')
      }
    } catch (error) {
      console.error('Erro ao extrair dados:', error)
      toast.error('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validações básicas
    if (!formData.cargo || !formData.cliente || !formData.categoria) {
      toast.error('Por favor, preencha os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Vaga cadastrada com sucesso!')
        setFormData({
          site: '',
          categoria: '',
          cargo: '',
          cliente: '',
          produto: '',
          descricao_vaga: '',
          responsabilidades_atribuicoes: '',
          requisitos_qualificacoes: '',
          salario: '',
          horario_trabalho: '',
          jornada_trabalho: '',
          beneficios: '',
          local_trabalho: '',
          etapas_processo: ''
        })
        if (onSuccess) onSuccess()
      } else {
        toast.error(result.error || 'Erro ao cadastrar vaga')
      }
    } catch (error) {
      console.error('Erro ao cadastrar vaga:', error)
      toast.error('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'scrape', label: 'Extração Automática', icon: LinkIcon },
    { id: 'manual', label: 'Preenchimento Manual', icon: DocumentTextIcon }
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PlusIcon className="h-6 w-6 text-primary" />
          <span>Adicionar Nova Vaga</span>
        </CardTitle>
        <CardDescription>
          Cadastre uma nova vaga através de extração automática de URL ou preenchimento manual
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tab: Extração Automática */}
          {activeTab === 'scrape' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <LinkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-100">
                      Extração Automática
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Cole a URL da vaga e clique em &quot;Extrair Dados&quot; para preencher automaticamente o formulário
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="url">URL da Vaga *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://atento.gupy.io/jobs/9807692?jobBoardSource=share_link"
                      value={formData.site}
                      onChange={(e) => handleInputChange('site', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleScrapeUrl}
                      disabled={loading || !formData.site}
                      className="px-6"
                    >
                      {loading ? (
                        <LoadingSpinner className="h-4 w-4" />
                      ) : (
                        <>
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Extrair
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab: Preenchimento Manual */}
          {activeTab === 'manual' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start space-x-3">
                  <DocumentTextIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900 dark:text-green-100">
                      Preenchimento Manual
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Preencha manualmente todas as informações da vaga
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Campos do formulário */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cargo">Cargo *</Label>
              <Input
                id="cargo"
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                placeholder="Ex: Desenvolvedor Full Stack"
                required
              />
            </div>

            <div>
              <Label htmlFor="cliente">Cliente/Empresa *</Label>
              <Input
                id="cliente"
                value={formData.cliente}
                onChange={(e) => handleInputChange('cliente', e.target.value)}
                placeholder="Ex: Atento Brasil"
                required
              />
            </div>

            <div>
              <Label htmlFor="categoria">Categoria *</Label>
              <select
                id="categoria"
                value={formData.categoria}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="">Selecione uma categoria</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="vendas">Vendas</option>
                <option value="marketing">Marketing</option>
                <option value="rh">Recursos Humanos</option>
                <option value="financeiro">Financeiro</option>
                <option value="operacional">Operacional</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <Label htmlFor="produto">Produto</Label>
              <Input
                id="produto"
                value={formData.produto}
                onChange={(e) => handleInputChange('produto', e.target.value)}
                placeholder="Ex: Atendimento ao Cliente"
              />
            </div>
          </div>

          {/* Campos de texto longo */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="descricao_vaga">Descrição da Vaga</Label>
              <textarea
                id="descricao_vaga"
                value={formData.descricao_vaga}
                onChange={(e) => handleInputChange('descricao_vaga', e.target.value)}
                placeholder="Descreva a vaga e suas principais características..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="responsabilidades_atribuicoes">Responsabilidades e Atribuições</Label>
              <textarea
                id="responsabilidades_atribuicoes"
                value={formData.responsabilidades_atribuicoes}
                onChange={(e) => handleInputChange('responsabilidades_atribuicoes', e.target.value)}
                placeholder="Liste as principais responsabilidades e atribuições do cargo..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="requisitos_qualificacoes">Requisitos e Qualificações</Label>
              <textarea
                id="requisitos_qualificacoes"
                value={formData.requisitos_qualificacoes}
                onChange={(e) => handleInputChange('requisitos_qualificacoes', e.target.value)}
                placeholder="Descreva os requisitos técnicos e qualificações necessárias..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salario">Salário</Label>
                <Input
                  id="salario"
                  value={formData.salario}
                  onChange={(e) => handleInputChange('salario', e.target.value)}
                  placeholder="Ex: R$ 5.000 - R$ 8.000"
                />
              </div>

              <div>
                <Label htmlFor="horario_trabalho">Horário de Trabalho</Label>
                <Input
                  id="horario_trabalho"
                  value={formData.horario_trabalho}
                  onChange={(e) => handleInputChange('horario_trabalho', e.target.value)}
                  placeholder="Ex: 8h às 17h"
                />
              </div>

              <div>
                <Label htmlFor="jornada_trabalho">Jornada de Trabalho</Label>
                <Input
                  id="jornada_trabalho"
                  value={formData.jornada_trabalho}
                  onChange={(e) => handleInputChange('jornada_trabalho', e.target.value)}
                  placeholder="Ex: 40h semanais"
                />
              </div>

              <div>
                <Label htmlFor="local_trabalho">Local de Trabalho</Label>
                <Input
                  id="local_trabalho"
                  value={formData.local_trabalho}
                  onChange={(e) => handleInputChange('local_trabalho', e.target.value)}
                  placeholder="Ex: São Paulo - SP (Híbrido)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="beneficios">Benefícios</Label>
              <textarea
                id="beneficios"
                value={formData.beneficios}
                onChange={(e) => handleInputChange('beneficios', e.target.value)}
                placeholder="Liste os benefícios oferecidos..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="etapas_processo">Etapas do Processo</Label>
              <textarea
                id="etapas_processo"
                value={formData.etapas_processo}
                onChange={(e) => handleInputChange('etapas_processo', e.target.value)}
                placeholder="Descreva as etapas do processo seletivo..."
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                rows={3}
              />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  site: '',
                  categoria: '',
                  cargo: '',
                  cliente: '',
                  produto: '',
                  descricao_vaga: '',
                  responsabilidades_atribuicoes: '',
                  requisitos_qualificacoes: '',
                  salario: '',
                  horario_trabalho: '',
                  jornada_trabalho: '',
                  beneficios: '',
                  local_trabalho: '',
                  etapas_processo: ''
                })
              }}
              disabled={loading}
            >
              Limpar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90"
            >
              {loading ? (
                <LoadingSpinner className="h-4 w-4 mr-2" />
              ) : (
                <CheckIcon className="h-4 w-4 mr-2" />
              )}
              Salvar Vaga
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default AdicionarVagaForm
