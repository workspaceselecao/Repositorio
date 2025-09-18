'use client'

import { useState, useEffect, useCallback, useMemo  } from 'react'
import { supabase  } from '../lib/supabase'
import { ChevronDownIcon, 
  ChevronUpIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ListBulletIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  BriefcaseIcon
 } from '@heroicons/react/24/outline'




export default function ComparativoVagas({ clientesSelecionados, filtros, onVagasChange }) {
  const [vagasPorCliente, setVagasPorCliente] = useState({})
  const [loading, setLoading] = useState(false)
  const [secoesExpandidas, setSecoesExpandidas] = useState(new Set())

  const loadVagas = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('vagas')
        .select('*')
        .in('cliente', clientesSelecionados)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filtros.site) {
        query = query.eq('site', filtros.site)
      }
      if (filtros.categoria) {
        query = query.eq('categoria', filtros.categoria)
      }
      if (filtros.cargo) {
        query = query.eq('cargo', filtros.cargo)
      }
      if (filtros.produto) {
        query = query.eq('produto', filtros.produto)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao carregar vagas:', error)
        return
      }

      // Agrupar vagas por cliente
      const vagasAgrupadas = {}
      data?.forEach(vaga => {
        if (!vagasAgrupadas[vaga.cliente]) {
          vagasAgrupadas[vaga.cliente] = []
        }
        vagasAgrupadas[vaga.cliente].push(vaga)
      })

      setVagasPorCliente(vagasAgrupadas)
    } catch (error) {
      console.error('Erro ao carregar vagas:', error)
    } finally {
      setLoading(false)
    }
  }, [clientesSelecionados, filtros])

  useEffect(() => {
    if (clientesSelecionados.length > 0) {
      loadVagas()
    } else {
      setVagasPorCliente({})
    }
  }, [clientesSelecionados, loadVagas])

  // Memoizar transformação das vagas para export
  const vagasParaExport = useMemo(() => {
    const todasVagas = Object.values(vagasPorCliente).flat()
    return todasVagas.map(vaga => ({
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
  }, [vagasPorCliente])

  // Efeito para notificar mudanças nas vagas para export
  useEffect(() => {
    if (onVagasChange) {
      onVagasChange(vagasParaExport)
    }
  }, [vagasParaExport, onVagasChange])


  const toggleSecao = (secao) => {
    const novasSecoes = new Set(secoesExpandidas)
    if (novasSecoes.has(secao)) {
      novasSecoes.delete(secao)
    } else {
      novasSecoes.add(secao)
    }
    setSecoesExpandidas(novasSecoes)
  }

  const secoes = [
    { 
      key: 'descricao_vaga', 
      titulo: 'Descrição da Vaga', 
      icon: DocumentTextIcon
    },
    { 
      key: 'responsabilidades_atribuicoes', 
      titulo: 'Responsabilidades e Atribuições', 
      icon: ClipboardDocumentListIcon
    },
    { 
      key: 'requisitos_qualificacoes', 
      titulo: 'Requisitos e Qualificações', 
      icon: AcademicCapIcon
    },
    { 
      key: 'salario', 
      titulo: 'Salário', 
      icon: CurrencyDollarIcon
    },
    { 
      key: 'horario_trabalho', 
      titulo: 'Horário de Trabalho', 
      icon: ClockIcon
    },
    { 
      key: 'jornada_trabalho', 
      titulo: 'Jornada de Trabalho', 
      icon: BriefcaseIcon
    },
    { 
      key: 'beneficios', 
      titulo: 'Benefícios', 
      icon: UserGroupIcon
    },
    { 
      key: 'local_trabalho', 
      titulo: 'Local de Trabalho', 
      icon: MapPinIcon
    },
    { 
      key: 'etapas_processo', 
      titulo: 'Etapas do Processo', 
      icon: ListBulletIcon
    }
  ]

  if (clientesSelecionados.length === 0) {
    return (
      <div className="bg-gray-50 p-12 rounded-lg border border-gray-200 text-center">
        <BuildingOfficeIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Comparativo de Clientes
        </h3>
        <p className="text-gray-600">
          Selecione clientes acima para começar a comparação
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesSelecionados.map((cliente) => (
          <div key={cliente} className="space-y-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              {secoes.map((secao) => (
                <div key={secao.key} className="bg-gray-100 p-4 rounded-lg mb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Verificar se há vagas para os clientes selecionados
  const temVagas = clientesSelecionados.some(cliente => 
    vagasPorCliente[cliente] && vagasPorCliente[cliente].length > 0
  )

  if (!temVagas) {
    return (
      <div className="bg-yellow-50 p-8 rounded-lg border border-yellow-200 text-center">
        <DocumentTextIcon className="h-10 w-10 mx-auto text-yellow-500 mb-3" />
        <h3 className="text-lg font-medium text-yellow-800 mb-2">
          Nenhuma vaga encontrada
        </h3>
        <p className="text-yellow-700">
          Não foram encontradas vagas para os filtros selecionados.
        </p>
        <p className="text-yellow-600 text-sm mt-1">
          Tente ajustar os filtros ou selecionar outros clientes.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com estatísticas */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex flex-wrap gap-4 text-sm">
          {clientesSelecionados.map((cliente) => {
            const vagas = vagasPorCliente[cliente] || []
            return (
              <div key={cliente} className="text-blue-800">
                <span className="font-semibold">{cliente}:</span>{' '}
                {vagas.length} {vagas.length === 1 ? 'vaga' : 'vagas'}
              </div>
            )
          })}
        </div>
      </div>

      {/* Grid de comparação em 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientesSelecionados.map((cliente) => {
          const vagas = vagasPorCliente[cliente] || []
          
          return (
            <div key={cliente} className="space-y-4">
              {/* Header da coluna */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
                <h3 className="text-lg font-bold flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  {cliente}
                </h3>
                <p className="text-blue-100 text-sm">
                  {vagas.length} {vagas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
                </p>
              </div>
              
              {/* Seções expansíveis */}
              {secoes.map((secao) => {
                const isExpanded = secoesExpandidas.has(secao.key)
                const Icon = secao.icon

                return (
                  <div key={secao.key} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <button
                      onClick={() => toggleSecao(secao.key)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 rounded-t-lg"
                    >
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="font-medium text-gray-900">{secao.titulo}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100">
                        {vagas.length === 0 ? (
                          <p className="text-gray-500 text-sm py-2">
                            Nenhuma vaga encontrada
                          </p>
                        ) : (
                          <div className="space-y-3 mt-3">
                            {vagas.map((vaga, index) => {
                              const conteudo = vaga[secao.key]
                              
                              return (
                                <div key={vaga.id} className="border-l-2 border-blue-200 pl-3">
                                  <div className="flex items-start justify-between mb-1">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                      {vaga.cargo}
                                    </h4>
                                    <span className="text-xs text-gray-500 ml-2">
                                      #{index + 1}
                                    </span>
                                  </div>
                                  
                                  {/* Informações básicas */}
                                  <div className="text-xs text-gray-600 mb-2 space-y-1">
                                    <div className="flex items-center">
                                      <MapPinIcon className="h-3 w-3 mr-1" />
                                      {vaga.site}
                                    </div>
                                    <div className="flex items-center">
                                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                      {vaga.produto}
                                    </div>
                                  </div>

                                  {/* Conteúdo da seção */}
                                  {conteudo ? (
                                    <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-2 rounded">
                                      {conteudo}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-400 italic">
                                      Informação não disponível
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}