-- ============================================
-- CRIAR USUÁRIO ADMIN NO SUPABASE
-- ============================================
-- Execute este SQL no SQL Editor do Supabase
-- 
-- Este script cria o usuário admin com:
-- Email: admin@evento.com
-- Senha: admin123
-- Role: admin

-- IMPORTANTE: O hash abaixo é para a senha "admin123"
-- Se precisar gerar um novo hash, use bcrypt com salt rounds 10

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

-- Verificar se foi criado
SELECT id, nome, email, role, criado_em 
FROM usuarios 
WHERE email = 'admin@evento.com';

