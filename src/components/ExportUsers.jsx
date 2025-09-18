'use client'

import { useState } from 'react'
import { useUsersCache } from '../hooks/useSupabaseCache'

export default function ExportUsers({ className = '' }) {
  const { data: users = [] } = useUsersCache()
  const [isExporting, setIsExporting] = useState(false)

  const exportToExcel = async () => {
    setIsExporting(true)
    
    try {
      // Preparar dados para exportação
      const usersData = (users || []).map(user => ({
        'Nome': user.name || '',
        'Email': user.email || '',
        'Função': user.role || '',
        'Data de Criação': user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '',
        'Última Atualização': user.updated_at ? new Date(user.updated_at).toLocaleDateString('pt-BR') : ''
      }))

      // Verificar se há dados para exportar
      if (usersData.length === 0) {
        alert('Nenhum usuário encontrado para exportar.')
        return
      }

      // Criar workbook
      const XLSX = (await import('xlsx')).default
      const worksheet = XLSX.utils.json_to_sheet(usersData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuários')

      // Gerar nome do arquivo com data
      const today = new Date().toISOString().split('T')[0]
      const filename = `backup-usuarios-${today}.xlsx`

      // Fazer download
      XLSX.writeFile(workbook, filename)
      
      alert(`Backup dos usuários exportado com sucesso!\nArquivo: ${filename}`)
    } catch (error) {
      console.error('Erro ao exportar usuários:', error)
      alert('Erro ao exportar usuários. Verifique o console para mais detalhes.')
    } finally {
      setIsExporting(false)
    }
  }

  if ((users || []).length === 0) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed"
      >
        Nenhum usuário encontrado
      </button>
    )
  }

  return (
    <button
      onClick={exportToExcel}
      disabled={isExporting}
      className={`${className} ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isExporting ? 'Exportando...' : `Exportar Usuários (${(users || []).length})`}
    </button>
  )
}
