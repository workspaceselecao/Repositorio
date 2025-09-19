# 🔧 Configuração da Service Role Key no Vercel

## 🚨 PROBLEMA IDENTIFICADO

O erro **500 Internal Server Error** na criação de usuários é causado pela **falta da `SUPABASE_SERVICE_ROLE_KEY`** nas variáveis de ambiente do Vercel.

## ✅ SOLUÇÃO

### 1. **Obter a Service Role Key do Supabase:**

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Vá para seu projeto
3. Clique em **Settings** > **API**
4. Copie a **Service Role Key** (não a anon key!)

### 2. **Configurar no Vercel:**

#### **Opção A: Via Dashboard do Vercel**
1. Acesse o [Dashboard do Vercel](https://vercel.com/dashboard)
2. Vá para seu projeto
3. Clique em **Settings** > **Environment Variables**
4. Adicione:
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
   - **Value**: `sua_service_role_key_aqui`
   - **Environment**: Production (e Development se necessário)

#### **Opção B: Via CLI do Vercel**
```bash
vercel env add SUPABASE_SERVICE_ROLE_KEY
# Cole a Service Role Key quando solicitado
```

### 3. **Verificar Configuração:**

Após configurar, acesse:
```
https://seu-app.vercel.app/api/test-config
```

Deve retornar:
```json
{
  "success": true,
  "message": "Configuração OK",
  "details": {
    "hasUrl": true,
    "hasServiceRole": true,
    "supabaseConnected": true
  }
}
```

## 🔍 DEBUG

### **Se ainda houver erro 500:**

1. **Verifique os logs do Vercel:**
   - Dashboard Vercel > Functions > Logs
   - Procure por mensagens de erro

2. **Teste o endpoint de configuração:**
   - `/api/test-config` deve mostrar o status

3. **Verifique as variáveis de ambiente:**
   - Certifique-se que estão em **Production**
   - Reinicie o deploy após adicionar

## 📋 CHECKLIST

- [ ] Service Role Key copiada do Supabase
- [ ] Variável adicionada no Vercel (Production)
- [ ] Deploy reiniciado
- [ ] Teste `/api/test-config` passou
- [ ] Criação de usuários funcionando

## 🚀 RESULTADO ESPERADO

Após a configuração:
- ✅ Criação de usuários funciona
- ✅ Sem erros 500
- ✅ Logs detalhados disponíveis
- ✅ Sistema robusto e confiável

## ⚠️ IMPORTANTE

- **NUNCA** compartilhe a Service Role Key publicamente
- **SEMPRE** use em ambiente de produção
- **MANTENHA** a chave segura e rotacione periodicamente
