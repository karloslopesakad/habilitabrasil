-- ===========================================
-- Correção da função get_balanced_questions
-- Erro: "for SELECT DISTINCT, ORDER BY expressions must appear in select list"
-- Execute este SQL no SQL Editor do Supabase
-- ===========================================

CREATE OR REPLACE FUNCTION get_balanced_questions(
  p_count INTEGER DEFAULT 30,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  question TEXT,
  options JSONB,
  correct_answer VARCHAR(1),
  category question_category,
  explanation TEXT,
  difficulty question_difficulty
) AS $$
DECLARE
  questions_per_category INTEGER;
  remaining_questions INTEGER;
BEGIN
  -- Calcular quantas questões por categoria (aproximadamente)
  questions_per_category := p_count / 5; -- 5 categorias
  remaining_questions := p_count - (questions_per_category * 5);
  
  -- Retornar questões balanceadas
  RETURN QUERY
  WITH recent_attempts AS (
    SELECT sa.question_ids, sa.completed_at
    FROM simulation_attempts sa
    WHERE sa.user_id = p_user_id
      AND sa.completed_at IS NOT NULL
    ORDER BY sa.completed_at DESC
    LIMIT 3  -- últimas 3 tentativas
  ),
  recent_questions AS (
    SELECT DISTINCT UNNEST(ra.question_ids) as question_id
    FROM recent_attempts ra
  ),
  category_questions AS (
    SELECT 
      sq.*,
      ROW_NUMBER() OVER (PARTITION BY sq.category ORDER BY RANDOM()) as rn
    FROM simulation_questions sq
    WHERE sq.id IS NOT NULL
      AND (p_user_id IS NULL OR sq.id NOT IN (SELECT question_id FROM recent_questions))
  )
  SELECT 
    cq.id,
    cq.question,
    cq.options,
    cq.correct_answer,
    cq.category,
    cq.explanation,
    cq.difficulty
  FROM category_questions cq
  WHERE cq.rn <= questions_per_category + CASE 
    WHEN cq.category = 'legislacao' AND remaining_questions > 0 THEN 1
    WHEN cq.category = 'direcao_defensiva' AND remaining_questions > 1 THEN 1
    ELSE 0
  END
  ORDER BY RANDOM()
  LIMIT p_count;
END;
$$ LANGUAGE plpgsql;

