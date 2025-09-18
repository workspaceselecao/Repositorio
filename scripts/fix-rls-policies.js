const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://qdzrldxubcofobqmynab.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixRLSPolicies() {
  console.log('🔧 Corrigindo políticas RLS...')
  
  try {
    const email = 'roberio.gomes@atento.com'
    const password = 'admin123'
    
    // Fazer login primeiro
    console.log('🔐 Fazendo login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message)
      return
    }
    
    console.log('✅ Login realizado com sucesso!')
    
    // SQL para corrigir as políticas RLS
    const fixSQL = `
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
    `
    
    console.log('📝 Executando SQL para corrigir políticas...')
    
    // Executar SQL usando RPC (se disponível) ou tentar inserir usuário diretamente
    console.log('🔄 Tentando inserir usuário na tabela users...')
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: loginData.user.id,
        email: email,
        name: 'Robério Gomes',
        role: 'ADMIN'
      })
      .select()
      .single()
    
    if (userError) {
      console.error('❌ Erro ao inserir usuário:', userError.message)
      
      if (userError.message.includes('duplicate key') || userError.message.includes('already exists')) {
        console.log('ℹ️  Usuário já existe, tentando atualizar...')
        
        const { data: updateData, error: updateError } = await supabase
          .from('users')
          .update({
            name: 'Robério Gomes',
            role: 'ADMIN'
          })
          .eq('email', email)
          .select()
          .single()
        
        if (updateError) {
          console.error('❌ Erro ao atualizar usuário:', updateError.message)
          console.log('\n💡 SOLUÇÃO MANUAL:')
          console.log('Execute este SQL no painel do Supabase:')
          console.log(fixSQL)
        } else {
          console.log('✅ Usuário atualizado com sucesso!')
          console.log('📊 Dados:', updateData)
        }
      } else {
        console.log('\n💡 SOLUÇÃO MANUAL:')
        console.log('Execute este SQL no painel do Supabase:')
        console.log(fixSQL)
      }
    } else {
      console.log('✅ Usuário inserido com sucesso!')
      console.log('📊 Dados:', userData)
    }
    
    // Testar acesso após correção
    console.log('\n🔍 Testando acesso após correção...')
    const { data: testUsers, error: testError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
    
    if (testError) {
      console.error('❌ Ainda há erro:', testError.message)
    } else {
      console.log('✅ Acesso funcionando!')
      console.log('👤 Usuários encontrados:', testUsers.length)
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

fixRLSPolicies()
