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

class UniversalJobScraper {
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
      .replace(/[^\x20-\x7E\u00C0-\u017F]/g, '') // Remove caracteres não-ASCII problemáticos
      .trim()
  }

  // Função para extrair seções usando múltiplas estratégias
  extractSection($, selectors = [], regexPatterns = [], fallbackText = '') {
    // Estratégia 1: Seletores CSS
    for (const selector of selectors) {
      const elements = $(selector)
      if (elements.length > 0) {
        const text = elements.map((i, el) => $(el).text()).get().join(' ')
        if (text && text.trim()) {
          return this.cleanText(text)
        }
      }
    }

    // Estratégia 2: Busca por texto próximo a palavras-chave
    const keywords = ['descrição', 'responsabilidades', 'requisitos', 'benefícios', 'salário', 'horário', 'local', 'etapas']
    for (const keyword of keywords) {
      const elements = $(`*:contains("${keyword}")`).not('script, style')
      if (elements.length > 0) {
        const text = elements.map((i, el) => $(el).text()).get().join(' ')
        if (text && text.trim()) {
          return this.cleanText(text)
        }
      }
    }

    // Estratégia 3: Regex patterns
    const fullText = $('body').text()
    for (const pattern of regexPatterns) {
      const regex = new RegExp(pattern, 'is')
      const match = fullText.match(regex)
      if (match && match[1]) {
        return this.cleanText(match[1])
      }
    }

    return fallbackText
  }

  // Extrair informações de JSON-LD
  extractFromJsonLd($) {
    const jobData = {}
    
    $('script[type="application/ld+json"]').each((i, element) => {
      try {
        const jsonData = JSON.parse($(element).html())
        if (jsonData['@type'] === 'JobPosting') {
          jobData.titulo = jsonData.title || jobData.titulo
          jobData.descricao = jsonData.description || jobData.descricao
          
          if (jsonData.jobLocation) {
            const location = jsonData.jobLocation
            if (location.address) {
              jobData.local_trabalho = `${location.address.addressLocality || ''}, ${location.address.addressRegion || ''}`.replace(/^,\s*|,\s*$/g, '')
            }
          }
          
          if (jsonData.baseSalary) {
            const salary = jsonData.baseSalary
            const currency = salary.currency || 'R$'
            const minValue = salary.value?.minValue || ''
            const maxValue = salary.value?.maxValue || ''
            if (minValue || maxValue) {
              jobData.salario = `${currency} ${minValue} - ${maxValue}`.trim()
            }
          }
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
    })
    
    return jobData
  }

  // Detectar site e aplicar estratégias específicas
  detectSite(url) {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      
      console.log(`🔍 Detectando site para: ${hostname}`)
      
      if (hostname.includes('gupy.io')) {
        console.log('✅ Site detectado: Gupy')
        return 'gupy'
      }
      if (hostname.includes('linkedin.com')) {
        console.log('✅ Site detectado: LinkedIn')
        return 'linkedin'
      }
      if (hostname.includes('indeed.com')) {
        console.log('✅ Site detectado: Indeed')
        return 'indeed'
      }
      if (hostname.includes('vagas.com')) {
        console.log('✅ Site detectado: Vagas.com')
        return 'vagas'
      }
      if (hostname.includes('infojobs.com.br')) {
        console.log('✅ Site detectado: InfoJobs')
        return 'infojobs'
      }
      
      console.log('⚠️ Site genérico detectado')
      return 'generic'
    } catch (e) {
      console.log('❌ Erro ao detectar site:', e.message)
      return 'generic'
    }
  }

  // Estratégias específicas por site
  getSiteStrategies(site) {
    const strategies = {
      gupy: {
        title: [
          'h1[data-testid="job-title"]',
          'h1.job-title',
          'h1',
          '[data-testid="job-title"]',
          '.job-title'
        ],
        description: [
          '[data-testid="job-description"]',
          '.job-description',
          '.description'
        ],
        salary: [
          '[data-testid="salary"]',
          '.salary',
          '.salario'
        ]
      },
      linkedin: {
        title: [
          'h1.job-details-jobs-unified-top-card__job-title',
          'h1',
          '.job-details-jobs-unified-top-card__job-title'
        ],
        description: [
          '.jobs-description-content__text',
          '.jobs-box__html-content'
        ],
        salary: [
          '.jobs-unified-top-card__job-insight',
          '.salary'
        ]
      },
      indeed: {
        title: [
          'h1[data-testid="job-title"]',
          'h1.jobsearch-JobInfoHeader-title',
          'h1'
        ],
        description: [
          '[data-testid="job-description"]',
          '.jobsearch-jobDescriptionText'
        ],
        salary: [
          '[data-testid="job-salary"]',
          '.salary'
        ]
      },
      generic: {
        title: [
          'h1',
          '.job-title',
          '.title',
          '[data-testid*="title"]',
          '[class*="title"]'
        ],
        description: [
          '.job-description',
          '.description',
          '.content',
          '[data-testid*="description"]',
          '[class*="description"]'
        ],
        salary: [
          '.salary',
          '.salario',
          '[data-testid*="salary"]',
          '[class*="salary"]'
        ]
      }
    }
    
    return strategies[site] || strategies.generic
  }

  // Extrair informações universais
  extractUniversalInfo($, site) {
    const strategies = this.getSiteStrategies(site)
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

    // Extrair título
    jobData.titulo = this.extractSection($, strategies.title, [
      /<h1[^>]*>([^<]+)<\/h1>/i,
      /<title[^>]*>([^<]+)<\/title>/i
    ], 'Título não encontrado')

    // Extrair descrição
    jobData.descricao = this.extractSection($, strategies.description, [
      /descrição[:\s]*([\s\S]*?)(?=responsabilidades|requisitos|benefícios|etapas|informações|$)/i,
      /sobre a vaga[:\s]*([\s\S]*?)(?=responsabilidades|requisitos|benefícios|etapas|informações|$)/i
    ], '')

    // Extrair responsabilidades
    jobData.responsabilidades = this.extractSection($, [
      '[data-testid*="responsibilities"]',
      '.responsibilities',
      '.responsabilidades',
      '[class*="responsibilities"]'
    ], [
      /responsabilidades[:\s]*([\s\S]*?)(?=requisitos|qualificações|benefícios|etapas|informações|$)/i,
      /atribuições[:\s]*([\s\S]*?)(?=requisitos|qualificações|benefícios|etapas|informações|$)/i
    ], '')

    // Extrair requisitos
    jobData.requisitos = this.extractSection($, [
      '[data-testid*="requirements"]',
      '.requirements',
      '.requisitos',
      '[class*="requirements"]'
    ], [
      /requisitos[:\s]*([\s\S]*?)(?=benefícios|informações|etapas|local|horário|$)/i,
      /qualificações[:\s]*([\s\S]*?)(?=benefícios|informações|etapas|local|horário|$)/i
    ], '')

    // Extrair salário
    jobData.salario = this.extractSection($, strategies.salary, [
      /salário[:\s]*([^\\n]*)/i,
      /remuneração[:\s]*([^\\n]*)/i,
      /R\$\s*[\d.,]+/g
    ], '')

    // Extrair horário
    jobData.horario_trabalho = this.extractSection($, [
      '[data-testid*="schedule"]',
      '.schedule',
      '.horario',
      '[class*="schedule"]'
    ], [
      /horário[:\s]*([^\\n]*)/i,
      /jornada[:\s]*([^\\n]*)/i
    ], '')

    // Extrair benefícios
    jobData.beneficios = this.extractSection($, [
      '[data-testid*="benefits"]',
      '.benefits',
      '.beneficios',
      '[class*="benefits"]'
    ], [
      /benefícios[:\s]*([\s\S]*?)(?=local|etapas|processo|$)/i,
      /o que oferecemos[:\s]*([\s\S]*?)(?=local|etapas|processo|$)/i
    ], '')

    // Extrair local
    jobData.local_trabalho = this.extractSection($, [
      '[data-testid*="location"]',
      '.location',
      '.local',
      '[class*="location"]'
    ], [
      /local[:\s]*([^\\n]*)/i,
      /endereço[:\s]*([^\\n]*)/i
    ], '')

    // Extrair etapas do processo
    jobData.etapas_processo = this.extractSection($, [
      '[data-testid*="process"]',
      '.process',
      '.etapas',
      '[class*="process"]'
    ], [
      /etapas[:\s]*([\s\S]*?)(?=muito prazer|somos|$)/i,
      /processo[:\s]*([\s\S]*?)(?=muito prazer|somos|$)/i
    ], '')

    return jobData
  }

  async extractJobInfo(url) {
    try {
      console.log(`🔍 Extraindo informações de: ${url}`)
      
      const response = await axios.get(url, this.axiosConfig)
      const $ = cheerio.load(response.data)
      
      // Detectar site
      const site = this.detectSite(url)
      console.log(`📍 Site detectado: ${site}`)
      
      // Extrair dados do JSON-LD primeiro
      const jsonLdData = this.extractFromJsonLd($)
      
      // Extrair dados universais
      const universalData = this.extractUniversalInfo($, site)
      
      // Combinar dados (JSON-LD tem prioridade)
      const jobData = {
        ...universalData,
        ...jsonLdData,
        url: url
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
    console.log('=== EXTRAÇÃO UNIVERSAL DE VAGA ===')
    
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
    
    // Aceitar qualquer URL de vaga (não apenas Gupy)
    const scraper = new UniversalJobScraper()
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