import { createClient } from '@supabase/supabase-js'

// Criar cliente admin com service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request) {
  try {
    console.log('=== CRIAÇÃO DE USUÁRIO ===')
    
    const { email, password, name, role } = await request.json()
    
    console.log('Dados recebidos:', { email, name, role })
    
    // Validações
    if (!email || !password || !name || !role) {
      return Response.json({ 
        error: 'Todos os campos são obrigatórios' 
      }, { status: 400 })
    }

    // Verificar se email já existe
    console.log('Verificando email duplicado...')
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      console.log('Email já existe:', email)
      return Response.json({ 
        error: 'Este email já está cadastrado' 
      }, { status: 409 })
    }

    console.log('Email disponível, criando usuário...')

    // Criar usuário usando admin.createUser
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role
      }
    })

    if (authError) {
      console.error('Erro no Auth:', authError)
      return Response.json({ 
        error: authError.message 
      }, { status: 400 })
    }

    console.log('Usuário criado no Auth:', authData.user.id)

    // Criar perfil na tabela users
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name,
        role
      })
      .select()
      .single()

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError)
      
      // Limpar usuário do auth
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      } catch (deleteError) {
        console.error('Erro ao limpar auth:', deleteError)
      }
      
      return Response.json({ 
        error: 'Erro ao criar perfil do usuário' 
      }, { status: 500 })
    }

    console.log('✅ Usuário criado com sucesso!')

    return Response.json({
      success: true,
      message: `Usuário ${name} criado com sucesso!`,
      user: profileData
    })

  } catch (error) {
    console.error('Erro geral:', error)
    return Response.json({ 
      error: error.message 
    }, { status: 500 })
  }
}
