// Teste específico para produção no Vercel
const { createClient } = require('@supabase/supabase-js')

console.log('🌐 Teste Específico para Produção Vercel')
console.log('=' .repeat(50))

// Configuração exata do Vercel
const supabaseUrl = 'https://qdzrldxubcofobqmynab.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'

console.log('📋 Configuração:')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? 'Definida' : 'Não definida')

// Testar diferentes configurações de cliente
async function testDifferentConfigs() {
  console.log('\n🔍 Testando Diferentes Configurações...')
  
  // Configuração 1: Padrão
  console.log('\n1️⃣ Configuração Padrão...')
  const supabase1 = createClient(supabaseUrl, supabaseKey)
  
  try {
    const { data, error } = await supabase1.auth.signInWithPassword({
      email: 'roberio.gomes@atento.com',
      password: 'admin123'
    })
    
    if (error) {
      console.error('❌ Erro:', error.message)
      console.error('📋 Código:', error.status)
    } else {
      console.log('✅ Login OK')
      await supabase1.auth.signOut()
    }
  } catch (err) {
    console.error('❌ Erro geral:', err.message)
  }
  
  // Configuração 2: Com headers específicos
  console.log('\n2️⃣ Configuração com Headers...')
  const supabase2 = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    }
  })
  
  try {
    const { data, error } = await supabase2.auth.signInWithPassword({
      email: 'roberio.gomes@atento.com',
      password: 'admin123'
    })
    
    if (error) {
      console.error('❌ Erro:', error.message)
      console.error('📋 Código:', error.status)
    } else {
      console.log('✅ Login OK')
      await supabase2.auth.signOut()
    }
  } catch (err) {
    console.error('❌ Erro geral:', err.message)
  }
  
  // Configuração 3: Mínima
  console.log('\n3️⃣ Configuração Mínima...')
  const supabase3 = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  })
  
  try {
    const { data, error } = await supabase3.auth.signInWithPassword({
      email: 'roberio.gomes@atento.com',
      password: 'admin123'
    })
    
    if (error) {
      console.error('❌ Erro:', error.message)
      console.error('📋 Código:', error.status)
    } else {
      console.log('✅ Login OK')
      await supabase3.auth.signOut()
    }
  } catch (err) {
    console.error('❌ Erro geral:', err.message)
  }
  
  // Teste direto da API
  console.log('\n4️⃣ Teste Direto da API...')
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'roberio.gomes@atento.com',
        password: 'admin123'
      })
    })
    
    console.log('📋 Status:', response.status)
    console.log('📋 OK:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro da API:', errorText)
    } else {
      const data = await response.json()
      console.log('✅ API OK:', data.access_token ? 'Token recebido' : 'Sem token')
    }
  } catch (err) {
    console.error('❌ Erro na API:', err.message)
  }
}

testDifferentConfigs()
