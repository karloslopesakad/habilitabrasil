-- ===========================================
-- HabilitaBrasil - Dados Iniciais (Seeds)
-- Execute após o schema.sql
-- ===========================================

-- ===========================================
-- Pacotes
-- ===========================================
INSERT INTO packages (name, slug, price, description, features, practical_hours, theoretical_classes_included, simulations_included, has_whatsapp_support, has_instructor_support, is_highlighted, highlight_label, display_order) VALUES
(
  'Free',
  'free',
  0,
  'Plataforma com passo a passo completo',
  '["Passo a passo detalhado", "Etapas do processo explicadas", "Links de apoio oficiais", "Acesso à plataforma"]',
  0, 0, 0, false, false, false, NULL, 1
),
(
  'Básico',
  'basico',
  97,
  'Tudo do Free + consultoria e suporte',
  '["Tudo do pacote Free", "Consultoria pela plataforma", "Auxílio com documentação", "Acesso a aulas gravadas", "Suporte por chat"]',
  0, 0, 0, true, true, false, NULL, 2
),
(
  'B2',
  'b2',
  197,
  'Preparação completa para prova teórica',
  '["Tudo do pacote Básico", "1 aula agendada para prova teórica", "Simulado interativo", "1 aula de reforço", "Material de estudo exclusivo"]',
  0, 2, 5, true, true, true, 'Mais Popular', 3
),
(
  'Driver',
  'driver',
  497,
  'Inclui aulas práticas obrigatórias',
  '["Tudo do pacote B2", "2 aulas práticas obrigatórias", "Instrutor qualificado", "Acompanhamento personalizado"]',
  2, 2, 5, true, true, false, NULL, 4
),
(
  'Driver +10',
  'driver-plus-10',
  997,
  'Pacote completo com aulas extras',
  '["Tudo do pacote B2", "8 aulas práticas de direção", "Preparação intensiva", "Garantia de aprovação*"]',
  10, 2, 10, true, true, false, NULL, 5
),
(
  'Driver Auto',
  'driver-auto',
  597,
  'Aulas práticas em carro automático',
  '["Tudo do pacote B2", "Aulas em veículo automático", "Instrutor especializado", "Ideal para iniciantes"]',
  2, 2, 5, true, true, false, 'Diferencial', 6
);

-- ===========================================
-- Etapas
-- ===========================================
INSERT INTO steps (type, title, subtitle, description, instructions, external_link, whatsapp_message, icon, display_order, requires_payment) VALUES
(
  'link',
  'Documentação Inicial',
  'Reúna os documentos necessários',
  'Primeira etapa do processo é garantir que você tenha toda a documentação em ordem.',
  'Você precisará dos seguintes documentos:\n\n• RG original e cópia\n• CPF\n• Comprovante de residência atualizado (últimos 3 meses)\n• Foto 3x4 recente com fundo branco\n\nCertifique-se de que todos os documentos estão legíveis e em dia. Faça cópias autenticadas quando necessário.',
  'https://www.gov.br/denatran/pt-br',
  'Olá! Preciso de ajuda com a documentação inicial para tirar minha CNH.',
  'FileText',
  1,
  false
),
(
  'link',
  'Exames Médicos e Psicológicos',
  'Agende seus exames em clínica credenciada',
  'Os exames médicos e psicológicos são obrigatórios para iniciar o processo de habilitação.',
  'Passos para realizar os exames:\n\n1. Busque uma clínica credenciada pelo DETRAN do seu estado\n2. Agende o exame médico (avaliação clínica e oftalmológica)\n3. Agende o exame psicológico (avaliação psicotécnica)\n4. Guarde os laudos - eles têm validade de 90 dias\n\nDica: Planeje bem o agendamento considerando a validade dos laudos.',
  'https://www.gov.br/denatran/pt-br',
  'Olá! Preciso de ajuda para encontrar clínicas credenciadas para os exames médicos.',
  'Stethoscope',
  2,
  false
),
(
  'link',
  'Abertura do Processo no DETRAN',
  'Cadastro e pagamento das taxas',
  'Faça seu cadastro no DETRAN e pague as taxas iniciais para dar início oficial ao processo.',
  'Como abrir o processo:\n\n1. Acesse o portal do DETRAN do seu estado\n2. Faça o cadastro como candidato a CNH\n3. Preencha todos os dados solicitados\n4. Gere o boleto das taxas iniciais\n5. Efetue o pagamento e aguarde a confirmação\n\nApós a confirmação, você receberá o RENACH (número de registro).',
  'https://www.gov.br/denatran/pt-br',
  'Olá! Preciso de ajuda para abrir meu processo no DETRAN.',
  'Building',
  3,
  false
),
(
  'theoretical_class',
  'Curso Teórico',
  '45 horas de aulas obrigatórias',
  'Complete o curso teórico de 45 horas/aula. Oferecemos aulas ao vivo e focadas na prova.',
  'O curso teórico aborda os seguintes conteúdos:\n\n• Legislação de Trânsito (18h)\n• Direção Defensiva (16h)\n• Primeiros Socorros (4h)\n• Meio Ambiente e Cidadania (4h)\n• Noções de Mecânica (3h)\n\nNossas aulas são focadas no que realmente cai na prova!',
  NULL,
  'Olá! Gostaria de agendar minhas aulas teóricas.',
  'BookOpen',
  4,
  true
),
(
  'simulation',
  'Simulados Preparatórios',
  'Teste seus conhecimentos',
  'Realize simulados no formato oficial do DETRAN para avaliar sua preparação.',
  'Como usar os simulados:\n\n1. Acesse nossa plataforma de simulados\n2. Escolha o tipo de prova (por categoria ou completa)\n3. Responda as 30 questões no tempo estipulado\n4. Confira seu resultado e as questões que errou\n5. Refaça quantas vezes precisar até se sentir preparado\n\nDica: Você precisa acertar pelo menos 21 questões (70%) para ser aprovado.',
  '/simulados',
  'Olá! Tenho dúvidas sobre os simulados.',
  'FileCheck',
  5,
  true
),
(
  'link',
  'Prova Teórica',
  'Agendamento e realização da prova',
  'Após completar o curso teórico, agende sua prova no DETRAN.',
  'Informações sobre a prova:\n\n• 30 questões de múltipla escolha\n• Tempo: aproximadamente 60 minutos\n• Aprovação: mínimo 21 acertos (70%)\n• Leve documento de identidade original\n• Chegue com antecedência ao local\n\nSe reprovar, pode refazer após 15 dias.',
  'https://www.gov.br/denatran/pt-br',
  'Olá! Preciso de ajuda para agendar minha prova teórica.',
  'GraduationCap',
  6,
  false
),
(
  'practical',
  'Aulas Práticas',
  'Aprenda a dirigir com instrutores licenciados',
  'Após aprovação na prova teórica, inicie as aulas práticas de direção.',
  'Sobre as aulas práticas:\n\n• Mínimo obrigatório: 2 aulas (conforme nova legislação)\n• Recomendamos mais aulas se não se sentir confiante\n• Aulas com instrutores licenciados e credenciados\n• Veículos manual ou automático disponíveis\n• Horários flexíveis para agendamento',
  NULL,
  'Olá! Gostaria de agendar minhas aulas práticas de direção.',
  'Car',
  7,
  true
),
(
  'link',
  'Prova Prática',
  'Demonstre suas habilidades',
  'A última etapa! Realize a prova prática de direção no DETRAN.',
  'O que será avaliado na prova:\n\n• Verificações iniciais do veículo\n• Habilidades de direção em percurso\n• Estacionamento (baliza)\n• Respeito às leis de trânsito\n• Controle do veículo\n\nSe aprovado, receberá a CNH provisória (PPD) válida por 1 ano.',
  'https://www.gov.br/denatran/pt-br',
  'Olá! Preciso de ajuda para me preparar para a prova prática.',
  'CheckCircle',
  8,
  false
);

-- ===========================================
-- Instrutores de Exemplo
-- ===========================================
INSERT INTO instructors (name, phone, whatsapp, email, specialization, vehicle_types, bio) VALUES
(
  'Carlos Silva',
  '11999999991',
  '5511999999991',
  'carlos@habilitabrasil.com',
  'Aulas práticas - Manual e Automático',
  '{manual, automatic}',
  'Instrutor certificado com mais de 10 anos de experiência. Especialista em ensinar iniciantes com paciência e dedicação.'
),
(
  'Maria Santos',
  '11999999992',
  '5511999999992',
  'maria@habilitabrasil.com',
  'Aulas teóricas e práticas',
  '{manual}',
  'Instrutora e professora de legislação de trânsito. Abordagem didática focada na aprovação.'
);

-- ===========================================
-- Configurações
-- ===========================================
INSERT INTO settings (key, value, description) VALUES
(
  'whatsapp_support',
  '{"number": "5511999999999", "default_message": "Olá! Preciso de ajuda com meu processo de habilitação no HabilitaBrasil."}',
  'Configurações do WhatsApp de suporte'
),
(
  'site_info',
  '{"name": "HabilitaBrasil", "tagline": "Seu caminho para a CNH começa aqui", "support_email": "suporte@habilitabrasil.com"}',
  'Informações gerais do site'
);


