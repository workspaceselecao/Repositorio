const fs = require('fs');
const path = require('path');

// Criar diretório de ícones se não existir
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG base para o ícone PWA
const createIconSVG = (size) => {
  const fontSize = Math.round(size * 0.4);
  const borderRadius = Math.round(size * 0.1);
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)" rx="${borderRadius}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">V</text>
  <circle cx="${size * 0.8}" cy="${size * 0.2}" r="${size * 0.08}" fill="white" opacity="0.3"/>
  <circle cx="${size * 0.2}" cy="${size * 0.8}" r="${size * 0.06}" fill="white" opacity="0.2"/>
</svg>`;
};

// Tamanhos dos ícones necessários
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 Criando ícones PWA...');

// Criar ícones SVG melhorados
sizes.forEach(size => {
  const svg = createIconSVG(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`✅ Criado: ${filename}`);
});

// Criar um favicon.ico simples
const faviconSVG = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#2563eb" rx="4"/>
  <text x="16" y="20" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="white">V</text>
</svg>`;

fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), faviconSVG);
console.log('✅ Criado: favicon.svg');

// Criar apple-touch-icon
const appleTouchIcon = createIconSVG(180);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.svg'), appleTouchIcon);
console.log('✅ Criado: apple-touch-icon.svg');

// Atualizar o manifesto para usar os ícones SVG
const manifestPath = path.join(__dirname, '../public/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Atualizar os ícones no manifesto
manifest.icons = sizes.map(size => ({
  src: `/icons/icon-${size}x${size}.svg`,
  sizes: `${size}x${size}`,
  type: "image/svg+xml",
  purpose: "maskable any"
}));

// Adicionar apple-touch-icon
manifest.icons.push({
  src: "/icons/apple-touch-icon.svg",
  sizes: "180x180",
  type: "image/svg+xml",
  purpose: "any"
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✅ Manifesto PWA atualizado');

console.log('\n🎉 Ícones PWA criados com sucesso!');
console.log('📁 Localização:', iconsDir);
console.log('\n📝 Próximos passos:');
console.log('1. Os ícones SVG estão prontos para uso');
console.log('2. Para melhor compatibilidade, converta para PNG usando:');
console.log('   - Ferramentas online (ex: convertio.co)');
console.log('   - ImageMagick: convert icon-192x192.svg icon-192x192.png');
console.log('   - Ou use o script: npm run convert-icons');
