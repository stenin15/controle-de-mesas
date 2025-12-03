# 🔧 SOLUÇÃO: Erro 401 - Credenciais Inválidas

## Problema
O login retorna `401 Unauthorized` mesmo com credenciais corretas.

## Causa
O usuário admin **não existe** no banco de dados ou a senha está incorreta.

## Solução Rápida

### Opção 1: Criar Admin via SQL (MAIS RÁPIDO)

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Cole e execute este SQL:

```sql
INSERT INTO usuarios (nome, email, senha_hash, role)
VALUES (
  'Administrador',
  'admin@evento.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin'
)
ON CONFLICT (email) 
DO UPDATE SET
  senha_hash = EXCLUDED.senha_hash,
  role = 'admin';
```

4. Verifique se foi criado:
```sql
SELECT id, nome, email, role FROM usuarios WHERE email = 'admin@evento.com';
```

### Opção 2: Verificar Logs do Servidor

No terminal onde está rodando `npm run dev`, você deve ver:

```
🔵 Resultado da autenticação: ❌ FALHOU
🔴 Credenciais inválidas - usuário não encontrado ou senha incorreta
   ⚠️ Usuário não existe no banco de dados!
```

OU

```
   ⚠️ Usuário existe, mas senha está incorreta!
```

### Opção 3: Verificar se Admin Existe

Execute no Supabase SQL Editor:

```sql
SELECT id, nome, email, role, criado_em 
FROM usuarios 
WHERE email = 'admin@evento.com';
```

Se não retornar nada, o usuário não existe.

## Credenciais Padrão

Após criar o admin:
- **Email:** `admin@evento.com`
- **Senha:** `admin123`

## Hash da Senha

O hash `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy` corresponde à senha `admin123` com bcrypt (10 rounds).

## Próximos Passos

1. Execute o SQL acima no Supabase
2. Tente fazer login novamente
3. Se ainda não funcionar, verifique os logs do servidor

