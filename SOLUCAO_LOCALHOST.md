# 🔧 SOLUÇÃO: Backend apontando para localhost

## Problema
O backend está tentando conectar ao localhost em vez da URL do Supabase.

## Soluções

### 1. Reiniciar o servidor (OBRIGATÓRIO)
O Next.js só carrega `.env.local` na inicialização. 

**Pare o servidor (Ctrl+C) e rode novamente:**
```bash
npm run dev
```

### 2. Verificar logs no terminal
Ao iniciar, você deve ver:
```
🔍 [supabaseAdmin] Verificando variáveis:
   NEXT_PUBLIC_SUPABASE_URL: ✅ https://orqrtobctdjxvygqfhee.supabase.co...
   SUPABASE_SERVICE_ROLE_KEY: ✅ DEFINIDO
```

Se aparecer `localhost`, o `.env.local` não está sendo lido.

### 3. Verificar .env.local
Confirme que o arquivo está na **raiz do projeto** (mesmo nível do `package.json`):

```
controledemesa/
├── .env.local  ← AQUI
├── package.json
├── next.config.js
└── ...
```

### 4. Verificar conteúdo do .env.local
Deve ter:
```env
NEXT_PUBLIC_SUPABASE_URL=https://orqrtobctdjxvygqfhee.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
JWT_SECRET=...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** `NEXT_PUBLIC_BASE_URL` é para o frontend, não para o Supabase!

### 5. Se ainda não funcionar
1. Pare o servidor completamente
2. Delete a pasta `.next` (cache do Next.js)
3. Rode: `npm run dev`

## Verificação
Após reiniciar, os logs devem mostrar a URL correta do Supabase (não localhost).

