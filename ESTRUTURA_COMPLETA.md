# 📁 ESTRUTURA COMPLETA DO PROJETO

## 🌳 Árvore de Diretórios e Arquivos

```
controledemesa/
├── app/
│   ├── admin/
│   │   ├── estoque/
│   │   │   └── page.tsx
│   │   ├── estornos/
│   │   │   └── page.tsxa
│   │   ├── funcionarios/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── logs/
│   │   │   └── page.tsx
│   │   ├── pacotes/
│   │   │   └── page.tsx
│   │   ├── page.tsx (Dashboard)
│   │   └── vendas/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   └── me/
│   │   │       └── route.ts
│   │   ├── checkin/
│   │   │   └── route.ts
│   │   ├── estoque/
│   │   │   └── route.ts
│   │   ├── estorno/
│   │   │   └── route.ts
│   │   ├── funcionarios/
│   │   │   └── route.ts
│   │   ├── logs/
│   │   │   └── route.ts
│   │   ├── pacotes/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── relatorios/
│   │   │   └── route.ts
│   │   ├── venda-presencial/
│   │   │   └── route.ts
│   │   └── vendas/
│   │       └── route.ts
│   ├── funcionario/
│   │   ├── layout.tsx
│   │   ├── minhas-vendas/
│   │   │   └── page.tsx
│   │   ├── pacotes/
│   │   │   └── page.tsx
│   │   ├── scanner/
│   │   │   └── page.tsx
│   │   ├── venda-presencial/
│   │   │   └── page.tsx
│   │   └── vender/
│   │       └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── AdminLayout.tsx
│   └── FuncionarioLayout.tsx
├── lib/
│   ├── auth.ts
│   ├── middleware.ts
│   ├── supabaseAdmin.ts
│   ├── supabaseClient.ts
│   └── utils.ts
├── scripts/
│   └── create-admin.ts
├── supabase/
│   └── schema.sql
├── .env.local (arquivo de ambiente - não versionado)
├── .gitignore
├── INSTALL.md
├── middleware.ts
├── next.config.js
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── PROJETO_COMPLETO.md
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📄 CONTEÚDO DOS ARQUIVOS PRINCIPAIS

### 🔐 .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://orqrtobctdjxvygqfhee.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=***
SUPABASE_SERVICE_ROLE_KEY=***
JWT_SECRET=***
```

---

### 📦 package.json

```json
{
  "name": "controledemesa",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "bcryptjs": "^2.4.3",
    "html5-qrcode": "^2.3.8",
    "jsonwebtoken": "^9.0.2",
    "next": "15.0.0",
    "qrcode": "^1.5.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/node": "^20",
    "@types/qrcode": "^1.5.5",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.16",
    "eslint": "^8",
    "eslint-config-next": "15.0.0",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5"
  }
}
```

---

### ⚙️ next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
```

---

### 🔧 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### 🎨 tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## 📚 BIBLIOTECAS (/lib)

### lib/auth.ts

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from './supabaseAdmin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface UserPayload {
  id: string;
  email: string;
  role: 'admin' | 'funcionario';
  nome: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<UserPayload | null> {
  const { data, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, email, senha_hash, role, nome')
    .eq('email', email)
    .single();

  if (error || !data) {
    return null;
  }

  const isValid = await verifyPassword(password, data.senha_hash);
  if (!isValid) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    role: data.role as 'admin' | 'funcionario',
    nome: data.nome,
  };
}
```

### lib/utils.ts

```typescript
import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error);
    throw error;
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
```

### lib/supabaseClient.ts

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### lib/supabaseAdmin.ts

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
```

### lib/middleware.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  return payload;
}

export function requireAuth(request: NextRequest, allowedRoles: ('admin' | 'funcionario')[] = ['admin', 'funcionario']) {
  const user = authMiddleware(request);

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!allowedRoles.includes(user.role)) {
    return NextResponse.redirect(new URL('/login?error=unauthorized', request.url));
  }

  return null;
}
```

---

## 🛡️ MIDDLEWARE

### middleware.ts (raiz)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from './lib/middleware';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas
  if (pathname === '/login' || pathname === '/') {
    return NextResponse.next();
  }

  // Rotas admin - apenas admin
  if (pathname.startsWith('/admin')) {
    const response = requireAuth(request, ['admin']);
    if (response) return response;
  }

  // Rotas funcionário - admin + funcionário
  if (pathname.startsWith('/funcionario')) {
    const response = requireAuth(request, ['admin', 'funcionario']);
    if (response) return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 🔌 APIs (/app/api)

### app/api/auth/login/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, generateToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    // Registrar log de login
    await supabaseAdmin.from('logs').insert({
      usuario_id: user.id,
      acao: 'login',
      detalhes: { email: user.email },
    });

    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      user,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

### app/api/pacotes/route.ts

**POST** - Cria pacote e gera QR Code
**GET** - Lista pacotes (filtrado por role)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { generateQRCode } from '@/lib/utils';

export async function POST(request: NextRequest) {
  // Cria pacote, venda, QR Code e log
  // Retorna: { pacote, qrCode }
}

export async function GET(request: NextRequest) {
  // Lista pacotes com paginação
  // Admin vê todos, funcionário vê só os seus
  // Retorna: { pacotes: [...] }
}
```

### app/api/checkin/route.ts

**POST** - Realiza check-in de mesas

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  // Body: { id_pacote, acao: "1mesa" | "todas" }
  // Valida estoque
  // Atualiza pacote e estoque
  // Registra log
  // Retorna: { message, mesas_entregues, mesas_restantes }
}
```

### app/api/estoque/route.ts

**GET** - Busca estoque atual
**PUT** - Atualiza total de mesas (apenas admin)

### app/api/estorno/route.ts

**POST** - Realiza estorno (apenas admin)

### app/api/relatorios/route.ts

**GET** - Gera relatórios financeiros (apenas admin)
- Vendas totais
- Estornos totais
- Faturamento líquido
- Ticket médio
- Ranking por funcionário
- Vendas por hora

### app/api/vendas/route.ts

**GET** - Lista todas as vendas

### app/api/funcionarios/route.ts

**GET** - Lista funcionários (apenas admin)
**POST** - Cria funcionário (apenas admin)

### app/api/logs/route.ts

**GET** - Lista logs de auditoria (apenas admin)

---

## 🖥️ PÁGINAS PRINCIPAIS

### app/login/page.tsx

Página de login com formulário de email/senha. Redireciona para `/admin` ou `/funcionario` baseado no role.

### app/admin/page.tsx

Dashboard administrativo com:
- Cards de resumo (total mesas, entregues, restantes, faturamento)
- Cards financeiros (vendas, estornos, ticket médio)
- Ranking por funcionário
- Gráfico de vendas por hora

### app/funcionario/scanner/page.tsx

Scanner QR Code com:
- Integração html5-qrcode
- Detecção automática de câmera traseira
- Exibição de informações do pacote
- Botões para entregar 1 mesa ou todas
- Validação de estoque

### app/funcionario/vender/page.tsx

Formulário para venda via WhatsApp:
- Campos: nome, telefone, qtd mesas, preço
- Gera pacote e QR Code
- Exibe QR Code para envio

### app/funcionario/venda-presencial/page.tsx

Formulário para venda presencial (mesma estrutura do vender)

---

## 🧩 COMPONENTES

### components/AdminLayout.tsx

Layout do painel admin com:
- Navegação horizontal
- Menu: Dashboard, Estoque, Funcionários, Pacotes, Vendas, Estornos, Logs
- Botão de logout
- Verificação de autenticação

### components/FuncionarioLayout.tsx

Layout do painel funcionário com:
- Navegação horizontal
- Menu: Vender (WhatsApp), Venda Presencial, Scanner QR, Pacotes, Minhas Vendas
- Botão de logout
- Verificação de autenticação

---

## 📊 BANCO DE DADOS

### supabase/schema.sql

Contém:
- Tabela `usuarios` (id, nome, email, senha_hash, role, criado_em)
- Tabela `estoque` (id, total_mesas, mesas_entregues)
- Tabela `pacotes` (id, nome_cliente, telefone, qtd_mesas_compradas, qtd_mesas_usadas, preco_total, criado_por, data_compra)
- Tabela `vendas` (id, pacote_id, valor, mesas, tipo, vendedor_id, data)
- Tabela `logs` (id, usuario_id, acao, pacote_id, detalhes, timestamp)
- Índices para performance
- Policies de segurança (abertas para dev)

---

## 📝 SCRIPTS

### scripts/create-admin.ts

Script para criar usuário admin inicial:
- Email: admin@evento.com
- Senha: admin123
- Gera hash bcrypt automaticamente

---

## 🎯 ROTAS DO SISTEMA

### Públicas
- `/` - Redireciona para login ou dashboard
- `/login` - Página de login

### Admin (apenas admin)
- `/admin` - Dashboard
- `/admin/estoque` - Controle de estoque
- `/admin/funcionarios` - Gerenciar funcionários
- `/admin/pacotes` - Lista de pacotes
- `/admin/vendas` - Lista de vendas
- `/admin/estornos` - Lista de estornos
- `/admin/logs` - Logs de auditoria

### Funcionário (admin + funcionário)
- `/funcionario/vender` - Venda via WhatsApp
- `/funcionario/venda-presencial` - Venda presencial
- `/funcionario/scanner` - Scanner QR Code
- `/funcionario/pacotes` - Meus pacotes
- `/funcionario/minhas-vendas` - Minhas vendas

---

## 🔑 ENDPOINTS API

### Autenticação
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuário atual
- `POST /api/auth/logout` - Logout

### Pacotes
- `POST /api/pacotes` - Criar pacote
- `GET /api/pacotes` - Listar pacotes
- `GET /api/pacotes/[id]` - Buscar pacote por ID

### Check-in
- `POST /api/checkin` - Realizar check-in

### Estoque
- `GET /api/estoque` - Buscar estoque
- `PUT /api/estoque` - Atualizar estoque (admin)

### Estorno
- `POST /api/estorno` - Realizar estorno (admin)

### Relatórios
- `GET /api/relatorios` - Relatórios financeiros (admin)

### Vendas
- `GET /api/vendas` - Listar vendas

### Funcionários
- `GET /api/funcionarios` - Listar funcionários (admin)
- `POST /api/funcionarios` - Criar funcionário (admin)

### Logs
- `GET /api/logs` - Listar logs (admin)

---

## ✅ STATUS DO PROJETO

- ✅ Estrutura completa criada
- ✅ Todas as APIs implementadas
- ✅ Páginas admin e funcionário
- ✅ Scanner QR Code funcional
- ✅ Autenticação JWT
- ✅ Middleware de proteção
- ✅ Banco de dados configurado
- ✅ Dependências instaladas
- ✅ Pronto para deploy

---

**Documentação gerada em:** 02/12/2025


