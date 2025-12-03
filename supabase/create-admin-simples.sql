-- ============================================
-- CRIAR USUÁRIO ADMIN NO SUPABASE
-- Execute este SQL no SQL Editor do Supabase
-- ============================================

-- Primeiro, vamos gerar o hash da senha 'admin123' usando bcrypt
-- O PostgreSQL precisa da extensão pgcrypto para isso

-- Habilitar extensão pgcrypto (se ainda não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criar ou atualizar usuário admin
-- A senha 'admin123' será hashada automaticamente
INSERT INTO usuarios (nome, email, senha_hash, role)
VALUES (
    'Administrador',
    'admin@evento.com',
    crypt('admin123', gen_salt('bf', 10)), -- Gera hash bcrypt da senha
    'admin'
)
ON CONFLICT (email) 
DO UPDATE SET 
    senha_hash = crypt('admin123', gen_salt('bf', 10)),
    role = 'admin',
    nome = 'Administrador';

-- Verificar se foi criado corretamente
SELECT 
    id, 
    nome, 
    email, 
    role,
    CASE 
        WHEN senha_hash IS NOT NULL THEN '✅ Hash configurado' 
        ELSE '❌ Hash faltando' 
    END as status_hash,
    criado_em
FROM usuarios 
WHERE email = 'admin@evento.com';

-- Se aparecer o usuário acima, está tudo OK!
-- Credenciais: admin@evento.com / admin123


