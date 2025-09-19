import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Verificar variáveis de ambiente
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    
    console.log('Variáveis de ambiente:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL:', hasUrl)
    console.log('- SUPABASE_SERVICE_ROLE_KEY:', hasServiceRole)
    
    if (!hasUrl || !hasServiceRole) {
      return Response.json({
        error: 'Variáveis de ambiente não configuradas',
        details: {
          hasUrl,
          hasServiceRole
        }
      }, { status: 500 })
    }

    // Testar conexão com Supabase
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Testar query simples
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Erro ao testar conexão:', error)
      return Response.json({
        error: 'Erro ao conectar com Supabase',
        details: error.message
      }, { status: 500 })
    }

    return Response.json({
      success: true,
      message: 'Configuração OK',
      details: {
        hasUrl,
        hasServiceRole,
        supabaseConnected: true
      }
    })

  } catch (error) {
    console.error('Erro no teste de configuração:', error)
    return Response.json({
      error: 'Erro interno',
      details: error.message
    }, { status: 500 })
  }
}
