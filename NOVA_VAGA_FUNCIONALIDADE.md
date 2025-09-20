# Funcionalidade de Adicionar Novas Vagas

## Visão Geral

Foi implementada uma funcionalidade completa para adicionar novas vagas ao sistema, com duas modalidades principais:

1. **Extração Automática**: Extrai dados automaticamente de URLs de sites de vagas
2. **Preenchimento Manual**: Permite preenchimento manual de todos os campos

## Arquivos Criados/Modificados

### APIs
- `src/app/api/scrape-vaga/route.js` - API para extração de dados de URLs
- `src/app/api/vagas/route.js` - API para CRUD de vagas

### Componentes
- `src/components/AdicionarVagaForm.jsx` - Formulário principal com abas

### Páginas
- `src/app/vagas/nova/page.jsx` - Página para adicionar novas vagas
- `src/app/vagas/page.jsx` - Adicionado botão "Nova Vaga"

## Funcionalidades Implementadas

### 1. Extração Automática de Dados

A funcionalidade de extração automática utiliza a biblioteca `cheerio` para fazer scraping de sites de vagas. Ela extrai:

- **Título da vaga** (cargo)
- **Descrição da vaga**
- **Responsabilidades e atribuições**
- **Requisitos e qualificações**
- **Informações adicionais**:
  - Salário
  - Horário de trabalho
  - Jornada de trabalho
  - Benefícios
  - Local de trabalho
- **Etapas do processo seletivo**
- **Nome da empresa**

### 2. Seletores Inteligentes

O sistema utiliza múltiplos seletores CSS para encontrar informações em diferentes sites:

```javascript
// Exemplos de seletores utilizados
const responsabilidadesSelectors = [
  '[data-testid*="responsabilities"]',
  '.responsibilities',
  '.job-responsibilities',
  'h3:contains("Responsabilidades")',
  'h4:contains("Responsabilidades")'
]
```

### 3. Interface com Abas

O formulário possui duas abas principais:

- **Extração Automática**: Para URLs de sites de vagas
- **Preenchimento Manual**: Para entrada manual de dados

### 4. Validações

- Campos obrigatórios: Cargo, Cliente, Categoria
- Validação de URL para extração automática
- Validação de dados antes do envio

### 5. Integração com Banco de Dados

- Salvamento automático no Supabase
- Estrutura de dados compatível com o schema existente
- Tratamento de erros e feedback ao usuário

## Como Usar

### 1. Acessar a Funcionalidade

1. Navegue para `/vagas`
2. Clique no botão "Nova Vaga"
3. Ou acesse diretamente `/vagas/nova`

### 2. Extração Automática

1. Selecione a aba "Extração Automática"
2. Cole a URL da vaga (ex: https://atento.gupy.io/jobs/9807692)
3. Clique em "Extrair Dados"
4. Revise e edite os dados extraídos
5. Clique em "Salvar Vaga"

### 3. Preenchimento Manual

1. Selecione a aba "Preenchimento Manual"
2. Preencha todos os campos desejados
3. Clique em "Salvar Vaga"

## Campos Disponíveis

### Campos Obrigatórios
- **Cargo**: Nome da posição
- **Cliente**: Nome da empresa
- **Categoria**: Tipo da vaga (Tecnologia, Vendas, etc.)

### Campos Opcionais
- **Produto**: Produto ou serviço relacionado
- **Descrição da Vaga**: Descrição geral
- **Responsabilidades e Atribuições**: Lista de responsabilidades
- **Requisitos e Qualificações**: Requisitos técnicos e pessoais
- **Salário**: Faixa salarial
- **Horário de Trabalho**: Horários de funcionamento
- **Jornada de Trabalho**: Carga horária semanal
- **Benefícios**: Lista de benefícios oferecidos
- **Local de Trabalho**: Localização (presencial/remoto/híbrido)
- **Etapas do Processo**: Processo seletivo

## Sites Suportados

A extração automática funciona melhor com sites que utilizam estruturas HTML padronizadas, incluindo:

- Gupy
- Vagas.com
- LinkedIn Jobs
- InfoJobs
- Catho
- E outros sites com estrutura similar

## Dependências Adicionadas

- `cheerio`: Para parsing e manipulação de HTML no servidor

## Melhorias Futuras Sugeridas

1. **Cache de URLs**: Evitar re-extração de URLs já processadas
2. **Seletores Personalizados**: Permitir configuração de seletores por site
3. **Validação de Dados**: Melhorar validação de dados extraídos
4. **Preview**: Mostrar preview dos dados antes de salvar
5. **Histórico**: Manter histórico de extrações
6. **Rate Limiting**: Implementar controle de taxa para evitar bloqueios

## Tratamento de Erros

- URLs inválidas
- Sites inacessíveis
- Dados não encontrados
- Erros de conexão
- Erros de banco de dados

Todos os erros são tratados com mensagens amigáveis ao usuário e logs detalhados no servidor.
