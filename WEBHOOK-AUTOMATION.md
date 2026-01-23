# Sistema de Automação de Webhooks

## Configuração

### URL do Webhook
Todos os eventos utilizam o mesmo endpoint:
```
https://eva.evastur.cloud/webhook/datas
```

Configurado no arquivo `.env`:
```env
NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL=https://eva.evastur.cloud/webhook/datas
```

## Eventos Disponíveis

### 1. Aniversário Hoje (`aniversario_hoje`)
Envia dados de clientes que fazem aniversário no dia atual.

**Dados enviados:**
```json
{
  "tipo_evento": "aniversario_hoje",
  "nome": "Nome do Cliente",
  "data_aniversario": "2000-01-23",
  "contato_id": "uuid-do-contato",
  "data_referencia": "2026-01-23"
}
```

### 2. Aniversário Amanhã (`aniversario_amanha`)
Envia dados de clientes que fazem aniversário no dia seguinte.

**Dados enviados:**
```json
{
  "tipo_evento": "aniversario_amanha",
  "nome": "Nome do Cliente",
  "data_aniversario": "2000-01-24",
  "contato_id": "uuid-do-contato",
  "data_referencia": "2026-01-24"
}
```

### 3. Embarque Hoje (`embarque_hoje`)
Envia dados de vendas com embarque agendado para o dia atual.

**Dados enviados:**
```json
{
  "tipo_evento": "embarque_hoje",
  "nome": "Nome do Cliente",
  "data_embarque": "2026-01-23",
  "observacoes": "Pendências | Observação | Fornecedor",
  "fornecedor": "Nome do Fornecedor",
  "data_referencia": "2026-01-23"
}
```

### 4. Embarque D+1 (`embarque_d1`)
Envia dados de vendas com embarque agendado para o dia seguinte.

**Dados enviados:**
```json
{
  "tipo_evento": "embarque_d1",
  "nome": "Nome do Cliente",
  "data_embarque": "2026-01-24",
  "observacoes": "Pendências | Observação | Fornecedor",
  "fornecedor": "Nome do Fornecedor",
  "data_referencia": "2026-01-24"
}
```

## Como Funciona a Automação

### 1. Agendamento de Eventos
- Acesse a página de **Calendário** no CRM
- No card "Agendador de Webhooks", clique em "Novo Evento"
- Selecione o tipo de evento
- Defina o horário de execução (HH:MM)
- Salve o evento

### 2. Execução Automática
- O sistema verifica a cada **1 minuto** se há eventos agendados
- Quando o horário atual coincide com um evento agendado, ele é executado automaticamente
- Todos os registros correspondentes são enviados para o webhook

### 3. Timezone
- Todos os horários são processados no timezone **America/Sao_Paulo**
- Isso garante que os eventos sejam disparados no horário local do Brasil

## Estrutura Técnica

### Banco de Dados
Tabela `eventos_webhook`:
- `id`: Identificador único
- `nome_evento`: Tipo do evento (ex: 'aniversario_hoje')
- `horario_evento`: Horário de execução (formato HH:MM)
- `acao_evento`: Sempre 'webhook'
- `created_at`: Data de criação

### Scheduler
- **Arquivo**: `server/tasks/webhook-events.ts`
- **Frequência**: A cada 1 minuto (`*/1 * * * *`)
- **Fuso Horário**: America/Sao_Paulo

### Lógica de Disparo
- **Arquivo**: `server/utils/webhook-events.ts`
- Busca registros do Supabase
- Suporta paginação para grandes volumes de dados (até 10.000+ registros)
- Envia POST para o webhook com os dados formatados

## Gerenciamento via Interface

### Criar Evento
1. Vá para a página de Calendário
2. Clique em "Novo Evento" no card de Webhooks
3. Preencha os campos e salve

### Editar Evento
1. Clique no botão de editar (ícone de lápis)
2. Modifique os dados desejados
3. Salve as alterações

### Excluir Evento
1. Clique no botão de excluir (ícone de lixeira)
2. Confirme a exclusão

### Disparar Manualmente
1. Clique no botão "Disparar Agora" ao lado do evento
2. O webhook será acionado imediatamente, independente do horário agendado

## Logs e Monitoramento

Os logs de execução aparecem no console do servidor:
- Horário de verificação
- Eventos encontrados
- Quantidade de registros processados
- Erros (se houver)

Exemplo de log:
```
--- Scheduled Task: Webhook Events ---
Checking events for time: 08:00
Events executed: [
  { eventType: 'aniversario_hoje', triggered: 5 }
]
```

## Notas Importantes

1. **URL Único**: Todos os eventos usam o mesmo endpoint do webhook
2. **Identificação por Tipo**: Use o campo `tipo_evento` para diferenciar os eventos no webhook
3. **Execução Diária**: Os eventos são verificados e executados todos os dias no horário configurado
4. **Precisão**: O sistema verifica a cada minuto, então o evento será disparado no minuto exato configurado
5. **Volume de Dados**: O sistema suporta envio de milhares de registros usando paginação automática
