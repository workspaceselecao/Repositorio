'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useNavigation } from '../hooks/useNavigation'
import {
  HomeIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Lista de Clientes', href: '/vagas', icon: UserGroupIcon },
  { name: 'Comparativo de Clientes', href: '/comparativo', icon: ChartBarIcon },
  { name: 'Nova Vaga', href: '/vagas/nova', icon: PlusIcon },
  { name: 'Configurações', href: '/configuracoes', icon: Cog6ToothIcon, adminOnly: true },
]

export default function Sidebar({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const { navigate } = useNavigation()
  const pathname = usePathname()
  const [lastClickTime, setLastClickTime] = useState(0)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
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
    if (now - lastClickTime < 500) {
      console.log('Navigation debounced, ignoring click')
      return
    }
    setLastClickTime(now)
    navigate(href)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {/* Logomarca */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-gray-800 truncate">
                REPOSITÓRIO
              </h1>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            // Verificar se o usuário tem permissão para ver o item
            if (item.adminOnly && profile?.role !== 'ADMIN') {
              return null
            }

            const isCurrent = isActive(item.href)
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`${
                  isCurrent
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 w-full text-left`}
              >
                <item.icon
                  className={`${
                    isCurrent ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  } h-5 w-5 mr-3 flex-shrink-0`}
                />
                {sidebarOpen && <span className="truncate">{item.name}</span>}
              </button>
            )
          })}
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-gray-200">
          {sidebarOpen && (
            <div className="mb-4">
              <div className="text-sm text-gray-500">Usuário:</div>
              <div className="text-sm font-medium text-gray-900 truncate">
                {profile?.name || profile?.email || 'Carregando...'}
              </div>
              <div className="flex items-center mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  profile?.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {profile?.role || 'RH'}
                </span>
              </div>
            </div>
          )}
          
          <button
            onClick={handleSignOut}
            className={`${
              sidebarOpen 
                ? 'w-full justify-center px-4' 
                : 'w-10 h-10 justify-center'
            } flex items-center py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-150`}
            title={!sidebarOpen ? 'Sair' : ''}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            {sidebarOpen && <span className="ml-2">Sair</span>}
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">
                REPOSITÓRIO
              </h1>
            </div>
            <div className="w-10"></div> {/* Spacer */}
          </div>
        </div>
        
        {children}
      </div>
    </div>
  )
}