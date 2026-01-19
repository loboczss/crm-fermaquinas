export interface HistoricoVenda {
  id: number
  created_at: string
  id_mensagem_venda: number | null
  contato_id: string
  valor_venda: number | null
  contact_name: string | null
  vendedor: string | null
}
