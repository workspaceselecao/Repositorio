# 🔧 Configuração do Service Role Key para Criação de Usuários

## ⚠️ IMPORTANTE: Configuração Necessária

Para que a criação de usuários funcione corretamente sem interferir na sessão do ADMIN, é necessário configurar a **Service Role Key** do Supabase.

## 🔑 Como Obter a Service Role Key

1. **Acesse o Supabase Dashboard**
   - Vá para https://app.supabase.com
   - Selecione seu projeto

2. **Navegue para Settings > API**
   - No menu lateral, clique em "Settings"
   - Clique em "API"

3. **Copie a Service Role Key**
   - Encontre a seção "Project API keys"
   - Copie a chave que está marcada como **"service_role"** (não a "anon" key)
   - ⚠️ **ATENÇÃO**: Esta chave tem privilégios administrativos completos

## 📝 Configurar no Projeto

### 1. Arquivo .env.local
Adicione a seguinte variável ao seu arquivo `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### 2. Vercel (se usando deploy)
Adicione a variável de ambiente no dashboard do Vercel:
- Vá para Settings > Environment Variables
- Adicione: `SUPABASE_SERVICE_ROLE_KEY`
- Valor: sua service role key

## 🔒 Segurança

- **NUNCA** exponha a Service Role Key no frontend
- **NUNCA** commite a Service Role Key no Git
- Use apenas em API routes server-side
- Mantenha-a segura e não a compartilhe

## ✅ Como Funciona Agora

1. **ADMIN acessa página de Configurações**
2. **Clica em "Novo Usuário"**
3. **Preenche dados do usuário**
4. **Clica em "Criar Usuário"**
5. **API route usa Service Role para criar usuário**
6. **ADMIN permanece logado com sua sessão intacta**
7. **Mensagem de sucesso é exibida**

## 🚨 Se Não Configurar

Sem a Service Role Key, você receberá erro:
```
Error: Missing service role key
```

## 📋 Checklist de Verificação

- [ ] Service Role Key obtida do Supabase Dashboard
- [ ] Variável `SUPABASE_SERVICE_ROLE_KEY` configurada no .env.local
- [ ] Deploy atualizado (se aplicável)
- [ ] Teste de criação de usuário funcionando
- [ ] ADMIN permanece logado após criação

## 🔄 Teste da Funcionalidade

1. Faça login como ADMIN
2. Vá para Configurações > Gerenciar Usuários
3. Clique em "Novo Usuário"
4. Preencha:
   - Nome: "Teste Usuário"
   - Email: "teste@empresa.com"
   - Senha: "123456"
   - Role: "RH"
5. Clique em "Criar Usuário"
6. **Resultado esperado:**
   - ✅ Mensagem verde de sucesso
   - ✅ ADMIN permanece logado
   - ✅ Usuário é criado no sistema
   - ✅ Lista de usuários é atualizada
