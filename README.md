# HabilitaBrasil

Plataforma de apoio para obtenção da CNH (Carteira Nacional de Habilitação) com acompanhamento de instrutores especializados.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth, Database, RLS)
- **Lucide React** (Ícones)

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Supabase](https://supabase.com)

## 🔧 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um novo projeto no [Supabase](https://supabase.com)
2. Vá em **Settings > API** e copie:
   - Project URL
   - anon public key

3. Crie o arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui

# WhatsApp Support
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
NEXT_PUBLIC_WHATSAPP_MESSAGE=Olá! Preciso de ajuda com meu processo de habilitação.
```

### 3. Criar tabelas no Supabase

1. Acesse o **SQL Editor** no painel do Supabase
2. Execute o conteúdo do arquivo `supabase/schema.sql`
3. Execute o conteúdo do arquivo `supabase/seed.sql` para inserir dados iniciais

### 4. Criar usuário admin

Após se cadastrar como usuário normal, você precisa atualizar seu role para `admin`:

**Opção 1: Pelo email (mais fácil)**

1. Acesse o **SQL Editor** no painel do Supabase
2. Execute o seguinte SQL, substituindo `seu-email@exemplo.com` pelo seu email:

```sql
UPDATE profiles
SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'seu-email@exemplo.com'
);
```

**Opção 2: Pelo ID do usuário**

1. Vá em **Authentication > Users** no Supabase
2. Copie o **UUID** do seu usuário
3. Execute no SQL Editor:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'UUID_DO_SEU_USUARIO';
```

**Verificar se funcionou:**

```sql
SELECT id, name, email, role 
FROM profiles 
WHERE role = 'admin';
```

**⚠️ IMPORTANTE: Após atualizar o role para admin:**

1. **Faça logout** na aplicação (clique em "Sair")
2. **Faça login novamente** para atualizar a sessão
3. Acesse `/admin` - agora deve funcionar!

Se ainda não funcionar, verifique:
- O console do navegador (F12) para ver os logs de debug
- O terminal do servidor para ver os logs do middleware
- Execute o script `supabase/verificar-admin.sql` para confirmar que o role foi atualizado

Você também pode usar o arquivo `supabase/make-admin.sql` como referência.

### 5. Executar o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
/
├── app/                    # Pages (App Router)
│   ├── admin/              # Painel administrativo
│   │   ├── etapas/         # CRUD de etapas
│   │   ├── pacotes/        # CRUD de pacotes
│   │   ├── aulas-teoricas/ # Gestão de aulas teóricas
│   │   ├── aulas-praticas/ # Gestão de aulas práticas
│   │   ├── instrutores/    # CRUD de instrutores
│   │   └── configuracoes/  # Configurações gerais
│   ├── dashboard/          # Painel do usuário
│   ├── login/              # Login
│   ├── register/           # Registro
│   ├── como-funciona/      # Página Como Funciona
│   ├── pacotes/            # Página de Pacotes
│   └── faq/                # FAQ
├── components/
│   ├── dashboard/          # Componentes do dashboard
│   │   ├── StepCard.tsx    # Card de etapa (wrapper)
│   │   ├── StepLink.tsx    # Etapa tipo link
│   │   ├── StepTheoretical.tsx # Etapa aula teórica
│   │   ├── StepSimulation.tsx  # Etapa simulado
│   │   ├── StepPractical.tsx   # Etapa aula prática
│   │   └── WhatsAppButton.tsx  # Botão WhatsApp
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Seções da home
│   └── ui/                 # Componentes UI
├── hooks/                  # React Hooks
│   ├── useAuth.ts          # Autenticação
│   ├── usePackages.ts      # Pacotes
│   ├── useSteps.ts         # Etapas e progresso
│   ├── useTheoreticalClasses.ts # Aulas teóricas
│   ├── usePracticalClasses.ts   # Aulas práticas
│   └── useSettings.ts      # Configurações
├── lib/                    # Utilitários
│   ├── supabase.ts         # Cliente Supabase (browser)
│   └── supabase-server.ts  # Cliente Supabase (server)
├── types/
│   └── database.ts         # Types TypeScript
├── supabase/
│   ├── schema.sql          # Schema do banco
│   └── seed.sql            # Dados iniciais
└── middleware.ts           # Middleware de autenticação
```

## 🔐 Autenticação

A autenticação usa Supabase Auth com:

- **Login com e-mail/senha**
- **Registro com confirmação por e-mail**
- **Recuperação de senha**
- **Proteção de rotas** via middleware

### Roles

- `user` - Usuário comum
- `admin` - Acesso ao painel admin
- `instructor` - Instrutor (futuro)

## 📊 Tipos de Etapas

| Tipo | Descrição |
|------|-----------|
| `link` | Orientações e links externos |
| `theoretical_class` | Aulas teóricas com agendamento |
| `simulation` | Acesso a simulados |
| `practical` | Agendamento de aulas práticas |

## 🎯 Funcionalidades

### Usuário

- [x] Dashboard com progresso
- [x] Visualização de etapas
- [x] Inscrição em aulas teóricas
- [x] Agendamento de aulas práticas
- [x] Acesso a simulados
- [x] Suporte via WhatsApp (planos pagos)

### Admin

- [x] CRUD de pacotes
- [x] CRUD de etapas
- [x] Gestão de aulas teóricas
- [x] Gestão de aulas práticas
- [x] CRUD de instrutores
- [x] Configurações gerais

## 📝 Scripts

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm run start

# Lint
npm run lint
```

## 🔒 Row Level Security (RLS)

O Supabase está configurado com RLS para:

- Usuários só veem/editam seus próprios dados
- Pacotes e etapas ativos são públicos
- Apenas admins podem gerenciar dados

## 📄 Licença

MIT
