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

export async function GET(request) {
  try {
    console.log('=== TESTE DE CONFIGURAÇÃO ===')
    
    // Verificar configurações
    const config = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0
    }
    
    console.log('Configurações:', config)
    
    // Testar conexão com Supabase
    if (!supabaseAdmin) {
      return Response.json({ 
        error: 'Cliente Supabase não foi criado',
        config 
      }, { status: 500 })
    }
    
    // Testar consulta simples
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Erro ao testar conexão:', error)
      return Response.json({ 
        error: 'Erro ao conectar com Supabase',
        details: error.message,
        config 
      }, { status: 500 })
    }
    
    return Response.json({ 
      success: true,
      message: 'Configuração OK',
      config,
      connectionTest: 'OK'
    })
    
  } catch (error) {
    console.error('Erro no teste:', error)
    return Response.json({ 
      error: error.message,
      config: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    }, { status: 500 })
  }
}
