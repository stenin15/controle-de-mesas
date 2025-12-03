-- 🔧 CRIAR USUÁRIO ADMIN DEFINITIVO
-- Execute este SQL no Supabase SQL Editor

-- 1. Verificar se usuário já existe
SELECT id, email, nome, papel FROM usuarios WHERE email = 'admin@admin.com';

-- 2. Se não existir, criar usuário admin
-- Senha: MinhaSenha123
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

INSERT INTO usuarios (email, senha_hash, nome, papel)
VALUES (
  'admin@admin.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Administrador',
  'admin'
)
ON CONFLICT (email) DO UPDATE
SET 
  senha_hash = EXCLUDED.senha_hash,
  papel = 'admin',
  nome = 'Administrador';

-- 3. Verificar se foi criado
SELECT id, email, nome, papel, created_at FROM usuarios WHERE email = 'admin@admin.com';

