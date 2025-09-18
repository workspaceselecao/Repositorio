'use client'

import { useState, useEffect, useCallback, useMemo, memo  } from 'react'
import { supabase  } from '../lib/supabase'
import EditarVagaModal from './EditarVagaModal'
import Pagination from './Pagination'
import VirtualizedVagasList from './VirtualizedVagasList'
import PerformanceDashboard from './PerformanceDashboard'
import VagaCardExpansivel from './VagaCardExpansivel'
import { Vaga  } from '../types'
import { useDebounce  } from '../hooks/useDebounce'
import { usePagination  } from '../hooks/usePagination'
import { useVagasCache, useClientesCache, useSitesCache  } from '../hooks/useSupabaseCache'
import { useAPIPerformance, useUserPerformance, useMemoryMonitor  } from '../hooks/usePerformanceMetrics'
import { PencilIcon, 
  TrashIcon, 
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowDownTrayIcon,
  ChartBarIcon
 } from '@heroicons/react/24/outline'
import * as XLSX from 'xlsx'



const VagaCard = memo(function VagaCard({ vaga, onEdit, onDelete, onExport }) {
  const [expanded, setExpanded] = useState(false)

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir a vaga ${vaga.cargo} - ${vaga.cliente}?`)) {
      onDelete(vaga.id)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{vaga.cargo}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(vaga)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
              title="Editar vaga"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => onExport(vaga)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
              title="Exportar vaga para Excel"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              title="Excluir vaga"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Informações principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">{vaga.site}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <UserGroupIcon className="h-4 w-4 mr-2" />
            <span className="text-sm">{vaga.categoria}</span>
          </div>
          {vaga.salario && (
            <div className="flex items-center text-green-600">
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{vaga.salario}</span>
            </div>
          )}
          {vaga.jornada_trabalho && (
            <div className="flex items-center text-gray-600">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span className="text-sm">{vaga.jornada_trabalho}</span>
            </div>
          )}
        </div>

        {/* Produto */}
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {vaga.produto}
          </span>
        </div>

        {/* Botão expandir */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {expanded ? 'Ver menos' : 'Ver mais detalhes'}
        </button>
      </div>

      {/* Conteúdo expandido */}
      {expanded && (
        <div className="border-t border-gray-200 p-6 space-y-4">
          {vaga.descricao_vaga && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Descrição da Vaga</h4>
              <p className="text-gray-700 text-sm whitespace-pre-line">{vaga.descricao_vaga}</p>
            </div>
          )}

          {vaga.responsabilidades_atribuicoes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Responsabilidades e Atribuições</h4>
              <p className="text-gray-700 text-sm whitespace-pre-line">{vaga.responsabilidades_atribuicoes}</p>
            </div>
          )}

          {vaga.requisitos_qualificacoes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Requisitos e Qualificações</h4>
              <p className="text-gray-700 text-sm whitespace-pre-line">{vaga.requisitos_qualificacoes}</p>
            </div>
          )}

          {vaga.horario_trabalho && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Horário de Trabalho</h4>
              <p className="text-gray-700 text-sm">{vaga.horario_trabalho}</p>
            </div>
          )}

          {vaga.beneficios && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Benefícios</h4>
              <p className="text-gray-700 text-sm whitespace-pre-line">{vaga.beneficios}</p>
            </div>
          )}

          {vaga.local_trabalho && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Local de Trabalho</h4>
              <p className="text-gray-700 text-sm">{vaga.local_trabalho}</p>
            </div>
          )}

          {vaga.etapas_processo && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Etapas do Processo</h4>
              <p className="text-gray-700 text-sm whitespace-pre-line">{vaga.etapas_processo}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
})



export default function ListaVagas({ onVagasChange }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCliente, setFilterCliente] = useState('')
  const [filterSite, setFilterSite] = useState('')
  const [editingVaga, setEditingVaga] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [viewMode, setViewMode] = useState<'paginated' | 'virtualized' | 'expanded'>('expanded')
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false)

  // Debounce para busca
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Usar cache para dados
  const { 
    data: vagas = [], 
    loading: vagasLoading, 
    error: vagasError, 
    refetch} = useVagasCache()

  const { 
    data: clientes = [], 
    loading: clientesLoading} = useClientesCache()

  const { 
    data: sites = [], 
    loading: sitesLoading} = useSitesCache()

  // Extrair nomes dos clientes e sites para filtros
  const clientesNomes = useMemo(() => clientes?.map(c => c.nome) || [], [clientes])
  const sitesNomes = useMemo(() => sites || [], [sites])

  const error = vagasError?.message || ''

  // Performance monitoring
  const { measureAPICall } = useAPIPerformance()
  const { measureUserAction } = useUserPerformance()
  useMemoryMonitor()

  const handleEdit = useCallback((vaga) => {
    setEditingVaga(vaga)
    setIsEditModalOpen(true)
  }, [])

  const handleSaveEdit = useCallback((updatedVaga) => {
    // Atualizar cache local e refetch para sincronizar
    refetch()
    setEditingVaga(null)
    setIsEditModalOpen(false)
  }, [refetch])

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
        { wch}, // Horário
        { wch}, // Jornada
        { wch}, // Observações
        { wch}  // Data Criação
      ]
      ws['!cols'] = colWidths

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
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              placeholder="Buscar por cargo, cliente ou produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cliente
            </label>
            <select
              value={filterCliente}
              onChange={(e) => setFilterCliente(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={clientesLoading}
            >
              <option value="">Todos os clientes</option>
              {clientesNomes.map(cliente => (
                <option key={cliente} value={cliente}>{cliente}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site
            </label>
            <select
              value={filterSite}
              onChange={(e) => setFilterSite(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={sitesLoading}
            >
              <option value="">Todos os sites</option>
              {sitesNomes.map(site => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
          </div>
        </div>
        
        {(searchTerm || filterCliente || filterSite) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm('')
                setFilterCliente('')
                setFilterSite('')
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {/* Estatísticas e controles de paginação */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-blue-800">
            Mostrando <span className="font-semibold">{pagination.startIndex + 1}-{Math.min(pagination.endIndex, pagination.totalItems)}</span> de{' '}
            <span className="font-semibold">{pagination.totalItems}</span> vagas
            {pagination.totalItems !== (vagas?.length || 0) && (
              <span className="text-blue-600"> (filtradas de {vagas?.length || 0} total)</span>
            )}
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-blue-700">Visualização:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="expanded">Expandida (1 por linha)</option>
                <option value="paginated">Paginada</option>
                <option value="virtualized">Virtualizada</option>
              </select>
            </div>

            <button
              onClick={() => setShowPerformanceDashboard(true)}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
            >
              <ChartBarIcon className="h-4 w-4" />
              Performance
            </button>
            
            {(viewMode === 'paginated' || viewMode === 'expanded') && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-blue-700">Itens por página:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3</option>
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de vagas */}
      {pagination.totalItems === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhuma vaga encontrada</p>
          {(vagas?.length || 0) === 0 && (
            <p className="text-gray-400 text-sm mt-2">
              Importe os dados do JSON para começar
            </p>
          )}
        </div>
      ) : viewMode === 'virtualized' ? (
        <VirtualizedVagasList
          vagas={vagasFiltradas}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onExport={handleExportVaga}
          containerHeight={600}
          itemHeight={200}
        />
      ) : viewMode === 'expanded' ? (
        <>
          <div className="space-y-6">
            {pagination.paginatedData.map((vaga) => (
              <VagaCardExpansivel
                key={vaga.id}
                vaga={vaga}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onExport={handleExportVaga}
              />
            ))}
          </div>
          
          {/* Componente de paginação */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            onNext={pagination.nextPage}
            onPrev={pagination.prevPage}
            canGoNext={pagination.canGoNext}
            canGoPrev={pagination.canGoPrev}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {pagination.currentPageData.map(vaga => (
              <VagaCard
                key={vaga.id}
                vaga={vaga}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onExport={handleExportVaga}
              />
            ))}
          </div>
          
          {/* Componente de paginação */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            onNext={pagination.nextPage}
            onPrev={pagination.prevPage}
            canGoNext={pagination.canGoNext}
            canGoPrev={pagination.canGoPrev}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      )}

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