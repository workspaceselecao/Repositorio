'use client'

import { useState  } from 'react'
import * as XLSX from 'xlsx'





export default function ExportExcel({ 
  vagas, 
  filename = 'vagas-exportadas',
  buttonText = 'Exportar Excel',
  className = 'btn-primary'
}) {
  const [loading, setLoading] = useState(false)

  const exportToExcel = async () => {
    if (vagas.length === 0) {
      alert('Não há dados para exportar')
      return
    }

    setLoading(true)

    try {
      // Preparar dados para export
      const dadosExport = vagas.map(vaga => ({
        'ID': vaga.id,
        'Cliente': vaga.cliente,
        'Site': vaga.site,
        'Categoria': vaga.categoria,
        'Cargo': vaga.cargo,
        'Produto': vaga.produto,
        'Descrição': vaga.descricao,
        'Requisitos': vaga.requisitos,
        'Benefícios': vaga.beneficios,
        'Salário': vaga.salario,
        'Localização': vaga.localizacao,
        'Regime': vaga.regime,
        'Horário': vaga.horario,
        'Contrato': vaga.contrato,
        'Observações': vaga.observacoes,
        'Data Criação': new Date(vaga.created_at).toLocaleDateString('pt-BR')
      }))

      // Criar workbook
      const ws = XLSX.utils.json_to_sheet(dadosExport)
      const wb = XLSX.utils.book_new()
      
      // Ajustar largura das colunas
      const colWidths = [
        { wch}, // ID
        { wch}, // Cliente
        { wch}, // Site
        { wch}, // Categoria
        { wch}, // Cargo
        { wch}, // Produto
        { wch}, // Descrição
        { wch}, // Requisitos
        { wch}, // Benefícios
        { wch}, // Salário
        { wch}, // Localização
        { wch}, // Regime
        { wch}, // Horário
        { wch}, // Contrato
        { wch}, // Observações
        { wch}  // Data Criação
      ]
      ws['!cols'] = colWidths

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Vagas')

      // Download do arquivo
      const dataAtual = new Date().toISOString().split('T')[0]
      const nomeArquivo = `${filename}-${dataAtual}.xlsx`
      
      XLSX.writeFile(wb, nomeArquivo)

    } catch (error) {
      console.error('Erro ao exportar Excel:', error)
      alert('Erro ao exportar arquivo Excel')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={exportToExcel}
      disabled={loading || vagas.length === 0}
      className={`${className} flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      title={vagas.length === 0 ? 'Não há dados para exportar' : 'Exportar para Excel'}
    >
      {loading ? (
        'Exportando...'
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          {buttonText}
        </>
      )}
    </button>
  )
}