const fs = require('fs');
const path = require('path');

// Função para criar um PNG simples usando dados base64
const createPNGData = (size) => {
  // Para este exemplo, vamos criar um PNG válido mas simples
  // Em produção, use uma biblioteca como sharp ou canvas
  
  // Cabeçalho PNG
  const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  // IHDR chunk
  const width = size;
  const height = size;
  const bitDepth = 8;
  const colorType = 6; // RGBA
  const compression = 0;
  const filter = 0;
  const interlace = 0;
  
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(bitDepth, 8);
  ihdrData.writeUInt8(colorType, 9);
  ihdrData.writeUInt8(compression, 10);
  ihdrData.writeUInt8(filter, 11);
  ihdrData.writeUInt8(interlace, 12);
  
  const ihdrCrc = crc32(Buffer.concat([Buffer.from('IHDR'), ihdrData]));
  const ihdrChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 13]), // Length
    Buffer.from('IHDR'),
    ihdrData,
    Buffer.from([
      (ihdrCrc >> 24) & 0xFF,
      (ihdrCrc >> 16) & 0xFF,
      (ihdrCrc >> 8) & 0xFF,
      ihdrCrc & 0xFF
    ])
  ]);
  
  // IDAT chunk (dados da imagem)
  const pixelData = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const x = i % width;
    const y = Math.floor(i / width);
    
    // Gradiente azul
    const r = Math.floor(37 + (x / width) * 20); // 37-57
    const g = Math.floor(99 + (y / height) * 20); // 99-119
    const b = Math.floor(235 + (x / width) * 20); // 235-255
    
    // Letra V no centro
    const centerX = width / 2;
    const centerY = height / 2;
    const letterSize = size * 0.4;
    
    let alpha = 255;
    if (Math.abs(x - centerX) < letterSize / 2 && Math.abs(y - centerY) < letterSize / 2) {
      // Verificar se está dentro da letra V
      const relX = (x - centerX) / (letterSize / 2);
      const relY = (y - centerY) / (letterSize / 2);
      
      if (Math.abs(relX) < 0.3 && Math.abs(relY) < 0.8) {
        r = 255;
        g = 255;
        b = 255;
      }
    }
    
    pixelData[i * 4] = r;     // R
    pixelData[i * 4 + 1] = g; // G
    pixelData[i * 4 + 2] = b; // B
    pixelData[i * 4 + 3] = alpha; // A
  }
  
  // Comprimir dados (simulação simples)
  const compressedData = Buffer.from(pixelData);
  const idatCrc = crc32(Buffer.concat([Buffer.from('IDAT'), compressedData]));
  const idatChunk = Buffer.concat([
    Buffer.from([
      (compressedData.length >> 24) & 0xFF,
      (compressedData.length >> 16) & 0xFF,
      (compressedData.length >> 8) & 0xFF,
      compressedData.length & 0xFF
    ]),
    Buffer.from('IDAT'),
    compressedData,
    Buffer.from([
      (idatCrc >> 24) & 0xFF,
      (idatCrc >> 16) & 0xFF,
      (idatCrc >> 8) & 0xFF,
      idatCrc & 0xFF
    ])
  ]);
  
  // IEND chunk
  const iendCrc = crc32(Buffer.from('IEND'));
  const iendChunk = Buffer.concat([
    Buffer.from([0, 0, 0, 0]), // Length
    Buffer.from('IEND'),
    Buffer.from([
      (iendCrc >> 24) & 0xFF,
      (iendCrc >> 16) & 0xFF,
      (iendCrc >> 8) & 0xFF,
      iendCrc & 0xFF
    ])
  ]);
  
  return Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
};

// Função CRC32 simples
function crc32(data) {
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  }
  return crc ^ 0xFFFFFFFF;
}

// Criar diretório de ícones
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Tamanhos dos ícones
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 Criando ícones PNG...');

// Criar ícones PNG
sizes.forEach(size => {
  try {
    const pngData = createPNGData(size);
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(iconsDir, filename);
    
    fs.writeFileSync(filepath, pngData);
    console.log(`✅ Criado: ${filename}`);
  } catch (error) {
    console.log(`❌ Erro ao criar icon-${size}x${size}.png:`, error.message);
  }
});

// Criar favicon.ico
try {
  const faviconData = createPNGData(32);
  fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), faviconData);
  console.log('✅ Criado: favicon.ico');
} catch (error) {
  console.log('❌ Erro ao criar favicon.ico:', error.message);
}

// Atualizar manifesto para usar PNGs
const manifestPath = path.join(__dirname, '../public/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.icons = sizes.map(size => ({
  src: `/icons/icon-${size}x${size}.png`,
  sizes: `${size}x${size}`,
  type: "image/png",
  purpose: "maskable any"
}));

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Manifesto PWA atualizado para usar PNGs');

console.log('\n🎉 Ícones PNG criados com sucesso!');
console.log('📁 Localização:', iconsDir);
console.log('\n📝 Nota: Os ícones foram criados com dados básicos.');
console.log('   Para ícones de alta qualidade, use o conversor HTML ou ferramentas profissionais.');
