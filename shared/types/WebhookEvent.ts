export interface WebhookEvent {
  id: number
  created_at: string
  nome_evento: string | null
  horario_evento: string | null
  acao_evento: string | null
}
