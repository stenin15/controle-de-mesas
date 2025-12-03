-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  role TEXT DEFAULT 'funcionario' CHECK (role IN ('admin', 'funcionario')),
  criado_em TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de estoque
CREATE TABLE IF NOT EXISTS estoque (
  id INT PRIMARY KEY DEFAULT 1,
  total_mesas INT NOT NULL,
  mesas_entregues INT DEFAULT 0,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Tabela de pacotes
CREATE TABLE IF NOT EXISTS pacotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_cliente TEXT NOT NULL,
  telefone TEXT NOT NULL,
  qtd_mesas_compradas INT NOT NULL,
  qtd_mesas_usadas INT DEFAULT 0,
  preco_total NUMERIC(10,2) NOT NULL,
  criado_por UUID REFERENCES usuarios(id),
  data_compra TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS vendas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pacote_id UUID REFERENCES pacotes(id),
  valor NUMERIC(10,2) NOT NULL,
  mesas INT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('venda', 'presencial', 'estorno')),
  vendedor_id UUID REFERENCES usuarios(id),
  data TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de logs
CREATE TABLE IF NOT EXISTS logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id),
  acao TEXT NOT NULL,
  pacote_id UUID REFERENCES pacotes(id),
  detalhes JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pacotes_criado_por ON pacotes(criado_por);
CREATE INDEX IF NOT EXISTS idx_pacotes_data_compra ON pacotes(data_compra);
CREATE INDEX IF NOT EXISTS idx_vendas_pacote_id ON vendas(pacote_id);
CREATE INDEX IF NOT EXISTS idx_vendas_vendedor_id ON vendas(vendedor_id);
CREATE INDEX IF NOT EXISTS idx_vendas_data ON vendas(data);
CREATE INDEX IF NOT EXISTS idx_logs_usuario_id ON logs(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);

-- Policies abertas para desenvolvimento (ajustar em produção)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Policies permissivas para dev
CREATE POLICY "Allow all on usuarios" ON usuarios FOR ALL USING (true);
CREATE POLICY "Allow all on estoque" ON estoque FOR ALL USING (true);
CREATE POLICY "Allow all on pacotes" ON pacotes FOR ALL USING (true);
CREATE POLICY "Allow all on vendas" ON vendas FOR ALL USING (true);
CREATE POLICY "Allow all on logs" ON logs FOR ALL USING (true);

-- Inserir estoque inicial
INSERT INTO estoque (id, total_mesas, mesas_entregues) 
VALUES (1, 100, 0)
ON CONFLICT (id) DO NOTHING;

-- NOTA: Para criar o usuário admin, execute o script em scripts/create-admin.ts
-- ou use a API /api/funcionarios (POST) após fazer login como admin
-- Senha padrão sugerida: admin123

