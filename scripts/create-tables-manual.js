const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://fajvqzggqvhcnrsptttc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhanZxemdncXZoY25yc3B0dHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NjEwMzQsImV4cCI6MjA3MzEzNzAzNH0.vwYSUCV4XC0YGW-eNl2xE6Mx48NhbGq28S6w7lB9JVE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTables() {
  try {
    console.log('🚀 Criando tabelas no Supabase...')
    
    // 1. Testar conexão
    console.log('🔌 Testando conexão...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('pg_tables')
      .select('*')
      .limit(1)
    
    if (connectionError) {
      console.log('⚠️ Não é possível acessar pg_tables diretamente, mas isso é normal')
    }
    
    // 2. Tentar inserir dados de teste para verificar se as tabelas existem
    console.log('🧪 Testando se a tabela vagas existe...')
    
    const { data: testVaga, error: testError } = await supabase
      .from('vagas')
      .select('*')
      .limit(1)
    
    if (testError) {
      if (testError.code === 'PGRST205') {
        console.log('❌ Tabela vagas não existe!')
        console.log('📋 INSTRUÇÕES PARA CRIAR AS TABELAS:')
        console.log('')
        console.log('1. Acesse o Supabase Dashboard: https://supabase.com/dashboard')
        console.log('2. Selecione seu projeto: fajvqzggqvhcnrsptttc')
        console.log('3. Vá para: SQL Editor')
        console.log('4. Cole o seguinte SQL e execute:')
        console.log('')
        console.log('-- Criar extensão UUID se não existir')
        console.log('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        console.log('')
        console.log('-- Criar tabela de usuários')
        console.log('CREATE TABLE IF NOT EXISTS public.users (')
        console.log('    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),')
        console.log('    email VARCHAR UNIQUE NOT NULL,')
        console.log('    name VARCHAR NOT NULL,')
        console.log('    role VARCHAR CHECK (role IN (\'ADMIN\', \'RH\')) NOT NULL DEFAULT \'RH\',')
        console.log('    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),')
        console.log('    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()')
        console.log(');')
        console.log('')
        console.log('-- Criar tabela de vagas')
        console.log('CREATE TABLE IF NOT EXISTS public.vagas (')
        console.log('    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),')
        console.log('    site VARCHAR NOT NULL,')
        console.log('    categoria VARCHAR NOT NULL,')
        console.log('    cargo VARCHAR NOT NULL,')
        console.log('    cliente VARCHAR NOT NULL,')
        console.log('    produto VARCHAR NOT NULL,')
        console.log('    descricao_vaga TEXT,')
        console.log('    responsabilidades_atribuicoes TEXT,')
        console.log('    requisitos_qualificacoes TEXT,')
        console.log('    salario TEXT,')
        console.log('    horario_trabalho TEXT,')
        console.log('    jornada_trabalho TEXT,')
        console.log('    beneficios TEXT,')
        console.log('    local_trabalho TEXT,')
        console.log('    etapas_processo TEXT,')
        console.log('    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),')
        console.log('    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()')
        console.log(');')
        console.log('')
        console.log('-- Habilitar RLS')
        console.log('ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;')
        console.log('ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;')
        console.log('')
        console.log('-- Políticas de segurança')
        console.log('CREATE POLICY "Users can view own user data" ON public.users')
        console.log('    FOR SELECT USING (auth.email() = email);')
        console.log('')
        console.log('CREATE POLICY "Authenticated users can view vagas" ON public.vagas')
        console.log('    FOR SELECT USING (auth.role() = \'authenticated\');')
        console.log('')
        console.log('CREATE POLICY "Authenticated users can insert vagas" ON public.vagas')
        console.log('    FOR INSERT WITH CHECK (auth.role() = \'authenticated\');')
        console.log('')
        console.log('CREATE POLICY "Authenticated users can update vagas" ON public.vagas')
        console.log('    FOR UPDATE USING (auth.role() = \'authenticated\');')
        console.log('')
        console.log('CREATE POLICY "Authenticated users can delete vagas" ON public.vagas')
        console.log('    FOR DELETE USING (auth.role() = \'authenticated\');')
        console.log('')
        console.log('-- Inserir usuário ADMIN')
        console.log('INSERT INTO public.users (email, name, role)')
        console.log('VALUES (\'roberio.gomes@atento.com\', \'Robério Gomes\', \'ADMIN\')')
        console.log('ON CONFLICT (email) DO NOTHING;')
        console.log('')
        console.log('5. Após executar o SQL, execute este script novamente para testar')
        
        return false
      } else {
        console.error('❌ Erro inesperado:', testError)
        return false
      }
    } else {
      console.log('✅ Tabela vagas existe!')
      console.log(`📊 Encontradas ${testVaga.length} vagas`)
    }
    
    // 3. Testar tabela users
    console.log('🧪 Testando se a tabela users existe...')
    const { data: testUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (userError) {
      console.log('❌ Tabela users não existe!')
      return false
    } else {
      console.log('✅ Tabela users existe!')
      console.log(`👥 Encontrados ${testUser.length} usuários`)
    }
    
    console.log('\n🎉 Todas as tabelas estão funcionando!')
    return true
    
  } catch (error) {
    console.error('❌ Erro:', error)
    return false
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  createTables()
}

module.exports = { createTables }
