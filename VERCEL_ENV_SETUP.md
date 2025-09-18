# 🔧 Configuração de Variáveis de Ambiente no Vercel

## ⚠️ PROBLEMA ATUAL: "Invalid API key" e Erro 401

A aplicação está falhando porque as variáveis de ambiente não estão configuradas no Vercel.

## 🚀 SOLUÇÃO RÁPIDA

### 1. Acesse o Dashboard do Vercel
- Vá para: https://vercel.com/dashboard
- Selecione o projeto "repositoriovagas"

### 2. Configure as Variáveis de Ambiente
- Vá para: **Settings** → **Environment Variables**
- Adicione as seguintes variáveis:

```
NEXT_PUBLIC_SUPABASE_URL = https://qdzrldxubcofobqmynab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w
NEXT_PUBLIC_APP_URL = https://repositoriodevagas.vercel.app
NODE_ENV = production
```

### 3. Configuração por Ambiente
- **Production**: ✅ Marque para produção
- **Preview**: ✅ Marque para preview
- **Development**: ✅ Marque para desenvolvimento

### 4. Redeploy da Aplicação
Após configurar as variáveis:
- Vá para: **Deployments**
- Clique em **"Redeploy"** no último deployment
- Aguarde o deploy completar

## 🔍 Verificação

Após o redeploy, acesse:
- https://repositoriodevagas.vercel.app
- O erro "Invalid API key" deve desaparecer
- O login deve funcionar normalmente

## 🛠️ Configuração Local (Desenvolvimento)

O arquivo `.env.local` já está configurado localmente:
```env
NEXT_PUBLIC_SUPABASE_URL=https://qdzrldxubcofobqmynab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🚨 Erro Atual Explicado

1. **"Invalid API key"**: Supabase não consegue se conectar
2. **Erro 401**: Falta de autenticação devido à chave inválida
3. **Console 401**: Requisições falhando por falta de credenciais

## ✅ Após Configurar

- ✅ Login funcionará
- ✅ Dados carregarão normalmente
- ✅ Sistema estará operacional
