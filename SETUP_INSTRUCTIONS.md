# 🚀 Instruções de Setup - CRM Fermaquinas

## ✅ O que foi feito

Seu projeto foi adaptado com sucesso para o repositório `crm-fermaquinas`. As seguintes mudanças foram realizadas:

### 📝 Atualizações de Branding
- ✅ Nome do projeto alterado de `crm-eva` para `crm-fermaquinas`
- ✅ Configurações do Nuxt atualizadas com nova identidade
- ✅ Meta tags e SEO configurados para Fermaquinas
- ✅ URLs de exemplo atualizadas

### 📚 Documentação Criada
- ✅ **README.md** - Documentação completa do projeto
- ✅ **CONTRIBUTING.md** - Guia para contribuidores
- ✅ **DEPLOYMENT.md** - Instruções de deploy
- ✅ **SECURITY.md** - Políticas de segurança
- ✅ **CHANGELOG.md** - Histórico de versões
- ✅ **LICENSE** - Licença MIT

### 🛠️ Configurações de Desenvolvimento
- ✅ **.env.example** - Template de variáveis de ambiente
- ✅ **scripts/setup.js** - Script automatizado de configuração
- ✅ **.vscode/** - Configurações do VS Code
- ✅ **.github/workflows/ci.yml** - Pipeline de CI/CD

### 🔧 Git e Repositório
- ✅ Repositório Git inicializado
- ✅ Primeiro commit realizado
- ✅ Remote configurado para `https://github.com/loboczss/crm-fermaquinas.git`

## 🎯 Próximos Passos

### 1. Criar o Repositório no GitHub
```bash
# Acesse https://github.com/new
# Nome: crm-fermaquinas
# Descrição: Sistema de CRM customizado para Fermaquinas
# Público ou Privado (sua escolha)
# NÃO inicialize com README, .gitignore ou LICENSE (já temos)
```

### 2. Fazer Push do Código
```bash
git push -u origin main
```

### 3. Configurar o Projeto Localmente
```bash
# Execute o script de setup
npm run setup

# Ou manualmente:
npm install
cp .env.example .env
# Edite o .env com suas configurações
```

### 4. Configurar Supabase
1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script `supabase-function.sql` no SQL Editor
3. Configure as variáveis no `.env`:
   ```env
   NUXT_SUPABASE_URL=https://seu-projeto.supabase.co
   NUXT_SUPABASE_KEY=sua-chave-anon
   ```

### 5. Testar Localmente
```bash
npm run dev
```

### 6. Deploy (Opcional)
- **Vercel**: Conecte o repositório GitHub
- **Netlify**: Importe o projeto
- **Outros**: Veja `DEPLOYMENT.md`

## 📋 Checklist de Verificação

- [ ] Repositório criado no GitHub
- [ ] Código enviado com `git push`
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Supabase configurado
- [ ] Projeto rodando localmente (`npm run dev`)
- [ ] Deploy realizado (opcional)

## 🆘 Problemas Comuns

### Erro ao fazer push
```bash
# Se o repositório já existir no GitHub:
git push --force origin main
```

### Erro de dependências
```bash
# Limpe o cache e reinstale:
rm -rf node_modules package-lock.json
npm install
```

### Erro de Supabase
- Verifique se as URLs e chaves estão corretas no `.env`
- Confirme se o script SQL foi executado
- Teste a conexão no Supabase Dashboard

## 📞 Suporte

- **Documentação**: Veja os arquivos `.md` na raiz do projeto
- **Issues**: Use o sistema de issues do GitHub
- **Email**: suporte@fermaquinas.com

---

🎉 **Parabéns!** Seu CRM Fermaquinas está pronto para uso!