# Guia de Deploy - CRM Fermaquinas

Este documento descreve como fazer o deploy do CRM Fermaquinas em diferentes plataformas.

## 🚀 Deploy na Vercel (Recomendado)

### 1. Preparação
1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com) e conecte sua conta GitHub
3. Importe o repositório `crm-fermaquinas`

### 2. Configuração de Variáveis de Ambiente
No painel da Vercel, adicione as seguintes variáveis:

```
NUXT_SUPABASE_URL=https://your-project.supabase.co
NUXT_SUPABASE_KEY=your-anon-key
NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL=https://your-webhook-url.com/birthday
NUXT_PUBLIC_WEBHOOK_EMBARQUE_URL=https://your-webhook-url.com/embarque
```

### 3. Deploy
- A Vercel detectará automaticamente que é um projeto Nuxt
- O deploy será feito automaticamente a cada push na branch main

## 🌐 Deploy na Netlify

### 1. Configuração
1. Conecte seu repositório GitHub à Netlify
2. Configure o build command: `npm run build`
3. Configure o publish directory: `.output/public`

### 2. Variáveis de Ambiente
Adicione as mesmas variáveis de ambiente no painel da Netlify.

### 3. Configuração de Redirects
Crie um arquivo `_redirects` na pasta `public/`:

```
/*    /index.html   200
```

## 🐳 Deploy com Docker

### 1. Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
```

### 2. Docker Compose
```yaml
version: '3.8'
services:
  crm-fermaquinas:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NUXT_SUPABASE_URL=${NUXT_SUPABASE_URL}
      - NUXT_SUPABASE_KEY=${NUXT_SUPABASE_KEY}
      - NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL=${NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL}
```

## ☁️ Deploy na AWS

### 1. AWS Amplify
1. Conecte o repositório GitHub
2. Configure as variáveis de ambiente
3. Build settings serão detectados automaticamente

### 2. AWS EC2
1. Configure uma instância EC2 com Node.js
2. Clone o repositório
3. Configure PM2 para gerenciamento de processos:

```bash
npm install -g pm2
npm run build
pm2 start .output/server/index.mjs --name crm-fermaquinas
```

## 🔧 Configurações Pós-Deploy

### 1. Domínio Customizado
- Configure seu domínio personalizado na plataforma escolhida
- Atualize as URLs no `nuxt.config.ts` se necessário

### 2. SSL/HTTPS
- A maioria das plataformas fornece SSL automático
- Para deploys customizados, configure Let's Encrypt

### 3. Monitoramento
- Configure alertas de uptime
- Monitore logs de erro
- Configure analytics se necessário

## 🔍 Troubleshooting

### Problemas Comuns

1. **Erro de Build**: Verifique se todas as dependências estão instaladas
2. **Variáveis de Ambiente**: Confirme se todas as variáveis estão configuradas
3. **Supabase Connection**: Verifique se as URLs e chaves estão corretas
4. **CORS Issues**: Configure as origens permitidas no Supabase

### Logs Úteis
```bash
# Verificar logs do build
npm run build

# Verificar logs em produção (se usando PM2)
pm2 logs crm-fermaquinas
```

## 📊 Performance

### Otimizações Recomendadas
- Configure CDN para assets estáticos
- Ative compressão gzip/brotli
- Configure cache headers apropriados
- Monitore Core Web Vitals

### Métricas Importantes
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)