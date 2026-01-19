export interface CrmEvastur {
  id: number
  created_at: string
  contato_id: string
  nome: string | null
  cidade: string | null
  email: string | null
  data_nascimento: string | null
  sentimento: string | null
  urgencia: string | null
  resumo_perfil: string | null
  interesses: any[] | null
  objeccoes: any[] | null
  nome_social: string | null
  fase_obra: string | null
  compras_cliente: any[] | null
}
