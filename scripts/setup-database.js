const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuração do Supabase
const supabaseUrl = 'https://fajvqzggqvhcnrsptttc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhanZxemdncXZoY25yc3B0dHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NjEwMzQsImV4cCI6MjA3MzEzNzAzNH0.vwYSUCV4XC0YGW-eNl2xE6Mx48NhbGq28S6w7lB9JVE'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('🚀 Configurando banco de dados...')
    
    // Ler o schema SQL
    const schemaPath = path.join(__dirname, '../database/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Dividir o schema em comandos individuais
    const commands = schema
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
    
    console.log(`📝 Executando ${commands.length} comandos SQL...`)
    
    // Executar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      if (command.trim()) {
        try {
          console.log(`⚡ Executando comando ${i + 1}/${commands.length}...`)
          const { error } = await supabase.rpc('exec_sql', { sql: command })
          
          if (error) {
            console.warn(`⚠️ Aviso no comando ${i + 1}:`, error.message)
          } else {
            console.log(`✅ Comando ${i + 1} executado com sucesso`)
          }
        } catch (err) {
          console.warn(`⚠️ Erro no comando ${i + 1}:`, err.message)
        }
      }
    }
    
    // Verificar se as tabelas foram criadas
    console.log('\n🔍 Verificando tabelas criadas...')
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.error('❌ Erro ao verificar tabelas:', tablesError)
    } else {
      console.log('📋 Tabelas encontradas:', tables.map(t => t.table_name))
    }
    
    // Testar inserção de dados de exemplo
    console.log('\n🧪 Testando inserção de dados...')
    
    const { data: testVaga, error: testError } = await supabase
      .from('vagas')
      .insert({
        site: 'Teste',
        categoria: 'Teste',
        cargo: 'Desenvolvedor Teste',
        cliente: 'Cliente Teste',
        produto: 'Produto Teste',
        descricao_vaga: 'Vaga de teste para verificar funcionamento',
        salario: 'R$ 5.000,00',
        jornada_trabalho: 'CLT',
        horario_trabalho: '08:00 às 17:00',
        local_trabalho: 'Remoto'
      })
      .select()
    
    if (testError) {
      console.error('❌ Erro ao inserir vaga de teste:', testError)
    } else {
      console.log('✅ Vaga de teste inserida com sucesso:', testVaga[0].id)
      
      // Limpar vaga de teste
      await supabase
        .from('vagas')
        .delete()
        .eq('id', testVaga[0].id)
      console.log('🧹 Vaga de teste removida')
    }
    
    console.log('\n🎉 Configuração do banco de dados concluída!')
    
  } catch (error) {
    console.error('❌ Erro na configuração do banco:', error)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }
