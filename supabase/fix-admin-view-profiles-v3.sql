-- ===========================================
-- Fix V3: Função RPC para buscar usuários (bypass RLS)
-- Execute este SQL no SQL Editor do Supabase
-- ===========================================

-- Criar função RPC que retorna usuários (bypassa RLS)
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
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Acesso negado. Apenas administradores podem executar esta função.';
  END IF;

  -- Retornar todos os usuários com role = 'user'
  RETURN QUERY
  SELECT 
    p.id AS id,
    p.name AS name,
    COALESCE(u.email, '')::TEXT AS email,
    p.role AS role
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE p.role = 'user'
  ORDER BY p.name;
END;
$$;

-- Também atualizar a política para usar a função melhorada
DROP FUNCTION IF EXISTS public.is_admin();
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role = 'admin', false);
END;
$$;

-- Atualizar política
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles 
FOR SELECT 
USING (public.is_admin());

