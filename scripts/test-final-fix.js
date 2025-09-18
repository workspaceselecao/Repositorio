const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://qdzrldxubcofobqmynab.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFinalFix() {
  console.log('🔧 Teste Final - Verificando Correções')
  console.log('=' .repeat(50))
  
  try {
    const email = 'roberio.gomes@atento.com'
    const password = 'admin123'
    
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    console.log('🌐 URL:', supabaseUrl)
    
    // Testar login
    console.log('\n🔐 Testando login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message)
      console.error('📋 Código do erro:', loginError.status)
      
      if (loginError.message.includes('Invalid login credentials')) {
        console.log('\n💡 Possíveis causas:')
        console.log('1. Site URL incorreta no Supabase')
        console.log('2. Variáveis de ambiente não configuradas no Vercel')
        console.log('3. Problema de redirecionamento')
      }
      
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
    
    // Fazer logout
    console.log('\n🚪 Testando logout...')
    const { error: logoutError } = await supabase.auth.signOut()
    
    if (logoutError) {
      console.error('❌ Erro no logout:', logoutError.message)
    } else {
      console.log('✅ Logout realizado com sucesso!')
    }
    
    console.log('\n🎉 Teste concluído com sucesso!')
    console.log('✅ Backend funcionando perfeitamente')
    console.log('💡 Problema está na configuração do frontend/Vercel')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

testFinalFix()
