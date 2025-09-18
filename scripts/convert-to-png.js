const fs = require('fs');
const path = require('path');

// Função para criar um PNG simples usando canvas (simulado)
const createSimplePNG = (size) => {
  // Para simplicidade, vamos criar um arquivo de dados PNG básico
  // Em um ambiente real, você usaria uma biblioteca como sharp ou canvas
  
  // Cabeçalho PNG básico (simulado)
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A  // PNG signature
  ]);
  
  // Para este exemplo, vamos criar um arquivo de placeholder
  // Em produção, use uma biblioteca real de conversão
  return pngHeader;
};

// Criar um script HTML que pode ser usado para converter SVGs para PNG
const createConversionHTML = () => {
  return `<!DOCTYPE html>
<html>
<head>
    <title>SVG to PNG Converter</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .icon { margin: 10px; display: inline-block; }
        canvas { border: 1px solid #ccc; margin: 5px; }
        button { padding: 10px 20px; margin: 5px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer; }
        button:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <h1>🔄 Conversor de Ícones SVG para PNG</h1>
    <p>Clique nos botões abaixo para converter e baixar os ícones como PNG:</p>
    
    <div id="icons"></div>
    
    <script>
        const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
        
        function createIcon(size) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            
            // Criar gradiente de fundo
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#2563eb');
            gradient.addColorStop(1, '#1d4ed8');
            
            // Desenhar fundo
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // Adicionar bordas arredondadas
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.roundRect(0, 0, size, size, size * 0.1);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            
            // Desenhar letra V
            ctx.fillStyle = 'white';
            ctx.font = \`bold \${size * 0.4}px Arial\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('V', size / 2, size / 2);
            
            // Adicionar círculos decorativos
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(size * 0.8, size * 0.2, size * 0.08, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(size * 0.2, size * 0.8, size * 0.06, 0, 2 * Math.PI);
            ctx.fill();
            
            return canvas;
        }
        
        function downloadCanvas(canvas, filename) {
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
        
        // Criar interface
        const container = document.getElementById('icons');
        sizes.forEach(size => {
            const div = document.createElement('div');
            div.className = 'icon';
            div.innerHTML = \`
                <h3>Ícone \${size}x\${size}</h3>
                <canvas id="canvas-\${size}" width="\${size}" height="\${size}"></canvas><br>
                <button onclick="downloadCanvas(document.getElementById('canvas-\${size}'), 'icon-\${size}x\${size}.png')">
                    📥 Baixar PNG
                </button>
            \`;
            container.appendChild(div);
            
            // Desenhar ícone
            const canvas = document.getElementById(\`canvas-\${size}\`);
            const ctx = canvas.getContext('2d');
            
            // Criar gradiente
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#2563eb');
            gradient.addColorStop(1, '#1d4ed8');
            
            // Desenhar fundo
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // Adicionar bordas arredondadas
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.roundRect(0, 0, size, size, size * 0.1);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';
            
            // Desenhar letra V
            ctx.fillStyle = 'white';
            ctx.font = \`bold \${size * 0.4}px Arial\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('V', size / 2, size / 2);
            
            // Adicionar círculos decorativos
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(size * 0.8, size * 0.2, size * 0.08, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath();
            ctx.arc(size * 0.2, size * 0.8, size * 0.06, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Botão para baixar todos
        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.innerHTML = '📦 Baixar Todos os Ícones';
        downloadAllBtn.style.marginTop = '20px';
        downloadAllBtn.style.fontSize = '16px';
        downloadAllBtn.onclick = () => {
            sizes.forEach(size => {
                setTimeout(() => {
                    const canvas = document.getElementById(\`canvas-\${size}\`);
                    downloadCanvas(canvas, \`icon-\${size}x\${size}.png\`);
                }, size * 10); // Delay para evitar bloqueio do navegador
            });
        };
        container.appendChild(downloadAllBtn);
    </script>
</body>
</html>`;
};

// Criar o arquivo HTML de conversão
const htmlPath = path.join(__dirname, '../public/convert-icons.html');
fs.writeFileSync(htmlPath, createConversionHTML());

console.log('🎨 Conversor de ícones criado!');
console.log('📁 Arquivo criado:', htmlPath);
console.log('\n📝 Como usar:');
console.log('1. Abra o arquivo convert-icons.html no navegador');
console.log('2. Clique nos botões para baixar cada ícone como PNG');
console.log('3. Ou use o botão "Baixar Todos" para baixar todos de uma vez');
console.log('4. Salve os arquivos PNG na pasta public/icons/');
console.log('\n🌐 Abra: http://localhost:3000/convert-icons.html');
