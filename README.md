# CRM Fermaquinas

Sistema de CRM customizado para Fermaquinas, desenvolvido com Nuxt 3, Vue 3, Tailwind CSS e Supabase.

## 🚀 Funcionalidades

- **Dashboard Interativo**: Visualização de dados em tempo real com gráficos
- **Gestão de Clientes**: CRUD completo para gerenciamento de clientes
- **Sistema de Vendas**: Controle de vendas e relatórios
- **Calendário**: Agendamentos e eventos importantes
- **Automação de Webhooks**: Sistema automatizado de notificações
- **Relatórios**: Análises detalhadas de performance
- **Autenticação**: Sistema seguro com Supabase Auth
- **Responsivo**: Interface adaptada para desktop e mobile

## 🛠️ Tecnologias

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Gráficos**: Chart.js + Vue-ChartJS
- **Autenticação**: Supabase Auth
- **Deploy**: Vercel/Netlify ready

## 📋 Pré-requisitos

- Node.js 18+ 
- npm/yarn/pnpm
- Conta no Supabase

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/loboczss/crm-fermaquinas.git
cd crm-fermaquinas
```

### 2. Instale as dependências

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NUXT_SUPABASE_URL=sua_supabase_url
NUXT_SUPABASE_KEY=sua_supabase_anon_key
NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL=sua_webhook_url
```

### 4. Configure o Supabase

Execute o script SQL fornecido (`supabase-function.sql`) no seu projeto Supabase para criar as tabelas necessárias.

## 🚀 Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 📦 Build para Produção

```bash
# Build
npm run build

# Preview local
npm run preview
```

## 📁 Estrutura do Projeto

```
crm-fermaquinas/
├── app/
│   ├── components/     # Componentes Vue reutilizáveis
│   ├── composables/    # Composables para lógica reativa
│   ├── pages/          # Páginas da aplicação
│   ├── types/          # Definições de tipos TypeScript
│   └── utils/          # Utilitários e helpers
├── server/
│   ├── api/            # Endpoints da API
│   ├── tasks/          # Tarefas automatizadas
│   └── utils/          # Utilitários do servidor
├── shared/
│   ├── constants/      # Constantes compartilhadas
│   └── types/          # Tipos compartilhados
└── public/             # Arquivos estáticos
```

## 🔧 Principais Funcionalidades

### Dashboard
- Gráficos de atendimentos em tempo real
- Cards de estatísticas importantes
- Calendário integrado
- Notificações automáticas

### Gestão de Clientes
- Lista completa de clientes
- Formulários de cadastro e edição
- Histórico de interações
- Filtros e busca avançada

### Sistema de Vendas
- Registro de vendas
- Relatórios de performance
- Gráficos de vendas por período
- Gestão de vendedores

### Automação
- Webhooks para aniversários
- Notificações de embarques
- Sistema de eventos automatizados
- Integração com sistemas externos

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato através do email: suporte@fermaquinas.com

---

Desenvolvido com ❤️ para Fermaquinas
