import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function useNews(includeInactive = false) {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  // Função para buscar notícias
  const fetchNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (includeInactive) {
        params.append('includeInactive', 'true')
      }

      const response = await fetch(`/api/news?${params}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao buscar notícias')
      }

      setNews(result.data || [])
    } catch (err) {
      console.error('Erro ao buscar notícias:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [includeInactive])

  // Função para criar notícia
  const createNews = useCallback(async (newsData) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newsData,
          user_id: user.id
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao criar notícia')
      }

      // Atualizar lista local
      setNews(prev => [result.data, ...prev])
      return result.data
    } catch (err) {
      console.error('Erro ao criar notícia:', err)
      setError(err.message)
      throw err
    }
  }, [user])

  // Função para atualizar notícia
  const updateNews = useCallback(async (id, newsData) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const response = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newsData,
          user_id: user.id
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao atualizar notícia')
      }

      // Atualizar lista local
      setNews(prev => prev.map(item => 
        item.id === id ? result.data : item
      ))
      return result.data
    } catch (err) {
      console.error('Erro ao atualizar notícia:', err)
      setError(err.message)
      throw err
    }
  }, [user])

  // Função para excluir notícia
  const deleteNews = useCallback(async (id) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao excluir notícia')
      }

      // Atualizar lista local
      setNews(prev => prev.filter(item => item.id !== id))
      return true
    } catch (err) {
      console.error('Erro ao excluir notícia:', err)
      setError(err.message)
      throw err
    }
  }, [user])

  // Função para alternar status ativo/inativo
  const toggleNewsStatus = useCallback(async (id, isActive) => {
    try {
      const newsItem = news.find(item => item.id === id)
      if (!newsItem) {
        throw new Error('Notícia não encontrada')
      }

      return await updateNews(id, {
        ...newsItem,
        is_active: isActive
      })
    } catch (err) {
      console.error('Erro ao alternar status da notícia:', err)
      setError(err.message)
      throw err
    }
  }, [news, updateNews])

  // Carregar notícias quando o hook for montado
  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  return {
    news,
    loading,
    error,
    fetchNews,
    createNews,
    updateNews,
    deleteNews,
    toggleNewsStatus
  }
}
