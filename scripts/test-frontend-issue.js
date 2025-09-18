// Simular exatamente o que acontece no frontend
const { createClient } = require('@supabase/supabase-js')

console.log('🌐 Teste Específico do Frontend')
console.log('=' .repeat(50))

// Simular o ambiente do navegador
global.window = {
  location: {
    origin: 'https://repositoriodevagas.vercel.app'
  }
}

// Configuração exata do frontend
const supabaseUrl = 'https://qdzrldxubcofobqmynab.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'

console.log('📋 Configuração:')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? 'Definida' : 'Não definida')
console.log('Origin:', global.window.location.origin)

// Criar cliente com configuração exata do frontend
const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      // Configurações específicas para produção
      flowType: 'pkce'
    }
  }
)

// Testar diferentes cenários
async function testScenarios() {
  console.log('\n🔍 Testando Cenários...')
  
  // Cenário 1: Login básico
  console.log('\n1️⃣ Login Básico...')
  try {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'roberio.gomes@atento.com',
      password: 'admin123'
    })
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message)
      console.error('📋 Código:', loginError.status)
      console.error('📋 Detalhes:', loginError)
      
      // Verificar se é problema específico do frontend
      if (loginError.message.includes('Invalid API key')) {
        console.log('\n🚨 PROBLEMA ESPECÍFICO: Invalid API key no frontend')
        console.log('💡 Possíveis causas:')
        console.log('1. Problema de CORS')
        console.log('2. Configuração de domínio no Supabase')
        console.log('3. Cache do navegador')
        console.log('4. Problema de rede')
        console.log('5. Configuração de headers')
      }
    } else {
      console.log('✅ Login OK')
      console.log('🆔 User ID:', loginData.user.id)
      
      // Fazer logout
      await supabase.auth.signOut()
    }
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
  
  // Cenário 2: Verificar se consegue acessar a API
  console.log('\n2️⃣ Verificando Acesso à API...')
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Erro na sessão:', sessionError.message)
    } else {
      console.log('✅ Sessão OK')
    }
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
  
  // Cenário 3: Testar com diferentes configurações
  console.log('\n3️⃣ Testando Configurações Alternativas...')
  
  // Configuração alternativa 1: Sem PKCE
  const supabaseAlt1 = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
  
  try {
    const { data: loginData, error: loginError } = await supabaseAlt1.auth.signInWithPassword({
      email: 'roberio.gomes@atento.com',
      password: 'admin123'
    })
    
    if (loginError) {
      console.error('❌ Erro com configuração alternativa:', loginError.message)
    } else {
      console.log('✅ Configuração alternativa OK')
      await supabaseAlt1.auth.signOut()
    }
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

testScenarios()
