'use client'

import { useState } from 'react'
import { 
  Building2, Tag, Briefcase, Package, FileText, MapPin, 
  DollarSign, Clock, Users, Calendar, Save, X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCache } from '../contexts/CacheContext'

const FormularioVaga = ({ onVagaCriada }) => {
  const [formData, setFormData] = useState({
    site: 'Gupy',
    categoria: 'Tecnologia',
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
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const { profile } = useAuth()
  const { refreshCache } = useCache()

  // Auto-hide notifications
  useState(() => {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validações básicas
    if (!formData.cargo.trim()) {
      showNotification('Cargo é obrigatório', 'error')
      return
    }
    
    if (!formData.cliente.trim()) {
      showNotification('Cliente é obrigatório', 'error')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/vagas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      
      if (result.success) {
        showNotification('Vaga criada com sucesso!', 'success')
        
        // Limpar formulário
        setFormData({
          site: 'Gupy',
          categoria: 'Tecnologia',
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
      showNotification(`Erro ao criar vaga: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
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

  const FieldDisplay = ({ label, field, icon: Icon, multiline = false, required = false, options = null }) => {
    const value = formData[field] || ''

    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          {Icon && <Icon className="h-4 w-4 mr-2 text-blue-600" />}
          <label className="font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        </div>
        {options ? (
          <select
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required={required}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : multiline ? (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-24"
            rows="4"
            placeholder={`Digite ${label.toLowerCase()}...`}
            required={required}
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder={`Digite ${label.toLowerCase()}...`}
            required={required}
          />
        )}
      </div>
    )
  }

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

      {/* Formulário */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center mb-6">
          <FileText className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Criar Nova Vaga Manualmente</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Coluna da Esquerda - Informações Básicas */}
            <div className="space-y-4">
              <FieldDisplay 
                label="Site" 
                field="site" 
                icon={Building2} 
                required={true}
                options={[
                  { value: 'Gupy', label: 'Gupy' },
                  { value: 'LinkedIn', label: 'LinkedIn' },
                  { value: 'Indeed', label: 'Indeed' },
                  { value: 'Vagas.com', label: 'Vagas.com' },
                  { value: 'InfoJobs', label: 'InfoJobs' },
                  { value: 'Outro', label: 'Outro' }
                ]}
              />
              
              <FieldDisplay 
                label="Categoria" 
                field="categoria" 
                icon={Tag} 
                required={true}
                options={[
                  { value: 'Tecnologia', label: 'Tecnologia' },
                  { value: 'Vendas', label: 'Vendas' },
                  { value: 'Marketing', label: 'Marketing' },
                  { value: 'Recursos Humanos', label: 'Recursos Humanos' },
                  { value: 'Financeiro', label: 'Financeiro' },
                  { value: 'Operacional', label: 'Operacional' },
                  { value: 'Comercial', label: 'Comercial' },
                  { value: 'Outro', label: 'Outro' }
                ]}
              />
              
              <FieldDisplay 
                label="Cargo" 
                field="cargo" 
                icon={Briefcase} 
                required={true}
              />
              
              <FieldDisplay 
                label="Cliente" 
                field="cliente" 
                icon={Building2} 
                required={true}
              />
              
              <FieldDisplay 
                label="Produto" 
                field="produto" 
                icon={Package} 
                required={true}
              />
              
              <FieldDisplay 
                label="Local de Trabalho" 
                field="local_trabalho" 
                icon={MapPin}
              />
              
              <FieldDisplay 
                label="Salário" 
                field="salario" 
                icon={DollarSign}
              />
              
              <FieldDisplay 
                label="Horário de Trabalho" 
                field="horario_trabalho" 
                icon={Clock}
              />
              
              <FieldDisplay 
                label="Jornada de Trabalho" 
                field="jornada_trabalho" 
                icon={Users}
              />
            </div>
            
            {/* Coluna da Direita - Descrições Detalhadas */}
            <div className="space-y-4">
              <FieldDisplay 
                label="Descrição da Vaga" 
                field="descricao_vaga" 
                multiline
              />
              
              <FieldDisplay 
                label="Responsabilidades e Atribuições" 
                field="responsabilidades_atribuicoes" 
                multiline
              />
              
              <FieldDisplay 
                label="Requisitos e Qualificações" 
                field="requisitos_qualificacoes" 
                multiline
              />
              
              <FieldDisplay 
                label="Benefícios" 
                field="beneficios" 
                multiline
              />
              
              <FieldDisplay 
                label="Etapas do Processo" 
                field="etapas_processo" 
                multiline
              />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  site: 'Gupy',
                  categoria: 'Tecnologia',
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
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center font-medium"
            >
              <X className="h-4 w-4 mr-2" />
              Limpar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center font-medium"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Salvando...' : 'Salvar Vaga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormularioVaga
