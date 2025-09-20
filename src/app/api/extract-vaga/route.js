import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import * as cheerio from 'cheerio'

// Criar cliente admin com service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

class JobScraper {
  constructor() {
    this.axiosConfig = {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    }
  }

  // Função para limpar e normalizar texto
  cleanText(text) {
    if (!text) return ''
    return text
      .replace(/\s+/g, ' ') // Múltiplos espaços em um
      .replace(/\n+/g, '\n') // Múltiplas quebras de linha em uma
      .replace(/\t+/g, ' ') // Tabs em espaços
      .trim()
  }

  // Função para extrair seções específicas do HTML
  extractSection($, selector, fallbackPatterns = []) {
    // Tentar primeiro com seletor CSS
    let content = $(selector).text()
    if (content && content.trim()) {
      return this.cleanText(content)
    }

    // Tentar com padrões de regex
    const fullText = $('body').text()
    for (const pattern of fallbackPatterns) {
      const regex = new RegExp(pattern, 'is')
      const match = fullText.match(regex)
      if (match && match[1]) {
        return this.cleanText(match[1])
      }
    }
    return ''
  }

  // Extrair informações específicas do Gupy
  extractGupyInfo($) {
    const jobData = {
      url: '',
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
    }

    // Extrair título - tentar múltiplos seletores
    const titleSelectors = [
      'h1[data-testid="job-title"]',
      'h1.job-title',
      'h1',
      '[data-testid="job-title"]',
      '.job-title'
    ]
    
    for (const selector of titleSelectors) {
      const title = $(selector).first().text().trim()
      if (title) {
        jobData.titulo = this.cleanText(title)
        break
      }
    }

    // Extrair descrição da vaga
    jobData.descricao = this.extractSection($, 
      '[data-testid="job-description"], .job-description, .description',
      [
        'Descrição da vaga[:\\s]*([\\s\\S]*?)(?=Responsabilidades|Requisitos|Benefícios|Etapas|Informações|$)',
        'Sobre a vaga[:\\s]*([\\s\\S]*?)(?=Responsabilidades|Requisitos|Benefícios|Etapas|Informações|$)'
      ]
    )

    // Extrair responsabilidades
    jobData.responsabilidades = this.extractSection($,
      '[data-testid="job-responsibilities"], .responsibilities, .responsabilidades',
      [
        'Responsabilidades e atribuições[:\\s]*([\\s\\S]*?)(?=Requisitos|Qualificações|Benefícios|Etapas|Informações|$)',
        'Responsabilidades[:\\s]*([\\s\\S]*?)(?=Requisitos|Qualificações|Benefícios|Etapas|Informações|$)',
        'Atribuições[:\\s]*([\\s\\S]*?)(?=Requisitos|Qualificações|Benefícios|Etapas|Informações|$)'
      ]
    )

    // Extrair requisitos
    jobData.requisitos = this.extractSection($,
      '[data-testid="job-requirements"], .requirements, .requisitos',
      [
        'Requisitos e qualificações[:\\s]*([\\s\\S]*?)(?=Benefícios|Informações|Etapas|Local|Horário|$)',
        'Requisitos[:\\s]*([\\s\\S]*?)(?=Benefícios|Informações|Etapas|Local|Horário|$)',
        'Qualificações[:\\s]*([\\s\\S]*?)(?=Benefícios|Informações|Etapas|Local|Horário|$)'
      ]
    )

    // Extrair salário - procurar em múltiplos lugares
    const salarySelectors = [
      '[data-testid="salary"], .salary, .salario',
      'text:contains("Salário")',
      'text:contains("Remuneração")'
    ]
    
    for (const selector of salarySelectors) {
      const salaryText = $(selector).text()
      if (salaryText && (salaryText.includes('R$') || salaryText.includes('salário'))) {
        const salaryMatch = salaryText.match(/R\$\s*[\d.,]+/g)
        if (salaryMatch) {
          jobData.salario = salaryMatch[0]
          break
        }
      }
    }

    // Se não encontrou salário, tentar com regex no texto completo
    if (!jobData.salario) {
      const fullText = $('body').text()
      const salaryPatterns = [
        /Salário[:\\s]*R\$\s*[\d.,]+/gi,
        /Remuneração[:\\s]*R\$\s*[\d.,]+/gi,
        /R\$\s*[\d.,]+/g
      ]
      
      for (const pattern of salaryPatterns) {
        const match = fullText.match(pattern)
        if (match) {
          jobData.salario = match[0].trim()
          break
        }
      }
    }

    // Extrair horário de trabalho
    jobData.horario_trabalho = this.extractSection($,
      '[data-testid="work-schedule"], .work-schedule, .horario',
      [
        'Horário de Trabalho[:\\s]*([^\\n]*?)(?=Jornada|Benefícios|Local|Etapas|$)',
        'Horário[:\\s]*([^\\n]*?)(?=Jornada|Benefícios|Local|Etapas|$)'
      ]
    )

    // Extrair jornada de trabalho
    jobData.jornada_trabalho = this.extractSection($,
      '[data-testid="work-hours"], .work-hours, .jornada',
      [
        'Jornada de Trabalho[:\\s]*([^\\n]*?)(?=Benefícios|Local|Etapas|$)',
        'Jornada[:\\s]*([^\\n]*?)(?=Benefícios|Local|Etapas|$)'
      ]
    )

    // Extrair benefícios
    jobData.beneficios = this.extractSection($,
      '[data-testid="benefits"], .benefits, .beneficios',
      [
        'Benefícios[:\\s]*([\\s\\S]*?)(?=Local|Etapas|Processo|$)',
        'O que oferecemos[:\\s]*([\\s\\S]*?)(?=Local|Etapas|Processo|$)'
      ]
    )

    // Extrair local de trabalho
    jobData.local_trabalho = this.extractSection($,
      '[data-testid="work-location"], .work-location, .local',
      [
        'Local de Trabalho[:\\s]*([^\\n]*?)(?=Etapas|Processo|$)',
        'Local[:\\s]*([^\\n]*?)(?=Etapas|Processo|$)'
      ]
    )

    // Extrair etapas do processo
    jobData.etapas_processo = this.extractSection($,
      '[data-testid="process-steps"], .process-steps, .etapas',
      [
        'Etapas do processo[:\\s]*([\\s\\S]*?)(?=Muito prazer|Somos|$)',
        'Processo seletivo[:\\s]*([\\s\\S]*?)(?=Muito prazer|Somos|$)'
      ]
    )

    return jobData
  }

  async extractJobInfo(url) {
    try {
      console.log(`🔍 Extraindo informações de: ${url}`)
      
      const response = await axios.get(url, this.axiosConfig)
      const $ = cheerio.load(response.data)
      
      // Extrair informações específicas do Gupy
      const jobData = this.extractGupyInfo($)

      // Definir URL
      jobData.url = url

      // Se não conseguiu extrair título, tentar do title da página
      if (!jobData.titulo) {
        jobData.titulo = $('title').text().trim() || 'Título não encontrado'
      }

      // Limpar e normalizar todos os campos
      Object.keys(jobData).forEach(key => {
        if (typeof jobData[key] === 'string') {
          jobData[key] = this.cleanText(jobData[key])
        }
      })

      console.log(`✅ Extração concluída: ${jobData.titulo}`)
      return jobData

    } catch (error) {
      console.error('❌ Erro na extração:', error.message)
      throw new Error(`Erro ao extrair informações: ${error.message}`)
    }
  }
}

export async function POST(request) {
  try {
    console.log('=== EXTRAÇÃO DE VAGA ===')
    
    // Verificar se o cliente Supabase está configurado
    if (!supabaseAdmin) {
      console.error('❌ Cliente Supabase não foi criado')
      return Response.json({ 
        error: 'Cliente Supabase não configurado' 
      }, { status: 500 })
    }

    const { url } = await request.json()
    
    if (!url) {
      return Response.json({ 
        error: 'URL é obrigatória' 
      }, { status: 400 })
    }
    
    if (!url.includes('gupy.io')) {
      return Response.json({ 
        error: 'URL deve ser do Gupy' 
      }, { status: 400 })
    }
    
    const scraper = new JobScraper()
    const jobData = await scraper.extractJobInfo(url)
    
    return Response.json({
      success: true,
      data: jobData
    })
    
  } catch (error) {
    console.error('Erro na extração:', error)
    return Response.json({ 
      error: error.message 
    }, { status: 500 })
  }
}