# Migrações do Banco de Dados

Este diretório contém scripts de migração para atualizar o banco de dados incrementalmente.

## Como usar

Execute os scripts na ordem numérica (se houver numeração) ou conforme necessário:

1. Acesse o **SQL Editor** no painel do Supabase
2. Execute o conteúdo do arquivo de migração desejado
3. Verifique se não houve erros

## Migrações Disponíveis

### `add-payments-table.sql`
Adiciona a tabela `payments` e todas as estruturas relacionadas para controle de pagamentos via Stripe.

**Quando usar:**
- Se você já tem um banco de dados em produção e precisa adicionar suporte a pagamentos
- Se a tabela `payments` ainda não existe

**O que faz:**
- Cria a tabela `payments` com todas as colunas necessárias
- Adiciona a coluna `stripe_price_id` na tabela `packages`
- Cria índices para performance
- Configura triggers para `updated_at`
- Habilita RLS (Row Level Security) e cria políticas de acesso

**Nota:** Este script é idempotente (pode ser executado múltiplas vezes sem problemas) graças ao uso de `IF NOT EXISTS` e `IF NOT EXISTS` nos comandos.

## Script Principal Recomendado

### `../setup-payments.sql`
Script completo e recomendado para configurar a estrutura de pagamentos. Inclui:
- Criação da tabela `payments` com validações CHECK
- Todos os índices necessários (incluindo índice por data)
- Triggers e funções
- Políticas RLS completas
- Comentários de documentação
- Verificação automática ao final

**Recomendado:** Use este script ao invés do de migração se estiver configurando pela primeira vez ou quiser uma instalação mais robusta.

