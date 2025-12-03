# 🎫 Sistema de Controle de Mesas para Eventos

Sistema profissional para gerenciamento de vendas de mesas em eventos, com QR Code, check-in, controle de estoque e painéis administrativos.

## 🚀 Início Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Configurar .env.local (veja INSTALL.md)

# 3. Executar SQL no Supabase (veja supabase/schema.sql)

# 4. Criar usuário admin
npx ts-node scripts/create-admin.ts

# 5. Rodar o sistema
npm run dev
```

Acesse: http://localhost:3000

**Login:** `admin@evento.com` / `admin123`

## 📚 Documentação

- **[INSTALL.md](./INSTALL.md)** - Guia completo de instalação passo a passo
- **[PROJETO_COMPLETO.md](./PROJETO_COMPLETO.md)** - Documentação técnica completa

## ✨ Funcionalidades

- ✅ Vendas de mesas (WhatsApp + Presencial)
- ✅ QR Code único por cliente
- ✅ Check-in para liberar mesas
- ✅ Controle de estoque
- ✅ Painel Admin e Funcionários
- ✅ Financeiro (vendas, estornos, relatórios)
- ✅ Logs de auditoria
- ✅ Scanner QR Code com câmera

## 🛠️ Tecnologias

- **Next.js 15** (App Router)
- **TypeScript**
- **Supabase** (Banco de dados)
- **Tailwind CSS**
- **JWT Authentication**
- **QR Code** (qrcode, html5-qrcode)

## 📁 Estrutura

```
app/
├── admin/          # Painel Administrativo
├── funcionario/    # Painel Funcionário
├── api/            # APIs do sistema
└── login/          # Página de login

lib/                # Utilitários e configurações
components/         # Componentes reutilizáveis
supabase/          # Schema do banco de dados
scripts/           # Scripts auxiliares
```

## 🔒 Segurança

- Autenticação JWT
- Proteção de rotas por middleware
- Hash de senhas com bcrypt
- Validação de dados nas APIs
- Logs de auditoria

## 🚢 Deploy

Pronto para deploy na Vercel! Configure as variáveis de ambiente e faça o deploy.

---

**Desenvolvido com ❤️ para eventos profissionais**
