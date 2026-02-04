-- ===========================================
-- Fix Final: Função RPC para buscar usuários (bypass RLS)
-- Execute este SQL no SQL Editor do Supabase
-- ===========================================

-- ===========================================
-- IMPORTANTE: Execute este SQL na ordem apresentada
-- ===========================================

-- 1. Primeiro, remover a política que depende da função
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- 2. Remover função antiga se existir (agora pode ser removida)
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.get_users_for_admin();

-- 3. Criar função is_admin melhorada (evita recursão)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT profiles.role INTO user_role
  FROM public.profiles
  WHERE profiles.id = auth.uid();
  
  RETURN COALESCE(user_role = 'admin', false);
END;
$$;

-- 4. Criar função RPC que retorna usuários (bypassa RLS)
-- Nota: Email não está disponível diretamente, será retornado como string vazia
CREATE OR REPLACE FUNCTION public.get_users_for_admin()
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  email TEXT,
  role VARCHAR
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem executar esta função.';
  END IF;

  -- Retornar todos os usuários com role = 'user'
  -- Email será string vazia pois não temos acesso direto a auth.users
  RETURN QUERY
  SELECT 
    profiles.id::UUID AS id,
    profiles.name::VARCHAR AS name,
    ''::TEXT AS email,  -- Email não disponível via RPC
    profiles.role::VARCHAR AS role
  FROM public.profiles
  WHERE profiles.role = 'user'
  ORDER BY profiles.name;
END;
$$;

-- 5. Recriar a política usando a função is_admin
CREATE POLICY "Admins can view all profiles" ON profiles 
FOR SELECT 
USING (public.is_admin());

