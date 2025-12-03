# ✅ CORREÇÃO FINAL - LOGIN

## 🔴 ERRO IDENTIFICADO

O schema da tabela `usuarios` usa a coluna **`role`** (não `papel`).

O schema.sql mostra:
```sql
role TEXT DEFAULT 'funcionario' CHECK (role IN ('admin', 'funcionario'))
```

---

## ✅ CORREÇÕES APLICADAS

### 1. **lib/auth.ts** - CORRIGIDO ✅

**Mudança:**
- ✅ `select('id, email, senha_hash, role, nome')` - usa `role` (correto)
- ✅ `role: (data.role || 'funcionario')` - mapeia `role` corretamente

### 2. **supabase/atualizar-senha-admin.sql** - CORRIGIDO ✅

**Mudança:**
- ✅ `role = 'admin'` em vez de `papel = 'admin'`
- ✅ `INSERT INTO usuarios (email, senha_hash, role, nome)`

---

## 🔧 PRÓXIMOS PASSOS

### 1. **Executar SQL no Supabase**

Execute este SQL no **Editor SQL do Supabase**:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

UPDATE usuarios
SET 
  senha_hash = crypt('MinhaSenha123', gen_salt('bf')),
  role = 'admin',
  nome = 'Administrador'
WHERE email = 'admin@admin.com';

INSERT INTO usuarios (email, senha_hash, role, nome)
SELECT 
  'admin@admin.com',
  crypt('MinhaSenha123', gen_salt('bf')),
  'admin',
  'Administrador'
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE email = 'admin@admin.com'
);

SELECT 
  id,
  email,
  nome,
  role,
  CASE 
    WHEN senha_hash IS NOT NULL THEN '✅ Senha definida'
    ELSE '❌ Senha não definida'
  END as status_senha
FROM usuarios
WHERE email = 'admin@admin.com';
```

**Arquivo:** `supabase/atualizar-senha-admin.sql` (já corrigido)

---

### 2. **Aguardar Deploy na Vercel**

O código já foi corrigido e será enviado para o Git.

---

### 3. **Testar Login**

1. Acesse: `https://controle-de-mesas.vercel.app/login`
2. Email: `admin@admin.com`
3. Senha: `MinhaSenha123`
4. Deve funcionar! ✅

---

## ✅ RESUMO

**Problema:** Assumi que era `papel`, mas o schema usa `role`

**Solução:** 
- ✅ Código corrigido para usar `role` (como estava originalmente)
- ✅ SQL corrigido para usar `role`

**Status:** Correções aplicadas, pronto para deploy

---

**Agora sim, com `role` correto, o login DEVE funcionar!** 🚀✅
