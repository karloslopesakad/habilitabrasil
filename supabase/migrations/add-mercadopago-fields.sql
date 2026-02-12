-- ===========================================
-- Migração: Adicionar campos do Mercado Pago
-- Execute este script para adicionar suporte ao Mercado Pago
-- ===========================================

-- Adicionar colunas do Mercado Pago na tabela payments
ALTER TABLE payments 
  ADD COLUMN IF NOT EXISTS mercadopago_payment_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS mercadopago_preference_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS mercadopago_order_id VARCHAR(255);

-- Criar índice para busca por payment_id do Mercado Pago
CREATE INDEX IF NOT EXISTS idx_payments_mercadopago_payment 
  ON payments(mercadopago_payment_id);

-- Criar índice para busca por preference_id do Mercado Pago
CREATE INDEX IF NOT EXISTS idx_payments_mercadopago_preference 
  ON payments(mercadopago_preference_id);

-- Comentários nas colunas
COMMENT ON COLUMN payments.mercadopago_payment_id IS 'ID do pagamento no Mercado Pago';
COMMENT ON COLUMN payments.mercadopago_preference_id IS 'ID da preferência de pagamento no Mercado Pago';
COMMENT ON COLUMN payments.mercadopago_order_id IS 'ID do pedido (merchant_order) no Mercado Pago';

-- Migração: Adicionar campos do Mercado Pago
-- Execute este script para adicionar suporte ao Mercado Pago
-- ===========================================

-- Adicionar colunas do Mercado Pago na tabela payments
ALTER TABLE payments 
  ADD COLUMN IF NOT EXISTS mercadopago_payment_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS mercadopago_preference_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS mercadopago_order_id VARCHAR(255);

-- Criar índice para busca por payment_id do Mercado Pago
CREATE INDEX IF NOT EXISTS idx_payments_mercadopago_payment 
  ON payments(mercadopago_payment_id);

-- Criar índice para busca por preference_id do Mercado Pago
CREATE INDEX IF NOT EXISTS idx_payments_mercadopago_preference 
  ON payments(mercadopago_preference_id);

-- Comentários nas colunas
COMMENT ON COLUMN payments.mercadopago_payment_id IS 'ID do pagamento no Mercado Pago';
COMMENT ON COLUMN payments.mercadopago_preference_id IS 'ID da preferência de pagamento no Mercado Pago';
COMMENT ON COLUMN payments.mercadopago_order_id IS 'ID do pedido (merchant_order) no Mercado Pago';

