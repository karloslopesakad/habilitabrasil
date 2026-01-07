-- ===========================================
-- Script Completo: Estrutura de Pagamentos Stripe
-- Execute este script no SQL Editor do Supabase
-- ===========================================

-- ===========================================
-- 1. Criar Tabela de Pagamentos
-- ===========================================
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

-- Adicionar foreign key para profiles se não existir (opcional, para facilitar queries)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'payments_user_id_profiles_fkey'
  ) THEN
    ALTER TABLE payments 
    ADD CONSTRAINT payments_user_id_profiles_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ===========================================
-- 2. Adicionar Coluna stripe_price_id em packages
-- ===========================================
ALTER TABLE packages ADD COLUMN IF NOT EXISTS stripe_price_id VARCHAR(255);

-- ===========================================
-- 3. Criar Índices para Performance
-- ===========================================
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_package ON payments(package_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_session ON payments(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- ===========================================
-- 4. Adicionar Trigger para updated_at
-- ===========================================
-- Certificar que a função update_updated_at existe
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger se não existir
DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON payments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- 5. Habilitar Row Level Security (RLS)
-- ===========================================
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- 6. Criar Políticas RLS
-- ===========================================
-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Admins can manage payments" ON payments;

-- Política: Usuários podem ver apenas seus próprios pagamentos
CREATE POLICY "Users can view own payments" 
  ON payments FOR SELECT 
  USING (auth.uid() = user_id);

-- Política: Admins podem gerenciar todos os pagamentos
CREATE POLICY "Admins can manage payments" 
  ON payments FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ===========================================
-- 7. Adicionar Comentários (Documentação)
-- ===========================================
COMMENT ON TABLE payments IS 'Tabela para armazenar histórico de pagamentos processados via Stripe';
COMMENT ON COLUMN payments.stripe_payment_intent_id IS 'ID do Payment Intent do Stripe (ex: pi_xxx)';
COMMENT ON COLUMN payments.stripe_checkout_session_id IS 'ID da Checkout Session do Stripe (ex: cs_xxx)';
COMMENT ON COLUMN payments.status IS 'Status do pagamento: succeeded (aprovado), pending (pendente), failed (falhou), refunded (reembolsado)';
COMMENT ON COLUMN payments.metadata IS 'Metadados adicionais do pagamento em formato JSON (email do cliente, detalhes, etc)';
COMMENT ON COLUMN payments.amount IS 'Valor do pagamento em reais (ex: 199.99)';
COMMENT ON COLUMN payments.currency IS 'Moeda do pagamento (padrão: BRL)';

-- ===========================================
-- 8. Verificação Final
-- ===========================================
-- Verificar se tudo foi criado corretamente
DO $$
BEGIN
  -- Verificar se a tabela existe
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'payments'
  ) THEN
    RAISE EXCEPTION 'Tabela payments não foi criada!';
  END IF;

  -- Verificar se os índices foram criados
  IF NOT EXISTS (
    SELECT FROM pg_indexes 
    WHERE tablename = 'payments' 
    AND indexname = 'idx_payments_user'
  ) THEN
    RAISE WARNING 'Índice idx_payments_user não foi criado!';
  END IF;

  RAISE NOTICE '✅ Estrutura de pagamentos criada com sucesso!';
END $$;

-- ===========================================
-- FIM DO SCRIPT
-- ===========================================

