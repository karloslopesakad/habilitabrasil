-- ===========================================
-- Migração: Adicionar Tabela de Pagamentos
-- Execute este script se a tabela payments ainda não existe
-- ===========================================

-- Criar tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id),
  stripe_payment_intent_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar coluna stripe_price_id na tabela packages (se não existir)
ALTER TABLE packages ADD COLUMN IF NOT EXISTS stripe_price_id VARCHAR(255);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_package ON payments(package_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Adicionar trigger para updated_at
CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON payments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at();

-- Habilitar RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para payments
-- Usuário vê apenas os próprios pagamentos
CREATE POLICY IF NOT EXISTS "Users can view own payments" 
  ON payments FOR SELECT 
  USING (auth.uid() = user_id);

-- Admins podem gerenciar todos os pagamentos
CREATE POLICY IF NOT EXISTS "Admins can manage payments" 
  ON payments FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Comentários nas colunas
COMMENT ON TABLE payments IS 'Tabela para armazenar histórico de pagamentos via Stripe';
COMMENT ON COLUMN payments.stripe_payment_intent_id IS 'ID do Payment Intent do Stripe';
COMMENT ON COLUMN payments.stripe_checkout_session_id IS 'ID da Checkout Session do Stripe';
COMMENT ON COLUMN payments.status IS 'Status do pagamento: succeeded, pending, failed, refunded';
COMMENT ON COLUMN payments.metadata IS 'Metadados adicionais do pagamento (JSON)';

