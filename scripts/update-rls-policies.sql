-- Script para atualizar políticas RLS
-- Execute este script no Supabase SQL Editor

-- Remover políticas antigas
DROP POLICY IF EXISTS "Users can view own user data" ON public.users;
DROP POLICY IF EXISTS "Users can update own user data" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can insert users" ON public.users;
DROP POLICY IF EXISTS "Only admin can delete users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view vagas" ON public.vagas;
DROP POLICY IF EXISTS "Authenticated users can insert vagas" ON public.vagas;
DROP POLICY IF EXISTS "Authenticated users can update vagas" ON public.vagas;
DROP POLICY IF EXISTS "Authenticated users can delete vagas" ON public.vagas;

-- Criar novas políticas de segurança para usuários
-- ADMIN pode ver todos os usuários, outros usuários veem apenas seus próprios dados
CREATE POLICY "Users can view user data" ON public.users
    FOR SELECT USING (
        auth.email() = email OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE email = auth.email() AND role = 'ADMIN'
        )
    );

-- ADMIN pode atualizar todos os usuários, outros usuários podem atualizar apenas seus próprios dados
CREATE POLICY "Users can update user data" ON public.users
    FOR UPDATE USING (
        auth.email() = email OR 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE email = auth.email() AND role = 'ADMIN'
        )
    );

-- Permitir inserção de usuários apenas para ADMIN
CREATE POLICY "Only admin can insert users" ON public.users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE email = auth.email() AND role = 'ADMIN'
        )
    );

-- Apenas ADMIN pode deletar usuários
CREATE POLICY "Only admin can delete users" ON public.users
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE email = auth.email() AND role = 'ADMIN'
        )
    );

-- Criar novas políticas de segurança para vagas
-- RH e ADMIN podem visualizar vagas
CREATE POLICY "RH and ADMIN can view vagas" ON public.vagas
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE email = auth.email() AND role IN ('RH', 'ADMIN')
        )
    );

-- RH e ADMIN podem inserir vagas
CREATE POLICY "RH and ADMIN can insert vagas" ON public.vagas
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE email = auth.email() AND role IN ('RH', 'ADMIN')
        )
    );

-- RH e ADMIN podem atualizar vagas
CREATE POLICY "RH and ADMIN can update vagas" ON public.vagas
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE email = auth.email() AND role IN ('RH', 'ADMIN')
        )
    );

-- RH e ADMIN podem deletar vagas
CREATE POLICY "RH and ADMIN can delete vagas" ON public.vagas
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE email = auth.email() AND role IN ('RH', 'ADMIN')
        )
    );

-- Verificar se as políticas foram criadas corretamente
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
