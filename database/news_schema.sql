-- Esquema para tabela de notícias
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
CREATE TRIGGER trigger_update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_news_updated_at();

-- RLS (Row Level Security) - Políticas de segurança
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler notícias ativas
CREATE POLICY "Anyone can read active news" ON news
  FOR SELECT USING (is_active = true);

-- Política: Apenas usuários autenticados podem inserir notícias
CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política: Apenas usuários autenticados podem atualizar notícias
CREATE POLICY "Authenticated users can update news" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política: Apenas usuários autenticados podem excluir notícias
CREATE POLICY "Authenticated users can delete news" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem ver todas as notícias (incluindo inativas)
CREATE POLICY "Authenticated users can see all news" ON news
  FOR SELECT USING (auth.role() = 'authenticated');

-- Inserir notícias padrão
INSERT INTO news (title, content, priority, is_active, created_by) VALUES
(
  'Bem-vindo ao Sistema de Vagas',
  'Sistema atualizado com novas funcionalidades de gerenciamento e análise de vagas de emprego.',
  'high',
  true,
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Nova Funcionalidade: Comparativo de Vagas',
  'Agora você pode comparar vagas de diferentes empresas e analisar benefícios, salários e requisitos.',
  'medium',
  true,
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'Manutenção Programada',
  'Sistema passará por manutenção preventiva no próximo domingo das 02:00 às 04:00.',
  'low',
  true,
  (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT DO NOTHING;

-- Comentários para documentação
COMMENT ON TABLE news IS 'Tabela para armazenar notícias do sistema';
COMMENT ON COLUMN news.title IS 'Título da notícia';
COMMENT ON COLUMN news.content IS 'Conteúdo da notícia';
COMMENT ON COLUMN news.priority IS 'Prioridade da notícia: high, medium, low';
COMMENT ON COLUMN news.is_active IS 'Se a notícia está ativa e visível';
COMMENT ON COLUMN news.created_by IS 'ID do usuário que criou a notícia';
COMMENT ON COLUMN news.updated_by IS 'ID do usuário que atualizou a notícia pela última vez';
