import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Buscar notícias
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive') === 'true'
    
    let query = supabase
      .from('news')
      .select(`
        id,
        title,
        content,
        priority,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by
      `)
      .order('created_at', { ascending: false })

    // Se não incluir inativas, filtrar apenas ativas
    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar notícias:', error)
      return Response.json(
        { error: 'Erro ao buscar notícias', details: error.message },
        { status: 500 }
      )
    }

    return Response.json({ data })
  } catch (error) {
    console.error('Erro na API de notícias:', error)
    return Response.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}

// POST - Criar nova notícia
export async function POST(request) {
  try {
    const body = await request.json()
    const { title, content, priority = 'medium', is_active = true } = body

    // Validação básica
    if (!title || !content) {
      return Response.json(
        { error: 'Título e conteúdo são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar prioridade
    if (!['high', 'medium', 'low'].includes(priority)) {
      return Response.json(
        { error: 'Prioridade deve ser: high, medium ou low' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('news')
      .insert([
        {
          title,
          content,
          priority,
          is_active,
          created_by: body.user_id, // Será passado pelo frontend
          updated_by: body.user_id
        }
      ])
      .select(`
        id,
        title,
        content,
        priority,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by
      `)
      .single()

    if (error) {
      console.error('Erro ao criar notícia:', error)
      return Response.json(
        { error: 'Erro ao criar notícia', details: error.message },
        { status: 500 }
      )
    }

    return Response.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Erro na API de criação de notícia:', error)
    return Response.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}
