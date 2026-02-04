-- ===========================================
-- Script para importar questões de simulado
-- Execute este SQL no SQL Editor do Supabase
-- ===========================================

-- Limpar questões existentes (opcional - descomente se quiser recriar)
-- DELETE FROM simulation_questions;

-- Inserir questões do JSON
-- Nota: Convertendo o formato de array para objeto JSONB com chaves A, B, C, D
-- Se a tabela não aceitar IDs customizados, remova a coluna 'id' dos INSERTs
INSERT INTO simulation_questions (question, options, correct_answer, category, explanation, difficulty) VALUES
('Qual a velocidade máxima permitida para veículos automotores em vias urbanas, salvo quando sinalização indicar outra velocidade?', '{"A": "60 km/h", "B": "80 km/h", "C": "100 km/h", "D": "120 km/h"}'::jsonb, 'A', 'legislacao', 'Em vias urbanas, a velocidade máxima permitida é de 60 km/h, exceto quando sinalização indicar outra velocidade.', 'easy'),
('O condutor que estiver habilitado na categoria B pode conduzir:', '{"A": "Apenas veículos de passeio", "B": "Veículos de passeio e motocicletas", "C": "Veículos de passeio e caminhões leves", "D": "Apenas veículos automotores de duas rodas"}'::jsonb, 'A', 'legislacao', 'A categoria B permite conduzir veículos de passeio, com peso bruto total de até 3.500 kg e lotação de até 8 lugares.', 'medium'),
('Qual a distância mínima que deve ser mantida entre veículos em movimento?', '{"A": "Metade da velocidade em metros", "B": "Velocidade em metros", "C": "O dobro da velocidade em metros", "D": "Não há distância mínima obrigatória"}'::jsonb, 'A', 'direcao_defensiva', 'A distância mínima entre veículos deve ser de pelo menos metade da velocidade em metros. Ex: a 60 km/h, manter pelo menos 30 metros.', 'medium'),
('Em caso de acidente com vítima, a primeira ação do condutor deve ser:', '{"A": "Remover a vítima do local", "B": "Sinalizar o local do acidente", "C": "Ligar para a emergência (193 ou 190)", "D": "Tentar reanimar a vítima"}'::jsonb, 'C', 'primeiros_socorros', 'A primeira ação deve ser ligar para os serviços de emergência (SAMU 193 ou Polícia 190) e sinalizar o local.', 'easy'),
('O que significa a placa de regulamentação R-1?', '{"A": "Proibido estacionar", "B": "Proibido parar", "C": "Proibido ultrapassar", "D": "Velocidade máxima permitida"}'::jsonb, 'B', 'legislacao', 'A placa R-1 significa ''Proibido parar'', ou seja, não é permitido parar o veículo no local.', 'easy'),
('Qual a distância mínima para ultrapassagem segura?', '{"A": "50 metros de visibilidade", "B": "100 metros de visibilidade", "C": "200 metros de visibilidade", "D": "300 metros de visibilidade"}'::jsonb, 'C', 'direcao_defensiva', 'Para ultrapassagem segura, é necessário ter pelo menos 200 metros de visibilidade à frente.', 'medium'),
('Em caso de queimadura, o que NÃO deve ser feito?', '{"A": "Aplicar água corrente fria", "B": "Remover roupas grudadas na pele", "C": "Aplicar pomadas ou cremes", "D": "Cobrir com pano limpo"}'::jsonb, 'C', 'primeiros_socorros', 'Não se deve aplicar pomadas, cremes ou qualquer substância em queimaduras. Apenas água corrente fria e cobrir com pano limpo.', 'medium'),
('O que significa a cor amarela no semáforo?', '{"A": "Atenção, prepare-se para parar", "B": "Pode passar com segurança", "C": "Parar obrigatoriamente", "D": "Acelerar para passar"}'::jsonb, 'A', 'legislacao', 'O amarelo significa atenção, o condutor deve parar, salvo se não puder fazê-lo com segurança.', 'easy'),
('Qual a principal causa de acidentes de trânsito?', '{"A": "Falhas mecânicas", "B": "Condições da via", "C": "Fator humano", "D": "Condições climáticas"}'::jsonb, 'C', 'direcao_defensiva', 'O fator humano (desatenção, imprudência, embriaguez) é a principal causa de acidentes de trânsito.', 'easy'),
('O que fazer em caso de vítima inconsciente sem respiração?', '{"A": "Aguardar a ambulância", "B": "Iniciar massagem cardíaca imediatamente", "C": "Virar a vítima de lado", "D": "Dar água para a vítima"}'::jsonb, 'B', 'primeiros_socorros', 'Em caso de parada cardiorrespiratória, deve-se iniciar imediatamente a massagem cardíaca (RCP) enquanto aguarda socorro.', 'hard'),
('Qual a velocidade máxima em rodovias para veículos de passeio?', '{"A": "80 km/h", "B": "100 km/h", "C": "110 km/h", "D": "120 km/h"}'::jsonb, 'C', 'legislacao', 'Em rodovias, a velocidade máxima para veículos de passeio é de 110 km/h, salvo sinalização indicando outra velocidade.', 'easy'),
('O que é direção defensiva?', '{"A": "Dirigir devagar sempre", "B": "Conjunto de medidas para prevenir acidentes", "C": "Ultrapassar com cuidado", "D": "Respeitar apenas os sinais de trânsito"}'::jsonb, 'B', 'direcao_defensiva', 'Direção defensiva é o conjunto de medidas e procedimentos utilizados para prevenir ou minimizar as consequências dos acidentes de trânsito.', 'easy'),
('Qual o tempo de validade da CNH para condutores até 50 anos?', '{"A": "3 anos", "B": "5 anos", "C": "10 anos", "D": "15 anos"}'::jsonb, 'C', 'legislacao', 'A CNH tem validade de 10 anos para condutores até 50 anos de idade.', 'easy'),
('O que fazer ao encontrar um acidente de trânsito?', '{"A": "Parar e ajudar imediatamente", "B": "Sinalizar o local e chamar socorro", "C": "Continuar o trajeto", "D": "Tirar fotos e seguir"}'::jsonb, 'B', 'primeiros_socorros', 'Ao encontrar um acidente, deve-se sinalizar o local para evitar novos acidentes e chamar os serviços de emergência.', 'easy'),
('Qual a função do sistema de freios ABS?', '{"A": "Aumentar a distância de frenagem", "B": "Evitar o travamento das rodas", "C": "Melhorar a aceleração", "D": "Reduzir o consumo de combustível"}'::jsonb, 'B', 'mecanica', 'O ABS (Anti-lock Braking System) evita o travamento das rodas durante a frenagem, mantendo a dirigibilidade do veículo.', 'medium'),
('Em vias com velocidade máxima de 80 km/h, qual a distância mínima entre veículos?', '{"A": "20 metros", "B": "40 metros", "C": "60 metros", "D": "80 metros"}'::jsonb, 'B', 'direcao_defensiva', 'A distância mínima é metade da velocidade em metros. A 80 km/h, deve-se manter pelo menos 40 metros.', 'medium'),
('O que significa a placa de advertência A-1?', '{"A": "Curva à direita", "B": "Curva à esquerda", "C": "Curva sinuosa", "D": "Intersecção em T"}'::jsonb, 'A', 'legislacao', 'A placa A-1 indica curva à direita à frente, alertando o condutor para reduzir a velocidade.', 'easy'),
('Qual a pressão ideal dos pneus?', '{"A": "A indicada pelo fabricante do veículo", "B": "Sempre 30 PSI", "C": "Quanto mais alta melhor", "D": "Não importa a pressão"}'::jsonb, 'A', 'mecanica', 'A pressão dos pneus deve ser a indicada pelo fabricante do veículo, geralmente encontrada no manual ou na porta do motorista.', 'easy'),
('O que fazer ao avistar um veículo de emergência com sirene ligada?', '{"A": "Acelerar para sair da frente", "B": "Parar imediatamente onde estiver", "C": "Encostar à direita e parar", "D": "Continuar normalmente"}'::jsonb, 'C', 'legislacao', 'Ao avistar veículo de emergência, deve-se encostar à direita e parar, facilitando a passagem.', 'easy'),
('Qual a importância da manutenção preventiva do veículo?', '{"A": "Apenas economizar dinheiro", "B": "Garantir segurança e evitar acidentes", "C": "Satisfazer a garantia", "D": "Não tem importância"}'::jsonb, 'B', 'mecanica', 'A manutenção preventiva é essencial para garantir a segurança do veículo e evitar acidentes causados por falhas mecânicas.', 'easy')
-- ON CONFLICT só funciona se houver constraint única
-- Se quiser evitar duplicatas, adicione uma constraint única na coluna question
-- ou remova esta linha se não precisar de upsert

-- Verificar se as questões foram inseridas
SELECT COUNT(*) as total_questoes FROM simulation_questions;

