# 🔧 SOLUÇÃO DO ERRO NO SQL EDITOR

## ❌ O ERRO QUE VOCÊ VIU

```
ERROR: 42601: syntax error at or near "npx"
LINE 1: npx ts-node --transpile-only scripts/create-admin.ts
```

**Causa:** Você tentou executar um comando Node.js no SQL Editor do Supabase.

**O SQL Editor só aceita comandos SQL, não comandos do terminal!**

---

## ✅ SOLUÇÃO CORRETA

### Opção 1: Usar SQL no Supabase (Mais Rápido)

1. **Abra o SQL Editor no Supabase**
2. **Clique em "New Query"**
3. **Cole este SQL:**

```sql
-- Habilitar extensão pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criar usuário admin
INSERT INTO usuarios (nome, email, senha_hash, role)
VALUES (
    'Administrador',
    'admin@evento.com',
    crypt('admin123', gen_salt('bf', 10)),
    'admin'
)
ON CONFLICT (email) 
DO UPDATE SET 
    senha_hash = crypt('admin123', gen_salt('bf', 10)),
    role = 'admin',
    nome = 'Administrador';

-- Verificar
SELECT id, nome, email, role FROM usuarios WHERE email = 'admin@evento.com';
```

4. **Clique em "Run" (ou CTRL+J)**
5. **Deve aparecer o usuário criado!**

---

### Opção 2: Usar Terminal Local (Recomendado)

1. **Abra o terminal no seu computador**
   - No VS Code: Terminal → New Terminal
   - Ou PowerShell na pasta do projeto

2. **Execute:**
```bash
npx ts-node --transpile-only scripts/create-admin.ts
```

3. **Deve aparecer:**
```
Usuário admin criado com sucesso!
Email: admin@evento.com
Senha: admin123
```

---

## 🎯 QUAL USAR?

- **SQL no Supabase:** Se você já está no Supabase Dashboard
- **Terminal Local:** Se você quer garantir que o hash está 100% correto

**Ambos funcionam!** Use o que for mais fácil para você.

---

## ✅ VERIFICAR SE FUNCIONOU

Execute no SQL Editor do Supabase:
```sql
SELECT id, nome, email, role FROM usuarios WHERE email = 'admin@evento.com';
```

**Deve retornar:**
- Nome: Administrador
- Email: admin@evento.com
- Role: admin

---

## 🔑 CREDENCIAIS

- **Email:** `admin@evento.com`
- **Senha:** `admin123`

---

## 📝 ARQUIVOS CRIADOS

- ✅ `supabase/create-admin-simples.sql` - SQL pronto para usar
- ✅ `COMO_CRIAR_ADMIN.md` - Guia completo
- ✅ `SOLUCAO_ERRO_SQL.md` - Este arquivo

**Agora você pode criar o usuário admin de qualquer forma! 🚀**


