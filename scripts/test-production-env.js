const { createClient } = require('@supabase/supabase-js')

// Simular ambiente de produção
process.env.NODE_ENV = 'production'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://qdzrldxubcofobqmynab.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🌐 Simulando ambiente de produção...')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('SUPABASE_URL:', supabaseUrl)
console.log('SUPABASE_KEY:', supabaseKey ? 'Configurada' : 'Não configurada')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProductionEnv() {
  console.log('🔍 Testando ambiente de produção...')
  console.log('=' .repeat(50))
  
  try {
    const email = 'roberio.gomes@atento.com'
    const password = 'admin123'
    
    // Testar login
    console.log('🔐 Testando login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message)
      console.error('📋 Detalhes:', loginError)
      return
    }
    
    console.log('✅ Login realizado com sucesso!')
    console.log('🆔 ID do usuário:', loginData.user.id)
    console.log('📧 Email:', loginData.user.email)
    console.log('🔐 Role:', loginData.user.user_metadata?.role || 'Não definido')
    
    // Testar acesso a dados
    console.log('\n📊 Testando acesso a dados...')
    const { data: vagas, error: vagasError } = await supabase
      .from('vagas')
      .select('*')
      .limit(1)
    
    if (vagasError) {
      console.error('❌ Erro ao acessar vagas:', vagasError.message)
    } else {
      console.log('✅ Acesso a dados OK')
      console.log('📊 Vagas encontradas:', vagas.length)
    }
    
    // Testar acesso à tabela users
    console.log('\n👥 Testando acesso à tabela users...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
    
    if (usersError) {
      console.error('❌ Erro ao acessar users:', usersError.message)
    } else {
      console.log('✅ Acesso à tabela users OK')
      console.log('👤 Usuários encontrados:', users.length)
      if (users.length > 0) {
        console.log('📋 Dados do usuário:', users[0])
      }
    }
    
    console.log('\n🎉 Teste de produção concluído com sucesso!')
    console.log('💡 O problema pode estar na configuração do Vercel ou no frontend')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

testProductionEnv()
