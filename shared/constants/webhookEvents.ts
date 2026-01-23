export type WebhookEventType =
  | 'aniversario_hoje'
  | 'aniversario_amanha'
  | 'embarque_hoje'
  | 'embarque_d1'
  | 'followup_pendente'
  | 'clientes_inativos_30d'

export interface WebhookEventOption {
  value: WebhookEventType
  label: string
  description: string
}

export const WEBHOOK_EVENT_OPTIONS: WebhookEventOption[] = [
  {
    value: 'aniversario_hoje',
    label: 'Aniversários (Hoje)',
    description: 'Dispara para aniversariantes do dia.'
  },
  {
    value: 'aniversario_amanha',
    label: 'Aniversários (Amanhã)',
    description: 'Dispara para aniversariantes de amanhã.'
  },
  {
    value: 'embarque_hoje',
    label: 'Embarques (Hoje)',
    description: 'Dispara para embarques com data de hoje.'
  },
  {
    value: 'embarque_d1',
    label: 'Embarques (D-1)',
    description: 'Dispara para embarques de amanhã (D-1).'
  },
  {
    value: 'followup_pendente',
    label: 'Follow-up Pendente',
    description: 'Dispara para clientes com última mensagem outgoing há mais de 1 dia sem resposta.'
  },
  {
    value: 'clientes_inativos_30d',
    label: 'Clientes Inativos (30 dias)',
    description: 'Dispara para clientes que não compram há mais de 30 dias.'
  }
]
