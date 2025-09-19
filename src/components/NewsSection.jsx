'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useNews } from '../hooks/useNews'
import { useAuth } from '../contexts/AuthContext'
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Plus,
  Save,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function NewsSection({ isAdminView = false }) {
  const { user, profile } = useAuth()
  const { 
    news, 
    loading, 
    error, 
    createNews, 
    updateNews, 
    deleteNews 
  } = useNews(isAdminView)
  
  const [isEditing, setIsEditing] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [newNews, setNewNews] = useState({ title: '', content: '', priority: 'medium' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Adicionar nova notícia
  const handleAddNews = async () => {
    if (!newNews.title || !newNews.content) return

    try {
      setIsSubmitting(true)
      await createNews({
        title: newNews.title,
        content: newNews.content,
        priority: newNews.priority
      })
      setNewNews({ title: '', content: '', priority: 'medium' })
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao criar notícia:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Editar notícia
  const handleEditNews = (newsItem) => {
    setEditingNews({ ...newsItem })
    setIsEditing(true)
  }

  // Salvar edição
  const handleSaveEdit = async () => {
    if (!editingNews.title || !editingNews.content) return

    try {
      setIsSubmitting(true)
      await updateNews(editingNews.id, {
        title: editingNews.title,
        content: editingNews.content,
        priority: editingNews.priority
      })
      setEditingNews(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar notícia:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Excluir notícia
  const handleDeleteNews = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return

    try {
      await deleteNews(id)
    } catch (error) {
      console.error('Erro ao excluir notícia:', error)
    }
  }

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingNews(null)
    setIsEditing(false)
    setNewNews({ title: '', content: '', priority: 'medium' })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Média'
      case 'low': return 'Baixa'
      default: return 'Normal'
    }
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

  // Verificar se o usuário pode editar notícias
  const canEdit = profile?.role === 'ADMIN'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando notícias...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-2">Erro ao carregar notícias</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Newspaper className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Novas Notícias</h2>
            <p className="text-muted-foreground">Fique por dentro das últimas atualizações do sistema</p>
          </div>
        </div>
        {canEdit && (
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancelar' : 'Nova Notícia'}
          </Button>
        )}
      </motion.div>

      {/* Formulário de Nova Notícia */}
      {isEditing && canEdit && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit3 className="h-5 w-5 text-primary" />
                <span>{editingNews ? 'Editar Notícia' : 'Nova Notícia'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Título
                </label>
                <input
                  type="text"
                  value={editingNews ? editingNews.title : newNews.title}
                  onChange={(e) => {
                    if (editingNews) {
                      setEditingNews({ ...editingNews, title: e.target.value })
                    } else {
                      setNewNews({ ...newNews, title: e.target.value })
                    }
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Digite o título da notícia"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Conteúdo
                </label>
                <textarea
                  value={editingNews ? editingNews.content : newNews.content}
                  onChange={(e) => {
                    if (editingNews) {
                      setEditingNews({ ...editingNews, content: e.target.value })
                    } else {
                      setNewNews({ ...newNews, content: e.target.value })
                    }
                  }}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Digite o conteúdo da notícia"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Prioridade
                </label>
                <select
                  value={editingNews ? editingNews.priority : newNews.priority}
                  onChange={(e) => {
                    if (editingNews) {
                      setEditingNews({ ...editingNews, priority: e.target.value })
                    } else {
                      setNewNews({ ...newNews, priority: e.target.value })
                    }
                  }}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={editingNews ? handleSaveEdit : handleAddNews}
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {editingNews ? 'Salvar' : 'Adicionar'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Lista de Notícias */}
      <motion.div variants={itemVariants} className="space-y-4">
        {news.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nenhuma notícia disponível
              </h3>
              <p className="text-muted-foreground">
                {canEdit ? 'Adicione a primeira notícia para começar' : 'Aguarde novas notícias'}
              </p>
            </CardContent>
          </Card>
        ) : (
          news.map((newsItem, index) => (
            <motion.div
              key={newsItem.id}
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {newsItem.title}
                        </CardTitle>
                        <Badge className={getPriorityColor(newsItem.priority)}>
                          {getPriorityLabel(newsItem.priority)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(newsItem.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(newsItem.created_at).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {newsItem.created_by?.slice(0, 8) || 'Sistema'}
                        </div>
                      </div>
                    </div>
                    {canEdit && (
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNews(newsItem)}
                          className="h-8 w-8 p-0"
                          title="Editar notícia"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNews(newsItem.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          title="Excluir notícia"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {newsItem.content}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  )
}
