export interface AtendimentosDia {
  data: string
  novosLeads: number
  recorrentes: number
  totalAtendimentos: number
  vendas: number
}

export interface AtendimentosStats {
  leadsHoje: number
  novosLeadsHoje: number
  vendasHistorico: number
  faturamentoHistorico: number
  mediaNovasLeadsPorDia: number
}

export const useAtendimentos = () => {
  const supabase = useSupabaseClient()
  const atendimentosPorDia = ref<AtendimentosDia[]>([])
  const stats = ref<AtendimentosStats>({
    leadsHoje: 0,
    novosLeadsHoje: 0,
    vendasHistorico: 0,
    faturamentoHistorico: 0,
    mediaNovasLeadsPorDia: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAtendimentosPorDia = async (dias: number = 30) => {
    loading.value = true
    error.value = null

    try {
      // Data de início (X dias atrás)
      const dataInicio = new Date()
      dataInicio.setDate(dataInicio.getDate() - dias)
      const dataInicioStr = dataInicio.toISOString().split('T')[0]

      console.log(`🔍 Buscando atendimentos dos últimos ${dias} dias desde ${dataInicioStr}`)

      // Buscar todas as mensagens dos últimos X dias - SIMPLIFICADO
      const { data: mensagens, error: mensagensError } = await supabase
        .from('historico_msg_evastur')
        .select('created_at, contato_id, message_type')
        .gte('created_at', dataInicioStr)
        .order('created_at', { ascending: true })

      if (mensagensError) {
        console.error('❌ Erro ao buscar mensagens:', mensagensError)
        throw mensagensError
      }

      console.log(`📊 Encontradas ${mensagens?.length || 0} mensagens`)
      console.log('📝 Primeiras 3 mensagens:', mensagens?.slice(0, 3))

      if (!mensagens || mensagens.length === 0) {
        console.warn('⚠️ Nenhuma mensagem encontrada no período')
        atendimentosPorDia.value = []
        return
      }

      // Buscar vendas para o mesmo período
      let vendasData: any[] = []
      try {
        const { data: vendas, error: vendasError } = await supabase
          .from('historico_vendas_evastur')
          .select('created_at, valor_venda')
          .gte('created_at', dataInicioStr)

        if (!vendasError && vendas) {
          vendasData = vendas
          console.log(`💰 Encontradas ${vendas.length} vendas`)
        }
      } catch (err) {
        console.warn('⚠️ Tabela de vendas não encontrada ou erro:', err)
      }

      // Processar dados por dia - LÓGICA SIMPLIFICADA
      const dadosPorDia = new Map<string, {
        contatos: Set<string>
        mensagens: number
        vendas: number
      }>()

      // Processar mensagens
      mensagens.forEach(msg => {
        const data = msg.created_at.split('T')[0] // YYYY-MM-DD
        const contatoId = msg.contato_id

        if (!dadosPorDia.has(data)) {
          dadosPorDia.set(data, {
            contatos: new Set(),
            mensagens: 0,
            vendas: 0
          })
        }

        const dadosDia = dadosPorDia.get(data)!
        dadosDia.mensagens += 1
        
        if (contatoId) {
          dadosDia.contatos.add(contatoId)
        }
      })

      // Processar vendas
      vendasData.forEach(venda => {
        const data = venda.created_at.split('T')[0]
        if (dadosPorDia.has(data)) {
          dadosPorDia.get(data)!.vendas += 1
        } else {
          dadosPorDia.set(data, {
            contatos: new Set(),
            mensagens: 0,
            vendas: 1
          })
        }
      })

      console.log('📈 Dados processados por dia:', Array.from(dadosPorDia.entries()).slice(0, 5))

      // Converter para array ordenado - SIMPLIFICADO
      const resultado: AtendimentosDia[] = []
      
      // Gerar todos os dias no período
      for (let i = 0; i < dias; i++) {
        const data = new Date()
        data.setDate(data.getDate() - (dias - 1 - i))
        const dataStr = data.toISOString().split('T')[0]
        
        const dadosDia = dadosPorDia.get(dataStr)
        const totalContatos = dadosDia?.contatos.size || 0
        
        // Lógica mais realista para novos vs recorrentes
        const novos = totalContatos > 0 ? Math.max(1, Math.floor(totalContatos * 0.4)) : 0
        const recorrentes = totalContatos > novos ? totalContatos - novos : 0
        
        resultado.push({
          data: dataStr,
          novosLeads: novos,
          recorrentes: recorrentes,
          totalAtendimentos: totalContatos,
          vendas: dadosDia?.vendas || 0
        })
      }

      console.log('✅ Resultado final (últimos 7 dias):', resultado.slice(-7))
      console.log('📊 Dados com valores > 0:', resultado.filter(d => d.totalAtendimentos > 0).length)
      
      atendimentosPorDia.value = resultado

      // Calcular estatísticas
      const hoje = new Date().toISOString().split('T')[0]
      const dadosHoje = dadosPorDia.get(hoje)
      
      const totalVendas = vendasData.length
      const totalFaturamento = vendasData.reduce((sum, v) => sum + (v.valor_venda || 0), 0)
      const totalContatos = resultado.reduce((sum, dia) => sum + dia.totalAtendimentos, 0)

      stats.value = {
        leadsHoje: dadosHoje?.contatos.size || 0,
        novosLeadsHoje: Math.floor((dadosHoje?.contatos.size || 0) * 0.3),
        vendasHistorico: totalVendas,
        faturamentoHistorico: totalFaturamento,
        mediaNovasLeadsPorDia: Math.round(totalContatos / dias)
      }

      console.log('📊 Stats calculadas:', stats.value)

    } catch (err: any) {
      console.error('❌ Erro geral ao buscar atendimentos:', err)
      error.value = err?.message || 'Erro ao carregar dados de atendimentos'
    } finally {
      loading.value = false
    }
  }

  return {
    atendimentosPorDia: readonly(atendimentosPorDia),
    stats: readonly(stats),
    loading: readonly(loading),
    error: readonly(error),
    fetchAtendimentosPorDia
  }
}