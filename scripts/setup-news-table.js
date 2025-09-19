const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas')
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupNewsTable() {
  try {
    console.log('🚀 Iniciando configuração da tabela de notícias...')
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '..', 'database', 'news_schema.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Executar o SQL
    console.log('📝 Executando esquema SQL...')
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent })
    
    if (error) {
      console.error('❌ Erro ao executar SQL:', error)
      return
    }
    
    console.log('✅ Tabela de notícias criada com sucesso!')
    console.log('📊 Verificando se a tabela foi criada...')
    
    // Verificar se a tabela foi criada
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'news')
    
    if (tableError) {
      console.error('❌ Erro ao verificar tabela:', tableError)
      return
    }
    
    if (tables && tables.length > 0) {
      console.log('✅ Tabela "news" encontrada no banco de dados')
      
      // Verificar notícias padrão
      const { data: news, error: newsError } = await supabase
        .from('news')
        .select('id, title, priority')
        .limit(5)
      
      if (newsError) {
        console.error('❌ Erro ao verificar notícias:', newsError)
        return
      }
      
      console.log(`📰 ${news.length} notícias encontradas no banco`)
      news.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title} (${item.priority})`)
      })
      
    } else {
      console.log('⚠️  Tabela "news" não encontrada. Execute o SQL manualmente no Supabase.')
    }
    
  } catch (error) {
    console.error('❌ Erro durante a configuração:', error)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupNewsTable()
}

module.exports = { setupNewsTable }
