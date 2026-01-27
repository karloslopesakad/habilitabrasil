-- ===========================================
-- Script para importar questões de simulado
-- Execute este SQL após executar add-simulation-tables.sql
-- ===========================================

-- Nota: Este script é um exemplo. Para importar as 200 perguntas do JSON,
-- você precisará converter o arquivo JSON para INSERTs SQL ou usar uma
-- ferramenta de importação.

-- Exemplo de como inserir questões manualmente:
-- INSERT INTO simulation_questions (question, options, correct_answer, category, explanation, difficulty) VALUES
-- (
--   'Qual a velocidade máxima permitida para veículos automotores em vias urbanas?',
--   '["60 km/h", "80 km/h", "100 km/h", "120 km/h"]'::jsonb,
--   'A',
--   'legislacao',
--   'Em vias urbanas, a velocidade máxima permitida é de 60 km/h, exceto quando sinalização indicar outra velocidade.',
--   'easy'
-- );

-- Para importar do JSON, você pode:
-- 1. Usar uma ferramenta online para converter JSON para SQL
-- 2. Criar um script Node.js/Python para fazer a conversão
-- 3. Usar a API do Supabase para inserir via código

-- Exemplo de estrutura para importação em lote:
-- BEGIN;
-- INSERT INTO simulation_questions (question, options, correct_answer, category, explanation, difficulty) VALUES
--   -- Adicione aqui todas as questões do JSON
-- COMMIT;

