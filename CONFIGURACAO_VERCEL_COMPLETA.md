# 🚀 CONFIGURAÇÃO COMPLETA PARA VERCEL

## ✅ URL do Projeto
**URL Principal:** `https://controle-de-mesas.vercel.app`

---

## 📋 PASSO 1: VARIÁVEIS DE AMBIENTE NA VERCEL

### Acesse:
**Vercel Dashboard** → `controle-de-mesas` → **Settings** → **Environment Variables**

### Adicione estas variáveis (para Production, Preview e Development):

```env
NEXT_PUBLIC_SUPABASE_URL=https://orqrtobctdjxvygqfhee.supabase.co
```

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDMwMDUsImV4cCI6MjA4MDI3OTAwNX0.hL3whcfQedAdG7gHYzipf30SyLD9dpRcu099ZEBmycQ
```

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMzAwNSwiZXhwIjoyMDgwMjc5MDA1fQ.kt8EofvDhs0ZamIqWUzZ-TH0iB-F7L2tc4z0x71QU0E
```

```env
JWT_SECRET=OXw6sbp4fSc8hGakyXG5pRfz21dfAIKqvYpUQHPlaMsvauHZR2X43g9QxXGp3Pdl/qn2PYai3J+/Mm02iuR/7g==
```

```env
NEXT_PUBLIC_BASE_URL=https://controle-de-mesas.vercel.app
```

**⚠️ IMPORTANTE:** 
- Adicione cada variável separadamente
- Selecione **Production**, **Preview** e **Development** para cada uma
- Clique em **Save** após cada variável

---

## 📋 PASSO 2: ATUALIZAR SCHEMA NO SUPABASE

### Execute no Supabase SQL Editor:

```sql
-- 1. Permitir tipo 'presencial' nas vendas
ALTER TABLE vendas DROP CONSTRAINT IF EXISTS vendas_tipo_check;
ALTER TABLE vendas ADD CONSTRAINT vendas_tipo_check 
  CHECK (tipo IN ('venda', 'presencial', 'estorno'));

-- 2. Criar usuário admin
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

-- 3. Verificar se foi criado
SELECT id, nome, email, role, criado_em 
FROM usuarios 
WHERE email = 'admin@evento.com';
```

---

## 📋 PASSO 3: FAZER DEPLOY

### Opção 1: Deploy Automático (Recomendado)
```bash
git add .
git commit -m "Configuração para produção"
git push
```

A Vercel detecta automaticamente e faz deploy.

### Opção 2: Redeploy Manual
1. Vercel Dashboard → Seu Projeto
2. Clique em **Deployments**
3. Clique nos 3 pontos do último deployment
4. Selecione **Redeploy**

---

## ✅ CHECKLIST FINAL

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] `NEXT_PUBLIC_BASE_URL` = `https://controle-de-mesas.vercel.app`
- [ ] Schema do banco atualizado (tipo 'presencial')
- [ ] Usuário admin criado no Supabase
- [ ] Deploy realizado na Vercel
- [ ] Testar login na URL da Vercel

---

## 🧪 TESTAR APÓS DEPLOY

1. Acesse: `https://controle-de-mesas.vercel.app/login`
2. Faça login:
   - Email: `admin@evento.com`
   - Senha: `admin123`
3. Verifique se redireciona para `/admin`

---

## 🐛 SE ALGO NÃO FUNCIONAR

### Verificar Logs na Vercel:
1. Vercel Dashboard → Seu Projeto → **Deployments**
2. Clique no deployment → **Functions** → Veja os logs

### Verificar Variáveis:
- Settings → Environment Variables
- Confirme que todas estão configuradas

### Verificar Build:
- Se o build falhar, veja os logs do build
- Verifique se todas as dependências estão no `package.json`

---

## 📝 PRÓXIMOS PASSOS

1. **Configure as variáveis de ambiente na Vercel** (PASSO 1)
2. **Atualize o schema no Supabase** (PASSO 2)
3. **Faça o deploy** (PASSO 3)
4. **Teste o login** na URL da Vercel

---

## 🎉 PRONTO!

Após seguir todos os passos, seu sistema estará 100% online e funcional!

