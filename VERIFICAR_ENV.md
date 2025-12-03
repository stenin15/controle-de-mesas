# ✅ VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE

## 📋 CHECKLIST DO .env.local

Seu arquivo `.env.local` na raiz DEVE ter exatamente estas variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://orqrtobctdjxvygqfhee.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MDMwMDUsImV4cCI6MjA4MDI3OTAwNX0.hL3whcfQedAdG7gHYzipf30SyLD9dpRcu099ZEBmycQ
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ycXJ0b2JjdGRqeHZ5Z3FmaGVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDcwMzAwNSwiZXhwIjoyMDgwMjc5MDA1fQ.kt8EofvDhs0ZamIqWUzZ-TH0iB-F7L2tc4z0x71QU0E
JWT_SECRET=OXw6sbp4fSc8hGakyXG5pRfz21dfAIKqvYpUQHPlaMsvauHZR2X43g9QxXGp3Pdl/qn2PYai3J+/Mm02iuR/7g==
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## ⚠️ IMPORTANTE

1. **NEXT_PUBLIC_SUPABASE_ANON_KEY** é necessária mesmo não usando Auth do Supabase
   - O arquivo `lib/supabaseClient.ts` precisa dela
   - Sem ela, o projeto não inicia

2. **Sem espaços extras:**
   - ❌ `NEXT_PUBLIC_SUPABASE_URL = https://...` (errado)
   - ✅ `NEXT_PUBLIC_SUPABASE_URL=https://...` (correto)

3. **Reiniciar servidor:**
   - Após alterar `.env.local`, sempre reinicie: `CTRL+C` e `npm run dev`

## ✅ VERIFICAR SE ESTÁ CORRETO

Execute no terminal:
```bash
# Windows PowerShell
Get-Content .env.local | Select-String -Pattern "SUPABASE|JWT"
```

Deve mostrar todas as 5 variáveis acima.

---

## 🔧 SE FALTAR ALGUMA VARIÁVEL

O servidor vai mostrar erro ao iniciar. Verifique:
- Se o arquivo está na raiz do projeto
- Se não há espaços extras
- Se todas as variáveis estão presentes

**Tudo verificado? Teste o login agora! 🚀**


