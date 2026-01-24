export interface VendedorRanking {
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

  const fetchAllMensagens = async () => {
    const pageSize = 1000
    let from = 0
    let allMensagens: Array<{ sender_name: string, contato_id: string }> = []
    let hasMore = true

    console.log('Iniciando busca de todas as mensagens...')

    while (hasMore) {
      const { data, error } = await supabase
        .from('historico_msg_evastur')
        .select('sender_name, contato_id')
        .eq('message_type', 'outgoing')
        .not('sender_name', 'is', null)
        .not('sender_name', 'eq', '')
        .range(from, from + pageSize - 1)

      if (error) {
        console.error('Erro ao buscar mensagens:', error)
        throw error
      }

      if (data && data.length > 0) {
        // Filtrar nomes inválidos
        const filteredData = data.filter(msg => {
          const nome = msg.sender_name?.toLowerCase().trim()
          return nome &&
            nome !== 'desconhecido' &&
            nome !== 'unknown' &&
            nome !== 'null' &&
            nome !== 'undefined' &&
            nome !== 'n/a' &&
            nome !== 'sem nome' &&
            nome !== 'anonimo' &&
            nome !== 'anonymous' &&
            !nome.includes('test') &&
            !nome.includes('teste') &&
            nome.length > 1
        })

        allMensagens = [...allMensagens, ...filteredData]
        console.log(`Carregadas ${allMensagens.length} mensagens válidas até agora...`)
        from += pageSize
        hasMore = data.length === pageSize
      } else {
        hasMore = false
      }
    }

    console.log(`Total de mensagens válidas carregadas: ${allMensagens.length}`)
    return allMensagens
  }

  const fetchAllVendas = async () => {
    const pageSize = 1000
    let from = 0
    let allVendas: Array<{ vendedor: string, valor_venda: number }> = []
    let hasMore = true

    console.log('Iniciando busca de todas as vendas...')

    while (hasMore) {
      const { data, error } = await supabase
        .from('historico_vendas_evastur')
        .select('vendedor, valor_venda')
        .not('vendedor', 'is', null)
        .not('vendedor', 'eq', '')
        .range(from, from + pageSize - 1)

      if (error) {
        console.warn('Erro ao buscar vendas (tabela pode não existir):', error)
        break
      }

      if (data && data.length > 0) {
        // Filtrar nomes inválidos
        const filteredData = data.filter(venda => {
          const nome = venda.vendedor?.toLowerCase().trim()
          return nome &&
            nome !== 'desconhecido' &&
            nome !== 'unknown' &&
            nome !== 'null' &&
            nome !== 'undefined' &&
            nome !== 'n/a' &&
            nome !== 'sem nome' &&
            nome !== 'anonimo' &&
            nome !== 'anonymous' &&
            !nome.includes('test') &&
            !nome.includes('teste') &&
            nome.length > 1
        })

        allVendas = [...allVendas, ...filteredData]
        console.log(`Carregadas ${allVendas.length} vendas válidas até agora...`)
        from += pageSize
        hasMore = data.length === pageSize
      } else {
        hasMore = false
      }
    }

    console.log(`Total de vendas válidas carregadas: ${allVendas.length}`)
    return allVendas
  }

  const fetchVendedoresRanking = async () => {
    loading.value = true
    error.value = null

    try {
      // Buscar todas as mensagens e vendas
      const [mensagensData, vendasData] = await Promise.all([
        fetchAllMensagens(),
        fetchAllVendas()
      ])

      // Processar dados de mensagens para contar clientes únicos por vendedor
      const vendedoresMap = new Map<string, Set<string>>()

      mensagensData.forEach(msg => {
        if (msg.sender_name && msg.contato_id) {
          if (!vendedoresMap.has(msg.sender_name)) {
            vendedoresMap.set(msg.sender_name, new Set())
          }
          vendedoresMap.get(msg.sender_name)!.add(msg.contato_id)
        }
      })

      console.log('Vendedores encontrados nas mensagens:', Array.from(vendedoresMap.keys()))
      vendedoresMap.forEach((contatos, nome) => {
        console.log(`${nome}: ${contatos.size} clientes únicos`)
      })

      // Processar dados de vendas para contar vendas e faturamento por vendedor
      const vendasMap = new Map<string, number>()
      const faturamentoMap = new Map<string, number>()

      vendasData.forEach(venda => {
        if (venda.vendedor) {
          vendasMap.set(venda.vendedor, (vendasMap.get(venda.vendedor) || 0) + 1)
          faturamentoMap.set(venda.vendedor, (faturamentoMap.get(venda.vendedor) || 0) + (venda.valor_venda || 0))
        }
      })

      console.log('Vendedores encontrados nas vendas:', Array.from(vendasMap.keys()))

      // Combinar dados e criar ranking
      const ranking: VendedorRanking[] = []

      // Adicionar vendedores das mensagens
      vendedoresMap.forEach((contatos, nome) => {
        ranking.push({
          posicao: 0, // Será definido após ordenação
          nome,
          vendas: vendasMap.get(nome) || 0,
          faturamento: faturamentoMap.get(nome) || 0,
          clientesAtendidos: contatos.size
        })
      })

      // Adicionar vendedores que só aparecem nas vendas
      vendasMap.forEach((vendas, nome) => {
        if (!vendedoresMap.has(nome)) {
          ranking.push({
            posicao: 0,
            nome,
            vendas,
            faturamento: faturamentoMap.get(nome) || 0,
            clientesAtendidos: 0
          })
        }
      })

      // Ordenar por faturamento (decrescente) se houver, ou vendas
      // Geralmente ranking é por Faturamento (valor)
      ranking.sort((a, b) => {
        if (b.faturamento !== a.faturamento) {
          return b.faturamento - a.faturamento
        }
        if (b.vendas !== a.vendas) {
          return b.vendas - a.vendas
        }
        return b.clientesAtendidos - a.clientesAtendidos
      })

      // Definir posições
      ranking.forEach((vendedor, index) => {
        vendedor.posicao = index + 1
      })

      console.log('Ranking final:', ranking)
      vendedores.value = ranking

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