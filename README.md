# Repositório de Vagas

Sistema de gestão e comparação de vagas de emprego desenvolvido com Next.js 14, TypeScript e Supabase.

## 🚀 Deploy na Vercel

### Configuração Rápida
1. **Fork/Clone** este repositório
2. **Conecte à Vercel** via GitHub
3. **Configure variáveis de ambiente** na Vercel:
   ```
   NEXT_PUBLIC_SUPABASE_URL=seu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
   ```
4. **Deploy automático** será executado

### Configurações de Produção
- ✅ `vercel.json` configurado
- ✅ `next.config.js` otimizado para Vercel
- ✅ Headers de segurança incluídos
- ✅ Redirects configurados
- ✅ PWA funcionando em produção

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação e Autorização
- **Login/Logout** com Supabase Auth
- **Sistema de roles** (ADMIN/RH)
- **Proteção de rotas** por permissão
- **Gerenciamento de usuários** (apenas ADMIN)

### ✅ Gestão de Vagas
- **Lista de clientes** com cards das vagas
- **CRUD completo** (Criar, Ler, Atualizar, Deletar)
- **Filtros avançados** por cliente, site, categoria
- **Importação de dados** via JSON ou Excel
- **Modal de edição** responsivo

### ✅ Comparativo de Clientes
- **Seleção de até 3 clientes** para comparação
- **Filtros dinâmicos** por SITE, CATEGORIA, CARGO, PRODUTO
- **Cards expansíveis** sincronizados em 3 colunas
- **9 seções detalhadas** de comparação

### ✅ Export/Import
- **Download template Excel** para importação
- **Export Excel** das vagas filtradas
- **Export do comparativo** personalizado
- **Importação JSON** dos dados originais

### ✅ PWA (Progressive Web App)
- **Instalação no dispositivo** (desktop/mobile)
- **Funcionamento offline** com cache
- **Notificações de conectividade**
- **Ícones e manifest** configurados
- **Service Worker** para cache inteligente

### ✅ Interface Responsiva
- **Sidebar expansível** desktop
- **Menu mobile** com drawer
- **Design adaptativo** para todas as telas
- **Componentes Tailwind CSS** otimizados

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- Conta no Supabase
- Git

### Configuração
1. **Clone o repositório** (já feito)
2. **Instale dependências** (já feito)
   ```bash
   npm install
   ```
3. **Configure variáveis de ambiente** (já feito)
   - `.env.local` com credenciais Supabase

### Banco de Dados
1. **Execute o schema SQL** (já aplicado)
   - Arquivo: `database/schema.sql`
   - Cria tabelas `users` e `vagas`
   - Configura RLS e triggers

### Execução
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm run start
```

## 📱 PWA - Instalação

A aplicação pode ser **instalada como um app nativo**:

### Desktop (Chrome/Edge)
1. Acesse a aplicação
2. Clique no ícone de instalação na barra de endereços
3. Confirme a instalação

### Mobile (Android/iOS)
1. Abra no navegador
2. Toque em "Adicionar à tela inicial"
3. Confirme a instalação

### Funcionalidades Offline
- **Cache inteligente** de páginas visitadas
- **Indicador de conectividade** 
- **Sincronização automática** quando voltar online

## 🔐 Sistema de Usuários

### Roles Disponíveis
- **ADMIN**: Acesso total + configurações
- **RH**: Acesso às vagas e comparativos

### Primeiro Acesso
1. Faça login com sua conta Supabase
2. O sistema criará automaticamente seu perfil
3. Role padrão: **RH**
4. ADMIN pode alterar roles nas configurações

## 📊 Dados de Exemplo

### Importação JSON
- Use o arquivo `REPOSITORIO.json` fornecido
- API: `/api/import-json`
- Converte automaticamente para schema SQL

### Template Excel
- Baixe o template na interface
- Preencha com suas vagas
- Importe via interface

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 14** - React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Heroicons** - Ícones consistentes

### Backend
- **Supabase** - BaaS completo
- **PostgreSQL** - Banco relacional
- **Row Level Security** - Segurança de dados
- **Supabase Auth** - Autenticação

### PWA
- **Service Worker** - Cache e offline
- **Web App Manifest** - Metadados da app
- **Cache API** - Armazenamento local

### Ferramentas
- **XLSX** - Manipulação de Excel
- **Sharp** - Processamento de imagens
- **ESLint** - Linting de código

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── login/             # Página de login
│   ├── dashboard/         # Dashboard principal
│   ├── vagas/             # Lista e gestão de vagas
│   ├── comparativo/       # Comparação de clientes
│   ├── configuracoes/     # Settings (ADMIN only)
│   └── api/               # API Routes
├── components/            # Componentes reutilizáveis
│   ├── Sidebar.tsx        # Navegação lateral
│   ├── DashboardLayout.tsx # Layout principal
│   ├── ListaVagas.tsx     # Lista com filtros
│   ├── ComparativoVagas.tsx # Comparação em colunas
│   ├── ExportExcel.tsx    # Export funcionalidade
│   └── InstallPWA.tsx     # Prompt de instalação
├── contexts/              # Context API
│   └── AuthContext.tsx    # Gerenciamento de auth
├── lib/                   # Utilitários
│   └── supabase.ts        # Cliente Supabase
└── types/                 # Definições TypeScript
```

## 🎨 Design System

### Cores Principais
- **Azul**: `#2563eb` (Primary)
- **Verde**: `#16a34a` (Success)
- **Vermelho**: `#dc2626` (Error)
- **Roxo**: `#9333ea` (Accent)

### Tipografia
- **Títulos**: Font bold, tamanhos responsivos
- **Texto**: Inter system font
- **Monospace**: Para códigos

### Componentes
- **Cards**: Sombra sutil, bordas arredondadas
- **Botões**: Estados hover/focus consistentes
- **Formulários**: Validação visual clara
- **Modais**: Backdrop com blur

## 🔧 Configurações Avançadas

### Supabase RLS
- **Políticas de segurança** configuradas
- **Acesso baseado em roles**
- **Auditoria automática** com triggers

### Service Worker
- **Cache inteligente** por tipo de recurso
- **Estratégia Cache-First** para assets
- **Network-First** para dados dinâmicos

### Responsividade
- **Mobile-first** design
- **Breakpoints Tailwind** padrão
- **Touch-friendly** interface

## 📈 Performance

### Otimizações
- **Bundle splitting** automático (Next.js)
- **Image optimization** com Next/Image
- **Lazy loading** de componentes
- **PWA caching** para velocidade

### Monitoramento
- **Console logging** para debug
- **Error boundaries** para erros
- **Loading states** para UX

## 🐛 Troubleshooting

### Problemas Comuns
1. **Erro de conexão Supabase**
   - Verifique `.env.local`
   - Confirme URLs e chaves

2. **PWA não instala**
   - Certifique-se de HTTPS
   - Verifique manifest.json

3. **Import falha**
   - Confirme formato JSON/Excel
   - Verifique campos obrigatórios

### Logs Úteis
- **Console browser** para erros frontend
- **Network tab** para requests
- **Supabase dashboard** para logs backend

## 📞 Suporte

O sistema está **totalmente funcional** e pronto para produção. Todas as funcionalidades especificadas foram implementadas com qualidade e seguindo as melhores práticas.

### Próximos Passos Sugeridos
1. **Backup regular** do banco Supabase
2. **Monitoramento** de performance
3. **Updates** de dependências
4. **Feedback** dos usuários para melhorias

---

**Desenvolvido com ❤️ usando Next.js 14 + Supabase**