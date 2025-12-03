-- ============================================
-- ATUALIZAR SENHA DO ADMIN NO SUPABASE
-- ============================================
-- 
-- Execute este SQL no Editor SQL do Supabase
-- para garantir que o usuário admin existe
-- com a senha correta.
--
-- IMPORTANTE: Este script usa pgcrypto do Postgres
-- para gerar um hash bcrypt compatível com bcryptjs
-- ============================================

-- Verificar se a extensão pgcrypto está habilitada
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Atualizar ou criar usuário admin
-- Se não existir, será criado (dependendo da estrutura da tabela)
UPDATE usuarios
SET 
  senha_hash = crypt('MinhaSenha123', gen_salt('bf')),
  papel = 'admin',
  nome = 'Administrador'
WHERE email = 'admin@admin.com';

-- Se nenhuma linha foi atualizada, criar o usuário
-- (Ajuste conforme sua estrutura de tabela)
INSERT INTO usuarios (email, senha_hash, papel, nome)
SELECT 
  'admin@admin.com',
  crypt('MinhaSenha123', gen_salt('bf')),
  'admin',
  'Administrador'
WHERE NOT EXISTS (
  SELECT 1 FROM usuarios WHERE email = 'admin@admin.com'
);

-- Verificar se foi atualizado/criado corretamente
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

