# 🎯 SISTEMA DE CONTROLE DE MESAS - GUIA RÁPIDO

## ⚡ INÍCIO RÁPIDO

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Crie `.env.local` na raiz:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_service_key
JWT_SECRET=seu_secret_seguro
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Configurar Banco de Dados
1. Acesse Supabase Dashboard
2. SQL Editor → Execute `supabase/schema.sql`

### 4. Criar Usuário Admin
```bash
npx ts-node --transpile-only scripts/create-admin.ts
```

### 5. Iniciar Servidor
```bash
npm run dev
```

### 6. Acessar Sistema
- URL: `http://localhost:3000/login`
- Email: `admin@evento.com`
- Senha: `admin123`

---

## 🔑 FUNCIONALIDADES PRINCIPAIS

### Admin
- Dashboard com totais
- Gerenciar estoque
- Criar funcionários
- Ver todas as vendas
- Ver logs de auditoria

### Funcionário
- Vender via WhatsApp (gera QR)
- Vender presencialmente
- Escanear QR para entregar mesas
- Ver seus pacotes e vendas

---

## 🛠️ COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Lint
npm run lint

# Criar admin
npx ts-node --transpile-only scripts/create-admin.ts
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

- `FINALIZACAO_COMPLETA.md` - Documentação completa
- `GUIA_DEBUG_LOGIN.md` - Debug de login
- `STATUS_PROJETO.md` - Status do projeto

---

## ✅ TUDO PRONTO!

O sistema está **100% funcional** e pronto para eventos reais! 🚀


