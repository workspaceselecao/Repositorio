import { createClient } from '@supabase/supabase-js'

// Cliente com service role para operações administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Listar usuários
export async function GET(request) {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar usuários:', error)
      return Response.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
    }

    return Response.json({ users: users || [] }, { status: 200 })
  } catch (error) {
    console.error('Erro na API users GET:', error)
    return Response.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar usuário
export async function POST(request) {
  try {
    // Verificar se a Service Role Key está configurada
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY não configurada')
      return Response.json({ 
        error: 'Configuração do servidor incompleta. Service Role Key não encontrada.',
        code: 'MISSING_SERVICE_ROLE_KEY'
      }, { status: 500 })
    }

    const { email, password, name, role } = await request.json()
    
    console.log('Dados recebidos para criação:', { email, name, role })

    // Validações básicas
    if (!email || !password || !name || !role) {
      return Response.json({ 
        error: 'Todos os campos são obrigatórios',
        code: 'MISSING_FIELDS'
      }, { status: 400 })
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ 
        error: 'Formato de email inválido',
        code: 'INVALID_EMAIL'
      }, { status: 400 })
    }

    // Validação de senha
    if (password.length < 6) {
      return Response.json({ 
        error: 'Senha deve ter pelo menos 6 caracteres',
        code: 'WEAK_PASSWORD'
      }, { status: 400 })
    }

    // Validação de role
    if (!['ADMIN', 'RH'].includes(role)) {
      return Response.json({ 
        error: 'Tipo de usuário inválido',
        code: 'INVALID_ROLE'
      }, { status: 400 })
    }

    // Verificar se email já existe (método mais simples)
    const { data: existingUsers } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (existingUsers && existingUsers.length > 0) {
      return Response.json({ 
        error: 'Este email já está em uso',
        code: 'EMAIL_EXISTS'
      }, { status: 409 })
    }

    // Criar usuário no Supabase Auth
    console.log('Criando usuário no Supabase Auth...')
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role }
    })

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError)
      
      let errorMessage = 'Erro ao criar usuário'
      if (authError.message.includes('already registered')) {
        errorMessage = 'Este email já está em uso'
      }
      
      return Response.json({ 
        error: errorMessage,
        code: 'AUTH_ERROR'
      }, { status: 400 })
    }

    console.log('Usuário criado no Auth com sucesso:', authData?.user?.id)

    // Criar perfil na tabela users
    console.log('Criando perfil na tabela users...')
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
      console.error('Erro ao criar perfil do usuário:', profileError)
      
      // Limpar usuário do auth se falhou
      try {
        console.log('Limpando usuário do auth após falha no perfil...')
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        console.log('Usuário removido do auth com sucesso')
      } catch (deleteError) {
        console.error('Erro ao limpar usuário do auth:', deleteError)
      }
      
      return Response.json({ 
        error: `Erro ao criar perfil do usuário: ${profileError.message}`,
        code: 'PROFILE_ERROR'
      }, { status: 500 })
    }

    console.log('Perfil criado com sucesso:', profileData)

    return Response.json({ 
      success: true,
      user: profileData,
      message: `Usuário ${name} criado com sucesso!`
    }, { status: 201 })

  } catch (error) {
    console.error('Erro na API users POST:', error)
    return Response.json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

// DELETE - Deletar usuário
export async function DELETE(request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return Response.json({ 
        error: 'ID do usuário é obrigatório',
        code: 'MISSING_USER_ID'
      }, { status: 400 })
    }

    // Deletar do auth primeiro
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error('Erro ao deletar usuário do auth:', authError)
      return Response.json({ 
        error: 'Erro ao deletar usuário',
        code: 'AUTH_DELETE_ERROR'
      }, { status: 500 })
    }

    // Deletar perfil da tabela
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.error('Erro ao deletar perfil:', profileError)
      return Response.json({ 
        error: 'Erro ao deletar perfil do usuário',
        code: 'PROFILE_DELETE_ERROR'
      }, { status: 500 })
    }

    return Response.json({ 
      success: true,
      message: 'Usuário deletado com sucesso!'
    }, { status: 200 })

  } catch (error) {
    console.error('Erro na API users DELETE:', error)
    return Response.json({ 
      error: 'Erro interno do servidor',
      code: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}
