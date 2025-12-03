-- Execute este SQL no Supabase SQL Editor
-- Cria o usuário admin com senha: admin123

INSERT INTO usuarios (nome, email, senha_hash, role)
VALUES (
  'Administrador',
  'admin@evento.com',
  '$2a$10$rK8Q8Z9X9X9X9X9X9X9X9u9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X9X',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Se der erro, o hash acima é placeholder
-- Use o script create-admin.ts ou crie manualmente via API

