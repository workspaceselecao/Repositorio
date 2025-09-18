# Vercel Build Configuration

## Passos para Deploy Correto:

### 1. Variáveis de Ambiente (OBRIGATÓRIO)
Configure na dashboard da Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

### 2. Framework Detection
- Framework: Next.js
- Node.js Version: 18.x ou superior
- Build Command: `npm run build`
- Output Directory: `.next`

### 3. Troubleshooting 404 Errors
Se ainda ocorrer 404, verifique:
1. ✅ Variáveis de ambiente configuradas
2. ✅ Build completou sem erros
3. ✅ Supabase URL/Key válidos
4. ✅ Domínio correto no Supabase Auth

### 4. Logs de Debug
Para debugar, acesse:
- Vercel Dashboard > Project > Functions
- Vercel Dashboard > Project > Deployments > View Logs