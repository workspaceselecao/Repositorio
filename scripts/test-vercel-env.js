// Simular o ambiente do Vercel
process.env.NODE_ENV = 'production'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://qdzrldxubcofobqmynab.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'
process.env.NEXT_PUBLIC_APP_URL = 'https://repositoriodevagas.vercel.app'

const { createClient } = require('@supabase/supabase-js')

console.log('🌐 Teste Simulando Ambiente Vercel')
console.log('=' .repeat(50))

// Simular exatamente o que o frontend faz
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('📋 Variáveis de Ambiente:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Definida' : 'Não definida')
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)

// Valores padrão para fallback (como no código)
const defaultUrl = 'https://qdzrldxubcofobqmynab.supabase.co'
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'

const finalUrl = supabaseUrl || defaultUrl
const finalKey = supabaseAnonKey || defaultKey

console.log('\n🔧 Configuração Final:')
console.log('URL Final:', finalUrl)
console.log('Key Final:', finalKey ? 'Definida' : 'Não definida')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  console.error('Usando valores padrão como fallback')
} else {
  console.log('✅ Variáveis de ambiente do Supabase configuradas corretamente')
}

// Criar cliente Supabase
const supabase = createClient(
  finalUrl,
  finalKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Testar login
async function testLogin() {
  console.log('\n🔐 Testando Login...')
  
  try {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'roberio.gomes@atento.com',
      password: 'admin123'
    })
    
    if (loginError) {
      console.error('❌ Erro no login:', loginError.message)
      console.error('📋 Código:', loginError.status)
      console.error('📋 Detalhes:', loginError)
      
      // Verificar se é problema específico
      if (loginError.message.includes('Invalid API key')) {
        console.log('\n🚨 PROBLEMA: Invalid API key')
        console.log('💡 Possíveis causas:')
        console.log('1. Chave não está sendo passada corretamente')
        console.log('2. Problema de CORS')
        console.log('3. Configuração de domínio no Supabase')
        console.log('4. Cache do navegador')
      }
    } else {
      console.log('✅ Login realizado com sucesso!')
      console.log('🆔 User ID:', loginData.user.id)
      
      // Fazer logout
      await supabase.auth.signOut()
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

testLogin()
