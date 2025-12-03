# 🚀 DEPLOY NA VERCEL - GUIA COMPLETO

## ✅ Projeto já está na Vercel!

Agora você pode editar localmente e ver as mudanças automaticamente.

---

## 🔄 Como Funciona

### 1. **Editar Localmente**
- Edite os arquivos no Cursor
- O servidor local (`npm run dev`) mostra as mudanças imediatamente

### 2. **Deploy Automático na Vercel**
- Faça commit e push para o Git
- A Vercel detecta e faz deploy automaticamente
- Ou configure deploy manual

---

## ⚙️ CONFIGURAÇÃO NECESSÁRIA NA VERCEL

### Variáveis de Ambiente na Vercel

1. Acesse: **Vercel Dashboard** → Seu Projeto → **Settings** → **Environment Variables**

2. Adicione estas variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://orqrtobctdjxvygqfhee.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDMwMDUsImV4cCI6MjA4MDI3OTAwNX0.hL3whcfQedAdG7gHYzipf30SyLD9dpRcu099ZEBmycQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMzAwNSwiZXhwIjoyMDgwMjc5MDA1fQ.kt8EofvDhs0ZamIqWUzZ-TH0iB-F7L2tc4z0x71QU0E
JWT_SECRET=OXw6sbp4fSc8hGakyXG5pRfz21dfAIKqvYpUQHPlaMsvauHZR2X43g9QxXGp3Pdl/qn2PYai3J+/Mm02iuR/7g==
NEXT_PUBLIC_BASE_URL=https://seu-projeto.vercel.app
```

**⚠️ IMPORTANTE:** 
- Substitua `NEXT_PUBLIC_BASE_URL` pela URL real do seu projeto na Vercel
- Exemplo: `https://controledemesa.vercel.app`

---

## 🔄 WORKFLOW DE DESENVOLVIMENTO

### Opção 1: Desenvolvimento Local (Recomendado)
```bash
# 1. Edite os arquivos localmente
# 2. Veja as mudanças em: http://localhost:3000
npm run dev

# 3. Quando estiver pronto, faça commit e push
git add .
git commit -m "Descrição das mudanças"
git push
```

### Opção 2: Preview na Vercel
- Cada push cria um preview deployment
- Você pode testar antes de fazer merge

---

## 📝 CHECKLIST DE DEPLOY

- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] `NEXT_PUBLIC_BASE_URL` aponta para a URL da Vercel
- [ ] Schema do banco atualizado (tipo 'presencial' permitido)
- [ ] Usuário admin criado no Supabase
- [ ] Testar login na Vercel

---

## 🐛 DEBUG NA VERCEL

### Ver Logs
1. Vercel Dashboard → Seu Projeto → **Deployments**
2. Clique no deployment → **Functions** → Veja os logs

### Verificar Variáveis
- Settings → Environment Variables
- Confirme que todas estão configuradas

---

## ✅ PRÓXIMOS PASSOS

1. **Configure as variáveis de ambiente na Vercel**
2. **Atualize `NEXT_PUBLIC_BASE_URL`** para a URL da Vercel
3. **Teste o login** na URL da Vercel
4. **Crie o admin** no Supabase (se ainda não criou)

---

## 🔗 Links Úteis

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard

