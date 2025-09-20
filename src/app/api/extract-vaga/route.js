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
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }
  }

  async extractJobInfo(url) {
    try {
      console.log(`🔍 Extraindo informações de: ${url}`)
      
      const response = await axios.get(url, this.axiosConfig)
      const $ = cheerio.load(response.data)
      
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
      }

      // Extrair título da vaga
      const title = $('h1').first().text().trim() || 
                   $('title').text().trim() || 
                   $('.job-title').text().trim()
      jobData.titulo = title

      // Buscar informações em scripts JSON-LD
      $('script[type="application/ld+json"]').each((i, element) => {
        try {
          const jsonData = JSON.parse($(element).html())
          if (jsonData['@type'] === 'JobPosting') {
            jobData.titulo = jsonData.title || jobData.titulo
            jobData.descricao = jsonData.description || jobData.descricao
            
            // Local de trabalho
            if (jsonData.jobLocation) {
              const location = jsonData.jobLocation
              if (location.address) {
                jobData.local_trabalho = `${location.address.addressLocality || ''}, ${location.address.addressRegion || ''}`.replace(/^,\s*|,\s*$/g, '')
              }
            }
            
            // Salário
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

      // Extrair texto completo para análise
      const fullText = $('body').text()
      
      // Padrões para extrair seções específicas
      const extractSection = (patterns, text) => {
        for (const pattern of patterns) {
          const regex = new RegExp(pattern, 'is')
          const match = text.match(regex)
          if (match && match[1]) {
            return match[1].trim().substring(0, 2000) // Limitar tamanho
          }
        }
        return ''
      }

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
      }

      // Extrair cada seção
      Object.keys(sections).forEach(key => {
        if (!jobData[key]) {
          jobData[key] = extractSection(sections[key], fullText)
        }
      })

      // Extrair informações específicas adicionais
      if (!jobData.salario) {
        const salaryPatterns = [
          'Salário[:\\s]*([R$\\d\\.,\\-\\s]+)',
          'Remuneração[:\\s]*([R$\\d\\.,\\-\\s]+)'
        ]
        jobData.salario = extractSection(salaryPatterns, fullText)
      }

      const schedulePatterns = [
        'Horário[:\\s]*([^\\n]*)',
        'Jornada[:\\s]*([^\\n]*)'
      ]
      
      if (!jobData.horario_trabalho) {
        jobData.horario_trabalho = extractSection(['Horário[:\\s]*([^\\n]*)'], fullText)
      }
      
      if (!jobData.jornada_trabalho) {
        jobData.jornada_trabalho = extractSection(['Jornada[:\\s]*([^\\n]*)'], fullText)
      }

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
