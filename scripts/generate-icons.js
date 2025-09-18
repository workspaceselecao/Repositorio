const fs = require('fs');
const path = require('path');

// Criar diretório de ícones se não existir
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG básico para gerar ícones
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#2563eb" rx="${size * 0.1}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">V</text>
</svg>
`;

// Tamanhos dos ícones necessários
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Gerando ícones PWA...');

sizes.forEach(size => {
  const svg = createIconSVG(size);
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  // Para simplificar, vamos criar um arquivo SVG que pode ser convertido para PNG
  const svgFilename = `icon-${size}x${size}.svg`;
  const svgFilepath = path.join(iconsDir, svgFilename);
  
  fs.writeFileSync(svgFilepath, svg);
  console.log(`Criado: ${svgFilename}`);
});

console.log('Ícones SVG criados! Para converter para PNG, use uma ferramenta online ou imagem.');
console.log('Arquivos criados em:', iconsDir);
