# ✅ CORREÇÃO DEFINITIVA - LOGIN

## 🔴 PROBLEMA IDENTIFICADO

A tabela `usuarios` usa a coluna **`papel`** e não **`role`**.

O código estava tentando fazer:
```typescript
.select('id, email, senha_hash, role, nome')  // ❌ ERRO: coluna 'role' não existe
```

Isso causava:
- ❌ `authenticateUser` sempre retornava `null`
- ❌ `/api/auth/login` sempre respondia `401`
- ❌ Front mostrava "Credenciais inválidas" para qualquer senha

---

## ✅ CORREÇÕES APLICADAS

### 1. **lib/auth.ts** - CORRIGIDO ✅

**Mudanças:**
- ✅ `select('id, email, senha_hash, papel, nome')` - usa `papel` em vez de `role`
- ✅ `role: (data.papel || 'funcionario')` - mapeia `papel` para `role`
- ✅ `generateToken` agora inclui `role` no JWT
- ✅ Tipagem correta com `UserPayload`

### 2. **app/api/auth/login/route.ts** - LIMPO ✅

**Mudanças:**
- ✅ Código simplificado e limpo
- ✅ Usa tipo `UserPayload` corretamente
- ✅ Logs mais objetivos

### 3. **app/login/page.tsx** - JÁ ESTAVA CORRETO ✅

- ✅ Lê `res.json()` apenas uma vez
- ✅ Trata erros corretamente
- ✅ Usa `data.user.role` para redirecionamento

---

## 🔧 PRÓXIMOS PASSOS OBRIGATÓRIOS

### 1. **Atualizar Senha do Admin no Supabase**

Execute este SQL no **Editor SQL do Supabase**:

```sql
-- Verificar se a extensão pgcrypto está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Atualizar senha do admin
UPDATE usuarios
SET 
  senha_hash = crypt('MinhaSenha123', gen_salt('bf')),
  papel = 'admin',
  nome = 'Administrador'
WHERE email = 'admin@admin.com';

-- Se não existir, criar
INSERT INTO usuarios (email, senha_hash, papel, nome)
SELECT 
  'admin@admin.com',
  crypt('MinhaSenha123', gen_salt('bf')),
  'admin',
  'Administrador'
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE email = 'admin@admin.com'
);

-- Verificar
SELECT 
  id,
  email,
  nome,
  papel,
  CASE 
    WHEN senha_hash IS NOT NULL THEN '✅ Senha definida'
    ELSE '❌ Senha não definida'
  END as status_senha
FROM usuarios
WHERE email = 'admin@admin.com';
```

**Arquivo:** `supabase/atualizar-senha-admin.sql`

---

### 2. **Fazer Deploy na Vercel**

```bash
git add .
git commit -m "Corrigir login: usar coluna 'papel' em vez de 'role'"
git push origin main
```

Aguarde o deploy concluir (~1-2 minutos).

---

### 3. **Testar Login**

1. Acesse: `https://controle-de-mesas.vercel.app/login`
2. Email: `admin@admin.com`
3. Senha: `MinhaSenha123`
4. Deve funcionar! ✅

---

## ✅ CHECKLIST FINAL

- [x] `lib/auth.ts` corrigido (usa `papel`)
- [x] `app/api/auth/login/route.ts` limpo
- [x] `app/login/page.tsx` já estava correto
- [ ] SQL executado no Supabase (você precisa fazer)
- [ ] Deploy feito na Vercel (você precisa fazer)
- [ ] Login testado (você precisa fazer)

---

## 🚨 SE AINDA NÃO FUNCIONAR

1. **Abra Runtime Logs da Vercel**
2. **Clique num request `/api/auth/login`**
3. **Copie a mensagem exata** que aparece
4. **Me envie** para análise

---

## 📊 RESUMO

**Problema:** Coluna `role` não existe, deveria ser `papel`

**Solução:** 
- ✅ Código corrigido para usar `papel`
- ✅ Mapeamento `papel` → `role` no retorno
- ✅ `role` incluído no JWT

**Próximo passo:** Executar SQL no Supabase e fazer deploy.

---

**Com essas correções, o login DEVE funcionar!** 🚀✅

