-- ===========================================
-- Script para VERIFICAR se um usuário é admin
-- Execute este SQL no SQL Editor do Supabase
-- ===========================================

-- Ver todos os usuários e seus roles
SELECT 
  u.id,
  u.email,
  p.name,
  p.role,
  u.created_at as user_created,
  p.updated_at as profile_updated
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC;

-- Ver apenas admins
SELECT 
  u.id,
  u.email,
  p.name,
  p.role
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE p.role = 'admin';

-- Verificar um usuário específico pelo email
-- Substitua 'seu-email@exemplo.com' pelo seu email
SELECT 
  u.id,
  u.email,
  p.name,
  p.role,
  CASE 
    WHEN p.role = 'admin' THEN '✅ É ADMIN'
    ELSE '❌ NÃO É ADMIN'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'seu-email@exemplo.com';

