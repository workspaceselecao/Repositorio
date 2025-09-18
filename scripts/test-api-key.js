const { createClient } = require('@supabase/supabase-js')

// Testar diferentes configurações de chave
const supabaseUrl = 'https://qdzrldxubcofobqmynab.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'

console.log('🔍 Teste Profundo da Chave API')
console.log('=' .repeat(50))

// Verificar se a chave está correta
console.log('📋 Informações da Chave:')
console.log('URL:', supabaseUrl)
console.log('Key (primeiros 50 chars):', supabaseKey.substring(0, 50) + '...')
console.log('Key (últimos 20 chars):', '...' + supabaseKey.substring(supabaseKey.length - 20))

// Decodificar JWT para verificar
try {
  const payload = JSON.parse(Buffer.from(supabaseKey.split('.')[1], 'base64').toString())
  console.log('\n🔐 Payload da Chave JWT:')
  console.log('Issuer:', payload.iss)
  console.log('Reference:', payload.ref)
  console.log('Role:', payload.role)
  console.log('Issued At:', new Date(payload.iat * 1000))
  console.log('Expires At:', new Date(payload.exp * 1000))
  console.log('Expired?', new Date() > new Date(payload.exp * 1000))
} catch (error) {
  console.error('❌ Erro ao decodificar JWT:', error.message)
}

// Testar conexão básica
async function testConnection() {
  console.log('\n🔌 Testando Conexão...')
  
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
  
  try {
    // Teste 1: Verificar se consegue acessar a API
    console.log('1️⃣ Testando acesso à API...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Erro na sessão:', sessionError.message)
      console.error('📋 Código:', sessionError.status)
    } else {
      console.log('✅ Sessão OK')
    }
    
    // Teste 2: Tentar login
    console.log('\n2️⃣ Testando login...')
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'roberio.gomes@atento.com',
      password: 'admin123'
    })
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message)
      console.error('📋 Código:', loginError.status)
      console.error('📋 Detalhes:', loginError)
      
      // Verificar se é problema de chave
      if (loginError.message.includes('Invalid API key') || loginError.message.includes('Invalid JWT')) {
        console.log('\n🚨 PROBLEMA IDENTIFICADO: Chave API inválida!')
        console.log('💡 Possíveis causas:')
        console.log('1. Chave expirada')
        console.log('2. Chave incorreta')
        console.log('3. Projeto Supabase incorreto')
        console.log('4. Configuração de domínio incorreta')
      }
    } else {
      console.log('✅ Login OK')
      console.log('🆔 User ID:', loginData.user.id)
      
      // Fazer logout
      await supabase.auth.signOut()
    }
    
    // Teste 3: Verificar se consegue acessar dados
    console.log('\n3️⃣ Testando acesso a dados...')
    const { data: vagas, error: vagasError } = await supabase
      .from('vagas')
      .select('*')
      .limit(1)
    
    if (vagasError) {
      console.error('❌ Erro ao acessar vagas:', vagasError.message)
    } else {
      console.log('✅ Acesso a dados OK')
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

testConnection()
