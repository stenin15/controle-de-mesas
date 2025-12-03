# ⚡ EXECUTAR AGORA - DEIXAR ONLINE

## 🎯 URL DO SEU PROJETO
**https://controle-de-mesas.vercel.app**

---

## ✅ PASSO 1: CONFIGURAR VARIÁVEIS NA VERCEL (5 minutos)

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto: **controle-de-mesas**
3. Vá em: **Settings** → **Environment Variables**
4. Adicione estas 5 variáveis (uma por vez):

### Variável 1:
- **Key:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://orqrtobctdjxvygqfhee.supabase.co`
- **Environments:** ✅ Production ✅ Preview ✅ Development

### Variável 2:
- **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDMwMDUsImV4cCI6MjA4MDI3OTAwNX0.hL3whcfQedAdG7gHYzipf30SyLD9dpRcu099ZEBmycQ`
- **Environments:** ✅ Production ✅ Preview ✅ Development

### Variável 3:
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMzAwNSwiZXhwIjoyMDgwMjc5MDA1fQ.kt8EofvDhs0ZamIqWUzZ-TH0iB-F7L2tc4z0x71QU0E`
- **Environments:** ✅ Production ✅ Preview ✅ Development

### Variável 4:
- **Key:** `JWT_SECRET`
- **Value:** `OXw6sbp4fSc8hGakyXG5pRfz21dfAIKqvYpUQHPlaMsvauHZR2X43g9QxXGp3Pdl/qn2PYai3J+/Mm02iuR/7g==`
- **Environments:** ✅ Production ✅ Preview ✅ Development

### Variável 5:
- **Key:** `NEXT_PUBLIC_BASE_URL`
- **Value:** `https://controle-de-mesas.vercel.app`
- **Environments:** ✅ Production ✅ Preview ✅ Development

**⚠️ IMPORTANTE:** Após adicionar todas, faça um **Redeploy**!

---

## ✅ PASSO 2: ATUALIZAR BANCO NO SUPABASE (2 minutos)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em: **SQL Editor**
4. Cole e execute este SQL:

```sql
-- Permitir tipo 'presencial'
ALTER TABLE vendas DROP CONSTRAINT IF EXISTS vendas_tipo_check;
ALTER TABLE vendas ADD CONSTRAINT vendas_tipo_check 
  CHECK (tipo IN ('venda', 'presencial', 'estorno'));

-- Criar admin
INSERT INTO usuarios (nome, email, senha_hash, role)
VALUES (
  'Administrador',
  'admin@evento.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin'
)
ON CONFLICT (email) 
DO UPDATE SET
  senha_hash = EXCLUDED.senha_hash,
  role = 'admin';
```

---

## ✅ PASSO 3: REDEPLOY NA VERCEL (1 minuto)

1. Vercel Dashboard → **controle-de-mesas**
2. Clique em **Deployments**
3. Clique nos **3 pontos** do último deployment
4. Selecione **Redeploy**
5. Aguarde o deploy terminar (2-3 minutos)

---

## ✅ PASSO 4: TESTAR (1 minuto)

1. Acesse: **https://controle-de-mesas.vercel.app/login**
2. Faça login:
   - Email: `admin@evento.com`
   - Senha: `admin123`
3. Deve redirecionar para `/admin`

---

## 🎉 PRONTO!

Seu sistema estará 100% online e funcional!

---

## 🐛 SE ALGO NÃO FUNCIONAR

### Verificar Logs:
- Vercel → Deployments → Clique no deployment → **Functions** → Veja os logs

### Verificar Variáveis:
- Vercel → Settings → Environment Variables → Confirme que todas estão lá

### Verificar Admin:
- Supabase → SQL Editor → Execute:
```sql
SELECT * FROM usuarios WHERE email = 'admin@evento.com';
```

---

**Tempo total: ~10 minutos** ⏱️

