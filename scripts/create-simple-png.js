const fs = require('fs');
const path = require('path');

// Criar diretório de ícones
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Criar um PNG simples usando dados base64
const createSimplePNG = (size) => {
  // PNG de 1x1 pixel azul (mínimo válido)
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // width = 1
    0x00, 0x00, 0x00, 0x01, // height = 1
    0x08, 0x06, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x1F, 0x15, 0xC4, 0x89, // IHDR CRC
    0x00, 0x00, 0x00, 0x0A, // IDAT length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x78, 0x9C, 0x62, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, // compressed data
    0x00, 0x00, 0x00, 0x00, // IEND length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // IEND CRC
  ]);
  
  return pngData;
};

// Tamanhos dos ícones
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 Criando ícones PNG simples...');

// Criar ícones PNG simples
sizes.forEach(size => {
  const pngData = createSimplePNG(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, pngData);
  console.log(`✅ Criado: ${filename}`);
});

// Criar favicon.ico
const faviconData = createSimplePNG(32);
fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), faviconData);
console.log('✅ Criado: favicon.ico');

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

console.log('\n🎉 Ícones PNG básicos criados!');
console.log('📁 Localização:', iconsDir);
console.log('\n💡 Para ícones de alta qualidade:');
console.log('1. Use o conversor HTML: http://localhost:3000/convert-icons.html');
console.log('2. Ou use ferramentas online como convertio.co');
console.log('3. Ou instale ImageMagick e use: convert icon-192x192.svg icon-192x192.png');
