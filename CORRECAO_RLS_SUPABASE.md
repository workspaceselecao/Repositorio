# 🔧 Correção das Políticas RLS no Supabase

## ⚠️ PROBLEMA IDENTIFICADO

O erro "infinite recursion detected in policy for relation 'users'" está impedindo o login. As políticas RLS estão causando recursão infinita.

## 🚀 SOLUÇÃO

### 1. Acesse o Painel do Supabase
- Vá para: https://supabase.com/dashboard
- Selecione o projeto: `qdzrldxubcofobqmynab`

### 2. Execute o SQL Editor
- Vá para: **SQL Editor**
- Clique em **"New query"**

### 3. Execute o SQL de Correção

```sql
-- Remover todas as políticas existentes que causam recursão
DROP POLICY IF EXISTS "Users can view own user data" ON public.users;
DROP POLICY IF EXISTS "Users can update own user data" ON public.users;
DROP POLICY IF EXISTS "Only admin can insert users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can insert users" ON public.users;
DROP POLICY IF EXISTS "Only admin can delete users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view all users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can update users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can delete users" ON public.users;

-- Criar políticas simples sem recursão
CREATE POLICY "Enable read access for all users" ON public.users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON public.users
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON public.users
    FOR DELETE USING (auth.role() = 'authenticated');
```

### 4. Inserir Usuário na Tabela

```sql
-- Inserir usuário administrador
INSERT INTO public.users (id, email, name, role) 
VALUES (
    '974707b8-00ba-499b-9ced-bdbf52a2813b',
    'roberio.gomes@atento.com',
    'Robério Gomes',
    'ADMIN'
)
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();
```

### 5. Verificar se Funcionou

```sql
-- Testar se consegue acessar a tabela users
SELECT * FROM public.users WHERE email = 'roberio.gomes@atento.com';
```

## 🔍 Verificação Final

Após executar o SQL:

1. **Acesse a aplicação**: https://repositoriodevagas.vercel.app/login
2. **Faça login** com:
   - Email: `roberio.gomes@atento.com`
   - Senha: `admin123`
3. **Verifique** se o erro "Invalid API key" desapareceu
4. **Confirme** se consegue acessar o dashboard

## 🚨 Se Ainda Houver Problemas

### Alternativa 1: Desabilitar RLS Temporariamente
```sql
-- Desabilitar RLS na tabela users
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Inserir usuário
INSERT INTO public.users (id, email, name, role) 
VALUES ('974707b8-00ba-499b-9ced-bdbf52a2813b', 'roberio.gomes@atento.com', 'Robério Gomes', 'ADMIN')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Reabilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

### Alternativa 2: Usar Service Role Key
Se necessário, use a service role key para contornar as políticas RLS.

## ✅ Após a Correção

- ✅ Login funcionará normalmente
- ✅ Erro 401 será resolvido
- ✅ Sistema estará operacional
- ✅ Dados carregarão corretamente
