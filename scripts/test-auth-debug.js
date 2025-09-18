const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://qdzrldxubcofobqmynab.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuthDebug() {
  console.log('🔍 Teste de Debug de Autenticação')
  console.log('=' .repeat(50))
  
  try {
    const email = 'roberio.gomes@atento.com'
    const password = 'admin123'
    
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    console.log('🌐 URL:', supabaseUrl)
    console.log('🔐 Key:', supabaseKey.substring(0, 20) + '...')
    
    // Testar conexão básica
    console.log('\n1. Testando conexão básica...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('❌ Erro na sessão:', sessionError.message)
    } else {
      console.log('✅ Conexão básica OK')
    }
    
    // Testar login
    console.log('\n2. Testando login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message)
      console.error('📋 Detalhes do erro:', loginError)
      
      // Verificar se é erro de credenciais
      if (loginError.message.includes('Invalid login credentials')) {
        console.log('\n💡 Possíveis soluções:')
        console.log('1. Verificar se a senha está correta')
        console.log('2. Verificar se o usuário existe no Supabase Auth')
        console.log('3. Verificar se o usuário está confirmado')
      }
      
      return
    }
    
    console.log('✅ Login realizado com sucesso!')
    console.log('🆔 ID do usuário:', loginData.user.id)
    console.log('📧 Email confirmado:', loginData.user.email_confirmed_at ? 'Sim' : 'Não')
    console.log('📅 Criado em:', loginData.user.created_at)
    
    // Testar acesso a dados
    console.log('\n3. Testando acesso a dados...')
    const { data: vagas, error: vagasError } = await supabase
      .from('vagas')
      .select('*')
      .limit(1)
    
    if (vagasError) {
      console.error('❌ Erro ao acessar vagas:', vagasError.message)
      console.error('📋 Detalhes:', vagasError)
    } else {
      console.log('✅ Acesso a dados OK')
      console.log('📊 Vagas encontradas:', vagas.length)
    }
    
    // Testar acesso à tabela users
    console.log('\n4. Testando acesso à tabela users...')
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
    
    if (usersError) {
      console.error('❌ Erro ao acessar users:', usersError.message)
      console.error('📋 Detalhes:', usersError)
    } else {
      console.log('✅ Acesso à tabela users OK')
      console.log('👤 Usuários encontrados:', users.length)
      if (users.length > 0) {
        console.log('📋 Dados do usuário:', users[0])
      }
    }
    
    // Fazer logout
    console.log('\n5. Testando logout...')
    const { error: logoutError } = await supabase.auth.signOut()
    
    if (logoutError) {
      console.error('❌ Erro no logout:', logoutError.message)
    } else {
      console.log('✅ Logout realizado com sucesso!')
    }
    
    console.log('\n🎉 Teste concluído!')
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

testAuthDebug()
