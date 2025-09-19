import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    console.log('=== TESTE DE CRIAÇÃO DE USUÁRIO ===')
    
    const { email, password, name, role } = await request.json()
    
    console.log('Dados recebidos:')
    console.log('- Email:', email)
    console.log('- Nome:', name)
    console.log('- Role:', role)
    console.log('- Senha:', password ? '***' : 'VAZIA')

    // Validações
    if (!email || !password || !name || !role) {
      console.log('❌ Campos obrigatórios faltando')
      return Response.json({ 
        error: 'Campos obrigatórios: email, password, name, role',
        step: 'VALIDATION'
      }, { status: 400 })
    }

    // Verificar se email já existe
    console.log('🔍 Verificando se email já existe...')
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', email)

    console.log('Resultado da verificação:')
    console.log('- Dados encontrados:', existingUsers)
    console.log('- Erro:', checkError)
    console.log('- Quantidade:', existingUsers ? existingUsers.length : 0)

    if (existingUsers && existingUsers.length > 0) {
      console.log('❌ EMAIL JÁ EXISTE - Parando aqui')
      return Response.json({ 
        error: `Email ${email} já existe`,
        step: 'EMAIL_CHECK',
        found: existingUsers
      }, { status: 409 })
    }

    console.log('✅ EMAIL DISPONÍVEL - Prosseguindo')

    // Criar no Auth
    console.log('🔧 Criando usuário no Auth...')
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role }
    })

    if (authError) {
      console.log('❌ Erro no Auth:', authError)
      return Response.json({ 
        error: `Erro no Auth: ${authError.message}`,
        step: 'AUTH_CREATION'
      }, { status: 400 })
    }

    console.log('✅ Usuário criado no Auth:', authData.user.id)

    // Criar na tabela
    console.log('🔧 Criando na tabela users...')
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        name,
        role
      }])
      .select()
      .single()

    if (profileError) {
      console.log('❌ Erro na tabela:', profileError)
      
      // Limpar Auth
      try {
        console.log('🧹 Limpando Auth...')
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        console.log('✅ Auth limpo')
      } catch (cleanupError) {
        console.log('❌ Erro na limpeza:', cleanupError)
      }
      
      return Response.json({ 
        error: `Erro na tabela: ${profileError.message}`,
        step: 'TABLE_CREATION'
      }, { status: 500 })
    }

    console.log('✅ Usuário criado com sucesso!')
    console.log('=== TESTE CONCLUÍDO COM SUCESSO ===')

    return Response.json({ 
      success: true,
      message: 'Usuário criado com sucesso!',
      user: profileData,
      step: 'SUCCESS'
    })

  } catch (error) {
    console.error('❌ Erro geral:', error)
    return Response.json({ 
      error: `Erro geral: ${error.message}`,
      step: 'GENERAL_ERROR'
    }, { status: 500 })
  }
}
