'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import EditarVagaModal from './EditarVagaModal'
import PerformanceDashboard from './PerformanceDashboard'
import { useDebounce } from '../hooks/useDebounce'
import { usePagination } from '../hooks/usePagination'
import { useVagasCache } from '../hooks/useSupabaseCache'
import { useAPIPerformance, useUserPerformance, useMemoryMonitor } from '../hooks/usePerformanceMetrics'
import * as XLSX from 'xlsx'

// Importar os novos componentes modulares
import VagaFilters from './vagas/VagaFilters'
import VagaListControls from './vagas/VagaListControls'
import VagaDisplay from './vagas/VagaDisplay'

export default function ListaVagas({ onVagasChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCliente, setFilterCliente] = useState('')
  const [filterSite, setFilterSite] = useState('')
  const [editingVaga, setEditingVaga] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [viewMode, setViewMode] = useState('expanded') // Default para 'expanded'
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false)

  // Debounce para busca
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Usar cache para dados
  const {
    data: vagas = [],
    loading: vagasLoading,
    error: vagasError,
    refetch
  } = useVagasCache()

  const error = vagasError?.message || ''

  // Performance monitoring
  const { measureAPICall } = useAPIPerformance()
  const { measureUserAction } = useUserPerformance()
  useMemoryMonitor()

  const handleEdit = useCallback((vaga) => {
    setEditingVaga(vaga)
    setIsEditModalOpen(true)
  }, [])

  const handleSaveEdit = useCallback(async (updatedVaga) => {
    try {
      await measureAPICall(async () => {
        const { error } = await supabase
          .from('vagas')
          .update(updatedVaga)
          .eq('id', updatedVaga.id);

        if (error) {
          throw error;
        }
      }, 'updateVaga');

      // Refetch para atualizar cache
      refetch();
      setEditingVaga(null);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar edição da vaga:', err);
      alert('Erro ao salvar edição da vaga.');
    }
  }, [refetch, measureAPICall]);

  const handleCloseEdit = useCallback(() => {
    setEditingVaga(null)
    setIsEditModalOpen(false)
  }, [])

  const handleExportVaga = useCallback(async (vaga) => {
    try {
      // Preparar dados para export
      const dadosExport = [{
        'ID': vaga.id,
        'Cliente': vaga.cliente,
        'Site': vaga.site,
        'Categoria': vaga.categoria,
        'Cargo': vaga.cargo,
        'Produto': vaga.produto,
        'Descrição': vaga.descricao_vaga || '',
        'Requisitos': vaga.requisitos_qualificacoes || '',
        'Benefícios': vaga.beneficios || '',
        'Salário': vaga.salario || '',
        'Localização': vaga.local_trabalho || '',
        'Horário': vaga.horario_trabalho || '',
        'Jornada': vaga.jornada_trabalho || '',
        'Observações': vaga.etapas_processo || '',
        'Data Criação': new Date(vaga.created_at).toLocaleDateString('pt-BR')
      }]

      // Criar workbook
      const ws = XLSX.utils.json_to_sheet(dadosExport)
      const wb = XLSX.utils.book_new()

      // Ajustar largura das colunas dinamicamente
      const header = Object.keys(dadosExport[0]);
      const colWidths = header.map(key => ({
        wch: Math.max(
          key.length, // Largura mínima baseada no cabeçalho
          ...dadosExport.map(item => (item[key] ? String(item[key]).length : 0))
        ) + 2 // Adicionar um pequeno padding
      }));
      ws['!cols'] = colWidths;

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Vaga')

      // Download do arquivo
      const dataAtual = new Date().toISOString().split('T')[0]
      const nomeArquivo = `vaga-${vaga.cliente}-${vaga.cargo}-${dataAtual}.xlsx`

      XLSX.writeFile(wb, nomeArquivo)

    } catch (error) {
      console.error('Erro ao exportar vaga:', error)
      alert('Erro ao exportar vaga para Excel')
    }
  }, [])

  const handleDelete = useCallback(async (id) => {
    measureUserAction(async () => {
      try {
        await measureAPICall(async () => {
          const { error } = await supabase
            .from('vagas')
            .delete()
            .eq('id', id)

          if (error) {
            throw error
          }
        }, 'deleteVaga')

        // Refetch para atualizar cache
        refetch()
      } catch (err) {
        console.error('Erro ao excluir vaga:', err)
      }
    }, 'deleteVaga')
  }, [refetch, measureAPICall, measureUserAction])

  // Filtrar vagas com memoização
  const vagasFiltradas = useMemo(() => {
    return (vagas || []).filter(vaga => {
      const matchSearch = debouncedSearchTerm === '' ||
        vaga.cargo.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        vaga.cliente.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        vaga.produto.toLowerCase().includes(debouncedSearchTerm.toLowerCase())

      const matchCliente = filterCliente === '' || vaga.cliente === filterCliente
      const matchSite = filterSite === '' || vaga.site === filterSite

      return matchSearch && matchCliente && matchSite
    })
  }, [vagas, debouncedSearchTerm, filterCliente, filterSite])

  // Paginação
  const pagination = usePagination({
    data: vagasFiltradas,
    itemsPerPage
  })

  // Memoizar transformação das vagas para export
  const vagasParaExport = useMemo(() => {
    return vagasFiltradas.map(vaga => ({
      id: vaga.id,
      cliente: vaga.cliente,
      site: vaga.site,
      categoria: vaga.categoria,
      cargo: vaga.cargo,
      produto: vaga.produto,
      descricao: vaga.descricao_vaga || '',
      requisitos: vaga.requisitos_qualificacoes || '',
      beneficios: vaga.beneficios || '',
      salario: vaga.salario || '',
      localizacao: vaga.local_trabalho || '',
      regime: '', // Não disponível no schema atual
      horario: vaga.horario_trabalho || '',
      contrato: vaga.jornada_trabalho || '',
      observacoes: vaga.etapas_processo || '',
      created_at: vaga.created_at
    }))
  }, [vagasFiltradas])

  // Efeito para notificar mudanças nas vagas para export
  useEffect(() => {
    if (onVagasChange) {
      onVagasChange(vagasParaExport)
    }
  }, [vagasParaExport, onVagasChange])

  if (vagasLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    const isConfigError = error.includes('placeholder') || error.includes('404') || error.includes('Failed to load resource')

    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Erro ao carregar vagas
            </h3>
            <p className="text-red-600 mb-4">
              {isConfigError
                ? 'As variáveis de ambiente do Supabase não estão configuradas. Verifique a configuração do Vercel.'
                : error
              }
            </p>
            {isConfigError && (
              <div className="text-sm text-red-700 mb-4 p-3 bg-red-100 rounded">
                <p className="font-semibold mb-2">Para corrigir:</p>
                <ol className="list-decimal list-inside space-y-1 text-left">
                  <li>Acesse o dashboard do Vercel</li>
                  <li>Vá para Settings → Environment Variables</li>
                  <li>Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>Faça redeploy da aplicação</li>
                </ol>
              </div>
            )}
            <button
              onClick={refetch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <VagaFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCliente={filterCliente}
        setFilterCliente={setFilterCliente}
        filterSite={filterSite}
        setFilterSite={setFilterSite}
      />

      {/* Estatísticas e controles de paginação */}
      <VagaListControls
        viewMode={viewMode}
        setViewMode={setViewMode}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setShowPerformanceDashboard={setShowPerformanceDashboard}
        totalItems={pagination.totalItems}
        totalVagasRaw={vagas?.length || 0}
      />

      {/* Lista de vagas */}
      <VagaDisplay
        vagas={vagasFiltradas}
        viewMode={viewMode}
        pagination={pagination}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExportVaga}
        itemsPerPage={itemsPerPage}
        totalVagasRaw={vagas?.length || 0}
      />

      {/* Modal de edição */}
      <EditarVagaModal
        vaga={editingVaga}
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />

      {/* Dashboard de Performance */}
      <PerformanceDashboard
        isOpen={showPerformanceDashboard}
        onClose={() => setShowPerformanceDashboard(false)}
      />
    </div>
  )
}