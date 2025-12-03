-- ============================================
-- SQL SIMPLES PARA CRIAR/ATUALIZAR ADMIN
-- ============================================
-- Use 'role' (padrão do schema.sql)
-- ============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Atualizar admin usando 'role' (conforme schema.sql)
UPDATE usuarios
SET 
  senha_hash = crypt('MinhaSenha123', gen_salt('bf')),
  role = 'admin',
  nome = 'Administrador'
WHERE email = 'admin@admin.com';

-- Se não existir, criar
INSERT INTO usuarios (email, senha_hash, role, nome)
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
  role,
  CASE 
    WHEN senha_hash IS NOT NULL THEN '✅ Senha definida'
    ELSE '❌ Senha não definida'
  END as status_senha
FROM usuarios
WHERE email = 'admin@admin.com';

