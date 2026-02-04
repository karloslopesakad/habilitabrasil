-- ===========================================
-- Script para adicionar seleção de estado no cadastro
-- Apenas Goiás estará habilitado por enquanto
-- ===========================================

-- Criar tabela de estados brasileiros
CREATE TABLE IF NOT EXISTS states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  abbreviation VARCHAR(2) NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar coluna state_id na tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state_id UUID REFERENCES states(id);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_state ON profiles(state_id);
CREATE INDEX IF NOT EXISTS idx_states_enabled ON states(is_enabled);

-- Inserir todos os estados brasileiros (apenas Goiás habilitado)
INSERT INTO states (name, abbreviation, is_enabled) VALUES
  ('Acre', 'AC', false),
  ('Alagoas', 'AL', false),
  ('Amapá', 'AP', false),
  ('Amazonas', 'AM', false),
  ('Bahia', 'BA', false),
  ('Ceará', 'CE', false),
  ('Distrito Federal', 'DF', false),
  ('Espírito Santo', 'ES', false),
  ('Goiás', 'GO', true),
  ('Maranhão', 'MA', false),
  ('Mato Grosso', 'MT', false),
  ('Mato Grosso do Sul', 'MS', false),
  ('Minas Gerais', 'MG', false),
  ('Pará', 'PA', false),
  ('Paraíba', 'PB', false),
  ('Paraná', 'PR', false),
  ('Pernambuco', 'PE', false),
  ('Piauí', 'PI', false),
  ('Rio de Janeiro', 'RJ', false),
  ('Rio Grande do Norte', 'RN', false),
  ('Rio Grande do Sul', 'RS', false),
  ('Rondônia', 'RO', false),
  ('Roraima', 'RR', false),
  ('Santa Catarina', 'SC', false),
  ('São Paulo', 'SP', false),
  ('Sergipe', 'SE', false),
  ('Tocantins', 'TO', false)
ON CONFLICT (abbreviation) DO NOTHING;

-- Atualizar trigger para incluir state_id (se fornecido nos metadados)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, state_id)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone',
    (NEW.raw_user_meta_data->>'state_id')::UUID
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para atualizar updated_at na tabela states
DROP TRIGGER IF EXISTS update_states_updated_at ON states;
CREATE TRIGGER update_states_updated_at 
  BEFORE UPDATE ON states 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at();

-- Adicionar RLS para a tabela states
ALTER TABLE states ENABLE ROW LEVEL SECURITY;

-- Política: todos podem ver estados habilitados
DROP POLICY IF EXISTS "States are publicly viewable" ON states;
CREATE POLICY "States are publicly viewable" ON states 
  FOR SELECT 
  USING (is_enabled = true);

-- Política: admins podem gerenciar estados
DROP POLICY IF EXISTS "Admins can manage states" ON states;
CREATE POLICY "Admins can manage states" ON states 
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Comentários para documentação
COMMENT ON TABLE states IS 'Tabela de estados brasileiros. Apenas estados com is_enabled=true estarão disponíveis no cadastro.';
COMMENT ON COLUMN profiles.state_id IS 'Referência ao estado selecionado pelo usuário no cadastro.';


