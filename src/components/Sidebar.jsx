'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useSimpleNavigation } from '../hooks/useSimpleNavigation'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ThemeToggle } from './ui/theme-toggle'
import {
  Home,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Visão geral do sistema' },
  { name: 'Lista de Clientes', href: '/vagas', icon: Users, description: 'Gerenciar clientes' },
  { name: 'Comparativo', href: '/comparativo', icon: BarChart3, description: 'Análise comparativa' },
  { name: 'Configurações', href: '/configuracoes', icon: Settings, description: 'Configurações do sistema', adminOnly: true },
]

export default function Sidebar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const { navigate } = useSimpleNavigation()
  const pathname = usePathname()
  const [lastClickTime, setLastClickTime] = useState(0)

  // Persistir estado da sidebar no localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen')
    if (savedState !== null) {
      setSidebarOpen(JSON.parse(savedState))
    }
  }, [])

  const toggleSidebar = () => {
    const newState = !sidebarOpen
    setSidebarOpen(newState)
    localStorage.setItem('sidebarOpen', JSON.stringify(newState))
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const handleNavigation = (href) => {
    const now = Date.now()
    if (now - lastClickTime < 200) {
      return
    }
    setLastClickTime(now)
    navigate(href)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-16'} transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border flex flex-col shadow-lg relative`}>
        {/* Header */}
        <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'} p-4 border-b border-sidebar-border`}>
          <div className="flex items-center space-x-3">
            {/* Logomarca */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
            </div>
            {sidebarOpen && (
              <div className="animate-fade-in">
                <h1 className="text-xl font-bold text-sidebar-foreground truncate">
                  REPOSITÓRIO
                </h1>
                <p className="text-xs text-muted-foreground">Sistema de Vagas</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Botão de expansão quando contraída */}
        {!sidebarOpen && (
          <div className="absolute top-4 right-2 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 hover:bg-accent bg-sidebar border border-sidebar-border"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 ${sidebarOpen ? 'px-4' : 'px-2'} py-6 space-y-2`}>
          {navigation.map((item) => {
            // Verificar se o usuário tem permissão para ver o item
            if (item.adminOnly && profile?.role !== 'ADMIN') {
              return null
            }

            const isCurrent = isActive(item.href)
            return (
              <Button
                key={item.name}
                variant={isCurrent ? "secondary" : "ghost"}
                onClick={() => handleNavigation(item.href)}
                className={`${
                  isCurrent
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                    : 'hover:bg-sidebar-accent/50'
                } group flex items-center ${
                  sidebarOpen ? 'px-3 py-3' : 'px-2 py-3 justify-center'
                } text-sm font-medium rounded-lg transition-all duration-200 w-full ${
                  sidebarOpen ? 'text-left justify-start' : 'justify-center'
                } h-auto`}
                title={!sidebarOpen ? item.name : undefined}
              >
                <item.icon
                  className={`${
                    isCurrent ? 'text-sidebar-accent-foreground' : 'text-muted-foreground group-hover:text-sidebar-foreground'
                  } ${
                    sidebarOpen ? 'h-5 w-5 mr-3' : 'h-5 w-5'
                  } flex-shrink-0 transition-colors duration-200`}
                />
                {sidebarOpen && (
                  <div className="flex flex-col items-start animate-fade-in">
                    <span className="truncate font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground group-hover:text-sidebar-foreground/70">
                      {item.description}
                    </span>
                  </div>
                )}
              </Button>
            )
          })}
        </nav>

        {/* User info and actions */}
        <div className={`${sidebarOpen ? 'p-4' : 'p-2'} border-t border-sidebar-border space-y-4`}>
          {sidebarOpen && (
            <Card className="p-4 bg-muted/30 border-0">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {profile?.name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-sidebar-foreground truncate">
                    {profile?.name || profile?.email || 'Carregando...'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      profile?.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {profile?.role || 'RH'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          <div className={`flex items-center ${sidebarOpen ? 'space-x-2' : 'flex-col space-y-2'}`}>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className={`${
                sidebarOpen 
                  ? 'h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10' 
                  : 'h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10'
              }`}
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden bg-sidebar shadow-sm border-b border-sidebar-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="h-9 w-9"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">
                REPOSITÓRIO
              </h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
        
        {children}
      </div>
    </div>
  )
}