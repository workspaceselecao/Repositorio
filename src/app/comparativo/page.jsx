'use client'

import { useState, useMemo } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import SeletorClientes from '../../components/SeletorClientes'
import ComparativoVagas from '../../components/ComparativoVagas'
import FiltrosComparativo from '../../components/FiltrosComparativo' // Importar o componente de filtros
import ExportExcel from '../../components/ExportExcel'
import { useVagasByClienteCache } from '../../hooks/useSupabaseCache' // Importar o hook de cache

export default function ComparativoPage() {
  const [clientesSelecionados, setClientesSelecionados] = useState([])
  const [filtros, setFiltros] = useState({
    site: '',
    categoria: '',
    cargo: '',
    produto: ''
  })
  const [vagasParaExport, setVagasParaExport] = useState([])

  // Carregar todas as vagas para os clientes selecionados para popular os filtros
  const { data: vagasDisponiveisParaFiltro = [] } = useVagasByClienteCache(clientesSelecionados);

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Comparativo de Clientes
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Compare vagas entre diferentes clientes
              </p>
            </div>
            {clientesSelecionados.length > 0 && (
              <div>
                <ExportExcel
                  vagas={vagasParaExport} // Passar as vagas para exportar
                  filename="comparativo-vagas"
                  buttonText="Exportar Comparativo"
                  className="bg-purple-600 hover:bg-purple-700"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 space-y-6 sm:px-0">
            
            {/* Seletor de Clientes */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Selecionar Clientes
              </h2>
              <SeletorClientes 
                clientesSelecionados={clientesSelecionados}
                onClientesChange={setClientesSelecionados}
              />
            </div>

            {/* Filtros */}
            {clientesSelecionados.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Filtros de Comparação
                </h2>
                <FiltrosComparativo 
                  filtros={filtros}
                  onFiltrosChange={setFiltros}
                  vagasDisponiveis={vagasDisponiveisParaFiltro} // Passar as vagas para o componente de filtros
                />
              </div>
            )}

            {/* Comparativo de Vagas */}
            {clientesSelecionados.length > 0 ? (
              <ComparativoVagas 
                clientesSelecionados={clientesSelecionados}
                filtros={filtros} // Passar os filtros para o ComparativoVagas
                onVagasChange={setVagasParaExport}
              />
            ) : (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum cliente selecionado
                </h3>
                <p className="mt-2 text-gray-500">
                  Selecione até 3 clientes acima para começar a comparação
                </p>
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <p>🔍 Filtros dinâmicos por SITE, CATEGORIA, CARGO, PRODUTO</p>
                  <p>📊 Cards expansíveis em até 3 colunas</p>
                  <p>🔄 Sincronização automática entre cards correlatos</p>
                  <p>📋 9 seções detalhadas de comparação</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}