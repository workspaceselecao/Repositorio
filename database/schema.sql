-- Criar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de usuários personalizada
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    role VARCHAR CHECK (role IN ('ADMIN', 'RH')) NOT NULL DEFAULT 'RH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de vagas
CREATE TABLE IF NOT EXISTS public.vagas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site VARCHAR NOT NULL,
    categoria VARCHAR NOT NULL,
    cargo VARCHAR NOT NULL,
    cliente VARCHAR NOT NULL,
    produto VARCHAR NOT NULL,
    descricao_vaga TEXT,
    responsabilidades_atribuicoes TEXT,
    requisitos_qualificacoes TEXT,
    salario TEXT,
    horario_trabalho TEXT,
    jornada_trabalho TEXT,
    beneficios TEXT,
    local_trabalho TEXT,
    etapas_processo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vagas_updated_at 
    BEFORE UPDATE ON public.vagas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança - SIMPLES E SEM RECURSÃO
-- Todos os usuários autenticados podem acessar dados
-- A segurança será controlada no frontend através dos componentes

-- Políticas para usuários
CREATE POLICY "Authenticated users can view users" ON public.users
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update users" ON public.users
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert users" ON public.users
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete users" ON public.users
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para vagas
CREATE POLICY "Authenticated users can view vagas" ON public.vagas
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert vagas" ON public.vagas
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update vagas" ON public.vagas
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete vagas" ON public.vagas
    FOR DELETE USING (auth.role() = 'authenticated');

-- Inserir usuário ADMIN inicial
INSERT INTO public.users (email, name, role) 
VALUES ('roberio.gomes@atento.com', 'Robério Gomes', 'ADMIN')
ON CONFLICT (email) DO NOTHING;