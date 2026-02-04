-- ===========================================
-- Fix: Permitir deleção de pacotes com referências
-- ===========================================
-- Este script resolve o erro de foreign key constraint
-- ao tentar deletar pacotes que estão referenciados em user_packages ou payments
--
-- Opções:
-- 1. Alterar constraints para ON DELETE CASCADE (deleta registros relacionados)
-- 2. Alterar constraints para ON DELETE SET NULL (mantém registros mas remove referência)
-- 3. Usar soft delete (marcar is_active = false) - RECOMENDADO
--
-- ===========================================

-- ===========================================
-- OPÇÃO 1: ON DELETE CASCADE
-- Deleta automaticamente user_packages e payments quando o pacote é deletado
-- ===========================================

-- Remover constraint antiga de user_packages
ALTER TABLE user_packages 
DROP CONSTRAINT IF EXISTS user_packages_package_id_fkey;

-- Adicionar nova constraint com CASCADE
ALTER TABLE user_packages 
ADD CONSTRAINT user_packages_package_id_fkey 
FOREIGN KEY (package_id) 
REFERENCES packages(id) 
ON DELETE CASCADE;

-- Remover constraint antiga de payments
ALTER TABLE payments 
DROP CONSTRAINT IF EXISTS payments_package_id_fkey;

-- Adicionar nova constraint com CASCADE
ALTER TABLE payments 
ADD CONSTRAINT payments_package_id_fkey 
FOREIGN KEY (package_id) 
REFERENCES packages(id) 
ON DELETE CASCADE;

-- Remover constraint antiga de steps (se existir)
ALTER TABLE steps 
DROP CONSTRAINT IF EXISTS steps_min_package_id_fkey;

-- Adicionar nova constraint com SET NULL (etapas podem existir sem pacote)
ALTER TABLE steps 
ADD CONSTRAINT steps_min_package_id_fkey 
FOREIGN KEY (min_package_id) 
REFERENCES packages(id) 
ON DELETE SET NULL;

-- ===========================================
-- OPÇÃO 2: Função para Soft Delete (RECOMENDADO)
-- Marca o pacote como inativo ao invés de deletar
-- ===========================================

-- Função para fazer soft delete de pacote
CREATE OR REPLACE FUNCTION soft_delete_package(package_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_packages_count INTEGER;
  payments_count INTEGER;
BEGIN
  -- Verificar se há referências
  SELECT COUNT(*) INTO user_packages_count
  FROM user_packages
  WHERE package_id = package_uuid;
  
  SELECT COUNT(*) INTO payments_count
  FROM payments
  WHERE package_id = package_uuid;
  
  -- Se há referências, fazer soft delete
  IF user_packages_count > 0 OR payments_count > 0 THEN
    UPDATE packages
    SET is_active = false,
        updated_at = NOW()
    WHERE id = package_uuid;
    
    RETURN true;
  ELSE
    -- Se não há referências, pode deletar fisicamente
    DELETE FROM packages WHERE id = package_uuid;
    RETURN true;
  END IF;
END;
$$;

-- ===========================================
-- OPÇÃO 3: Função para deletar com verificação
-- Deleta o pacote e todos os registros relacionados
-- ===========================================

CREATE OR REPLACE FUNCTION delete_package_cascade(package_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_packages_count INTEGER;
  payments_count INTEGER;
BEGIN
  -- Verificar quantos registros serão afetados
  SELECT COUNT(*) INTO user_packages_count
  FROM user_packages
  WHERE package_id = package_uuid;
  
  SELECT COUNT(*) INTO payments_count
  FROM payments
  WHERE package_id = package_uuid;
  
  -- Deletar user_packages relacionados primeiro
  DELETE FROM user_packages WHERE package_id = package_uuid;
  
  -- Deletar payments relacionados
  DELETE FROM payments WHERE package_id = package_uuid;
  
  -- Agora pode deletar o pacote
  DELETE FROM packages WHERE id = package_uuid;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Erro ao deletar pacote: %', SQLERRM;
END;
$$;

-- ===========================================
-- Verificação: Ver quantos registros referenciam um pacote
-- ===========================================

CREATE OR REPLACE FUNCTION check_package_references(package_uuid UUID)
RETURNS TABLE (
  table_name TEXT,
  reference_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'user_packages'::TEXT,
    COUNT(*)::BIGINT
  FROM user_packages
  WHERE package_id = package_uuid
  
  UNION ALL
  
  SELECT 
    'payments'::TEXT,
    COUNT(*)::BIGINT
  FROM payments
  WHERE package_id = package_uuid
  
  UNION ALL
  
  SELECT 
    'steps'::TEXT,
    COUNT(*)::BIGINT
  FROM steps
  WHERE min_package_id = package_uuid;
END;
$$;

-- ===========================================
-- Exemplo de uso:
-- ===========================================
-- 
-- 1. Verificar referências antes de deletar:
-- SELECT * FROM check_package_references('uuid-do-pacote');
--
-- 2. Soft delete (recomendado):
-- SELECT soft_delete_package('uuid-do-pacote');
--
-- 3. Deletar com cascade:
-- SELECT delete_package_cascade('uuid-do-pacote');
--
-- ===========================================

