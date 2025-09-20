# 🚀 Guia de Integração - Sistema de Extração de Vagas

## 📋 Pré-requisitos

- Node.js 16+ instalado
- NPM ou Yarn
- Aplicação React com Tailwind CSS configurado

## 🛠️ Configuração do Backend

### 1. Criar pasta do backend
```bash
mkdir job-scraper-backend
cd job-scraper-backend
```

### 2. Inicializar projeto e instalar dependências
```bash
npm init -y
npm install express cors axios cheerio sqlite3
npm install --save-dev nodemon
```

### 3. Criar arquivo server.js
- Cole o código do backend Node.js fornecido

### 4. Adicionar scripts no package.json
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 5. Executar o backend
```bash
npm run dev
```

O backend estará rodando em `http://localhost:5000`

## ⚛️ Integração no Frontend React

### 1. Instalar ícones (se ainda não tiver)
```bash
npm install lucide-react
```

### 2. Criar componente
- Criar arquivo `src/components/JobExtractor.jsx`
- Cole o código do componente React fornecido

### 3. Configurar variável de ambiente
Crie arquivo `.env` na raiz do projeto React:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Importar e usar o componente
```jsx
// App.js ou onde desejar usar
import JobExtractor from './components/JobExtractor';

function App() {
  return (
    <div className="App">
      <JobExtractor />
    </div>
  );
}
```

## 🎨 Customização

### Estilos Tailwind
O componente usa classes Tailwind padrão. Você pode customizar:

```jsx
// Exemplo de customização de cores
const customTheme = {
  primary: 'bg-purple-600 hover:bg-purple-700',
  secondary: 'bg-gray-600 hover:bg-gray-700',
  success: 'bg-green-600 hover:bg-green-700',
  danger: 'bg-red-600 hover:bg-red-700'
};
```

### Configuração da API
```jsx
// No componente JobExtractor.jsx
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://sua-api.com/api';
```

## 🗄️ Banco de Dados

### SQLite (Desenvolvimento)
- Banco criado automaticamente em `jobs.db`
- Ideal para desenvolvimento local

### PostgreSQL/MySQL (Produção)
Para produção, substitua SQLite por:

```bash
npm install pg  # PostgreSQL
# ou
npm install mysql2  # MySQL
```

## 🚀 Deploy

### Backend (Heroku/Railway/Vercel)
```bash
# Instalar CLI do provedor
# Fazer deploy seguindo documentação específica
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy da pasta build/
```

## 📡 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/extract` | Extrair informações de URL |
| POST | `/api/jobs` | Salvar vaga |
| GET | `/api/jobs` | Listar todas as vagas |
| GET | `/api/jobs/:id` | Buscar vaga específica |
| DELETE | `/api/jobs/:id` | Deletar vaga |
| GET | `/health` | Health check |

## 🔒 Segurança

### CORS
```js
// server.js
const corsOptions = {
  origin: ['http://localhost:3000', 'https://seudominio.com'],
  credentials: true
};
app.use(cors(corsOptions));
```

### Rate Limiting
```bash
npm install express-rate-limit
```

```js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});

app.use('/api/', limiter);
```

## 🧪 Testes

### Backend
```bash
npm install --save-dev jest supertest
```

### Frontend
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## 🐛 Troubleshooting

### Erro CORS
- Verificar se o backend está rodando
- Configurar CORS no servidor
- Verificar URL da API no frontend

### Erro de Banco
- Verificar permissões de escrita
- Path do banco de dados
- Dependências SQLite instaladas

### Scraping não funciona
- Site pode ter mudado estrutura
- Verificar User-Agent
- Implementar delay entre requests

## 📈 Melhorias Futuras

### Funcionalidades
- [ ] Suporte a outros sites além do Gupy
- [ ] Notificações push para novas vagas
- [ ] Sistema de tags e categorias
- [ ] Exportação para PDF/Excel
- [ ] Filtros avançados
- [ ] Dashboard com estatísticas

### Performance
- [ ] Cache Redis
- [ ] Fila de processamento
- [ ] Paginação
- [ ] Compressão de resposta

### Monitoramento
- [ ] Logs estruturados
- [ ] Métricas de performance
- [ ] Alertas de erro
- [ ] Health checks avançados

## 🤝 Contribuição

1. Fork do projeto
2. Criar branch para feature
3. Commit das mudanças
4. Push para branch
5. Abrir Pull Request

## 📞 Suporte

- Documentação: [Link para docs]
- Issues: [Link para GitHub issues]
- Email: seu-email@exemplo.com

---

## ✅ Checklist de Integração

- [ ] Backend Node.js configurado
- [ ] Dependências instaladas
- [ ] Banco de dados funcionando
- [ ] Componente React integrado
- [ ] Variáveis de ambiente configuradas
- [ ] Tailwind CSS funcionando
- [ ] Testes de extração realizados
- [ ] Deploy configurado (opcional)

**🎉 Parabéns! Seu sistema de extração de vagas está pronto para uso!**