-- ===========================================
-- Fix V2: Permitir que admins vejam todos os perfis
-- Solução alternativa que não causa recursão
-- Execute este SQL no SQL Editor do Supabase
-- ===========================================

-- Remover a função antiga se existir
DROP FUNCTION IF EXISTS public.is_admin();

-- Criar função helper melhorada que bypassa RLS completamente
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Usar SET LOCAL para desabilitar RLS temporariamente nesta função
  -- Isso permite consultar profiles sem causar recursão
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role = 'admin', false);
END;
$$;

-- Remover política antiga
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Criar nova política usando a função
CREATE POLICY "Admins can view all profiles" ON profiles 
FOR SELECT 
USING (public.is_admin());

-- Verificar se funcionou
-- Execute esta query para testar (substitua pelo seu user_id de admin):
-- SELECT public.is_admin();

