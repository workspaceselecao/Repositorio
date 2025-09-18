# Configuração de Variáveis de Ambiente no Vercel

## ⚠️ IMPORTANTE: Configurar Variáveis de Ambiente

A aplicação precisa das seguintes variáveis de ambiente configuradas no Vercel:

### 1. Acesse o Dashboard do Vercel
- Vá para: https://vercel.com/dashboard
- Selecione o projeto "repositoriovagas"

### 2. Configure as Variáveis de Ambiente
- Vá para: Settings > Environment Variables
- Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Obtenha as Credenciais do Supabase
- Acesse: https://supabase.com/dashboard
- Selecione seu projeto
- Vá para: Settings > API
- Copie:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Redeploy da Aplicação
Após configurar as variáveis:
- Vá para: Deployments
- Clique em "Redeploy" no último deployment

## 🔧 Configuração Local (Desenvolvimento)

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🚨 Erro Atual

A aplicação está mostrando "Erro ao carregar vagas" porque:
1. As variáveis de ambiente não estão configuradas no Vercel
2. O Supabase não consegue se conectar
3. As consultas falham com 404

## ✅ Solução

1. Configure as variáveis de ambiente no Vercel
2. Faça redeploy da aplicação
3. A aplicação funcionará normalmente
