# Contribuindo para o CRM Fermaquinas

Obrigado por considerar contribuir para o CRM Fermaquinas! Este documento fornece diretrizes para contribuições.

## 🤝 Como Contribuir

### 1. Fork e Clone
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/crm-fermaquinas.git
cd crm-fermaquinas

# Adicione o repositório original como upstream
git remote add upstream https://github.com/loboczss/crm-fermaquinas.git
```

### 2. Configuração do Ambiente
```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev
```

### 3. Criando uma Branch
```bash
# Crie uma branch para sua feature/fix
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

## 📝 Padrões de Código

### Convenções de Nomenclatura
- **Componentes**: PascalCase (`UserProfile.vue`)
- **Composables**: camelCase com prefixo `use` (`useAuth.ts`)
- **Utilitários**: camelCase (`formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

### Estrutura de Componentes Vue
```vue
<template>
  <!-- Template limpo e semântico -->
</template>

<script setup lang="ts">
// Imports
// Props/Emits
// Composables
// Reactive data
// Computed
// Methods
// Lifecycle hooks
</script>

<style scoped>
/* Estilos específicos do componente */
</style>
```

### TypeScript
- Use tipos explícitos sempre que possível
- Evite `any`, prefira `unknown` quando necessário
- Crie interfaces para objetos complexos
- Use enums para constantes relacionadas

## 🧪 Testes

### Executando Testes
```bash
# Testes unitários (quando implementados)
npm run test

# Testes de tipo
npm run build
```

### Escrevendo Testes
- Teste funcionalidades críticas
- Use nomes descritivos para os testes
- Mantenha testes simples e focados

## 📋 Processo de Pull Request

### 1. Antes de Submeter
- [ ] Código segue os padrões estabelecidos
- [ ] Funcionalidade foi testada localmente
- [ ] Documentação foi atualizada (se necessário)
- [ ] Commit messages são claros e descritivos

### 2. Commit Messages
Use o padrão Conventional Commits:

```
tipo(escopo): descrição

feat(auth): adiciona autenticação com Google
fix(dashboard): corrige erro no carregamento de gráficos
docs(readme): atualiza instruções de instalação
style(components): ajusta espaçamento dos cards
refactor(api): reorganiza estrutura dos endpoints
test(utils): adiciona testes para formatadores
```

### 3. Submissão
```bash
# Commit suas mudanças
git add .
git commit -m "feat(feature): descrição da mudança"

# Push para sua branch
git push origin feature/nome-da-feature

# Abra um Pull Request no GitHub
```

### 4. Template de PR
```markdown
## Descrição
Breve descrição das mudanças realizadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Resultado esperado

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes passam localmente
- [ ] Documentação atualizada
- [ ] PR tem título descritivo
```

## 🐛 Reportando Bugs

### Template de Issue
```markdown
**Descrição do Bug**
Descrição clara e concisa do bug.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**
- OS: [ex: Windows 10]
- Browser: [ex: Chrome 91]
- Versão: [ex: 1.0.0]
```

## 💡 Sugerindo Features

### Template de Feature Request
```markdown
**Descrição da Feature**
Descrição clara da funcionalidade desejada.

**Problema que Resolve**
Qual problema esta feature resolve?

**Solução Proposta**
Como você imagina que isso deveria funcionar?

**Alternativas Consideradas**
Outras soluções que você considerou?
```

## 📚 Recursos Úteis

### Documentação
- [Nuxt 3 Docs](https://nuxt.com/docs)
- [Vue 3 Docs](https://vuejs.org/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Ferramentas Recomendadas
- **IDE**: VS Code com extensões Vue/Nuxt
- **Git GUI**: GitKraken, SourceTree, ou GitHub Desktop
- **API Testing**: Postman ou Insomnia
- **Database**: Supabase Dashboard

## 🎯 Áreas que Precisam de Ajuda

- [ ] Testes automatizados
- [ ] Documentação de componentes
- [ ] Otimização de performance
- [ ] Acessibilidade (a11y)
- [ ] Internacionalização (i18n)
- [ ] PWA features

## 📞 Contato

- **Issues**: Use o sistema de issues do GitHub
- **Discussões**: Use as Discussions do GitHub
- **Email**: suporte@fermaquinas.com

---

Obrigado por contribuir! 🚀