'use client'

import { useState, useEffect } from 'react'
import { 
  Search, Save, List, Edit3, Check, X, ExternalLink, 
  Calendar, MapPin, DollarSign, Clock, Users, FileText,
  Trash2, Download, Upload, Building2, Tag, Briefcase, Package
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCache } from '../contexts/CacheContext'

const JobExtractor = ({ onVagaCriada }) => {
  const [url, setUrl] = useState('')
  const [jobData, setJobData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editedData, setEditedData] = useState({})
  const [notification, setNotification] = useState(null)
  const { profile } = useAuth()
  const { refreshCache } = useCache()

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
  }

  const extractJobInfo = async () => {
    if (!url.trim()) {
      showNotification('Por favor, insira uma URL válida', 'error')
      return
    }

    // Validar se é uma URL válida
    try {
      new URL(url)
    } catch (e) {
      showNotification('Por favor, insira uma URL válida', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/extract-vaga', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      const result = await response.json()
      
      if (result.success) {
        setJobData(result.data)
        setEditedData(result.data)
        showNotification('Informações extraídas com sucesso!', 'success')
      } else {
        showNotification(`Erro: ${result.error}`, 'error')
      }
    } catch (error) {
      showNotification(`Erro ao extrair informações: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const saveJob = async () => {
    if (!jobData) return

    setLoading(true)
    try {
      const dataToSave = editing ? editedData : jobData
      
      // Função para extrair cliente da URL (universal)
      const extractClienteFromUrl = (url) => {
        try {
          const urlObj = new URL(url)
          const hostname = urlObj.hostname
          
          // Gupy
          const gupyMatch = hostname.match(/([^.]+)\.gupy\.io/)
          if (gupyMatch) {
            return gupyMatch[1].charAt(0).toUpperCase() + gupyMatch[1].slice(1)
          }
          
          // LinkedIn
          if (hostname.includes('linkedin.com')) {
            return 'LinkedIn'
          }
          
          // Indeed
          if (hostname.includes('indeed.com')) {
            return 'Indeed'
          }
          
          // Vagas.com
          if (hostname.includes('vagas.com')) {
            return 'Vagas.com'
          }
          
          // InfoJobs
          if (hostname.includes('infojobs.com.br')) {
            return 'InfoJobs'
          }
          
          // Extrair domínio principal
          const domainMatch = hostname.match(/([^.]+)\.(com|com\.br|io|net|org)$/)
          if (domainMatch) {
            return domainMatch[1].charAt(0).toUpperCase() + domainMatch[1].slice(1)
          }
          
        } catch (e) {
          console.error('Erro ao extrair cliente da URL:', e)
        }
        return 'Cliente não identificado'
      }

      // Função para extrair produto do título
      const extractProdutoFromTitle = (titulo) => {
        if (!titulo) return 'Produto não identificado'
        
        // Procurar por padrões comuns de produtos no título
        const patterns = [
          /\(([^)]+)\)/g, // Texto entre parênteses
          /- ([^-]+)$/g, // Texto após último hífen
          /Banco de ([^-]+)/gi, // Banco de [algo]
          /([A-Z][a-z]+ [A-Z][a-z]+)/g // Duas palavras capitalizadas
        ]
        
        for (const pattern of patterns) {
          const match = titulo.match(pattern)
          if (match && match[0]) {
            return match[0].replace(/[()]/g, '').trim()
          }
        }
        
        return 'Produto não identificado'
      }

      // Função para determinar categoria baseada no título e descrição
      const determineCategoria = (titulo, descricao) => {
        const text = `${titulo} ${descricao}`.toLowerCase()
        
        if (text.includes('atendimento') || text.includes('suporte') || text.includes('relacionamento')) {
          return 'Atendimento'
        }
        if (text.includes('vendas') || text.includes('comercial') || text.includes('vendedor')) {
          return 'Vendas'
        }
        if (text.includes('tecnologia') || text.includes('ti') || text.includes('desenvolvedor') || text.includes('programador')) {
          return 'Tecnologia'
        }
        if (text.includes('rh') || text.includes('recursos humanos') || text.includes('recrutamento')) {
          return 'Recursos Humanos'
        }
        if (text.includes('financeiro') || text.includes('contábil') || text.includes('contador')) {
          return 'Financeiro'
        }
        if (text.includes('marketing') || text.includes('comunicação')) {
          return 'Marketing'
        }
        
        return 'Outro'
      }

      // Função para determinar site baseado na URL
      const determineSite = (url) => {
        try {
          const urlObj = new URL(url)
          const hostname = urlObj.hostname.toLowerCase()
          
          if (hostname.includes('gupy.io')) return 'Gupy'
          if (hostname.includes('linkedin.com')) return 'LinkedIn'
          if (hostname.includes('indeed.com')) return 'Indeed'
          if (hostname.includes('vagas.com')) return 'Vagas.com'
          if (hostname.includes('infojobs.com.br')) return 'InfoJobs'
          
          return 'Outro'
        } catch (e) {
          return 'Outro'
        }
      }

      // Mapear dados extraídos para o formato da tabela vagas
      const vagaData = {
        site: determineSite(dataToSave.url),
        categoria: determineCategoria(dataToSave.titulo, dataToSave.descricao),
        cargo: dataToSave.titulo || 'Cargo não informado',
        cliente: extractClienteFromUrl(dataToSave.url),
        produto: extractProdutoFromTitle(dataToSave.titulo),
        descricao_vaga: dataToSave.descricao || '',
        responsabilidades_atribuicoes: dataToSave.responsabilidades || '',
        requisitos_qualificacoes: dataToSave.requisitos || '',
        salario: dataToSave.salario || '',
        horario_trabalho: dataToSave.horario_trabalho || '',
        jornada_trabalho: dataToSave.jornada_trabalho || '',
        beneficios: dataToSave.beneficios || '',
        local_trabalho: dataToSave.local_trabalho || '',
        etapas_processo: dataToSave.etapas_processo || ''
      }
      
      const response = await fetch('/api/vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vagaData),
      })

      const result = await response.json()
      
      if (result.success) {
        showNotification('Vaga salva com sucesso!', 'success')
        setJobData(null)
        setEditedData({})
        setUrl('')
        setEditing(false)
        
        // Atualizar cache
        if (refreshCache) {
          refreshCache()
        }
        
        // Notificar componente pai
        if (onVagaCriada) {
          onVagaCriada(result.vaga)
        }
      } else {
        showNotification(`Erro: ${result.error}`, 'error')
      }
    } catch (error) {
      showNotification(`Erro ao salvar: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(true)
    setEditedData({...jobData})
  }

  const handleSaveEdit = () => {
    setJobData(editedData)
    setEditing(false)
    showNotification('Alterações salvas!', 'success')
  }

  const handleCancelEdit = () => {
    setEditedData(jobData)
    setEditing(false)
  }

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('pt-BR')
    } catch {
      return dateString
    }
  }

  const FieldDisplay = ({ label, field, icon: Icon, multiline = false, placeholder = "Não informado" }) => {
    const currentData = editing ? editedData : jobData
    const value = currentData?.[field] || ''

    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          {Icon && <Icon className="h-4 w-4 mr-2 text-blue-600" />}
          <label className="font-medium text-gray-700">{label}</label>
        </div>
        {editing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-24"
              rows="4"
              placeholder={placeholder}
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={placeholder}
            />
          )
        ) : (
          <div className={`p-3 bg-gray-50 rounded-lg border ${multiline ? 'min-h-24' : ''}`}>
            {multiline ? (
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                {value || placeholder}
              </pre>
            ) : (
              <span className="text-gray-700">{value || placeholder}</span>
            )}
          </div>
        )}
      </div>
    )
  }

  const Notification = ({ message, type, onClose }) => (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center max-w-md ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-black/10 rounded p-1">
        <X className="h-4 w-4" />
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* URL Input Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <Search className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Extrair Informações da Vaga</h2>
        </div>
        
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="https://empresa.gupy.io/jobs/1234567 ou https://linkedin.com/jobs/view/1234567"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={loading}
          />
          <button
            onClick={extractJobInfo}
            disabled={loading || !url.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center font-medium"
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Extraindo...' : 'Extrair'}
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-2">
          Cole aqui o link da vaga (Gupy, LinkedIn, Indeed, Vagas.com, InfoJobs ou outros) para extrair automaticamente todas as informações
        </p>
      </div>

      {/* Job Information Card */}
      {jobData && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Informações Extraídas</h2>
            </div>
            <div className="flex gap-2">
              {!editing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center font-medium"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                  <button
                    onClick={saveJob}
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center font-medium"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Vaga
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center font-medium"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Coluna da Esquerda - Informações Básicas */}
            <div className="space-y-4">
              <FieldDisplay label="Site" field="site" icon={Building2} placeholder="Gupy" />
              <FieldDisplay label="Categoria" field="categoria" icon={Tag} placeholder="Categoria não identificada" />
              <FieldDisplay label="Cargo" field="cargo" icon={Briefcase} placeholder="Cargo não informado" />
              <FieldDisplay label="Cliente" field="cliente" icon={Building2} placeholder="Cliente não identificado" />
              <FieldDisplay label="Produto" field="produto" icon={Package} placeholder="Produto não identificado" />
              <FieldDisplay label="Título da Vaga" field="titulo" icon={FileText} placeholder="Título não informado" />
              <FieldDisplay label="Local de Trabalho" field="local_trabalho" icon={MapPin} placeholder="Local não informado" />
              <FieldDisplay label="Salário" field="salario" icon={DollarSign} placeholder="A combinar" />
              <FieldDisplay label="Horário de Trabalho" field="horario_trabalho" icon={Clock} placeholder="Horário não informado" />
              <FieldDisplay label="Jornada de Trabalho" field="jornada_trabalho" icon={Users} placeholder="Jornada não informada" />
            </div>
            
            {/* Coluna da Direita - Descrições Detalhadas */}
            <div className="space-y-4">
              <FieldDisplay label="Descrição da Vaga" field="descricao" multiline placeholder="Descrição não disponível" />
              <FieldDisplay label="Responsabilidades e Atribuições" field="responsabilidades" multiline placeholder="Responsabilidades não informadas" />
              <FieldDisplay label="Requisitos e Qualificações" field="requisitos" multiline placeholder="Requisitos não informados" />
              <FieldDisplay label="Benefícios" field="beneficios" multiline placeholder="Benefícios não informados" />
              <FieldDisplay label="Etapas do Processo" field="etapas_processo" multiline placeholder="Etapas não informadas" />
            </div>
          </div>

          {/* Footer com informações da extração */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Extraído em: {formatDate(jobData.data_extracao)}</span>
            </div>
            <a
              href={jobData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Ver vaga original
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobExtractor
