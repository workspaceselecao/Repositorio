import { createClient } from '@supabase/supabase-js'

// Criar cliente com service role para operações administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    // Verificar se a Service Role Key está configurada
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY não configurada')
      return Response.json({ 
        error: 'Configuração do servidor incompleta. Service Role Key não encontrada.' 
      }, { status: 500 })
    }

    const { email, password, name, role } = await request.json()

    // Validação de dados obrigatórios
    if (!email || !password || !name || !role) {
      return Response.json({ 
        error: 'Dados obrigatórios: email, password, name, role' 
      }, { status: 400 })
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ 
        error: 'Formato de email inválido' 
      }, { status: 400 })
    }

    // Validação de senha
    if (password.length < 6) {
      return Response.json({ 
        error: 'Senha deve ter pelo menos 6 caracteres' 
      }, { status: 400 })
    }

    // Validação de role
    if (!['ADMIN', 'RH'].includes(role)) {
      return Response.json({ 
        error: 'Role deve ser ADMIN ou RH' 
      }, { status: 400 })
    }

    // Verificar se o email já existe
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)

    // Log para debug
    console.log('Verificando email:', email)
    console.log('Usuários encontrados:', existingUsers)
    console.log('Erro na verificação:', checkError)

    // Se encontrou algum usuário com este email
    if (existingUsers && existingUsers.length > 0) {
      console.log('Email já existe no sistema:', email)
      return Response.json({ 
        error: 'Este email já está cadastrado no sistema' 
      }, { status: 409 })
    }

    // Se houve erro na verificação (não é erro de "não encontrado")
    if (checkError && !checkError.message.includes('No rows returned')) {
      console.error('Erro ao verificar email existente:', checkError)
      return Response.json({ 
        error: 'Erro ao verificar email existente' 
      }, { status: 500 })
    }

    console.log('Email disponível para criação:', email)

    // Criar usuário no Supabase Auth usando admin
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        name,
        role
      }
    })

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError)
      
      // Tratar erros específicos do Supabase Auth
      let errorMessage = 'Erro ao criar usuário'
      if (authError.message.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado no sistema'
      } else if (authError.message.includes('Invalid email')) {
        errorMessage = 'Email inválido'
      } else if (authError.message.includes('Password should be at least')) {
        errorMessage = 'Senha deve ter pelo menos 6 caracteres'
      } else {
        errorMessage = authError.message || 'Erro ao criar usuário'
      }

      return Response.json({ 
        error: errorMessage
      }, { status: 400 })
    }

    if (authData?.user) {
      // Criar perfil do usuário na tabela users
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            role
          }
        ])

      if (profileError) {
        console.error('Erro ao criar perfil do usuário:', profileError)
        
        // Tentar deletar o usuário do auth se o perfil falhou
        try {
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        } catch (deleteError) {
          console.error('Erro ao deletar usuário após falha no perfil:', deleteError)
        }

        // Tratar erros específicos do banco
        let errorMessage = 'Erro ao criar perfil do usuário'
        if (profileError.message.includes('duplicate key value')) {
          errorMessage = 'Este email já está cadastrado no sistema'
        } else if (profileError.message.includes('violates unique constraint')) {
          errorMessage = 'Dados duplicados encontrados'
        } else {
          errorMessage = profileError.message || 'Erro ao criar perfil do usuário'
        }

        return Response.json({ 
          error: errorMessage
        }, { status: 400 })
      }

      return Response.json({ 
        success: true, 
        message: `Usuário ${name} criado com sucesso!`,
        user: {
          id: authData.user.id,
          email,
          name,
          role
        }
      }, { status: 201 })
    }

    return Response.json({ 
      error: 'Erro desconhecido ao criar usuário' 
    }, { status: 400 })

  } catch (error) {
    console.error('Erro na API create-user:', error)
    return Response.json({ 
      error: 'Erro interno do servidor. Tente novamente.' 
    }, { status: 500 })
  }
}
