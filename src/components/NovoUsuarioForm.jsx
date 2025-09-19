'use client'

import { useState  } from 'react'
import { useAuth  } from '../contexts/AuthContext'



export default function NovoUsuarioForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'RH'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { createUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validar formulário antes de enviar
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '))
      setLoading(false)
      return
    }

    try {
      const { data, error: createError } = await createUser(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      )

      if (createError) {
        // Tratar diferentes tipos de erro
        let errorMessage = createError.message || createError
        
        if (typeof createError === 'string') {
          errorMessage = createError
        } else if (createError.error) {
          errorMessage = createError.error
        }

        setError(errorMessage)
        setLoading(false)
      } else if (data?.success) {
        setSuccess(data.message || `Usuário ${formData.name} criado com sucesso!`)
        setFormData({ name: '', email: '', password: '', role: 'RH' })
        setLoading(false)
        
        // Chamar onSuccess após um pequeno delay para mostrar a mensagem
        setTimeout(() => {
          onSuccess()
        }, 2000)
      } else {
        setError('Erro desconhecido ao criar usuário')
        setLoading(false)
      }
    } catch (error) {
      console.error('Erro no handleSubmit:', error)
      setError('Erro de conexão. Verifique sua internet e tente novamente.')
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erros quando o usuário começar a digitar
    if (error) {
      setError('')
    }
  }

  const validateForm = () => {
    const errors = []

    if (!formData.name.trim()) {
      errors.push('Nome é obrigatório')
    }

    if (!formData.email.trim()) {
      errors.push('Email é obrigatório')
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.push('Formato de email inválido')
      }
    }

    if (!formData.password) {
      errors.push('Senha é obrigatória')
    } else if (formData.password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres')
    }

    if (!formData.role) {
      errors.push('Tipo de usuário é obrigatório')
    }

    return errors
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha Provisória
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={6}
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Tipo de Usuário
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="RH">RH</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => {
            setFormData({ name: '', email: '', password: '', role: 'RH' })
            setError('')
            setSuccess('')
          }}
          disabled={loading}
          className="flex-1 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Limpar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando...
            </div>
          ) : (
            'Criar Usuário'
          )}
        </button>
      </div>
    </form>
    </div>
  )
}