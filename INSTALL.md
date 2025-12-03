# 🚀 Guia de Instalação Completo

## ✅ PASSO 1 — Instalar Dependências

No terminal (Emergent / terminal local):

```bash
npm install
```

Isso baixa:
- Next.js 15
- Tailwind CSS
- Supabase client
- Bibliotecas de QR Code (qrcode, html5-qrcode)
- JWT (jsonwebtoken)
- bcryptjs
- E todas as outras dependências necessárias

---

## ✅ PASSO 2 — Criar o arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave
SUPABASE_SERVICE_ROLE_KEY=sua_service_key
JWT_SECRET=seu_secret
```

### 📌 Onde pegar as chaves no Supabase:

1. Entre no seu projeto Supabase
2. Vá em **Project Settings → API**

Lá você vai ver:
- **URL** → Copie para `NEXT_PUBLIC_SUPABASE_URL`
- **anon key** → Copie para `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role key** ⚠️ → Copie para `SUPABASE_SERVICE_ROLE_KEY` (nunca expor publicamente!)

3. Gere o `JWT_SECRET` (qualquer valor seguro aleatório)

**Exemplo:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=9d82h9qd82h9q8d2h9dq8h2d9
```

---

## ✅ PASSO 3 — Executar SQL no Supabase

1. Abra o arquivo: `supabase/schema.sql`
2. Copie **TUDO** o conteúdo
3. No Supabase:
   - Vá em **SQL Editor**
   - Clique em **New Query**
   - Cole o conteúdo completo
   - Clique em **Run** (ou pressione `Ctrl+Enter`)

Isso cria:
- ✅ Todas as tabelas (`usuarios`, `estoque`, `pacotes`, `vendas`, `logs`)
- ✅ Índices para performance
- ✅ Policies de segurança (abertas para desenvolvimento)
- ✅ Constraints e validações
- ✅ Estoque inicial (100 mesas)

**Ou seja, toda a estrutura do sistema!**

---

## ✅ PASSO 4 — Criar usuário admin

Execute no terminal:

```bash
npx ts-node scripts/create-admin.ts
```

**Se der erro de TypeScript, use:**

```bash
npx ts-node --transpile-only scripts/create-admin.ts
```

Isso cria o usuário administrador:
- **Email:** `admin@evento.com`
- **Senha:** `admin123`

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

---

## ✅ PASSO 5 — Rodar o sistema

```bash
npm run dev
```

Acesse:
👉 **http://localhost:3000**

### Login:
- **Email:** `admin@evento.com`
- **Senha:** `admin123`

---

## 📌 ARQUIVOS IMPORTANTES (explicação)

### ✔ `INSTALL.md`
Este arquivo — guia completo de instalação passo a passo.

### ✔ `PROJETO_COMPLETO.md`
Documentação técnica do sistema inteiro:
- Rotas e APIs
- Lógica de negócio
- Processos
- Painel admin e funcionário
- Funcionalidades

### ✔ `supabase/schema.sql`
É o coração do banco de dados. Contém:
- Estrutura de todas as tabelas
- Relacionamentos (foreign keys)
- Índices para performance
- Policies de segurança
- Dados iniciais

### ✔ `scripts/create-admin.ts`
Script para criar o usuário administrador inicial.
Usa bcrypt para hash da senha automaticamente.

---

## 🚀 Deploy na Vercel

1. **Conecte seu repositório** à Vercel
2. **Configure as variáveis de ambiente** na Vercel:
   - Vá em **Settings → Environment Variables**
   - Adicione todas as variáveis do `.env.local`
3. **Deploy automático!**

A Vercel detecta automaticamente que é um projeto Next.js e faz o build.

---

## ⚠️ Notas Importantes

### Desenvolvimento:
- ✅ As policies do Supabase estão **abertas** para facilitar desenvolvimento
- ✅ Você pode testar tudo sem restrições

### Produção:
- ⚠️ **Ajuste as policies de segurança** no Supabase
- ⚠️ **Altere o JWT_SECRET** para um valor seguro e aleatório
- ⚠️ **Configure HTTPS** (a Vercel já faz isso automaticamente)
- ⚠️ **Nunca exponha** a `SUPABASE_SERVICE_ROLE_KEY` publicamente

---

## 🆘 Troubleshooting

### Erro ao executar `npx ts-node`:
```bash
# Instale ts-node globalmente
npm install -g ts-node

# Ou use com transpile-only
npx ts-node --transpile-only scripts/create-admin.ts
```

### Erro de conexão com Supabase:
- Verifique se as variáveis de ambiente estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique se o SQL foi executado corretamente

### Erro de autenticação:
- Verifique se o usuário admin foi criado
- Confirme que a senha está correta
- Verifique os logs no console do navegador

---

## ✅ Pronto!

Agora você tem o sistema completo funcionando! 🎉

Acesse `/admin` para o painel administrativo ou `/funcionario` para o painel de funcionários.
