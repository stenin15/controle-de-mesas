# 🔧 SOLUÇÃO FINAL - COLUNA role/papel

## 🔴 PROBLEMA

A tabela `usuarios` pode ter:
- Coluna `role` (conforme schema.sql)
- OU coluna `papel` (conforme algumas queries)

Isso está causando confusão e erros.

---

## ✅ SOLUÇÃO DEFINITIVA

### 1. **PRIMEIRO: Verificar estrutura real**

Execute este SQL no Supabase:

```sql
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'usuarios'
  AND table_schema = 'public'
ORDER BY ordinal_position;
```

**Isso vai mostrar TODAS as colunas da tabela.**

---

### 2. **SEGUNDO: Atualizar admin com SQL inteligente**

Execute este SQL (funciona com `role` OU `papel`):

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Verificar e atualizar usando a coluna correta
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'role'
  ) THEN
    UPDATE usuarios
    SET senha_hash = crypt('MinhaSenha123', gen_salt('bf')),
        role = 'admin',
        nome = 'Administrador'
    WHERE email = 'admin@admin.com';
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' AND column_name = 'papel'
  ) THEN
    UPDATE usuarios
    SET senha_hash = crypt('MinhaSenha123', gen_salt('bf')),
        papel = 'admin',
        nome = 'Administrador'
    WHERE email = 'admin@admin.com';
  END IF;
END $$;
```

**Arquivo completo:** `supabase/atualizar-admin-definitivo.sql`

---

### 3. **TERCEIRO: Corrigir código conforme estrutura real**

Depois de verificar qual coluna existe, me diga:
- Se for `role` → código já está correto
- Se for `papel` → código já está corrigido para usar `papel`

---

## 📋 CHECKLIST

1. [ ] Execute `verificar-estrutura-tabela.sql` no Supabase
2. [ ] Me diga qual coluna existe: `role` ou `papel`
3. [ ] Execute `atualizar-admin-definitivo.sql` no Supabase
4. [ ] Teste o login

---

**Execute o primeiro SQL e me diga qual coluna aparece!** 🔍

