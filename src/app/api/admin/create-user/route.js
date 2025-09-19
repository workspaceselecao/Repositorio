import { createClient } from '@supabase/supabase-js'

// Criar cliente com service role para operações administrativas
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json()

    // Verificar se os dados necessários foram fornecidos
    if (!email || !password || !name || !role) {
      return Response.json({ 
        error: 'Dados obrigatórios: email, password, name, role' 
      }, { status: 400 })
    }

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
      return Response.json({ 
        error: authError.message || 'Erro ao criar usuário' 
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
        return Response.json({ 
          error: profileError.message || 'Erro ao criar perfil do usuário' 
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
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
