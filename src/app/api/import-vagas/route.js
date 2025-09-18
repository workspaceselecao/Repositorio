import { NextRequest, NextResponse  } from 'next/server'
import { createClient  } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request) {
  try {
    // Configurar CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // Verificar autenticação
    const authHeader = request.headers.get('authorization')
    if (!authHeader || authHeader !== 'Bearer authenticated-user') {
      return NextResponse.json(
        { error: 'Token de autenticação inválido' }, 
        { status: 401, headers: corsHeaders }
      )
    }

    // Ler o arquivo JSON
    const jsonPath = path.join(process.cwd(), 'REPOSITORIO.json')
    
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json(
        { error: 'Arquivo REPOSITORIO.json não encontrado' }, 
        { status: 404, headers: corsHeaders }
      )
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf8')
    const vagasData = JSON.parse(jsonData)

    // Mapear os dados do JSON para o formato da tabela
    const vagasFormatted = vagasData.map((vaga) => ({
      site: vaga.SITE || '',
      categoria: vaga.CATEGORIA || '',
      cargo: vaga.CARGO || '',
      cliente: vaga.CLIENTE || '',
      produto: vaga.PRODUTO || '',
      descricao_vaga: vaga['Descrição da vaga'] || null,
      responsabilidades_atribuicoes: vaga['Responsabilidades e atribuições'] || null,
      requisitos_qualificacoes: vaga['Requisitos e qualificações'] || null,
      salario: vaga.Salário || vaga['Salário'] || null,
      horario_trabalho: vaga['Horário de Trabalho'] || null,
      jornada_trabalho: vaga['Jornada de Trabalho'] || null,
      beneficios: vaga.Benefícios || null,
      local_trabalho: vaga['Local de Trabalho'] || null,
      etapas_processo: vaga['Etapas do processo'] || null,
    }))

    // Verificar se já existem dados
    const { count } = await supabase
      .from('vagas')
      .select('*', { count: 'exact', head: true })

    // Inserir dados em lotes
    const batchSize = 50
    let imported = 0
    const errors = []

    for (let i = 0; i < vagasFormatted.length; i += batchSize) {
      const batch = vagasFormatted.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('vagas')
        .insert(batch)
        .select()

      if (error) {
        errors.push(`Lote ${Math.floor(i / batchSize) + 1}: ${error.message}`)
        // Tentar inserir individualmente
        for (const vaga of batch) {
          try {
            const { error} = await supabase
              .from('vagas')
              .insert([vaga])
            
            if (!individualError) {
              imported++
            } else {
              errors.push(`Vaga ${vaga.cliente} - ${individualError.message}`)
            }
          } catch (err) {
            errors.push(`Vaga ${vaga.cliente} - ${err.message}`)
          }
        }
      } else {
        imported += batch.length
      }
    }

    // Obter estatísticas finais
    const { data} = await supabase
      .from('vagas')
      .select('cliente')
      .order('cliente')

    const clientesUnicos = finalStats 
      ? Array.from(new Set(finalStats.map(v => v.cliente)))
      : []

    return NextResponse.json({
      success: true,
      message: `Importação concluída! ${imported} vagas importadas de ${vagasData.length} total.`,
      stats: {
        totalVagas: finalStats?.length || 0,
        clientesUnicos: clientesUnicos.length,
        clientes: clientesUnicos,
        vagasExistentes: count || 0,
        vagasImportadas: imported,
        erros: errors.length,
        detalhesErros: errors
      }
    }, { 
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Erro na importação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message }, 
      { 
        status: 500, 
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  }
}
