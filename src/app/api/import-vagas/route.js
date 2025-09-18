import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Criar cliente Supabase para uso na API Route
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request) {
  // Configurar CORS headers para todas as respostas
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    // Verificar autenticação do usuário
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para importar dados.' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Opcional: Verificar role do usuário se necessário (ex: apenas ADMIN pode importar)
    // const { data: profile, error: profileError } = await supabase
    //   .from('users')
    //   .select('role')
    //   .eq('email', user.email)
    //   .single();

    // if (profileError || profile?.role !== 'ADMIN') {
    //   return NextResponse.json(
    //     { error: 'Acesso negado. Apenas administradores podem importar dados.' },
    //     { status: 403, headers: corsHeaders }
    //   );
    // }

    // Ler o arquivo JSON
    const jsonPath = path.join(process.cwd(), 'REPOSITORIO.json');

    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json(
        { error: 'Arquivo REPOSITORIO.json não encontrado no servidor.' },
        { status: 404, headers: corsHeaders }
      );
    }

    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const vagasData = JSON.parse(jsonData);

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
    }));

    // Verificar se já existem dados na tabela (para estatísticas)
    const { count } = await supabase
      .from('vagas')
      .select('*', { count: 'exact', head: true });

    // Inserir dados em lotes
    const batchSize = 50;
    let importedCount = 0;
    const errors = [];

    for (let i = 0; i < vagasFormatted.length; i += batchSize) {
      const batch = vagasFormatted.slice(i, i + batchSize);

      const { error: batchError } = await supabase
        .from('vagas')
        .insert(batch);

      if (batchError) {
        errors.push(`Lote ${Math.floor(i / batchSize) + 1}: ${batchError.message}`);
        // Tentar inserir individualmente para identificar registros problemáticos
        for (const vaga of batch) {
          try {
            const { error: individualError } = await supabase
              .from('vagas')
              .insert([vaga]);

            if (!individualError) {
              importedCount++;
            } else {
              errors.push(`Vaga ${vaga.cliente} - ${individualError.message}`);
            }
          } catch (err) {
            errors.push(`Vaga ${vaga.cliente} - Erro desconhecido: ${err.message}`);
          }
        }
      } else {
        importedCount += batch.length;
      }
    }

    // Obter estatísticas finais
    const { data: finalStats, error: statsError } = await supabase
      .from('vagas')
      .select('cliente')
      .order('cliente');

    const clientesUnicos = statsError
      ? []
      : Array.from(new Set(finalStats.map(v => v.cliente)));

    return NextResponse.json({
      success: true,
      message: `Importação concluída! ${importedCount} vagas importadas de ${vagasData.length} total.`,
      stats: {
        totalVagas: finalStats?.length || 0,
        clientesUnicos: clientesUnicos.length,
        clientes: clientesUnicos,
        vagasExistentesAntes: count || 0,
        vagasImportadasNestaSessao: importedCount,
        erros: errors.length,
        detalhesErros: errors
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Erro na importação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
}

// Handler para requisições OPTIONS (necessário para CORS preflight)
export async function OPTIONS() {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}