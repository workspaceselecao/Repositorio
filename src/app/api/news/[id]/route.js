import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET - Buscar notícia específica
export async function GET(request, { params }) {
  try {
    const { id } = params

    const { data, error } = await supabase
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
        updated_by,
        profiles:created_by(name, email),
        updated_profiles:updated_by(name, email)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json(
          { error: 'Notícia não encontrada' },
          { status: 404 }
        )
      }
      console.error('Erro ao buscar notícia:', error)
      return Response.json(
        { error: 'Erro ao buscar notícia', details: error.message },
        { status: 500 }
      )
    }

    return Response.json({ data })
  } catch (error) {
    console.error('Erro na API de busca de notícia:', error)
    return Response.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}

// PUT - Atualizar notícia
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, content, priority, is_active } = body

    // Validação básica
    if (!title || !content) {
      return Response.json(
        { error: 'Título e conteúdo são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar prioridade se fornecida
    if (priority && !['high', 'medium', 'low'].includes(priority)) {
      return Response.json(
        { error: 'Prioridade deve ser: high, medium ou low' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('news')
      .update({
        title,
        content,
        priority,
        is_active,
        updated_by: body.user_id, // Será passado pelo frontend
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        id,
        title,
        content,
        priority,
        is_active,
        created_at,
        updated_at,
        created_by,
        updated_by,
        profiles:created_by(name, email),
        updated_profiles:updated_by(name, email)
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return Response.json(
          { error: 'Notícia não encontrada' },
          { status: 404 }
        )
      }
      console.error('Erro ao atualizar notícia:', error)
      return Response.json(
        { error: 'Erro ao atualizar notícia', details: error.message },
        { status: 500 }
      )
    }

    return Response.json({ data })
  } catch (error) {
    console.error('Erro na API de atualização de notícia:', error)
    return Response.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE - Excluir notícia
export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao excluir notícia:', error)
      return Response.json(
        { error: 'Erro ao excluir notícia', details: error.message },
        { status: 500 }
      )
    }

    return Response.json({ message: 'Notícia excluída com sucesso' })
  } catch (error) {
    console.error('Erro na API de exclusão de notícia:', error)
    return Response.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}
