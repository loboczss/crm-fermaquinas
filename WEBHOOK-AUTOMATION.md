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
**Tabela**: `crm_evastur`  
**Condição**: Clientes que fazem aniversário no dia atual (busca por mês-dia na `data_nascimento`)

**Dados enviados para `https://eva.evastur.cloud/webhook/datas`:**
```json
{
  "tipo_evento": "aniversario_hoje",
  "nome": "Nome do Cliente",
  "contato_id": "uuid-do-contato",
  "data_nascimento": "2000-01-23",
  "data_referencia": "2026-01-23"
}
```

### 2. Aniversário Amanhã (`aniversario_amanha`)
**Tabela**: `crm_evastur`  
**Condição**: Clientes que fazem aniversário no dia seguinte

**Dados enviados para `https://eva.evastur.cloud/webhook/datas`:**
```json
{
  "tipo_evento": "aniversario_amanha",
  "nome": "Nome do Cliente",
  "contato_id": "uuid-do-contato",
  "data_nascimento": "2000-01-24",
  "data_referencia": "2026-01-24"
}
```

### 3. Embarque Hoje (`embarque_hoje`)
**Tabela**: `historico_vendas_evastur`  
**Condição**: Vendas com `embarque` agendado para o dia atual

**Dados enviados para `https://eva.evastur.cloud/webhook/datas`:**
```json
{
  "tipo_evento": "embarque_hoje",
  "nome": "Nome do Cliente",
  "contato_id": "uuid-do-contato",
  "data_embarque": "2026-01-23",
  "fornecedor": "Nome do Fornecedor",
  "observacoes": "Pendências | Observação",
  "data_referencia": "2026-01-23"
}
```

### 4. Embarque D+1 (`embarque_d1`)
**Tabela**: `historico_vendas_evastur`  
**Condição**: Vendas com `embarque` agendado para o dia seguinte

**Dados enviados para `https://eva.evastur.cloud/webhook/datas`:**
```json
{
  "tipo_evento": "embarque_d1",
  "nome": "Nome do Cliente",
  "contato_id": "uuid-do-contato",
  "data_embarque": "2026-01-24",
  "fornecedor": "Nome do Fornecedor",
  "observacoes": "Pendências | Observação",
  "data_referencia": "2026-01-24"
}
```

### 5. Follow-up Pendente (`followup_pendente`)
**Tabelas**: `historico_msg_evastur` + `crm_evastur`  
**Condição**: 
- Mensagens com `created_at` há mais de 1 dia (24 horas)
- Última mensagem do contato tem `message_type = 'outgoing'` (enviada por nós)
- Busca dados completos do cliente na tabela CRM

**Dados enviados para `https://eva.evastur.cloud/webhook/datas`:**
```json
{
  "tipo_evento": "followup_pendente",
  "nome": "Nome do Cliente",
  "contato_id": "uuid-do-contato",
  "data_nascimento": "2000-01-23",
  "ultima_mensagem": "2026-01-18 00:24:55.634382+00",
  "data_referencia": "2026-01-23"
}
```

### 6. Clientes Inativos 30 dias (`clientes_inativos_30d`)
**Tabelas**: `historico_vendas_evastur` + `crm_evastur`  
**Condição**:
- Clientes que JÁ compraram alguma vez
- Última compra (`created_at` na tabela vendas) foi há 30 dias ou mais
- Busca dados completos do cliente na tabela CRM
- Calcula exatamente quantos dias desde a última compra

**Dados enviados para `https://eva.evastur.cloud/webhook/datas`:**
```json
{
  "tipo_evento": "clientes_inativos_30d",
  "nome": "Nome do Cliente",
  "contato_id": "uuid-do-contato",
  "data_nascimento": "2000-01-23",
  "email": "cliente@email.com",
  "telefone": "+5511999999999",
  "dias_sem_compra": 45,
  "ultima_compra": "2025-12-09T10:30:00.000Z",
  "data_referencia": "2026-01-23"
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
