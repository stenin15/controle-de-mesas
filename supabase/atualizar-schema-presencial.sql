-- ============================================
-- ATUALIZAÇÃO DO SCHEMA PARA PERMITIR 'presencial'
-- ============================================
-- Execute este script no SQL Editor do Supabase
-- para permitir que vendas tenham tipo 'presencial'

-- Remover constraint antiga
ALTER TABLE vendas DROP CONSTRAINT IF EXISTS vendas_tipo_check;

-- Adicionar nova constraint com 'presencial'
ALTER TABLE vendas ADD CONSTRAINT vendas_tipo_check 
  CHECK (tipo IN ('venda', 'presencial', 'estorno'));

-- Verificar se foi aplicado corretamente
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'vendas'::regclass
  AND conname = 'vendas_tipo_check';

