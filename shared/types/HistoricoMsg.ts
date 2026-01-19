export interface HistoricoMsg {
  id: number
  created_at: string
  mensagem: string | null
  contato_id: string
  contact_name: string | null
  sender_type: string | null
  sender_name: string | null
  channel: string | null
  message_type: string | null
  chatwoot_msg_id: number | null
  conversation_id: number | null
  inbox_id: number | null
  is_private: boolean | null
}
