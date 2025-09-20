// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configurar banco de dados SQLite
const dbPath = path.join(__dirname, 'jobs.db');
const db = new sqlite3.Database(dbPath);

// Inicializar tabela
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT UNIQUE,
      titulo TEXT,
      descricao TEXT,
      responsabilidades TEXT,
      requisitos TEXT,
      salario TEXT,
      horario_trabalho TEXT,
      jornada_trabalho TEXT,
      beneficios TEXT,
      local_trabalho TEXT,
      etapas_processo TEXT,
      data_extracao DATETIME DEFAULT CURRENT_TIMESTAMP,
      data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

class JobScraper {
  constructor() {
    this.axiosConfig = {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
  }

  async extractJobInfo(url) {
    try {
      console.log(`🔍 Extraindo informações de: ${url}`);
      
      const response = await axios.get(url, this.axiosConfig);
      const $ = cheerio.load(response.data);
      
      const jobData = {
        url,
        titulo: '',
        descricao: '',
        responsabilidades: '',
        requisitos: '',
        salario: '',
        horario_trabalho: '',
        jornada_trabalho: '',
        beneficios: '',
        local_trabalho: '',
        etapas_processo: '',
        data_extracao: new Date().toISOString()
      };

      // Extrair título da vaga
      const title = $('h1').first().text().trim() || 
                   $('title').text().trim() || 
                   $('.job-title').text().trim();
      jobData.titulo = title;

      // Buscar informações em scripts JSON-LD
      $('script[type="application/ld+json"]').each((i, element) => {
        try {
          const jsonData = JSON.parse($(element).html());
          if (jsonData['@type'] === 'JobPosting') {
            jobData.titulo = jsonData.title || jobData.titulo;
            jobData.descricao = jsonData.description || jobData.descricao;
            
            // Local de trabalho
            if (jsonData.jobLocation) {
              const location = jsonData.jobLocation;
              if (location.address) {
                jobData.local_trabalho = `${location.address.addressLocality || ''}, ${location.address.addressRegion || ''}`.replace(/^,\s*|,\s*$/g, '');
              }
            }
            
            // Salário
            if (jsonData.baseSalary) {
              const salary = jsonData.baseSalary;
              const currency = salary.currency || 'R$';
              const minValue = salary.value?.minValue || '';
              const maxValue = salary.value?.maxValue || '';
              if (minValue || maxValue) {
                jobData.salario = `${currency} ${minValue} - ${maxValue}`.trim();
              }
            }
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      });

      // Extrair texto completo para análise
      const fullText = $('body').text();
      
      // Padrões para extrair seções específicas
      const extractSection = (patterns, text) => {
        for (const pattern of patterns) {
          const regex = new RegExp(pattern, 'is');
          const match = text.match(regex);
          if (match && match[1]) {
            return match[1].trim().substring(0, 2000); // Limitar tamanho
          }
        }
        return '';
      };

      // Seções específicas
      const sections = {
        descricao: [
          'Descrição da vaga[:\\s]*([\\s\\S]*?)(?=Responsabilidades|Requisitos|Benefícios|Etapas|$)',
          'Sobre a vaga[:\\s]*([\\s\\S]*?)(?=Responsabilidades|Requisitos|Benefícios|Etapas|$)',
          'O que você fará[:\\s]*([\\s\\S]*?)(?=Requisitos|Benefícios|Etapas|$)'
        ],
        responsabilidades: [
          'Responsabilidades[:\\s]*([\\s\\S]*?)(?=Requisitos|Qualificações|Benefícios|Etapas|$)',
          'Atribuições[:\\s]*([\\s\\S]*?)(?=Requisitos|Qualificações|Benefícios|Etapas|$)',
          'Suas responsabilidades[:\\s]*([\\s\\S]*?)(?=Requisitos|Benefícios|Etapas|$)'
        ],
        requisitos: [
          'Requisitos[:\\s]*([\\s\\S]*?)(?=Benefícios|Informações|Etapas|$)',
          'Qualificações[:\\s]*([\\s\\S]*?)(?=Benefícios|Informações|Etapas|$)',
          'O que esperamos[:\\s]*([\\s\\S]*?)(?=Benefícios|Informações|Etapas|$)'
        ],
        beneficios: [
          'Benefícios[:\\s]*([\\s\\S]*?)(?=Etapas|Local|Horário|$)',
          'O que oferecemos[:\\s]*([\\s\\S]*?)(?=Etapas|Local|Horário|$)'
        ],
        etapas_processo: [
          'Etapas do processo[:\\s]*([\\s\\S]*?)(?=$)',
          'Processo seletivo[:\\s]*([\\s\\S]*?)(?=$)'
        ]
      };

      // Extrair cada seção
      Object.keys(sections).forEach(key => {
        if (!jobData[key]) {
          jobData[key] = extractSection(sections[key], fullText);
        }
      });

      // Extrair informações específicas adicionais
      if (!jobData.salario) {
        const salaryPatterns = [
          'Salário[:\\s]*([R$\\d\\.,\\-\\s]+)',
          'Remuneração[:\\s]*([R$\\d\\.,\\-\\s]+)'
        ];
        jobData.salario = extractSection(salaryPatterns, fullText);
      }

      const schedulePatterns = [
        'Horário[:\\s]*([^\\n]*)',
        'Jornada[:\\s]*([^\\n]*)'
      ];
      
      if (!jobData.horario_trabalho) {
        jobData.horario_trabalho = extractSection(['Horário[:\\s]*([^\\n]*)'], fullText);
      }
      
      if (!jobData.jornada_trabalho) {
        jobData.jornada_trabalho = extractSection(['Jornada[:\\s]*([^\\n]*)'], fullText);
      }

      console.log(`✅ Extração concluída: ${jobData.titulo}`);
      return jobData;

    } catch (error) {
      console.error('❌ Erro na extração:', error.message);
      throw new Error(`Erro ao extrair informações: ${error.message}`);
    }
  }
}

// Instanciar scraper
const scraper = new JobScraper();

// Rotas da API
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Extrair informações de vaga
app.post('/api/extract', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL é obrigatória' });
    }
    
    if (!url.includes('gupy.io')) {
      return res.status(400).json({ error: 'URL deve ser do Gupy' });
    }
    
    const jobData = await scraper.extractJobInfo(url);
    
    res.json({
      success: true,
      data: jobData
    });
    
  } catch (error) {
    console.error('Erro na extração:', error);
    res.status(500).json({ error: error.message });
  }
});

// Salvar vaga
app.post('/api/jobs', (req, res) => {
  const jobData = req.body;
  
  if (!jobData.url || !jobData.titulo) {
    return res.status(400).json({ error: 'URL e título são obrigatórios' });
  }
  
  const query = `
    INSERT OR REPLACE INTO jobs 
    (url, titulo, descricao, responsabilidades, requisitos, salario,
     horario_trabalho, jornada_trabalho, beneficios, local_trabalho,
     etapas_processo, data_extracao, data_atualizacao)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `;
  
  const values = [
    jobData.url, jobData.titulo, jobData.descricao,
    jobData.responsabilidades, jobData.requisitos, jobData.salario,
    jobData.horario_trabalho, jobData.jornada_trabalho, jobData.beneficios,
    jobData.local_trabalho, jobData.etapas_processo, jobData.data_extracao
  ];
  
  db.run(query, values, function(err) {
    if (err) {
      console.error('Erro ao salvar:', err);
      return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
    }
    
    res.json({
      success: true,
      job_id: this.lastID,
      message: 'Vaga salva com sucesso'
    });
  });
});

// Listar todas as vagas
app.get('/api/jobs', (req, res) => {
  const query = 'SELECT * FROM jobs ORDER BY data_atualizacao DESC';
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar vagas:', err);
      return res.status(500).json({ error: 'Erro ao buscar vagas' });
    }
    
    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  });
});

// Buscar vaga por ID
app.get('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM jobs WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar vaga:', err);
      return res.status(500).json({ error: 'Erro ao buscar vaga' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }
    
    res.json({
      success: true,
      data: row
    });
  });
});

// Deletar vaga
app.delete('/api/jobs/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM jobs WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Erro ao deletar vaga:', err);
      return res.status(500).json({ error: 'Erro ao deletar vaga' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }
    
    res.json({
      success: true,
      message: 'Vaga deletada com sucesso'
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Sistema de Extração de Vagas iniciado!');
  console.log(`📡 API disponível em: http://localhost:${PORT}`);
  console.log('🔍 Endpoints disponíveis:');
  console.log('   POST /api/extract - Extrair informações de vaga');
  console.log('   POST /api/jobs - Salvar vaga');
  console.log('   GET /api/jobs - Listar todas as vagas');
  console.log('   GET /api/jobs/:id - Buscar vaga por ID');
  console.log('   DELETE /api/jobs/:id - Deletar vaga');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏳ Encerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar banco:', err.message);
    } else {
      console.log('✅ Banco de dados fechado.');
    }
    process.exit(0);
  });
});