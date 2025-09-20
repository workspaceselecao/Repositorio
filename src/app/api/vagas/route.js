import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const data = await request.json()

    // Validações básicas
    if (!data.cargo || !data.cliente || !data.categoria) {
      return NextResponse.json(
        { error: 'Cargo, cliente e categoria são obrigatórios' },
        { status: 400 }
      )
    }

    // Preparar dados para inserção
    const vagaData = {
      site: data.site || '',
      categoria: data.categoria,
      cargo: data.cargo,
      cliente: data.cliente,
      produto: data.produto || '',
      descricao_vaga: data.descricao_vaga || '',
      responsabilidades_atribuicoes: data.responsabilidades_atribuicoes || '',
      requisitos_qualificacoes: data.requisitos_qualificacoes || '',
      salario: data.salario || '',
      horario_trabalho: data.horario_trabalho || '',
      jornada_trabalho: data.jornada_trabalho || '',
      beneficios: data.beneficios || '',
      local_trabalho: data.local_trabalho || '',
      etapas_processo: data.etapas_processo || ''
    }

    // Inserir no banco de dados
    const { data: vaga, error } = await supabase
      .from('vagas')
      .insert([vagaData])
      .select()
      .single()

    if (error) {
      console.error('Erro ao inserir vaga:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar vaga no banco de dados' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: vaga,
      message: 'Vaga cadastrada com sucesso'
    })

  } catch (error) {
    console.error('Erro na API de vagas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''
    const categoria = searchParams.get('categoria') || ''

    let query = supabase
      .from('vagas')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (search) {
      query = query.or(`cargo.ilike.%${search}%,cliente.ilike.%${search}%,produto.ilike.%${search}%`)
    }

    if (categoria && categoria !== 'all') {
      query = query.eq('categoria', categoria)
    }

    // Aplicar paginação
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: vagas, error, count } = await query

    if (error) {
      console.error('Erro ao buscar vagas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar vagas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: vagas,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    })

  } catch (error) {
    console.error('Erro na API de vagas (GET):', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
