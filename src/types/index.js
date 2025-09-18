// Tipos e interfaces para a aplicação

// Apenas para documentação, não para tipagem em tempo de compilação em JS
export const Vaga = {
  id: '',
  cargo: '',
  cliente: '',
  site: '',
  categoria: '',
  produto: '',
  salario: '',
  jornada_trabalho: '',
  horario_trabalho: '',
  descricao_vaga: '',
  responsabilidades_atribuicoes: '',
  requisitos_qualificacoes: '',
  beneficios: '',
  local_trabalho: '',
  etapas_processo: '',
  created_at: '',
  updated_at: ''
}

export const User = {
  id: '',
  email: '',
  name: '',
  role: 'RH', // RH ou ADMIN
  created_at: '',
  updated_at: ''
}

export const Cliente = {
  id: '',
  nome: '',
  created_at: '',
  updated_at: ''
}

export const Site = {
  id: '',
  nome: '',
  cliente_id: '',
  created_at: '',
  updated_at: ''
}

// Tipos para performance
export const PerformanceMetric = {
  id: '',
  type: '', // 'api', 'user', 'memory'
  value: 0,
  timestamp: 0,
  metadata: {}
}

// Tipos para paginação
export const PaginationState = {
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 6,
  totalItems: 0,
  startIndex: 0,
  endIndex: 0
}

// Tipos para filtros
export const FilterState = {
  searchTerm: '',
  filterCliente: '',
  filterSite: '',
  filterCategoria: '',
  filterProduto: ''
}

// Tipos para export
export const ExportData = {
  id: '',
  cargo: '',
  cliente: '',
  site: '',
  categoria: '',
  produto: '',
  salario: '',
  localizacao: '',
  regime: '',
  horario: '',
  contrato: '',
  observacoes: '',
  created_at: ''
}

const types = {
  Vaga,
  User,
  Cliente,
  Site,
  PerformanceMetric,
  PaginationState,
  FilterState,
  ExportData
}

export default types