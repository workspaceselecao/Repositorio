# Instruções específicas para a Vercel

## 🔧 Configurações Obrigatórias na Dashboard da Vercel:

### Build and Development Settings:
- **Framework Preset:** Next.js
- **Build Command:** npm run build (ou deixe vazio) 
- **Output Directory:** (deixe vazio - Next.js detecta automaticamente)
- **Install Command:** npm install (ou deixe vazio)
- **Development Command:** npm run dev (ou deixe vazio)

### Root Directory:
- **Root Directory:** (DEIXE VAZIO)
- **Include files outside the Root Directory:** ENABLED

## ⚠️ IMPORTANTE:
1. NÃO configurar Root Directory (deixar vazio)
2. Framework Preset DEVE ser "Next.js" 
3. Build Command pode ser deixado vazio (usa package.json)
4. Output Directory DEVE ser deixado vazio

## 🚀 Após salvar configurações:
1. Force redeploy sem cache
2. Aguarde build completo