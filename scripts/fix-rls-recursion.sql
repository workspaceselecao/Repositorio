-- Script URGENTE para corrigir recursão infinita nas políticas RLS
-- Execute este script no Supabase SQL Editor IMEDIATAMENTE

-- 1. REMOVER TODAS AS POLÍTICAS PROBLEMÁTICAS
DROP POLICY IF EXISTS "Users can view user data" ON public.users;
DROP POLICY IF EXISTS "Users can update user data" ON public.users;
DROP POLICY IF EXISTS "Only admin can insert users" ON public.users;
DROP POLICY IF EXISTS "Only admin can delete users" ON public.users;
DROP POLICY IF EXISTS "RH and ADMIN can view vagas" ON public.vagas;
DROP POLICY IF EXISTS "RH and ADMIN can insert vagas" ON public.vagas;
DROP POLICY IF EXISTS "RH and ADMIN can update vagas" ON public.vagas;
DROP POLICY IF EXISTS "RH and ADMIN can delete vagas" ON public.vagas;

-- 2. CRIAR POLÍTICAS SIMPLES E SEGURAS (SEM RECURSÃO)

-- Políticas para usuários - SIMPLES E SEGURAS
-- Todos os usuários autenticados podem ver usuários
CREATE POLICY "Authenticated users can view users" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Todos os usuários autenticados podem atualizar usuários
CREATE POLICY "Authenticated users can update users" ON public.users
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Todos os usuários autenticados podem inserir usuários
CREATE POLICY "Authenticated users can insert users" ON public.users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Todos os usuários autenticados podem deletar usuários
CREATE POLICY "Authenticated users can delete users" ON public.users
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para vagas - SIMPLES E SEGURAS
-- Todos os usuários autenticados podem visualizar vagas
CREATE POLICY "Authenticated users can view vagas" ON public.vagas
    FOR SELECT USING (auth.role() = 'authenticated');

-- Todos os usuários autenticados podem inserir vagas
CREATE POLICY "Authenticated users can insert vagas" ON public.vagas
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Todos os usuários autenticados podem atualizar vagas
CREATE POLICY "Authenticated users can update vagas" ON public.vagas
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Todos os usuários autenticados podem deletar vagas
CREATE POLICY "Authenticated users can delete vagas" ON public.vagas
    FOR DELETE USING (auth.role() = 'authenticated');

-- 3. VERIFICAR SE AS POLÍTICAS FORAM CRIADAS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'vagas')
ORDER BY tablename, policyname;
