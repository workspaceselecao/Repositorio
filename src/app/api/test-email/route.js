import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    
    if (!email) {
      return Response.json({ 
        error: 'Email é obrigatório. Use: /api/test-email?email=seu@email.com' 
      }, { status: 400 })
    }

    console.log('=== TESTE DE EMAIL ===')
    console.log('Email a ser testado:', email)

    // Verificar na tabela users
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role')
      .eq('email', email)

    console.log('Resultado da consulta na tabela users:')
    console.log('- Dados:', users)
    console.log('- Erro:', usersError)
    console.log('- Quantidade encontrada:', users ? users.length : 0)

    // Verificar no Auth
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    let emailInAuth = false
    if (authUsers?.users) {
      emailInAuth = authUsers.users.some(user => user.email === email)
    }

    console.log('Email existe no Auth:', emailInAuth)

    return Response.json({
      email,
      existsInUsersTable: users && users.length > 0,
      existsInAuth: emailInAuth,
      usersFound: users || [],
      message: users && users.length > 0 
        ? `Email ${email} JÁ EXISTE na tabela users` 
        : `Email ${email} NÃO EXISTE na tabela users - pode ser criado`
    })

  } catch (error) {
    console.error('Erro no teste de email:', error)
    return Response.json({ 
      error: `Erro: ${error.message}` 
    }, { status: 500 })
  }
}
