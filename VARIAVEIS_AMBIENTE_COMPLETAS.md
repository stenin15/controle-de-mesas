# 🔑 VARIÁVEIS DE AMBIENTE - COMPLETAS E PRONTAS

## ✅ TODAS AS VARIÁVEIS NECESSÁRIAS

### Para `.env.local` (desenvolvimento local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://orqrtobctdjxvygqfhee.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDMwMDUsImV4cCI6MjA4MDI3OTAwNX0.hL3whcfQedAdG7gHYzipf30SyLD9dpRcu099ZEBmycQ

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMzAwNSwiZXhwIjoyMDgwMjc5MDA1fQ.kt8EofvDhs0ZamIqWUzZ-TH0iB-F7L2tc4z0x71QU0E

JWT_SECRET=OXw6sbp4fSc8hGakyXG5pRfz21dfAIKqvYpUQHPlaMsvauHZR2X43g9QxXGp3Pdl/qn2PYai3J+/Mm02iuR/7g==

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## 🔧 CONFIGURAR NA VERCEL

### Passo a Passo:

1. **Acesse:** `https://vercel.com/dashboard`
2. **Selecione:** Projeto `controle-de-mesas`
3. **Vá para:** `Settings` → `Environment Variables`
4. **Adicione cada variável abaixo:**

---

### Variável 1: NEXT_PUBLIC_SUPABASE_URL

- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://orqrtobctdjxvygqfhee.supabase.co`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- **Save**

---

### Variável 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDMwMDUsImV4cCI6MjA4MDI3OTAwNX0.hL3whcfQedAdG7gHYzipf30SyLD9dpRcu099ZEBmycQ`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- **Save**

---

### Variável 3: SUPABASE_SERVICE_ROLE_KEY

- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMzAwNSwiZXhwIjoyMDgwMjc5MDA1fQ.kt8EofvDhs0ZamIqWUzZ-TH0iB-F7L2tc4z0x71QU0E`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- **Save**

---

### Variável 4: JWT_SECRET

- **Name:** `JWT_SECRET`
- **Value:** `OXw6sbp4fSc8hGakyXG5pRfz21dfAIKqvYpUQHPlaMsvauHZR2X43g9QxXGp3Pdl/qn2PYai3J+/Mm02iuR/7g==`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development
- **Save**

---

### Variável 5: NEXT_PUBLIC_BASE_URL

**Para Production:**
- **Name:** `NEXT_PUBLIC_BASE_URL`
- **Value:** `https://controle-de-mesas.vercel.app`
- **Environments:** ✅ Production, ✅ Preview
- **Save**

**Para Development (adicione separadamente):**
- **Name:** `NEXT_PUBLIC_BASE_URL`
- **Value:** `http://localhost:3000`
- **Environments:** ✅ Development
- **Save**

---

## ✅ CHECKLIST

Após adicionar todas as variáveis:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` adicionada
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` adicionada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` adicionada
- [ ] `JWT_SECRET` adicionada
- [ ] `NEXT_PUBLIC_BASE_URL` adicionada (Production)
- [ ] `NEXT_PUBLIC_BASE_URL` adicionada (Development)
- [ ] Todas marcadas para os ambientes corretos
- [ ] **Fazer Redeploy** (Deployments → 3 pontos → Redeploy)

---

## 🚀 APÓS CONFIGURAR

1. **Vá para:** Deployments
2. **Clique nos 3 pontos** (⋯) do último deployment
3. **Clique em:** Redeploy
4. **Aguarde:** ~1-2 minutos
5. **Teste:** `https://controle-de-mesas.vercel.app/login`

---

**Todas as variáveis estão aqui, prontas para copiar e colar!** ✅

