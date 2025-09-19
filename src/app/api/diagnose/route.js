import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    console.log('=== DIAGNÓSTICO COMPLETO ===')
    
    // 1. Verificar variáveis de ambiente
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Variáveis de ambiente:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', hasUrl)
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', hasServiceRole)
    
    if (!hasUrl) {
      return Response.json({
        error: 'NEXT_PUBLIC_SUPABASE_URL não configurada',
        status: 'FAILED'
      }, { status: 500 })
    }
    
    if (!hasServiceRole) {
      return Response.json({
        error: 'SUPABASE_SERVICE_ROLE_KEY não configurada no Vercel',
        status: 'FAILED',
        instructions: 'Configure a Service Role Key no Vercel: Settings > Environment Variables > Production'
      }, { status: 500 })
    }

    // 2. Testar conexão com Supabase
    console.log('Testando conexão com Supabase...')
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // 3. Testar query na tabela users
    console.log('Testando query na tabela users...')
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')

    console.log('Resultado da query users:')
    console.log('- Dados:', users)
    console.log('- Erro:', usersError)

    if (usersError) {
      return Response.json({
        error: 'Erro ao conectar com tabela users',
        details: usersError.message,
        status: 'FAILED'
      }, { status: 500 })
    }

    // 4. Testar Auth admin
    console.log('Testando Auth admin...')
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    console.log('Resultado do Auth admin:')
    console.log('- Dados:', authData)
    console.log('- Erro:', authError)

    if (authError) {
      return Response.json({
        error: 'Erro ao conectar com Auth admin',
        details: authError.message,
        status: 'FAILED'
      }, { status: 500 })
    }

    // 5. Teste específico de email
    console.log('Testando verificação de email...')
    const testEmail = 'teste@exemplo.com'
    const { data: emailCheck, error: emailError } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', testEmail)

    console.log('Teste de email:')
    console.log('- Email testado:', testEmail)
    console.log('- Resultado:', emailCheck)
    console.log('- Erro:', emailError)

    return Response.json({
      status: 'SUCCESS',
      message: 'Sistema funcionando corretamente',
      details: {
        environment: {
          hasUrl,
          hasServiceRole
        },
        users: {
          count: users?.length || 0,
          data: users?.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })) || []
        },
        auth: {
          count: authData?.users?.length || 0,
          users: authData?.users?.map(u => ({ id: u.id, email: u.email })) || []
        },
        emailTest: {
          email: testEmail,
          exists: emailCheck && emailCheck.length > 0,
          result: emailCheck
        }
      }
    })

  } catch (error) {
    console.error('Erro no diagnóstico:', error)
    return Response.json({
      error: `Erro interno: ${error.message}`,
      status: 'FAILED'
    }, { status: 500 })
  }
}
