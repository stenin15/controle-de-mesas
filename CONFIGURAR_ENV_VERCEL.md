# 🔧 CONFIGURAR VARIÁVEIS DE AMBIENTE NA VERCEL

## ⚠️ PROBLEMA

Se as variáveis de ambiente não estiverem configuradas na Vercel, o projeto não funcionará em produção.

---

## ✅ SOLUÇÃO: CONFIGURAR NA VERCEL

### 1. **Acesse o Dashboard da Vercel**

1. Vá para: `https://vercel.com/dashboard`
2. Selecione o projeto: `controle-de-mesas`
3. Clique em **Settings** (Configurações)
4. Clique em **Environment Variables** (Variáveis de Ambiente)

---

### 2. **Adicione TODAS estas variáveis:**

#### ✅ Variável 1:
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://orqrtobctdjxvygqfhee.supabase.co`
- **Environment:** `Production`, `Preview`, `Development` (marque todas)

#### ✅ Variável 2:
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDMwMDUsImV4cCI6MjA4MDI3OTAwNX0.hL3whcfQedAdG7gHYzipf30SyLD9dpRcu099ZEBmycQ`
- **Environment:** `Production`, `Preview`, `Development` (marque todas)

#### ✅ Variável 3:
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMzAwNSwiZXhwIjoyMDgwMjc5MDA1fQ.kt8EofvDhs0ZamIqWUzZ-TH0iB-F7L2tc4z0x71QU0E`
- **Environment:** `Production`, `Preview`, `Development` (marque todas)

#### ✅ Variável 4:
- **Name:** `JWT_SECRET`
- **Value:** `OXw6sbp4fSc8hGakyXG5pRfz21dfAIKqvYpUQHPlaMsvauHZR2X43g9QxXGp3Pdl/qn2PYai3J+/Mm02iuR/7g==`
- **Environment:** `Production`, `Preview`, `Development` (marque todas)

#### ✅ Variável 5:
- **Name:** `NEXT_PUBLIC_BASE_URL`
- **Value:** `https://controle-de-mesas.vercel.app`
- **Environment:** `Production`, `Preview` (marque apenas estas)
- **Para Development:** `http://localhost:3000`

---

### 3. **Salvar e Fazer Redeploy**

1. Clique em **Save** (Salvar) para cada variável
2. Vá para **Deployments** (Deployments)
3. Clique nos **3 pontos** do último deployment
4. Clique em **Redeploy**
5. Aguarde o deploy concluir (~1-2 minutos)

---

## ✅ VERIFICAR SE ESTÁ CORRETO

Após o redeploy, acesse:
- `https://controle-de-mesas.vercel.app/login`

Se funcionar, está tudo certo! ✅

---

## 📋 CHECKLIST

- [ ] `NEXT_PUBLIC_SUPABASE_URL` configurada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configurada
- [ ] `JWT_SECRET` configurada
- [ ] `NEXT_PUBLIC_BASE_URL` configurada
- [ ] Todas marcadas para `Production`
- [ ] Redeploy feito
- [ ] Login testado

---

**IMPORTANTE:** Sem essas variáveis na Vercel, o projeto NÃO funcionará em produção! ⚠️

