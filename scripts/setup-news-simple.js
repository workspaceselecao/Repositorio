const { createClient } = require('@supabase/supabase-js')

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
    
    // SQL simplificado sem dependência da tabela profiles
    const sql = `
-- Criar tabela de notícias
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_is_active ON news(is_active);
CREATE INDEX IF NOT EXISTS idx_news_priority ON news(priority);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_news_updated_at ON news;
CREATE TRIGGER trigger_update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_news_updated_at();

-- RLS (Row Level Security)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança simplificadas
DROP POLICY IF EXISTS "Anyone can read active news" ON news;
CREATE POLICY "Anyone can read active news" ON news
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can insert news" ON news;
CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update news" ON news;
CREATE POLICY "Authenticated users can update news" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete news" ON news;
CREATE POLICY "Authenticated users can delete news" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can see all news" ON news;
CREATE POLICY "Authenticated users can see all news" ON news
  FOR SELECT USING (auth.role() = 'authenticated');
    `

    console.log('📝 Executando SQL...')
    
    // Executar cada comando separadamente para melhor controle de erro
    const commands = sql.split(';').filter(cmd => cmd.trim())
    
    for (const command of commands) {
      if (command.trim()) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: command.trim() + ';' })
          if (error) {
            console.log(`⚠️  Aviso: ${error.message}`)
          }
        } catch (err) {
          console.log(`⚠️  Aviso: ${err.message}`)
        }
      }
    }
    
    console.log('✅ Configuração básica concluída!')
    
    // Verificar se a tabela foi criada
    console.log('📊 Verificando tabela...')
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
      
      // Inserir notícias padrão
      console.log('📰 Inserindo notícias padrão...')
      const { data: news, error: newsError } = await supabase
        .from('news')
        .insert([
          {
            title: 'Bem-vindo ao Sistema de Vagas',
            content: 'Sistema atualizado com novas funcionalidades de gerenciamento e análise de vagas de emprego.',
            priority: 'high',
            is_active: true
          },
          {
            title: 'Nova Funcionalidade: Comparativo de Vagas',
            content: 'Agora você pode comparar vagas de diferentes empresas e analisar benefícios, salários e requisitos.',
            priority: 'medium',
            is_active: true
          },
          {
            title: 'Manutenção Programada',
            content: 'Sistema passará por manutenção preventiva no próximo domingo das 02:00 às 04:00.',
            priority: 'low',
            is_active: true
          }
        ])
        .select('id, title, priority')
      
      if (newsError) {
        console.log('⚠️  Aviso ao inserir notícias:', newsError.message)
      } else {
        console.log(`✅ ${news.length} notícias inseridas com sucesso!`)
        news.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.title} (${item.priority})`)
        })
      }
      
    } else {
      console.log('⚠️  Tabela "news" não encontrada. Execute o SQL manualmente no Supabase Dashboard.')
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
