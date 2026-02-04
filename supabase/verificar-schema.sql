-- ===========================================
-- Script de Verificação do Schema
-- Execute este script para verificar se há problemas de sintaxe
-- ===========================================

-- Verificar se todas as tabelas foram criadas
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('profiles', 'packages', 'steps', 'instructors', 
                       'theoretical_classes', 'practical_classes', 
                       'user_packages', 'user_progress', 'class_registrations', 
                       'settings', 'payments')
    THEN '✅ OK'
    ELSE '⚠️ Não esperada'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verificar se todas as funções foram criadas
SELECT 
  routine_name,
  routine_type,
  '✅ OK' as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'handle_new_user',
    'update_updated_at',
    'increment_practical_hours',
    'increment_theoretical_classes',
    'validate_practical_class_limits',
    'validate_theoretical_class_limits'
  )
ORDER BY routine_name;

-- Verificar se todos os triggers foram criados
SELECT 
  trigger_name,
  event_object_table,
  '✅ OK' as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name IN (
    'on_auth_user_created',
    'update_profiles_updated_at',
    'update_packages_updated_at',
    'update_steps_updated_at',
    'update_user_progress_updated_at',
    'update_practical_classes_updated_at',
    'update_instructors_updated_at',
    'update_payments_updated_at',
    'trigger_increment_practical_hours',
    'trigger_increment_theoretical_classes',
    'trigger_validate_practical_class_limits',
    'trigger_validate_theoretical_class_limits'
  )
ORDER BY trigger_name;

-- Verificar se RLS está habilitado
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS Habilitado'
    ELSE '❌ RLS Desabilitado'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'packages', 'steps', 'instructors', 
                    'theoretical_classes', 'practical_classes', 
                    'user_packages', 'user_progress', 'class_registrations', 
                    'settings', 'payments')
ORDER BY tablename;



