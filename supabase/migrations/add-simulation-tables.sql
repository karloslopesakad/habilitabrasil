-- ===========================================
-- Tabelas para Sistema de Simulado CNH
-- Execute este SQL no SQL Editor do Supabase
-- ===========================================

-- Enum para categorias de questões
DO $$ BEGIN
  CREATE TYPE question_category AS ENUM (
    'legislacao',
    'direcao_defensiva',
    'primeiros_socorros',
    'meio_ambiente',
    'mecanica'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Enum para dificuldade
DO $$ BEGIN
  CREATE TYPE question_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ===========================================
-- Tabela de Questões de Simulado
-- ===========================================
CREATE TABLE IF NOT EXISTS simulation_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array: ["Opção A", "Opção B", "Opção C", "Opção D"]
  correct_answer VARCHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  category question_category NOT NULL,
  explanation TEXT,
  difficulty question_difficulty DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Tabela de Tentativas de Simulado
-- ===========================================
CREATE TABLE IF NOT EXISTS simulation_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  step_id UUID REFERENCES steps(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 30),
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  passed BOOLEAN NOT NULL DEFAULT false,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL, -- { "question_id": "answer", ... }
  question_ids UUID[] NOT NULL, -- IDs das questões usadas nesta tentativa
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_simulation_questions_category ON simulation_questions(category);
CREATE INDEX IF NOT EXISTS idx_simulation_questions_difficulty ON simulation_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_simulation_attempts_user ON simulation_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_attempts_step ON simulation_attempts(step_id);
CREATE INDEX IF NOT EXISTS idx_simulation_attempts_user_step ON simulation_attempts(user_id, step_id);
CREATE INDEX IF NOT EXISTS idx_simulation_attempts_completed ON simulation_attempts(completed_at DESC);

-- ===========================================
-- Função para selecionar questões balanceadas
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

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================

-- Habilitar RLS
ALTER TABLE simulation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_attempts ENABLE ROW LEVEL SECURITY;

-- Política: Questões são públicas para leitura
DROP POLICY IF EXISTS "Questions are publicly viewable" ON simulation_questions;
CREATE POLICY "Questions are publicly viewable" ON simulation_questions 
  FOR SELECT 
  USING (true);

-- Política: Apenas admins podem gerenciar questões
DROP POLICY IF EXISTS "Admins can manage questions" ON simulation_questions;
CREATE POLICY "Admins can manage questions" ON simulation_questions 
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Política: Usuários podem ver apenas suas próprias tentativas
DROP POLICY IF EXISTS "Users can view own attempts" ON simulation_attempts;
CREATE POLICY "Users can view own attempts" ON simulation_attempts 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política: Usuários podem criar suas próprias tentativas
DROP POLICY IF EXISTS "Users can create own attempts" ON simulation_attempts;
CREATE POLICY "Users can create own attempts" ON simulation_attempts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias tentativas (para finalizar)
DROP POLICY IF EXISTS "Users can update own attempts" ON simulation_attempts;
CREATE POLICY "Users can update own attempts" ON simulation_attempts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Política: Admins podem gerenciar todas as tentativas
DROP POLICY IF EXISTS "Admins can manage all attempts" ON simulation_attempts;
CREATE POLICY "Admins can manage all attempts" ON simulation_attempts 
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Comentários para documentação
COMMENT ON TABLE simulation_questions IS 'Banco de questões para simulados de prova teórica do DETRAN';
COMMENT ON TABLE simulation_attempts IS 'Histórico de tentativas de simulados realizadas pelos usuários';
COMMENT ON FUNCTION get_balanced_questions IS 'Seleciona questões balanceadas por categoria, evitando repetir questões recentes do usuário';

