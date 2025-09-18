import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Precisaremos desta chave
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function importVagas() {
  try {
    // Ler o arquivo JSON
    const jsonPath = path.join(process.cwd(), 'REPOSITORIO.json')
    const jsonData = fs.readFileSync(jsonPath, 'utf8')
    const vagasData = JSON.parse(jsonData)

    console.log(`Encontradas ${vagasData.length} vagas para importar...`)

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

    // Verificar se já existem dados na tabela
    const { count } = await supabase
      .from('vagas')
      .select('*', { count: 'exact', head: true })

    if (count && count > 0) {
      console.log(`Já existem ${count} vagas na base de dados. Deseja continuar? (s/n)`)
      // Para automação, vamos prosseguir automaticamente
      console.log('Prosseguindo com a importação...')
    }

    // Inserir dados em lotes para melhor performance
    const batchSize = 50
    let imported = 0

    for (let i = 0; i < vagasFormatted.length; i += batchSize) {
      const batch = vagasFormatted.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('vagas')
        .insert(batch)
        .select()

      if (error) {
        console.error(`Erro ao importar lote ${Math.floor(i / batchSize) + 1}:`, error)
        // Tentar inserir individualmente para identificar registros problemáticos
        for (const vaga of batch) {
          try {
            await supabase.from('vagas').insert([vaga])
            imported++
          } catch (individualError) {
            console.error('Erro ao inserir vaga individual:', vaga.cliente, individualError)
          }
        }
      } else {
        imported += batch.length
        console.log(`Lote ${Math.floor(i / batchSize) + 1} importado com sucesso (${batch.length} vagas)`)
      }
    }

    console.log(`✅ Importação concluída! ${imported} vagas importadas de ${vagasData.length} total.`)

    // Mostrar estatísticas
    const { data: stats } = await supabase
      .from('vagas')
      .select('cliente')
      .order('cliente')

    if (stats) {
      const clientesUnicos = Array.from(new Set(stats.map(v => v.cliente)))
      console.log(`📊 Estatísticas:`)
      console.log(`   - Total de vagas: ${stats.length}`)
      console.log(`   - Clientes únicos: ${clientesUnicos.length}`)
      console.log(`   - Clientes: ${clientesUnicos.join(', ')}`)
    }

  } catch (error) {
    console.error('Erro durante a importação:', error)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  importVagas()
}

export default importVagas
