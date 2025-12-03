-- ============================================
-- VERIFICAR ESTRUTURA REAL DA TABELA usuarios
-- ============================================
-- Execute este SQL primeiro para ver qual coluna existe

-- Verificar colunas da tabela usuarios
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'usuarios'
  AND table_schema = 'public'
ORDER BY ordinal_position;

