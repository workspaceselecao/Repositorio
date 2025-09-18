const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

// Criar diretório de ícones
const iconsDir = path.join(__dirname, '../public/icons')
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Função para criar um PNG real usando canvas
const createRealPNG = (size) => {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  
  // Criar gradiente de fundo
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#2563eb')
  gradient.addColorStop(1, '#1d4ed8')
  
  // Desenhar fundo
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  
  // Adicionar bordas arredondadas
  ctx.globalCompositeOperation = 'destination-in'
  ctx.beginPath()
  ctx.roundRect(0, 0, size, size, size * 0.1)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'
  
  // Desenhar letra V
  ctx.fillStyle = 'white'
  ctx.font = `bold ${size * 0.4}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('V', size / 2, size / 2)
  
  // Adicionar círculos decorativos
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.beginPath()
  ctx.arc(size * 0.8, size * 0.2, size * 0.08, 0, 2 * Math.PI)
  ctx.fill()
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.beginPath()
  ctx.arc(size * 0.2, size * 0.8, size * 0.06, 0, 2 * Math.PI)
  ctx.fill()
  
  return canvas.toBuffer('image/png')
}

// Tamanhos dos ícones
const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

console.log('🎨 Criando ícones PNG reais com Canvas...')

// Criar ícones PNG reais
sizes.forEach(size => {
  try {
    const pngBuffer = createRealPNG(size)
    const filename = `icon-${size}x${size}.png`
    const filepath = path.join(iconsDir, filename)
    
    fs.writeFileSync(filepath, pngBuffer)
    console.log(`✅ Criado: ${filename} (${pngBuffer.length} bytes)`)
  } catch (error) {
    console.error(`❌ Erro ao criar icon-${size}x${size}.png:`, error.message)
  }
})

// Criar favicon.ico
try {
  const faviconBuffer = createRealPNG(32)
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), faviconBuffer)
  console.log('✅ Criado: favicon.ico')
} catch (error) {
  console.error('❌ Erro ao criar favicon.ico:', error.message)
}

console.log('\n🎉 Ícones PNG reais criados!')
console.log('📁 Localização:', iconsDir)
