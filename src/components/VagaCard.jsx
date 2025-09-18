'use client'

import { 
  PencilIcon, 
  TrashIcon, 
  ArrowDownTrayIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'

export default function VagaCard({ vaga, onEdit, onDelete, onExport }) {
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta vaga?')) {
      onDelete(vaga.id)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{vaga.cargo}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {vaga.cliente}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {vaga.site}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {vaga.categoria}
              </span>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
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

        {/* Informações básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {vaga.salario && (
            <div className="flex items-center text-gray-600">
              <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-sm">{vaga.salario}</span>
            </div>
          )}
          {vaga.jornada_trabalho && (
            <div className="flex items-center text-gray-600">
              <BriefcaseIcon className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-sm">{vaga.jornada_trabalho}</span>
            </div>
          )}
          {vaga.horario_trabalho && (
            <div className="flex items-center text-gray-600">
              <ClockIcon className="h-4 w-4 mr-2 text-orange-600" />
              <span className="text-sm">{vaga.horario_trabalho}</span>
            </div>
          )}
          {vaga.local_trabalho && (
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-2 text-red-600" />
              <span className="text-sm">{vaga.local_trabalho}</span>
            </div>
          )}
        </div>

        {/* Descrição resumida */}
        {vaga.descricao_vaga && (
          <div className="mb-3">
            <p className="text-gray-700 text-sm line-clamp-3">
              {vaga.descricao_vaga}
            </p>
          </div>
        )}

        {/* Produto */}
        {vaga.produto && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {vaga.produto}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
