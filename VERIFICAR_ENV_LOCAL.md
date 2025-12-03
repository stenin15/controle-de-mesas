# 🔍 VERIFICAR VARIÁVEIS DE AMBIENTE LOCAL

## 📋 VARIÁVEIS NECESSÁRIAS

Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://orqrtobctdjxvygqfhee.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDMwMDUsImV4cCI6MjA4MDI3OTAwNX0.hL3whcfQedAdG7gHYzipf30SyLD9dpRcu099ZEBmycQ

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMzAwNSwiZXhwIjoyMDgwMjc5MDA1fQ.kt8EofvDhs0ZamIqWUzZ-TH0iB-F7L2tc4z0x71QU0E

JWT_SECRET=OXw6sbp4fSc8hGakyXG5pRfz21dfAIKqvYpUQHPlaMsvauHZR2X43g9QxXGp3Pdl/qn2PYai3J+/Mm02iuR/7g==

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## ✅ COMO VERIFICAR

1. **Verifique se o arquivo existe:**
   ```bash
   ls .env.local
   ```

2. **Se não existir, crie:**
   ```bash
   cp .env.example .env.local
   ```
   (Ou copie o conteúdo acima)

3. **Reinicie o servidor:**
   ```bash
   npm run dev
   ```

---

## ⚠️ IMPORTANTE

- `.env.local` está no `.gitignore` (não vai para o Git)
- **SEMPRE configure as variáveis na Vercel também!**
- Veja: `CONFIGURAR_ENV_VERCEL.md`

---

**Arquivo de exemplo:** `.env.example` ✅

