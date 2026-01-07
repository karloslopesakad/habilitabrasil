-- ===========================================
-- HabilitaBrasil - Schema do Supabase
-- Execute este SQL no SQL Editor do Supabase
-- ===========================================

-- Enum para tipos de etapas
CREATE TYPE step_type AS ENUM ('link', 'theoretical_class', 'simulation', 'practical');

-- Enum para status de progresso
CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed');

-- Enum para status de pacote do usuário
CREATE TYPE package_status AS ENUM ('active', 'expired', 'cancelled');

-- Enum para tipo de veículo
CREATE TYPE vehicle_type AS ENUM ('manual', 'automatic');

-- Enum para status de aula
CREATE TYPE class_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- ===========================================
-- Tabela de Perfis (extensão do auth.users)
-- ===========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(200),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user', -- user, admin, instructor
  avatar_url VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- Tabela de Pacotes
-- ===========================================
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  features JSONB DEFAULT '[]',
  practical_hours INTEGER DEFAULT 0,
  theoretical_classes_included INTEGER DEFAULT 0,
  simulations_included INTEGER DEFAULT 0,
  has_whatsapp_support BOOLEAN DEFAULT false,
  has_instructor_support BOOLEAN DEFAULT false,
  is_highlighted BOOLEAN DEFAULT false,
  highlight_label VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Tabela de Etapas
-- ===========================================
CREATE TABLE steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type step_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  subtitle VARCHAR(300),
  description TEXT,
  instructions TEXT,
  external_link VARCHAR(500),
  whatsapp_message VARCHAR(500),
  icon VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  requires_payment BOOLEAN DEFAULT false,
  min_package_id UUID REFERENCES packages(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Tabela de Instrutores
-- ===========================================
CREATE TABLE instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  email VARCHAR(255),
  specialization VARCHAR(100),
  vehicle_types vehicle_type[] DEFAULT '{manual}',
  bio TEXT,
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Tabela de Aulas Teóricas
-- ===========================================
CREATE TABLE theoretical_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID REFERENCES steps(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES instructors(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_link VARCHAR(500),
  max_participants INTEGER DEFAULT 50,
  is_recorded BOOLEAN DEFAULT false,
  recording_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Tabela de Aulas Práticas
-- ===========================================
CREATE TABLE practical_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID REFERENCES steps(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES instructors(id),
  user_id UUID REFERENCES auth.users(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 50,
  vehicle_type vehicle_type DEFAULT 'manual',
  location VARCHAR(300),
  status class_status DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Tabela de Pacotes do Usuário
-- ===========================================
CREATE TABLE user_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id),
  status package_status DEFAULT 'active',
  practical_hours_used INTEGER DEFAULT 0,
  theoretical_classes_used INTEGER DEFAULT 0,
  simulations_used INTEGER DEFAULT 0,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  payment_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Tabela de Progresso do Usuário
-- ===========================================
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  step_id UUID REFERENCES steps(id) ON DELETE CASCADE,
  status progress_status DEFAULT 'not_started',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, step_id)
);

-- ===========================================
-- Tabela de Inscrições em Aulas Teóricas
-- ===========================================
CREATE TABLE class_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theoretical_class_id UUID REFERENCES theoretical_classes(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN DEFAULT false,
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(user_id, theoretical_class_id)
);

-- ===========================================
-- Tabela de Configurações
-- ===========================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- Tabela de Pagamentos
-- ===========================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id),
  stripe_payment_intent_id VARCHAR(255),
  stripe_checkout_session_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(50) NOT NULL, -- succeeded, pending, failed, refunded
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar coluna stripe_price_id na tabela packages (opcional)
ALTER TABLE packages ADD COLUMN IF NOT EXISTS stripe_price_id VARCHAR(255);

-- ===========================================
-- Índices para Performance
-- ===========================================
CREATE INDEX idx_steps_order ON steps(display_order);
CREATE INDEX idx_steps_type ON steps(type);
CREATE INDEX idx_steps_active ON steps(is_active);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_packages_user ON user_packages(user_id);
CREATE INDEX idx_user_packages_status ON user_packages(status);
CREATE INDEX idx_theoretical_classes_date ON theoretical_classes(scheduled_at);
CREATE INDEX idx_practical_classes_user ON practical_classes(user_id);
CREATE INDEX idx_practical_classes_instructor ON practical_classes(instructor_id);
CREATE INDEX idx_packages_active ON packages(is_active);
CREATE INDEX idx_packages_order ON packages(display_order);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_package ON payments(package_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_session ON payments(stripe_checkout_session_id);

-- ===========================================
-- Trigger para Atualizar updated_at
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_steps_updated_at BEFORE UPDATE ON steps FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_practical_classes_updated_at BEFORE UPDATE ON practical_classes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_instructors_updated_at BEFORE UPDATE ON instructors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- Row Level Security (RLS)
-- ===========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE theoretical_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE practical_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: usuário vê/edita apenas o próprio
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Packages: público pode ver ativos
CREATE POLICY "Packages are publicly viewable" ON packages FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage packages" ON packages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Steps: público pode ver ativos
CREATE POLICY "Steps are publicly viewable" ON steps FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage steps" ON steps FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Instructors: público pode ver ativos
CREATE POLICY "Instructors are publicly viewable" ON instructors FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage instructors" ON instructors FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Theoretical Classes: público pode ver ativas
CREATE POLICY "Theoretical classes are publicly viewable" ON theoretical_classes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage theoretical classes" ON theoretical_classes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Practical Classes: usuário vê apenas as próprias
CREATE POLICY "Users can view own practical classes" ON practical_classes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own practical classes" ON practical_classes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage practical classes" ON practical_classes FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Instructors can view assigned classes" ON practical_classes FOR SELECT USING (
  EXISTS (SELECT 1 FROM instructors WHERE user_id = auth.uid() AND id = practical_classes.instructor_id)
);

-- User Packages: usuário vê apenas os próprios
CREATE POLICY "Users can view own packages" ON user_packages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own packages" ON user_packages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage user packages" ON user_packages FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- User Progress: usuário vê/edita apenas o próprio
CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

-- Class Registrations: usuário vê/gerencia apenas as próprias
CREATE POLICY "Users can view own registrations" ON class_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own registrations" ON class_registrations FOR ALL USING (auth.uid() = user_id);

-- Settings: apenas admins
CREATE POLICY "Admins can manage settings" ON settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Settings are publicly viewable" ON settings FOR SELECT USING (true);

-- Payments: usuário vê apenas os próprios, admins veem todos
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ===========================================
-- Funções e Triggers para Contadores de Aulas
-- ===========================================

-- Função para incrementar horas práticas usadas
CREATE OR REPLACE FUNCTION increment_practical_hours()
RETURNS TRIGGER AS $$
DECLARE
  hours_to_add DECIMAL(10,2);
BEGIN
  -- Se status mudou para 'completed' e antes não era 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Converter minutos para horas (arredondar para 2 casas decimais)
    hours_to_add := ROUND(NEW.duration_minutes::DECIMAL / 60.0, 2);
    
    -- Atualizar user_packages
    UPDATE user_packages
    SET practical_hours_used = practical_hours_used + hours_to_add
    WHERE user_id = NEW.user_id
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > NOW());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_practical_hours
  AFTER UPDATE ON practical_classes
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed'))
  EXECUTE FUNCTION increment_practical_hours();

-- Função para incrementar aulas teóricas usadas
CREATE OR REPLACE FUNCTION increment_theoretical_classes()
RETURNS TRIGGER AS $$
BEGIN
  -- Se attended mudou de false para true
  IF NEW.attended = true AND (OLD.attended IS NULL OR OLD.attended = false) THEN
    -- Incrementar contador
    UPDATE user_packages
    SET theoretical_classes_used = theoretical_classes_used + 1
    WHERE user_id = NEW.user_id
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > NOW());
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_theoretical_classes
  AFTER UPDATE ON class_registrations
  FOR EACH ROW
  WHEN (NEW.attended = true AND (OLD.attended IS NULL OR OLD.attended = false))
  EXECUTE FUNCTION increment_theoretical_classes();

-- Função para validar limites antes de agendar aula prática
CREATE OR REPLACE FUNCTION validate_practical_class_limits()
RETURNS TRIGGER AS $$
DECLARE
  user_pkg RECORD;
  hours_available DECIMAL(10,2);
  hours_needed DECIMAL(10,2);
BEGIN
  -- Buscar pacote ativo do usuário
  SELECT 
    p.practical_hours,
    up.practical_hours_used,
    up.status,
    up.expires_at
  INTO user_pkg
  FROM user_packages up
  JOIN packages p ON p.id = up.package_id
  WHERE up.user_id = NEW.user_id
    AND up.status = 'active'
    AND (up.expires_at IS NULL OR up.expires_at > NOW())
  ORDER BY up.purchased_at DESC
  LIMIT 1;
  
  -- Se não tem pacote ativo, verificar se requer pagamento
  IF user_pkg IS NULL THEN
    -- Verificar se a etapa requer pagamento
    IF EXISTS (
      SELECT 1 FROM steps s 
      WHERE s.id = NEW.step_id 
      AND s.requires_payment = true
    ) THEN
      RAISE EXCEPTION 'Este tipo de aula requer um pacote ativo. Por favor, adquira um pacote primeiro.';
    END IF;
    RETURN NEW;
  END IF;
  
  -- Calcular horas disponíveis
  hours_available := (user_pkg.practical_hours::DECIMAL - COALESCE(user_pkg.practical_hours_used, 0));
  hours_needed := ROUND(NEW.duration_minutes::DECIMAL / 60.0, 2);
  
  -- Verificar se há horas suficientes
  IF hours_available < hours_needed THEN
    RAISE EXCEPTION 'Você não tem horas suficientes no seu pacote. Disponíveis: % horas, Necessárias: % horas', 
      hours_available, hours_needed;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_practical_class_limits
  BEFORE INSERT ON practical_classes
  FOR EACH ROW
  EXECUTE FUNCTION validate_practical_class_limits();

-- Função para validar limites antes de se inscrever em aula teórica
CREATE OR REPLACE FUNCTION validate_theoretical_class_limits()
RETURNS TRIGGER AS $$
DECLARE
  user_pkg RECORD;
  classes_available INTEGER;
BEGIN
  -- Buscar pacote ativo do usuário
  SELECT 
    p.theoretical_classes_included,
    up.theoretical_classes_used,
    up.status,
    up.expires_at
  INTO user_pkg
  FROM user_packages up
  JOIN packages p ON p.id = up.package_id
  WHERE up.user_id = NEW.user_id
    AND up.status = 'active'
    AND (up.expires_at IS NULL OR up.expires_at > NOW())
  ORDER BY up.purchased_at DESC
  LIMIT 1;
  
  -- Se não tem pacote ativo, verificar se requer pagamento
  IF user_pkg IS NULL THEN
    -- Verificar se a etapa requer pagamento
    IF EXISTS (
      SELECT 1 FROM theoretical_classes tc
      JOIN steps s ON s.id = tc.step_id
      WHERE tc.id = NEW.theoretical_class_id
      AND s.requires_payment = true
    ) THEN
      RAISE EXCEPTION 'Este tipo de aula requer um pacote ativo. Por favor, adquira um pacote primeiro.';
    END IF;
    RETURN NEW;
  END IF;
  
  -- Calcular aulas disponíveis
  classes_available := (user_pkg.theoretical_classes_included - COALESCE(user_pkg.theoretical_classes_used, 0));
  
  -- Verificar se há aulas suficientes
  IF classes_available <= 0 THEN
    RAISE EXCEPTION 'Você não tem aulas teóricas disponíveis no seu pacote.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_theoretical_class_limits
  BEFORE INSERT ON class_registrations
  FOR EACH ROW
  EXECUTE FUNCTION validate_theoretical_class_limits();

