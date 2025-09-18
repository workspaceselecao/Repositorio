'use client'

import { useState } from 'react'
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  PencilIcon, 
  TrashIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'

export default function VagaCardExpansivel({ vaga, onEdit, onDelete, onExport }) {
  const [expanded, setExpanded] = useState(false)

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta vaga?')) {
      onDelete(vaga.id)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{vaga.cargo}</h3>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
          <div className="mb-4">
            <p className="text-gray-700 text-sm line-clamp-3">
              {vaga.descricao_vaga}
            </p>
          </div>
        )}

        {/* Botão para expandir */}
        <div className="flex justify-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUpIcon className="h-4 w-4 mr-1" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-4 w-4 mr-1" />
                Ver detalhes completos
              </>
            )}
          </button>
        </div>

        {/* Conteúdo expandido */}
        {expanded && (
          <div className="space-y-6 border-t border-gray-200 pt-6">
            {/* Descrição da Vaga */}
            {vaga.descricao_vaga && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">DESCRIÇÃO DA VAGA</h4>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Temos a melhor vaga pra você! ❤️
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed mt-2">
                    Procuramos por um profissional <strong>despojado</strong>, com <strong>senso de dono</strong>, 
                    <strong> resiliente</strong>, com boas relações interpessoais, capacidade de interagir com 
                    clientes internos e externos, foco no cliente, inovador, visão global, adaptabilidade 
                    e capacidade de trabalhar em múltiplas tarefas.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed mt-2">
                    O atendimento é focado em clientes com produtos bancários como conta online, 
                    cartão de crédito e seguros, exigindo compreensão das necessidades de cada cliente.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed mt-2">
                    {vaga.descricao_vaga}
                  </p>
                </div>
              </div>
            )}

            {/* Responsabilidades e Atribuições */}
            {vaga.responsabilidades_atribuicoes && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">RESPONSABILIDADES E ATRIBUIÇÕES</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="text-gray-700 text-sm space-y-2">
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Resolução de problemas
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Atendimento ao cliente
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Suporte técnico
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      Vendas consultivas
                    </li>
                  </ul>
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      {vaga.responsabilidades_atribuicoes}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Requisitos e Qualificações */}
            {vaga.requisitos_qualificacoes && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">REQUISITOS E QUALIFICAÇÕES</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Obrigatórios:</h5>
                      <ul className="text-gray-700 text-sm space-y-1">   
                        <li>• Idade mínima de 18 anos</li>
                        <li>• Ensino superior completo ou cursando</li>      
                        <li>• Experiência com SAC, Suporte, Reclame Aqui ou Ouvidoria</li>                                                                   
                        <li>• Experiência com atendimento por voz, chat ou e-mail</li>
                        <li>• Conhecimento básico de informática e digitação</li>
                        <li>• Capacidade de atender múltiplas conversas de chat</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Diferenciais:</h5>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Experiência com sistemas bancários</li>
                        <li>• Conhecimento em produtos financeiros</li>
                        <li>• Certificações em atendimento</li>
                        <li>• Inglês intermediário</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      {vaga.requisitos_qualificacoes}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Benefícios */}
            {vaga.beneficios && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">BENEFÍCIOS</h4>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Salariais:</h5>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Salário competitivo</li>
                        <li>• PLR (Participação nos Lucros)</li>
                        <li>• Vale refeição</li>
                        <li>• Vale transporte</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2">Profissionais:</h5>
                      <ul className="text-gray-700 text-sm space-y-1">
                        <li>• Plano de carreira</li>
                        <li>• Treinamentos constantes</li>
                        <li>• Ambiente de trabalho moderno</li>
                        <li>• Equipe jovem e dinâmica</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      {vaga.beneficios}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Etapas do Processo */}
            {vaga.etapas_processo && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">ETAPAS DO PROCESSO</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        1
                      </div>
                      <span className="text-gray-700 text-sm">Envio do currículo</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        2
                      </div>
                      <span className="text-gray-700 text-sm">Análise do perfil</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        3
                      </div>
                      <span className="text-gray-700 text-sm">Entrevista inicial</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        4
                      </div>
                      <span className="text-gray-700 text-sm">Teste prático</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        5
                      </div>
                      <span className="text-gray-700 text-sm">Entrevista final</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-purple-50 rounded-md">
                    <p className="text-sm text-gray-700">
                      {vaga.etapas_processo}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}