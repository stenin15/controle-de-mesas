# 🔧 COMO CRIAR USUÁRIO ADMIN

## ⚠️ ERRO COMUM

**NÃO execute `npx ts-node --transpile-only scripts/create-admin.ts` no SQL Editor do Supabase!**

O SQL Editor é apenas para comandos SQL, não para comandos Node.js.

---

## ✅ FORMA CORRETA 1: Terminal Local (Recomendado)

### Passo 1: Abra o terminal no seu computador
- No VS Code: Terminal → New Terminal
- Ou PowerShell/CMD na pasta do projeto

### Passo 2: Execute o comando
```bash
npx ts-node --transpile-only scripts/create-admin.ts
```

### Passo 3: Verifique o resultado
Deve aparecer:
```
Usuário admin criado com sucesso!
Email: admin@evento.com
Senha: admin123
```

---

## ✅ FORMA CORRETA 2: SQL Editor do Supabase

### Passo 1: Acesse o Supabase Dashboard
1. Vá em **SQL Editor**
2. Clique em **New Query**

### Passo 2: Cole o SQL abaixo
```sql
-- Criar usuário admin
INSERT INTO usuarios (nome, email, senha_hash, role)
VALUES (
    'Administrador',
    'admin@evento.com',
    '$2a$10$rOzJ8K8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK',
    'admin'
)
ON CONFLICT (email) 
DO UPDATE SET 
    senha_hash = EXCLUDED.senha_hash,
    role = EXCLUDED.role,
    nome = EXCLUDED.nome;
```

**⚠️ PROBLEMA:** O hash acima é um exemplo. Você precisa gerar o hash correto!

### Passo 3: Gerar hash correto da senha

**Opção A: Usar o script Node.js (mais fácil)**
```bash
npx ts-node --transpile-only scripts/create-admin.ts
```

**Opção B: Gerar hash manualmente no Supabase**
Execute este SQL primeiro para gerar o hash:
```sql
-- Gerar hash da senha 'admin123'
SELECT crypt('admin123', gen_salt('bf', 10)) as senha_hash;
```

Depois use o hash gerado no INSERT acima.

---

## 🎯 RECOMENDAÇÃO

**Use a Forma 1 (Terminal Local)** - É mais fácil e garante que o hash está correto!

```bash
npx ts-node --transpile-only scripts/create-admin.ts
```

---

## ✅ VERIFICAR SE FUNCIONOU

Execute no SQL Editor do Supabase:
```sql
SELECT id, nome, email, role, 
       CASE WHEN senha_hash IS NOT NULL THEN 'OK' ELSE 'FALTANDO' END as status
FROM usuarios 
WHERE email = 'admin@evento.com';
```

Deve retornar:
- Nome: Administrador
- Email: admin@evento.com
- Role: admin
- Status: OK

---

## 🔑 CREDENCIAIS PADRÃO

- **Email:** `admin@evento.com`
- **Senha:** `admin123`

**⚠️ IMPORTANTE:** Altere a senha após o primeiro login em produção!

---

## ❓ AINDA COM PROBLEMAS?

Se ainda não funcionar:
1. Verifique se a tabela `usuarios` existe
2. Verifique se a coluna `senha_hash` existe
3. Execute o schema.sql completo no Supabase
4. Tente criar o usuário novamente

**Boa sorte! 🚀**


