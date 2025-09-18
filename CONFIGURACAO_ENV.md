# 🔐 Configuração das Variáveis de Ambiente

## ⚠️ IMPORTANTE: Crie o arquivo `.env.local` manualmente

Como o sistema está bloqueando a criação automática do arquivo `.env.local`, você precisa criá-lo manualmente.

### 📋 Passos para Configurar:

1. **Crie um arquivo chamado `.env.local` na raiz do projeto** (mesmo diretório do `package.json`)

2. **Copie e cole o seguinte conteúdo no arquivo:**

```env
# Configurações do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qdzrldxubcofobqmynab.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w

# Configurações da aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Chave de publicação do Supabase (se necessário)
SUPABASE_PUBLISHABLE_KEY=sb_publishable_6G0bN80k6wHUgHRlaSU0LQ_mU4cFtdz
```

3. **Salve o arquivo**

4. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

### 🔒 Segurança das Credenciais:

- ✅ **NEXT_PUBLIC_SUPABASE_URL**: Pode ser pública (é segura para frontend)
- ✅ **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Pode ser pública (é segura para frontend)
- ⚠️ **SUPABASE_PUBLISHABLE_KEY**: Mantenha privada (não commite no Git)

### 🚨 Proteções Implementadas:

1. **Arquivo `.env.local`** está no `.gitignore` (não será commitado)
2. **Credenciais são específicas** para este projeto
3. **Chaves anônimas** são seguras para uso público
4. **Apenas chaves de serviço** precisam ser mantidas privadas

### ✅ Verificação:

Após criar o arquivo, o sistema deve:
- ✅ Carregar as variáveis de ambiente corretamente
- ✅ Conectar com o Supabase sem erros
- ✅ Permitir login com as credenciais existentes
- ✅ Exibir "Configuração OK" na interface

### 🆘 Se houver problemas:

1. Verifique se o arquivo está na raiz do projeto
2. Verifique se não há espaços extras nas linhas
3. Reinicie o servidor após criar o arquivo
4. Verifique o console do navegador para erros
