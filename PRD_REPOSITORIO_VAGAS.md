# PRD - Repositório de Vagas
## Product Requirements Document

---

## 📋 **1. VISÃO GERAL DO PRODUTO**

### **1.1 Nome do Produto**
**Repositório de Vagas** - Sistema de Gestão e Comparação de Oportunidades de Emprego

### **1.2 Objetivo**
Desenvolver uma aplicação web responsiva para centralizar, gerenciar e comparar informações de vagas de emprego de diferentes clientes, facilitando a análise comparativa e tomada de decisões estratégicas para equipes de RH.

### **1.3 Público-Alvo**
- **Usuários RH**: Gestores e analistas de recursos humanos
- **Usuários ADMIN**: Administradores do sistema com acesso total
- **Stakeholders**: Gestores que precisam de visão comparativa das oportunidades

### **1.4 Proposta de Valor**
- **Centralização**: Todas as vagas em um único local
- **Comparação Inteligente**: Análise side-by-side de até 3 clientes
- **Eficiência**: Filtros avançados e exportação de dados
- **Acessibilidade**: PWA instalável e funcionamento offline
- **Segurança**: Controle de acesso baseado em roles

---

## 🎯 **2. OBJETIVOS E METAS**

### **2.1 Objetivos Primários**
1. **Centralizar** informações de vagas de diferentes clientes
2. **Facilitar comparação** entre oportunidades de emprego
3. **Otimizar processos** de análise e seleção de vagas
4. **Garantir acessibilidade** através de PWA responsivo

### **2.2 Objetivos Secundários**
1. **Automatizar** importação e exportação de dados
2. **Melhorar experiência** do usuário com interface intuitiva
3. **Garantir segurança** com controle de acesso granular
4. **Permitir funcionamento offline** para maior flexibilidade

### **2.3 KPIs de Sucesso**
- **Adoção**: 100% dos usuários RH utilizando o sistema
- **Eficiência**: Redução de 50% no tempo de análise de vagas
- **Satisfação**: NPS > 8 entre usuários
- **Disponibilidade**: 99.9% de uptime

---

## 👥 **3. PERSONAS E CASOS DE USO**

### **3.1 Persona 1: Analista de RH**
- **Nome**: Maria Silva
- **Cargo**: Analista de Recursos Humanos
- **Necessidades**: 
  - Visualizar todas as vagas disponíveis
  - Comparar oportunidades entre clientes
  - Filtrar vagas por critérios específicos
  - Exportar relatórios para análise

### **3.2 Persona 2: Gerente de RH**
- **Nome**: João Santos
- **Cargo**: Gerente de Recursos Humanos
- **Necessidades**:
  - Acesso a relatórios comparativos
  - Gestão de usuários do sistema
  - Configurações gerais da aplicação
  - Backup e manutenção do sistema

### **3.3 Casos de Uso Principais**

#### **UC1: Autenticação e Autorização**
- **Ator**: Usuário do sistema
- **Pré-condições**: Usuário possui credenciais válidas
- **Fluxo Principal**:
  1. Usuário acessa a aplicação
  2. Sistema exibe tela de login
  3. Usuário insere email e senha
  4. Sistema valida credenciais
  5. Sistema redireciona para dashboard
- **Pós-condições**: Usuário autenticado com permissões adequadas

#### **UC2: Visualizar Lista de Vagas**
- **Ator**: Usuário RH/ADMIN
- **Pré-condições**: Usuário autenticado
- **Fluxo Principal**:
  1. Usuário acessa "Lista de Clientes"
  2. Sistema carrega todas as vagas
  3. Usuário visualiza cards com informações das vagas
  4. Usuário pode filtrar por cliente, site, categoria
  5. Usuário pode editar ou excluir vagas

#### **UC3: Comparar Vagas entre Clientes**
- **Ator**: Usuário RH/ADMIN
- **Pré-condições**: Usuário autenticado
- **Fluxo Principal**:
  1. Usuário acessa "Comparativo de Clientes"
  2. Usuário seleciona até 3 clientes
  3. Sistema exibe vagas em cards sincronizados
  4. Usuário aplica filtros dinâmicos
  5. Usuário compara informações lado a lado

#### **UC4: Gerenciar Usuários (ADMIN)**
- **Ator**: Usuário ADMIN
- **Pré-condições**: Usuário com role ADMIN
- **Fluxo Principal**:
  1. Usuário acessa "Configurações"
  2. Sistema exibe lista de usuários
  3. Usuário pode adicionar/editar/remover usuários
  4. Usuário define roles (RH/ADMIN)
  5. Sistema atualiza permissões

---

## 🏗️ **4. ARQUITETURA E TECNOLOGIAS**

### **4.1 Stack Tecnológico**

#### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Linguagem**: JavaScript (ES6+)
- **Estilização**: Tailwind CSS
- **Componentes**: React 18
- **Ícones**: Heroicons
- **PWA**: Service Worker + Manifest

#### **Backend**
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **API**: Supabase REST API
- **Segurança**: Row Level Security (RLS)

#### **Infraestrutura**
- **Hospedagem**: Vercel
- **CDN**: Vercel Edge Network
- **Domínio**: Custom domain
- **SSL**: Automático via Vercel

### **4.2 Estrutura de Dados**

#### **Tabela: users**
```sql
- id (UUID, PK)
- email (VARCHAR, UNIQUE)
- name (VARCHAR)
- role (ENUM: 'ADMIN', 'RH')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **Tabela: vagas**
```sql
- id (UUID, PK)
- site (VARCHAR)
- categoria (VARCHAR)
- cargo (VARCHAR)
- cliente (VARCHAR)
- produto (VARCHAR)
- descricao_vaga (TEXT)
- responsabilidades_atribuicoes (TEXT)
- requisitos_qualificacoes (TEXT)
- salario (TEXT)
- horario_trabalho (TEXT)
- jornada_trabalho (TEXT)
- beneficios (TEXT)
- local_trabalho (TEXT)
- etapas_processo (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

## 🎨 **5. ESPECIFICAÇÕES DE INTERFACE**

### **5.1 Design System**

#### **Cores Primárias**
- **Azul Principal**: #2563eb (Blue-600)
- **Azul Secundário**: #1d4ed8 (Blue-700)
- **Verde Sucesso**: #10b981 (Emerald-500)
- **Vermelho Erro**: #ef4444 (Red-500)
- **Cinza Neutro**: #6b7280 (Gray-500)

#### **Tipografia**
- **Fonte Principal**: Inter (Sistema)
- **Tamanhos**: text-xs (12px) até text-4xl (36px)
- **Pesos**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

#### **Espaçamento**
- **Grid**: 4px base (Tailwind spacing scale)
- **Padding**: 4px, 8px, 12px, 16px, 24px, 32px
- **Margin**: 4px, 8px, 12px, 16px, 24px, 32px

### **5.2 Componentes Principais**

#### **Sidebar**
- **Estado**: Expansível/Contraído
- **Navegação**: Menu principal + perfil do usuário
- **Responsividade**: Drawer mobile + sidebar desktop

#### **Cards de Vaga**
- **Layout**: Grid responsivo
- **Informações**: Cargo, cliente, salário, local
- **Ações**: Editar, excluir, expandir
- **Estados**: Normal, hover, selecionado

#### **Modal de Edição**
- **Tamanho**: Responsivo (max-width: 4xl)
- **Campos**: Todos os campos da vaga
- **Validação**: Client-side + server-side
- **Ações**: Salvar, cancelar, fechar

### **5.3 Layouts Responsivos**

#### **Desktop (≥1024px)**
- **Sidebar**: Fixa, expansível
- **Conteúdo**: Grid de 3-4 colunas
- **Navegação**: Horizontal + sidebar

#### **Tablet (768px - 1023px)**
- **Sidebar**: Overlay
- **Conteúdo**: Grid de 2-3 colunas
- **Navegação**: Drawer

#### **Mobile (<768px)**
- **Sidebar**: Drawer completo
- **Conteúdo**: Lista vertical
- **Navegação**: Bottom navigation + drawer

---

## ⚙️ **6. FUNCIONALIDADES DETALHADAS**

### **6.1 Módulo de Autenticação**

#### **6.1.1 Login**
- **Campos**: Email, senha
- **Validação**: Email válido, senha obrigatória
- **Segurança**: Rate limiting, CSRF protection
- **Feedback**: Mensagens de erro claras

#### **6.1.2 Controle de Acesso**
- **Roles**: ADMIN, RH
- **Permissões**:
  - **RH**: Todas as funcionalidades exceto configurações
  - **ADMIN**: Acesso total + configurações
- **Proteção**: Middleware de autenticação

### **6.2 Módulo de Gestão de Vagas**

#### **6.2.1 Lista de Vagas**
- **Visualização**: Cards com informações essenciais
- **Filtros**: Cliente, site, categoria, cargo
- **Busca**: Texto livre em todos os campos
- **Paginação**: 20 itens por página
- **Ações**: Editar, excluir, visualizar detalhes

#### **6.2.2 Edição de Vagas**
- **Modal**: Formulário completo
- **Campos**: Todos os 14 campos da vaga
- **Validação**: Campos obrigatórios
- **Salvamento**: Auto-save + confirmação

#### **6.2.3 Importação/Exportação**
- **Formatos**: Excel (.xlsx), JSON
- **Template**: Download de template Excel
- **Validação**: Verificação de dados antes da importação
- **Feedback**: Relatório de sucesso/erro

### **6.3 Módulo de Comparativo**

#### **6.3.1 Seleção de Clientes**
- **Limite**: Máximo 3 clientes
- **Interface**: Checkboxes com busca
- **Validação**: Pelo menos 1 cliente selecionado

#### **6.3.2 Filtros Dinâmicos**
- **Campos**: SITE, CATEGORIA, CARGO, PRODUTO
- **Sincronização**: Filtros aplicados em todos os cards
- **Reset**: Limpar todos os filtros

#### **6.3.3 Cards Sincronizados**
- **Layout**: 3 colunas (desktop), 1 coluna (mobile)
- **Sincronização**: Scroll e filtros sincronizados
- **Seções**: 9 seções detalhadas por vaga

### **6.4 Módulo de Configurações (ADMIN)**

#### **6.4.1 Gestão de Usuários**
- **Lista**: Todos os usuários cadastrados
- **Ações**: Adicionar, editar, remover
- **Roles**: Alteração de permissões
- **Validação**: Email único, senha segura

#### **6.4.2 Backup do Sistema**
- **Exportação**: Dados completos em JSON
- **Agendamento**: Backup automático (futuro)
- **Restauração**: Importação de backup

### **6.5 Módulo PWA**

#### **6.5.1 Instalação**
- **Prompt**: Instalação automática
- **Ícones**: Múltiplos tamanhos (72px - 512px)
- **Manifest**: Configuração completa

#### **6.5.2 Funcionamento Offline**
- **Cache**: Páginas visitadas
- **Sincronização**: Auto-sync quando online
- **Indicador**: Status de conectividade

---

## 🔒 **7. SEGURANÇA E PRIVACIDADE**

### **7.1 Autenticação e Autorização**
- **Método**: Supabase Auth (JWT)
- **Sessão**: Refresh token automático
- **Logout**: Invalidação de tokens
- **Proteção**: Middleware em todas as rotas

### **7.2 Controle de Acesso**
- **RLS**: Row Level Security no Supabase
- **Políticas**: Baseadas em roles e usuário
- **Validação**: Client-side + server-side

### **7.3 Proteção de Dados**
- **Criptografia**: HTTPS obrigatório
- **Sanitização**: Input validation
- **Rate Limiting**: Proteção contra ataques
- **CORS**: Configuração restritiva

---

## 📱 **8. EXPERIÊNCIA DO USUÁRIO (UX)**

### **8.1 Princípios de Design**
- **Simplicidade**: Interface limpa e intuitiva
- **Consistência**: Padrões visuais uniformes
- **Eficiência**: Menos cliques para ações comuns
- **Acessibilidade**: Suporte a leitores de tela

### **8.2 Fluxos de Navegação**

#### **Fluxo Principal (RH)**
1. Login → Dashboard → Lista de Vagas
2. Filtros → Visualização → Ações
3. Comparativo → Seleção → Análise

#### **Fluxo Administrativo (ADMIN)**
1. Login → Dashboard → Configurações
2. Gestão de Usuários → Criação/Edição
3. Backup → Exportação → Manutenção

### **8.3 Estados da Interface**
- **Loading**: Spinners e skeletons
- **Vazio**: Mensagens e CTAs
- **Erro**: Mensagens claras e ações de recuperação
- **Sucesso**: Confirmações e feedback positivo

---

## 🚀 **9. PERFORMANCE E OTIMIZAÇÃO**

### **9.1 Métricas de Performance**
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **TTFB**: < 600ms (Time to First Byte)

### **9.2 Estratégias de Otimização**
- **Code Splitting**: Lazy loading de componentes
- **Image Optimization**: Next.js Image component
- **Caching**: Service Worker + Supabase cache
- **Bundle Size**: Tree shaking + minification

### **9.3 Monitoramento**
- **Vercel Analytics**: Métricas de performance
- **Error Tracking**: Captura de erros
- **User Analytics**: Comportamento do usuário

---

## 🧪 **10. TESTES E QUALIDADE**

### **10.1 Estratégia de Testes**
- **Unit Tests**: Componentes individuais
- **Integration Tests**: Fluxos completos
- **E2E Tests**: Cenários de usuário
- **Performance Tests**: Carga e stress

### **10.2 Critérios de Qualidade**
- **Cobertura**: > 80% de cobertura de testes
- **Acessibilidade**: WCAG 2.1 AA
- **Performance**: Core Web Vitals
- **Segurança**: OWASP Top 10

---

## 📈 **11. ROADMAP E EVOLUÇÃO**

### **11.1 Fase 1 - MVP (Atual)**
- ✅ Autenticação e autorização
- ✅ CRUD de vagas
- ✅ Comparativo básico
- ✅ PWA funcional
- ✅ Interface responsiva

### **11.2 Fase 2 - Melhorias (Próximos 3 meses)**
- 🔄 Dashboard com métricas
- 🔄 Notificações push
- 🔄 Relatórios avançados
- 🔄 API pública
- 🔄 Integração com ATS

### **11.3 Fase 3 - Expansão (6-12 meses)**
- 📋 Módulo de candidatos
- 📋 Workflow de aprovação
- 📋 Integração com LinkedIn
- 📋 IA para matching
- 📋 Mobile app nativo

---

## 📊 **12. MÉTRICAS E ANALYTICS**

### **12.1 Métricas de Negócio**
- **Usuários Ativos**: MAU (Monthly Active Users)
- **Engajamento**: Tempo de sessão, páginas visitadas
- **Conversão**: Taxa de uso das funcionalidades
- **Retenção**: Usuários que retornam

### **12.2 Métricas Técnicas**
- **Uptime**: 99.9% de disponibilidade
- **Performance**: Core Web Vitals
- **Erros**: Taxa de erro < 1%
- **Segurança**: Incidentes de segurança

---

## 🎯 **13. CRITÉRIOS DE SUCESSO**

### **13.1 Critérios Quantitativos**
- **Adoção**: 100% dos usuários RH utilizando
- **Performance**: < 2s de carregamento
- **Disponibilidade**: 99.9% uptime
- **Satisfação**: NPS > 8

### **13.2 Critérios Qualitativos**
- **Usabilidade**: Interface intuitiva
- **Eficiência**: Redução no tempo de análise
- **Satisfação**: Feedback positivo dos usuários
- **Estabilidade**: Sistema confiável

---

## 📋 **14. DEPENDÊNCIAS E RISCOS**

### **14.1 Dependências Externas**
- **Supabase**: Banco de dados e autenticação
- **Vercel**: Hospedagem e CDN
- **GitHub**: Controle de versão
- **NPM**: Gerenciamento de pacotes

### **14.2 Riscos Identificados**
- **Disponibilidade**: Dependência de serviços externos
- **Segurança**: Vazamento de dados sensíveis
- **Performance**: Degradação com muitos usuários
- **Manutenção**: Complexidade de atualizações

### **14.3 Mitigações**
- **Backup**: Estratégias de backup múltiplas
- **Monitoramento**: Alertas proativos
- **Escalabilidade**: Arquitetura preparada para crescimento
- **Documentação**: Manutenção atualizada

---

## 📞 **15. SUPORTE E MANUTENÇÃO**

### **15.1 Suporte ao Usuário**
- **Documentação**: Guias e tutoriais
- **FAQ**: Perguntas frequentes
- **Contato**: Canal de suporte
- **Treinamento**: Sessões de capacitação

### **15.2 Manutenção Técnica**
- **Atualizações**: Ciclo de releases
- **Patches**: Correções de segurança
- **Monitoramento**: 24/7 uptime
- **Backup**: Rotinas automáticas

---

**Documento criado em**: 17/09/2025  
**Versão**: 1.0  
**Próxima revisão**: 17/10/2025  
**Responsável**: Equipe de Desenvolvimento
