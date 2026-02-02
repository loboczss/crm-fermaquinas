import { useSupabaseClient } from '#imports'

interface VendedorRanking {
  posicao: number
  nome: string
  vendas: number
  faturamento: number
  clientesAtendidos: number
}

export const useVendedores = () => {
  const supabase = useSupabaseClient()
  const vendedores = ref<VendedorRanking[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchVendedoresRanking = async () => {
    loading.value = true
    error.value = null

    try {
      console.log('Iniciando busca de ranking via RPC...')

      // @ts-ignore - RPC not yet typed
      const { data, error: rpcError } = await supabase.rpc('get_vendedores_ranking')

      console.log('RPC Ranking Result:', { data, rpcError })

      if (rpcError) {
        console.error('Erro ao buscar ranking:', rpcError)
        throw rpcError
      }

      if (data && Array.isArray(data)) {
        // Map RPC result to interface
        // RPC: nome, vendas, faturamento, clientes_atendidos
        const ranking: VendedorRanking[] = (data as any[]).map((item: any, index: number) => ({
          posicao: index + 1,
          nome: item.nome,
          vendas: Number(item.vendas),
          faturamento: Number(item.faturamento),
          clientesAtendidos: Number(item.clientes_atendidos)
        }))

        vendedores.value = ranking
        console.log(`Ranking carregado: ${ranking.length} vendedores`)
      }

    } catch (err: any) {
      console.error('Erro ao buscar ranking de vendedores:', err)
      error.value = err?.message || 'Erro ao carregar dados dos vendedores'
      vendedores.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    vendedores: readonly(vendedores),
    loading: readonly(loading),
    error: readonly(error),
    fetchVendedoresRanking
  }
}