import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function POST(request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      )
    }

    // Validar se é uma URL válida
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'URL inválida' },
        { status: 400 }
      )
    }

    // Fazer requisição para a URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao acessar a URL' },
        { status: response.status }
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extrair dados baseado em seletores comuns
    const extractedData = {
      titulo: '',
      descricao_vaga: '',
      responsabilidades_atribuicoes: '',
      requisitos_qualificacoes: '',
      salario: '',
      horario_trabalho: '',
      jornada_trabalho: '',
      beneficios: '',
      local_trabalho: '',
      etapas_processo: '',
      empresa: '',
      site_origem: url
    }

    // Extrair título da vaga
    extractedData.titulo = $('h1').first().text().trim() || 
                          $('[data-testid*="title"]').text().trim() ||
                          $('.job-title').text().trim() ||
                          $('.title').text().trim()

    // Extrair descrição da vaga
    extractedData.descricao_vaga = $('[data-testid*="description"]').text().trim() ||
                                  $('.job-description').text().trim() ||
                                  $('.description').text().trim() ||
                                  $('p').first().text().trim()

    // Extrair responsabilidades e atribuições
    const responsabilidadesSelectors = [
      '[data-testid*="responsibilities"]',
      '.responsibilities',
      '.job-responsibilities',
      'h3:contains("Responsabilidades")',
      'h3:contains("Atribuições")',
      'h4:contains("Responsabilidades")',
      'h4:contains("Atribuições")'
    ]
    
    for (const selector of responsabilidadesSelectors) {
      const element = $(selector)
      if (element.length) {
        extractedData.responsabilidades_atribuicoes = element.next().text().trim() || 
                                                     element.parent().text().trim()
        break
      }
    }

    // Extrair requisitos e qualificações
    const requisitosSelectors = [
      '[data-testid*="requirements"]',
      '.requirements',
      '.job-requirements',
      '.qualifications',
      'h3:contains("Requisitos")',
      'h3:contains("Qualificações")',
      'h4:contains("Requisitos")',
      'h4:contains("Qualificações")'
    ]
    
    for (const selector of requisitosSelectors) {
      const element = $(selector)
      if (element.length) {
        extractedData.requisitos_qualificacoes = element.next().text().trim() || 
                                                element.parent().text().trim()
        break
      }
    }

    // Extrair informações adicionais
    const infoSelectors = [
      '.job-info',
      '.job-details',
      '.additional-info',
      '[data-testid*="info"]'
    ]

    for (const selector of infoSelectors) {
      const element = $(selector)
      if (element.length) {
        const text = element.text().toLowerCase()
        
        // Extrair salário
        if (text.includes('salário') || text.includes('remuneração') || text.includes('r$')) {
          extractedData.salario = element.text().trim()
        }
        
        // Extrair horário de trabalho
        if (text.includes('horário') || text.includes('jornada')) {
          extractedData.horario_trabalho = element.text().trim()
        }
        
        // Extrair benefícios
        if (text.includes('benefício') || text.includes('vantagem')) {
          extractedData.beneficios = element.text().trim()
        }
        
        // Extrair local de trabalho
        if (text.includes('local') || text.includes('endereço') || text.includes('presencial') || text.includes('remoto')) {
          extractedData.local_trabalho = element.text().trim()
        }
      }
    }

    // Extrair empresa
    extractedData.empresa = $('[data-testid*="company"]').text().trim() ||
                           $('.company-name').text().trim() ||
                           $('.company').text().trim() ||
                           $('h2').first().text().trim()

    // Extrair etapas do processo
    const etapasSelectors = [
      '[data-testid*="process"]',
      '.process',
      '.selection-process',
      'h3:contains("Processo")',
      'h4:contains("Processo")'
    ]
    
    for (const selector of etapasSelectors) {
      const element = $(selector)
      if (element.length) {
        extractedData.etapas_processo = element.next().text().trim() || 
                                       element.parent().text().trim()
        break
      }
    }

    // Se não encontrou dados específicos, tentar extrair de listas
    if (!extractedData.responsabilidades_atribuicoes) {
      $('ul li').each((i, el) => {
        const text = $(el).text().toLowerCase()
        if (text.includes('responsabilidade') || text.includes('atribuição')) {
          extractedData.responsabilidades_atribuicoes = $(el).text().trim()
        }
      })
    }

    if (!extractedData.requisitos_qualificacoes) {
      $('ul li').each((i, el) => {
        const text = $(el).text().toLowerCase()
        if (text.includes('requisito') || text.includes('qualificação') || text.includes('experiência')) {
          extractedData.requisitos_qualificacoes = $(el).text().trim()
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: extractedData
    })

  } catch (error) {
    console.error('Erro ao extrair dados da vaga:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
