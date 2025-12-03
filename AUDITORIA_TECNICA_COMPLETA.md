# 🔍 AUDITORIA TÉCNICA COMPLETA
## Sistema de Controle de Mesas - Next.js 15 + Supabase

**Data:** $(date)  
**Auditor:** Sistema Automatizado  
**Versão do Projeto:** 0.1.0

---

## 📋 SUMÁRIO EXECUTIVO

### ✅ PONTOS POSITIVOS
- Estrutura do projeto bem organizada seguindo padrão Next.js 15 App Router
- Autenticação JWT implementada corretamente
- Middleware configurado para proteção de rotas
- APIs REST bem estruturadas
- Variáveis de ambiente validadas

### ❌ PROBLEMAS CRÍTICOS ENCONTRADOS
1. **CRÍTICO**: Schema do banco não permite tipo 'presencial' mas API tenta inserir
2. **CRÍTICO**: `verifyToken` lança exceção mas alguns códigos não tratam
3. **MÉDIO**: Arquivo `lib/middleware.ts` não utilizado (redundante)
4. **MÉDIO**: `app/page.tsx` não trata exceção de `verifyToken`

---

## 🔍 1. ESTRUTURA DO PROJETO

### ✅ Estrutura Correta
```
app/
├── admin/          ✅ Protegido por middleware
├── funcionario/    ✅ Protegido por middleware
├── login/          ✅ Rota pública
├── api/            ✅ APIs REST organizadas
└── page.tsx        ✅ Redireciona baseado em role
```

### ⚠️ Problemas Encontrados

#### 1.1. Arquivo Redundante
**Arquivo:** `lib/middleware.ts`  
**Problema:** Arquivo não utilizado. O middleware real está em `middleware.ts` (raiz)  
**Impacto:** Baixo - apenas confusão  
**Solução:** Remover arquivo ou documentar que não é usado

#### 1.2. Rotas Protegidas
**Status:** ✅ CORRETO  
- `/admin/*` - Protegido, apenas admin
- `/funcionario/*` - Protegido, admin e funcionário
- `/login` - Público
- `/api/*` - Liberado no middleware (proteção individual nas rotas)

---

## 🔍 2. VARIÁVEIS DE AMBIENTE

### ✅ Variáveis Verificadas

| Variável | Status | Uso |
|----------|--------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ OK | `lib/supabaseAdmin.ts`, `lib/supabaseClient.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ OK | `lib/supabaseClient.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ OK | `lib/supabaseAdmin.ts` |
| `JWT_SECRET` | ✅ OK | `lib/auth.ts` |
| `NEXT_PUBLIC_BASE_URL` | ⚠️ Opcional | `app/api/pacotes/route.ts`, `app/api/venda-presencial/route.ts` |

### ✅ Validação de Variáveis
- `lib/supabaseAdmin.ts`: Valida `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- `lib/supabaseClient.ts`: Valida `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `lib/auth.ts`: Valida `JWT_SECRET` (lança erro se não existir)

### ✅ Fallback de `NEXT_PUBLIC_BASE_URL`
```typescript
// app/api/pacotes/route.ts (linha 47-48)
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
```
**Status:** ✅ CORRETO - Tem fallback adequado

---

## 🔍 3. AUTENTICAÇÃO E MIDDLEWARE

### ✅ Implementação JWT

#### 3.1. `lib/auth.ts`
**Status:** ✅ CORRETO após correções recentes

**Token Generation:**
```typescript
export function generateToken(user: UserPayload): string {
  return jwt.sign(
    {
      sub: user.id,        // ✅ Usa 'sub' (padrão JWT)
      email: user.email,
      role: user.role,
      nome: user.nome,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
```

**Token Verification:**
```typescript
export function verifyToken(token: string): UserPayload {
  const decoded = jwt.verify(token, JWT_SECRET!) as any;
  return {
    id: decoded.sub as string,  // ✅ Lê 'sub' corretamente
    email: decoded.email as string,
    role: decoded.role as UserRole,
    nome: decoded.nome as string,
  };
}
```

**⚠️ PROBLEMA:** `verifyToken` **LANÇA EXCEÇÃO** se token inválido, mas alguns códigos não tratam:

**Arquivos Afetados:**
1. `app/api/funcionarios/route.ts` (linha 10, 39)
2. `app/api/pacotes/route.ts` (linha 9, 71)
3. `app/api/estoque/route.ts` (linha 9, 36)
4. `app/api/vendas/route.ts` (linha 9)
5. `app/api/venda-presencial/route.ts` (linha 10)
6. `app/api/checkin/route.ts` (linha 8)
7. `app/api/estorno/route.ts` (linha 9)
8. `app/api/logs/route.ts` (linha 9)
9. `app/api/pacotes/[id]/route.ts` (linha 19)
10. `app/page.tsx` (linha 10)

**Exemplo do Problema:**
```typescript
// ❌ ERRADO - Não trata exceção
const user = verifyToken(token || '');
if (!user) {  // Isso nunca será null, vai lançar exceção antes
  return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
}
```

**Solução:**
```typescript
// ✅ CORRETO - Trata exceção
try {
  const user = verifyToken(token || '');
  // ... código
} catch {
  return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
}
```

#### 3.2. `app/api/auth/login/route.ts`
**Status:** ✅ CORRETO
- Gera token corretamente
- Salva cookie com `httpOnly: true`, `secure` (production), `sameSite: 'lax'`
- Path: `/`
- MaxAge: 7 dias

#### 3.3. `app/api/auth/me/route.ts`
**Status:** ✅ CORRETO após correção
- Retorna `{ user: null }` quando não autenticado
- Trata exceção de `verifyToken`

#### 3.4. `middleware.ts`
**Status:** ✅ CORRETO após correções recentes
- Evita loops infinitos
- Libera rotas públicas (`/login`, `/api`)
- Redireciona usuários logados de `/login` para dashboard
- Protege rotas por role

**⚠️ OBSERVAÇÃO:** Arquivo `lib/middleware.ts` existe mas não é usado. Considerar remoção.

#### 3.5. `app/login/page.tsx`
**Status:** ✅ CORRETO após correção
- Usa `useRouter` do Next.js
- Redireciona baseado em `role`
- Código limpo e simples

---

## 🔍 4. BANCO DE DADOS SUPABASE

### ✅ Estrutura das Tabelas

#### 4.1. Tabela `usuarios`
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'funcionario')),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);
```
**Status:** ✅ CORRETO - Bate com o código

#### 4.2. Tabela `estoque`
```sql
CREATE TABLE estoque (
  id INT PRIMARY KEY DEFAULT 1,
  total_mesas INT NOT NULL,
  mesas_entregues INT DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);
```
**Status:** ✅ CORRETO - Bate com o código

#### 4.3. Tabela `pacotes`
```sql
CREATE TABLE pacotes (
  id UUID PRIMARY KEY,
  nome_cliente TEXT NOT NULL,
  telefone TEXT NOT NULL,
  qtd_mesas_compradas INT NOT NULL,
  qtd_mesas_usadas INT DEFAULT 0,
  preco_total NUMERIC(10,2) NOT NULL,
  criado_por UUID REFERENCES usuarios(id),
  data_compra TIMESTAMPTZ DEFAULT NOW()
);
```
**Status:** ✅ CORRETO - Bate com o código

#### 4.4. Tabela `vendas`
```sql
CREATE TABLE vendas (
  id UUID PRIMARY KEY,
  pacote_id UUID REFERENCES pacotes(id),
  valor NUMERIC(10,2) NOT NULL,
  mesas INT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('venda', 'estorno')),  -- ⚠️ PROBLEMA AQUI
  vendedor_id UUID REFERENCES usuarios(id),
  data TIMESTAMPTZ DEFAULT NOW()
);
```

**❌ PROBLEMA CRÍTICO:**
- Schema permite apenas: `'venda'` e `'estorno'`
- Mas `app/api/venda-presencial/route.ts` (linha 49) tenta inserir: `tipo: 'presencial'`

**Impacto:** **CRÍTICO** - Vai falhar ao criar venda presencial!

**Solução:**
```sql
-- Atualizar schema.sql
ALTER TABLE vendas DROP CONSTRAINT IF EXISTS vendas_tipo_check;
ALTER TABLE vendas ADD CONSTRAINT vendas_tipo_check 
  CHECK (tipo IN ('venda', 'presencial', 'estorno'));
```

Ou atualizar o schema.sql:
```sql
tipo TEXT NOT NULL CHECK (tipo IN ('venda', 'presencial', 'estorno')),
```

#### 4.5. Tabela `logs`
```sql
CREATE TABLE logs (
  id UUID PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id),
  acao TEXT NOT NULL,
  pacote_id UUID REFERENCES pacotes(id),
  detalhes JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```
**Status:** ✅ CORRETO - Bate com o código

---

## 🔍 5. VALIDAÇÃO DE API

### ✅ APIs Verificadas

#### 5.1. `/api/funcionarios` (GET, POST)
**Status:** ⚠️ PRECISA CORREÇÃO
- **Problema:** `verifyToken` não tratado com try/catch (linhas 10, 39)
- **Validação de email:** ✅ OK (regex)
- **Validação de duplicação:** ✅ OK
- **Hash de senha:** ✅ OK
- **Log de auditoria:** ✅ OK

#### 5.2. `/api/pacotes` (GET, POST)
**Status:** ⚠️ PRECISA CORREÇÃO
- **Problema:** `verifyToken` não tratado com try/catch (linhas 9, 71)
- **Validação de dados:** ✅ OK
- **Geração de QR Code:** ✅ OK
- **Log de auditoria:** ✅ OK

#### 5.3. `/api/pacotes/[id]` (GET)
**Status:** ⚠️ PRECISA CORREÇÃO
- **Problema:** `verifyToken` não tratado com try/catch (linha 19)
- **Validação:** ✅ OK

#### 5.4. `/api/estoque` (GET, PUT)
**Status:** ⚠️ PRECISA CORREÇÃO
- **Problema:** `verifyToken` não tratado com try/catch (linhas 9, 36)
- **Validação de role:** ✅ OK (admin apenas para PUT)
- **Log de auditoria:** ✅ OK

#### 5.5. `/api/vendas` (GET)
**Status:** ⚠️ PRECISA CORREÇÃO
- **Problema:** `verifyToken` não tratado com try/catch (linha 9)
- **JOIN com pacotes e usuarios:** ✅ OK
- **Filtro por vendedor_id:** ✅ OK (funcionário vê apenas próprias vendas)

#### 5.6. `/api/venda-presencial` (POST)
**Status:** ❌ CRÍTICO - PROBLEMA NO BANCO
- **Problema 1:** `verifyToken` não tratado com try/catch (linha 10)
- **Problema 2:** Tenta inserir `tipo: 'presencial'` mas schema não permite
- **Validação de dados:** ✅ OK
- **Geração de QR Code:** ✅ OK
- **Log de auditoria:** ✅ OK

#### 5.7. `/api/checkin` (POST)
**Status:** ⚠️ PRECISA CORREÇÃO
- **Problema:** `verifyToken` não tratado com try/catch (linha 8)
- **Validação de estoque:** ✅ OK
- **Validação de mesas disponíveis:** ✅ OK
- **Atualização de pacote e estoque:** ✅ OK
- **Log de auditoria:** ✅ OK

#### 5.8. `/api/estorno` (POST)
**Status:** ⚠️ PRECISA CORREÇÃO
- **Problema:** `verifyToken` não tratado com try/catch (linha 9)
- **Validação de role:** ✅ OK (admin apenas)
- **Validação de quantidade:** ✅ OK
- **Atualização de pacote:** ✅ OK
- **Registro de venda negativa:** ✅ OK
- **Log de auditoria:** ✅ OK

#### 5.9. `/api/logs` (GET)
**Status:** ⚠️ PRECISA CORREÇÃO
- **Problema:** `verifyToken` não tratado com try/catch (linha 9)
- **Validação de role:** ✅ OK (admin apenas)
- **JOIN com usuarios:** ✅ OK
- **Limite de 200 registros:** ✅ OK

#### 5.10. `/api/auth/logout` (POST)
**Status:** ✅ CORRETO
- Deleta cookie corretamente

---

## 🔍 6. DASHBOARD ADMIN E FUNCIONÁRIO

### ✅ Páginas Verificadas

#### 6.1. `app/admin/page.tsx` (Dashboard)
**Status:** ✅ CORRETO
- Usa `'use client'` corretamente
- Fetch de `/api/estoque` e `/api/vendas` ✅
- Cálculo de totais ✅
- Tratamento de estornos (valores negativos) ✅

#### 6.2. `app/funcionario/page.tsx` (Home)
**Status:** ✅ CORRETO
- Links para funcionalidades principais ✅
- Layout simples e funcional ✅

#### 6.3. `app/page.tsx` (Root)
**Status:** ⚠️ PRECISA CORREÇÃO
- **Problema:** `verifyToken` não tratado com try/catch (linha 10)
- **Lógica de redirecionamento:** ✅ OK

---

## 📊 RESUMO DE PROBLEMAS

### ❌ CRÍTICOS (2)
1. **Schema do banco não permite `tipo: 'presencial'`** mas API tenta inserir
2. **Múltiplos arquivos não tratam exceção de `verifyToken`**

### ⚠️ MÉDIOS (2)
3. Arquivo `lib/middleware.ts` não utilizado (redundante)
4. `app/page.tsx` não trata exceção de `verifyToken`

### ✅ BAIXOS (0)
Nenhum problema de baixa prioridade encontrado.

---

## 🔧 CORREÇÕES NECESSÁRIAS

### Correção 1: Atualizar Schema do Banco
**Arquivo:** `supabase/schema.sql`  
**Linha:** 37

**ANTES:**
```sql
tipo TEXT NOT NULL CHECK (tipo IN ('venda', 'estorno')),
```

**DEPOIS:**
```sql
tipo TEXT NOT NULL CHECK (tipo IN ('venda', 'presencial', 'estorno')),
```

**Aplicar no Supabase:**
```sql
ALTER TABLE vendas DROP CONSTRAINT IF EXISTS vendas_tipo_check;
ALTER TABLE vendas ADD CONSTRAINT vendas_tipo_check 
  CHECK (tipo IN ('venda', 'presencial', 'estorno'));
```

---

### Correção 2: Tratar Exceção de `verifyToken` em Todas as APIs

**Padrão a aplicar em TODOS os arquivos:**

**ANTES:**
```typescript
const token = request.cookies.get('token')?.value;
const user = verifyToken(token || '');

if (!user) {
  return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
}
```

**DEPOIS:**
```typescript
const token = request.cookies.get('token')?.value;

if (!token) {
  return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
}

let user;
try {
  user = verifyToken(token);
} catch {
  return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 });
}
```

**Arquivos a corrigir:**
1. `app/api/funcionarios/route.ts` (2 ocorrências)
2. `app/api/pacotes/route.ts` (2 ocorrências)
3. `app/api/pacotes/[id]/route.ts` (1 ocorrência)
4. `app/api/estoque/route.ts` (2 ocorrências)
5. `app/api/vendas/route.ts` (1 ocorrência)
6. `app/api/venda-presencial/route.ts` (1 ocorrência)
7. `app/api/checkin/route.ts` (1 ocorrência)
8. `app/api/estorno/route.ts` (1 ocorrência)
9. `app/api/logs/route.ts` (1 ocorrência)
10. `app/page.tsx` (1 ocorrência)

---

### Correção 3: Remover Arquivo Redundante
**Arquivo:** `lib/middleware.ts`  
**Ação:** Deletar (não é usado)

---

## ✅ CHECKLIST FINAL

### Estrutura
- [x] Pastas no padrão Next.js 15 App Router
- [x] Middleware configurado corretamente
- [x] Rotas protegidas por role
- [ ] Remover `lib/middleware.ts` (redundante)

### Variáveis de Ambiente
- [x] Todas as variáveis validadas
- [x] Fallbacks implementados
- [x] Uso correto em todos os arquivos

### Autenticação
- [x] JWT gerado corretamente (usa `sub`)
- [x] JWT verificado corretamente (lê `sub`)
- [x] Cookie configurado corretamente
- [ ] Tratar exceção de `verifyToken` em todas as APIs (10 arquivos)

### Banco de Dados
- [x] Estrutura das tabelas correta
- [x] Campos batem com o código
- [ ] **ATUALIZAR SCHEMA** para permitir `tipo: 'presencial'`

### APIs
- [x] Padrão REST seguido
- [x] Validações implementadas
- [x] Logs de auditoria
- [ ] Tratar exceção de `verifyToken` em todas as rotas

### Frontend
- [x] Server/Client components corretos
- [x] Fetch correto
- [ ] Tratar exceção de `verifyToken` em `app/page.tsx`

---

## 🎯 PRÓXIMOS PASSOS

1. **CRÍTICO:** Atualizar schema do banco para permitir `'presencial'`
2. **CRÍTICO:** Aplicar try/catch em todas as chamadas de `verifyToken`
3. **MÉDIO:** Remover `lib/middleware.ts`
4. **TESTE:** Testar criação de venda presencial após correção do schema
5. **TESTE:** Testar todas as APIs com token inválido/expirado

---

## 📝 NOTAS FINAIS

O projeto está **bem estruturado** e **próximo de estar 100% funcional**. Os problemas encontrados são:

1. **Fáceis de corrigir** (apenas adicionar try/catch)
2. **Bem localizados** (schema e tratamento de exceções)
3. **Não afetam a arquitetura** (são ajustes pontuais)

Após aplicar as correções, o sistema estará **pronto para produção**.

---

**FIM DA AUDITORIA**

