const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://qdzrldxubcofobqmynab.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkenJsZHh1YmNvZm9icW15bmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MzkyMjcsImV4cCI6MjA3MzMxNTIyN30.OGrgDawwnY9BXjwYpT36r1ESBHLHE2gf6FWZIYBsm3w'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugLoginIssue() {
  console.log('🔍 Debug Detalhado do Problema de Login')
  console.log('=' .repeat(60))
  
  try {
    const email = 'roberio.gomes@atento.com'
    const password = 'admin123'
    
    console.log('📧 Email:', email)
    console.log('🔑 Senha:', password)
    console.log('🌐 URL:', supabaseUrl)
    console.log('🔐 Key:', supabaseKey.substring(0, 30) + '...')
    
    // 1. Testar conexão básica
    console.log('\n1. 🔌 Testando conexão básica...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('❌ Erro na sessão:', sessionError.message)
    } else {
      console.log('✅ Conexão básica OK')
      console.log('📊 Sessão atual:', session ? 'Ativa' : 'Nenhuma')
    }
    
    // 2. Testar login com diferentes senhas
    console.log('\n2. 🔐 Testando login com diferentes senhas...')
    
    const passwordsToTest = [
      'admin123',
      'admin',
      'password',
      '123456',
      'roberio123',
      'atento123'
    ]
    
    let loginSuccess = false
    let workingPassword = null
    
    for (const testPassword of passwordsToTest) {
      console.log(`   Testando senha: ${testPassword}`)
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: testPassword
      })
      
      if (loginError) {
        console.log(`   ❌ ${testPassword}: ${loginError.message}`)
      } else {
        console.log(`   ✅ ${testPassword}: SUCESSO!`)
        loginSuccess = true
        workingPassword = testPassword
        console.log('   🆔 ID do usuário:', loginData.user.id)
        console.log('   📧 Email confirmado:', loginData.user.email_confirmed_at ? 'Sim' : 'Não')
        console.log('   📅 Criado em:', loginData.user.created_at)
        console.log('   🔄 Último login:', loginData.user.last_sign_in_at)
        break
      }
    }
    
    if (!loginSuccess) {
      console.log('\n❌ Nenhuma senha funcionou!')
      console.log('\n💡 Possíveis soluções:')
      console.log('1. Resetar a senha no painel do Supabase')
      console.log('2. Criar um novo usuário')
      console.log('3. Verificar se o email está correto')
      
      // Tentar criar um novo usuário
      console.log('\n3. 👤 Tentando criar novo usuário...')
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'roberio.gomes@atento.com',
        password: 'admin123',
        options: {
          data: {
            name: 'Robério Gomes',
            role: 'ADMIN'
          }
        }
      })
      
      if (signUpError) {
        console.log('❌ Erro ao criar usuário:', signUpError.message)
        if (signUpError.message.includes('already registered')) {
          console.log('ℹ️  Usuário já existe, mas senha pode estar incorreta')
        }
      } else {
        console.log('✅ Usuário criado com sucesso!')
        console.log('🆔 ID:', signUpData.user.id)
        console.log('📧 Email confirmado:', signUpData.user.email_confirmed_at ? 'Sim' : 'Não')
        
        if (!signUpData.user.email_confirmed_at) {
          console.log('⚠️  Usuário criado mas email não confirmado!')
          console.log('💡 Verifique o email ou confirme manualmente no painel do Supabase')
        }
      }
      
      return
    }
    
    // 3. Testar acesso a dados após login bem-sucedido
    console.log('\n3. 📊 Testando acesso a dados...')
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
    
    // 4. Testar acesso à tabela users
    console.log('\n4. 👥 Testando acesso à tabela users...')
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
      } else {
        console.log('ℹ️  Nenhum usuário encontrado na tabela users')
        console.log('💡 Inserindo usuário na tabela...')
        
        const { data: insertData, error: insertError } = await supabase
          .from('users')
          .insert({
            id: loginData.user.id,
            email: email,
            name: 'Robério Gomes',
            role: 'ADMIN'
          })
          .select()
          .single()
        
        if (insertError) {
          console.error('❌ Erro ao inserir usuário:', insertError.message)
        } else {
          console.log('✅ Usuário inserido na tabela users!')
          console.log('📋 Dados:', insertData)
        }
      }
    }
    
    // 5. Fazer logout
    console.log('\n5. 🚪 Testando logout...')
    const { error: logoutError } = await supabase.auth.signOut()
    
    if (logoutError) {
      console.error('❌ Erro no logout:', logoutError.message)
    } else {
      console.log('✅ Logout realizado com sucesso!')
    }
    
    console.log('\n🎉 Debug concluído!')
    console.log('✅ Senha que funcionou:', workingPassword)
    
  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

debugLoginIssue()
