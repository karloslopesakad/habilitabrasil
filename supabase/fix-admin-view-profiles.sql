-- ===========================================
-- Fix: Permitir que admins vejam todos os perfis
-- Execute este SQL no SQL Editor do Supabase
-- ===========================================

-- Criar função helper para verificar se usuário é admin (evita recursão)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Adicionar política para admins verem todos os perfis
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  public.is_admin()
);

