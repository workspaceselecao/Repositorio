'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline' // Adicionado XMarkIcon
import { useUsersCache } from '../hooks/useSupabaseCache'
import { useAuth } from '../contexts/AuthContext'

// Novo componente de modal para edição de usuário
function EditarUsuarioModal({ user, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    role: user?.role || 'RH'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        role: user.role || 'RH'
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await onSave(user.id, formData)
      onClose()
    } catch (err) {
      setError(err.message || 'Erro ao salvar usuário')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Editar Usuário: {user.email}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
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

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


export default function ListaUsuarios() {
  const { data: users = [], loading, error: cacheError, refetch } = useUsersCache()
  const { profile, updateUserProfile } = useAuth()
  const [error, setError] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    if (cacheError) {
      setError('Erro ao carregar usuários: ' + cacheError.message)
      console.error('Erro detalhado:', cacheError)
    } else if (profile && profile.role !== 'ADMIN') {
      setError('Acesso negado. Apenas administradores podem visualizar a lista de usuários.')
    } else {
      setError('')
    }
  }, [cacheError, profile])

  const handleEdit = useCallback((user) => {
    setEditingUser(user)
    setIsEditModalOpen(true)
  }, [])

  const handleSaveEdit = useCallback(async (userId, updates) => {
    try {
      const { error: updateError } = await updateUserProfile(userId, updates)
      if (updateError) throw new Error(updateError)
      refetch() // Refetch para atualizar a lista após a edição
    } catch (err) {
      console.error('Erro ao salvar edição do usuário:', err)
      throw err // Re-throw para o modal exibir o erro
    }
  }, [refetch, updateUserProfile])

  const handleCloseEdit = useCallback(() => {
    setEditingUser(null)
    setIsEditModalOpen(false)
  }, [])

  const deleteUser = async (userId, userEmail) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${userEmail}?`)) {
      return
    }

    try {
      // Primeiro, tentar excluir o usuário da tabela 'users'
      const { error: deleteProfileError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (deleteProfileError) {
        alert('Erro ao excluir perfil do usuário: ' + deleteProfileError.message)
        console.error(deleteProfileError)
        return
      }

      // Em seguida, tentar excluir o usuário do auth.users (se necessário e permitido)
      // Nota: Excluir de auth.users pode ser restrito por RLS ou políticas do Supabase.
      // Geralmente, a exclusão do perfil em 'public.users' é suficiente para a lógica da aplicação.
      // Se a exclusão de auth.users for necessária, ela deve ser feita com uma chave de serviço
      // ou através de uma Edge Function para segurança.
      // Por enquanto, vamos focar na exclusão do perfil.

      refetch() // Refetch para atualizar a lista após a exclusão
      alert('Usuário excluído com sucesso')
    } catch (err) {
      alert('Erro interno do servidor ao excluir usuário')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar usuários
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setError('')
                  refetch()
                }}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Função
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data de Criação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(users || []).map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString('pt-BR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-600 hover:text-blue-900 mr-2"
                  title="Editar usuário"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteUser(user.id, user.email)}
                  className="text-red-600 hover:text-red-900"
                  title="Excluir usuário"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {(users || []).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum usuário encontrado
        </div>
      )}

      <EditarUsuarioModal
        user={editingUser}
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </div>
  )
}