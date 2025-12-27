-- ===========================================
-- Script para tornar um usuário ADMIN
-- Execute este SQL no SQL Editor do Supabase
-- ===========================================

-- IMPORTANTE: Substitua 'seu-email@exemplo.com' pelo seu email de cadastro!

-- Opção 1: Tornar admin pelo email do usuário (RECOMENDADO)
UPDATE profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com'
);

-- Opção 2: Tornar admin pelo ID do usuário
-- 1. Vá em Authentication > Users no Supabase
-- 2. Copie o UUID do seu usuário
-- 3. Descomente e use a query abaixo:
-- UPDATE profiles
-- SET role = 'admin'
-- WHERE id = 'UUID_DO_USUARIO_AQUI';

-- Verificar se foi atualizado corretamente
SELECT 
  p.id, 
  p.name, 
  u.email, 
  p.role 
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.role = 'admin';

