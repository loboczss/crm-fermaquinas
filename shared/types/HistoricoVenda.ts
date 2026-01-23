export interface HistoricoVenda {
  id: number
  created_at: string
  id_mensagem_venda: number | null
  contato_id: string
  valor_venda: number | null
  contact_name: string | null
  vendedor: string | null
  telefone: number | null
  instagram: string | null
  codigo_atlas: number | null
  status: string | null
  tipo_venda: string | null
  forma_pagamento: string | null
  data_venda_atlas: string | null
  cliente_atlas: string | null
  embarque: string | null
  obs_pendencias: string | null
  fornecedor: string | null
  forma_pagamento_faturas_automaticas: string | null
  observacao: string | null
  acao_venda: string | null
  taxa: number | null
  taxa_adm: number | null
  comissao: number | null
}
