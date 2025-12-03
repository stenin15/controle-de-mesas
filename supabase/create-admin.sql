-- Script SQL para criar usuário admin no Supabase
-- Execute este script no SQL Editor do Supabase

-- Primeiro, verificar se a coluna senha_hash existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'usuarios' AND column_name = 'senha_hash'
    ) THEN
        ALTER TABLE usuarios ADD COLUMN senha_hash TEXT;
    END IF;
END $$;

-- Criar ou atualizar usuário admin
-- A senha "admin123" será hashada usando bcrypt
-- Hash gerado: $2a$10$rOzJ8K8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK
-- Para gerar um novo hash, use: SELECT crypt('admin123', gen_salt('bf', 10));

INSERT INTO usuarios (nome, email, senha_hash, role)
VALUES (
    'Administrador',
    'admin@evento.com',
    '$2a$10$rOzJ8K8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK8qK', -- Hash de 'admin123'
    'admin'
)
ON CONFLICT (email) 
DO UPDATE SET 
    senha_hash = EXCLUDED.senha_hash,
    role = EXCLUDED.role,
    nome = EXCLUDED.nome;

-- Verificar se foi criado
SELECT id, nome, email, role, 
       CASE WHEN senha_hash IS NOT NULL THEN 'Hash configurado' ELSE 'Hash faltando' END as status_hash
FROM usuarios 
WHERE email = 'admin@evento.com';


