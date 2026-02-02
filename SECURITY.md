# Política de Segurança

## Versões Suportadas

Atualmente, as seguintes versões do CRM Fermaquinas recebem atualizações de segurança:

| Versão | Suportada          |
| ------ | ------------------ |
| 1.x.x  | :white_check_mark: |

## Reportando uma Vulnerabilidade

A segurança do CRM Fermaquinas é uma prioridade. Se você descobrir uma vulnerabilidade de segurança, por favor, siga estas diretrizes:

### Como Reportar

1. **NÃO** abra uma issue pública no GitHub
2. Envie um email para: security@fermaquinas.com
3. Inclua o máximo de informações possível:
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir o problema
   - Versão afetada
   - Impacto potencial
   - Sugestões de correção (se houver)

### O que Esperar

- **Confirmação**: Responderemos em até 48 horas
- **Avaliação**: Avaliaremos a vulnerabilidade em até 7 dias
- **Correção**: Trabalharemos para corrigir vulnerabilidades críticas em até 30 dias
- **Divulgação**: Coordenaremos a divulgação pública após a correção

### Processo de Divulgação Responsável

1. Você reporta a vulnerabilidade privadamente
2. Confirmamos e avaliamos o problema
3. Desenvolvemos e testamos uma correção
4. Lançamos a correção
5. Divulgamos publicamente os detalhes (com créditos apropriados)

## Práticas de Segurança

### Para Desenvolvedores

- **Autenticação**: Use sempre o sistema de autenticação do Supabase
- **Autorização**: Verifique permissões em todas as operações
- **Validação**: Valide todas as entradas do usuário
- **Sanitização**: Sanitize dados antes de armazenar ou exibir
- **HTTPS**: Use sempre conexões seguras em produção
- **Secrets**: Nunca commite chaves ou senhas no código

### Para Usuários

- **Senhas Fortes**: Use senhas complexas e únicas
- **2FA**: Ative autenticação de dois fatores quando disponível
- **Atualizações**: Mantenha o sistema sempre atualizado
- **Logs**: Monitore logs de acesso regularmente
- **Backup**: Faça backups regulares dos dados

## Configurações de Segurança Recomendadas

### Supabase
```sql
-- Habilitar RLS (Row Level Security)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso
CREATE POLICY "Users can only see their own data" ON clientes
  FOR ALL USING (auth.uid() = user_id);
```

### Variáveis de Ambiente
```env
# Use chaves específicas para cada ambiente
NUXT_SUPABASE_URL=https://your-project.supabase.co
NUXT_SUPABASE_KEY=your-anon-key

# Configure URLs de webhook seguras
NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL=https://secure-webhook.com/birthday
```

### Headers de Segurança
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
        }
      }
    }
  }
})
```

## Auditoria de Segurança

### Ferramentas Recomendadas
- **npm audit**: Para vulnerabilidades em dependências
- **Snyk**: Para análise contínua de segurança
- **OWASP ZAP**: Para testes de penetração
- **Lighthouse**: Para auditoria de segurança web

### Checklist de Segurança
- [ ] Todas as dependências estão atualizadas
- [ ] RLS está habilitado no Supabase
- [ ] Políticas de acesso estão configuradas
- [ ] Headers de segurança estão implementados
- [ ] Validação de entrada está funcionando
- [ ] Logs de segurança estão sendo monitorados
- [ ] Backup e recuperação estão testados

## Contato

Para questões de segurança:
- **Email**: security@fermaquinas.com
- **PGP Key**: [Disponível mediante solicitação]

Para outras questões:
- **Suporte Geral**: suporte@fermaquinas.com
- **Issues Públicas**: [GitHub Issues](https://github.com/loboczss/crm-fermaquinas/issues)

---

Obrigado por ajudar a manter o CRM Fermaquinas seguro! 🔒