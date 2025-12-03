-- ============================================
-- ATUALIZAR/CRIAR ADMIN - VERSÃO DEFINITIVA
-- ============================================
-- Este SQL funciona independente de ser 'role' ou 'papel'
-- ============================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Primeiro, verificar qual coluna existe e atualizar
-- Tenta com 'role' primeiro (padrão do schema.sql)
DO $$
BEGIN
  -- Verificar se coluna 'role' existe
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' 
    AND column_name = 'role'
  ) THEN
    -- Usar 'role'
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
    
  -- Se 'role' não existe, tentar com 'papel'
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usuarios' 
    AND column_name = 'papel'
  ) THEN
    -- Usar 'papel'
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
  END IF;
END $$;

-- Verificar resultado
SELECT 
  id,
  email,
  nome,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'role')
    THEN (SELECT role FROM usuarios WHERE email = 'admin@admin.com')
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'usuarios' AND column_name = 'papel')
    THEN (SELECT papel FROM usuarios WHERE email = 'admin@admin.com')
    ELSE 'N/A'
  END as role_ou_papel,
  CASE 
    WHEN senha_hash IS NOT NULL THEN '✅ Senha definida'
    ELSE '❌ Senha não definida'
  END as status_senha
FROM usuarios
WHERE email = 'admin@admin.com';


