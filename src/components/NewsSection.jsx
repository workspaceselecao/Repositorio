'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Plus,
  Save,
  X
} from 'lucide-react'

export default function NewsSection() {
  const [news, setNews] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [newNews, setNewNews] = useState({ title: '', content: '', date: '' })

  // Carregar notícias do localStorage
  useEffect(() => {
    const savedNews = localStorage.getItem('dashboardNews')
    if (savedNews) {
      setNews(JSON.parse(savedNews))
    } else {
      // Notícias padrão
      const defaultNews = [
        {
          id: 1,
          title: 'Bem-vindo ao Sistema de Vagas',
          content: 'Sistema atualizado com novas funcionalidades de gerenciamento e análise de vagas de emprego.',
          date: new Date().toISOString().split('T')[0],
          priority: 'high'
        },
        {
          id: 2,
          title: 'Nova Funcionalidade: Comparativo de Vagas',
          content: 'Agora você pode comparar vagas de diferentes empresas e analisar benefícios, salários e requisitos.',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          priority: 'medium'
        },
        {
          id: 3,
          title: 'Manutenção Programada',
          content: 'Sistema passará por manutenção preventiva no próximo domingo das 02:00 às 04:00.',
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          priority: 'low'
        }
      ]
      setNews(defaultNews)
      localStorage.setItem('dashboardNews', JSON.stringify(defaultNews))
    }
  }, [])

  // Salvar notícias no localStorage
  const saveNews = (updatedNews) => {
    setNews(updatedNews)
    localStorage.setItem('dashboardNews', JSON.stringify(updatedNews))
  }

  // Adicionar nova notícia
  const handleAddNews = () => {
    if (newNews.title && newNews.content) {
      const newsItem = {
        id: Date.now(),
        title: newNews.title,
        content: newNews.content,
        date: newNews.date || new Date().toISOString().split('T')[0],
        priority: 'medium'
      }
      const updatedNews = [newsItem, ...news]
      saveNews(updatedNews)
      setNewNews({ title: '', content: '', date: '' })
      setIsEditing(false)
    }
  }

  // Editar notícia
  const handleEditNews = (newsItem) => {
    setEditingNews(newsItem)
    setIsEditing(true)
  }

  // Salvar edição
  const handleSaveEdit = () => {
    if (editingNews.title && editingNews.content) {
      const updatedNews = news.map(item => 
        item.id === editingNews.id ? editingNews : item
      )
      saveNews(updatedNews)
      setEditingNews(null)
      setIsEditing(false)
    }
  }

  // Excluir notícia
  const handleDeleteNews = (id) => {
    const updatedNews = news.filter(item => item.id !== id)
    saveNews(updatedNews)
  }

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingNews(null)
    setIsEditing(false)
    setNewNews({ title: '', content: '', date: '' })
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
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isEditing ? 'Cancelar' : 'Nova Notícia'}
        </Button>
      </motion.div>

      {/* Formulário de Nova Notícia */}
      {isEditing && (
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
                  Data
                </label>
                <input
                  type="date"
                  value={editingNews ? editingNews.date : newNews.date}
                  onChange={(e) => {
                    if (editingNews) {
                      setEditingNews({ ...editingNews, date: e.target.value })
                    } else {
                      setNewNews({ ...newNews, date: e.target.value })
                    }
                  }}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={editingNews ? handleSaveEdit : handleAddNews}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingNews ? 'Salvar' : 'Adicionar'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
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
                Adicione a primeira notícia para começar
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
                          <span>{new Date(newsItem.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(newsItem.date).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditNews(newsItem)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNews(newsItem.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
