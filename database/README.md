# Scripts de Inserção de Dados - Supabase

Este diretório contém os scripts SQL para inserção de todas as vagas de emprego no banco de dados Supabase.

## Estrutura dos Arquivos

- `insert_vagas.sql` - Primeira parte das vagas (vagas 1-5)
- `insert_vagas_part2.sql` - Segunda parte das vagas (vagas 6-10)
- `insert_vagas_part3.sql` - Terceira parte das vagas (vagas 11-15)
- `insert_vagas_part4.sql` - Quarta parte das vagas (vagas 16-21)
- `insert_all_vagas.sql` - Script principal que executa todos os outros
- `schema.sql` - Schema da tabela vagas

## Como Executar

### Opção 1: Teste com 5 vagas (Recomendado para começar)
```sql
-- No Supabase SQL Editor, execute:
-- Copie e cole o conteúdo do arquivo test_insert_vagas.sql
```

### Opção 2: Executar cada parte individualmente
```sql
-- No Supabase SQL Editor, execute na ordem:
-- 1. Copie e cole o conteúdo de insert_vagas.sql (vagas 1-5)
-- 2. Copie e cole o conteúdo de insert_vagas_part2.sql (vagas 6-10)
-- 3. Copie e cole o conteúdo de insert_vagas_part3.sql (vagas 11-15)
-- 4. Copie e cole o conteúdo de insert_vagas_part4.sql (vagas 16-21)
```

### Opção 3: Executar via psql (linha de comando)
```bash
psql "postgresql://postgres:repoadmin456@db.qdzrldxubcofobqmynab.supabase.co:5432/postgres" -f test_insert_vagas.sql
```

### ⚠️ IMPORTANTE
- O comando `\i` não funciona no Supabase SQL Editor
- Você deve copiar e colar o conteúdo dos arquivos SQL diretamente no editor
- Comece com `test_insert_vagas.sql` para testar com 5 vagas

## Estrutura da Tabela

A tabela `vagas` possui as seguintes colunas:

- `id` - Chave primária (SERIAL)
- `site` - Local da vaga (ex: URUGUAI, CASA, CABULA)
- `categoria` - Categoria da vaga (ex: OPERAÇÕES)
- `cargo` - Cargo da vaga (ex: ESPECIALISTA I, ESPECIALISTA II)
- `cliente` - Cliente/empresa (ex: REDE, VIVO, PLUXEE)
- `produto` - Produto/serviço específico
- `descricao_vaga` - Descrição completa da vaga
- `responsabilidades_atribuicoes` - Responsabilidades e atribuições
- `requisitos_qualificacoes` - Requisitos e qualificações
- `salario` - Informações sobre salário
- `horario_trabalho` - Horário de trabalho
- `jornada_trabalho` - Jornada de trabalho
- `beneficios` - Benefícios oferecidos
- `local_trabalho` - Local de trabalho
- `etapas_processo` - Etapas do processo seletivo
- `created_at` - Data de criação (automática)
- `updated_at` - Data de atualização (automática)

## Dados Inseridos

O script insere **21 vagas** de diferentes clientes:

- **VIVO**: 8 vagas
- **UNIMED**: 2 vagas
- **PLUXEE**: 2 vagas
- **REDE**: 1 vaga
- **GPA**: 1 vaga
- **MESSER**: 1 vaga
- **MRV**: 1 vaga
- **CONSULTING HOUSE**: 1 vaga
- **GRUPO ITAU**: 1 vaga
- **BRADESCO**: 1 vaga

## Verificação

Após executar os scripts, você pode verificar os dados com:

```sql
-- Contar total de vagas
SELECT COUNT(*) as total_vagas FROM vagas;

-- Ver vagas por cliente
SELECT cliente, COUNT(*) as quantidade 
FROM vagas 
GROUP BY cliente 
ORDER BY quantidade DESC;

-- Ver todas as vagas
SELECT * FROM vagas ORDER BY cliente, cargo;
```

## Observações

- Todos os dados foram extraídos do arquivo `REPOSITORIO.json`
- Os campos vazios (NULL) no JSON foram mantidos como NULL no banco
- O script cria a tabela automaticamente se ela não existir
- As datas de criação e atualização são preenchidas automaticamente
