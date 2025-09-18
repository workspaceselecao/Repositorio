'use client'

import { useState  } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import ListaVagas from '../../components/ListaVagas'
import ImportarDados from '../../components/ImportarDados'
import { ArrowDownTrayIcon  } from '@heroicons/react/24/outline'

export default function VagasPage() {
  const [showImport, setShowImport] = useState(false)
  const [vagasParaExport, setVagasParaExport] = useState([])

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Lista de Clientes
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Gerencie todas as vagas cadastradas no sistema
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowImport(!showImport)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                {showImport ? 'Ocultar Importação' : 'Importar Dados'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 space-y-6">
            
            {/* Component de importação */}
            {showImport && (
              <ImportarDados />
            )}

            {/* Lista de vagas */}
            <ListaVagas onVagasChange={setVagasParaExport} />
            
          </div>
        </div>
      </main>
    </DashboardLayout>
  )
}