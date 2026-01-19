import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'
import type { CrmEvastur } from '~~/shared/types/CrmEvastur'
import type { HistoricoMsg } from '~~/shared/types/HistoricoMsg'
import type { HistoricoVenda } from '~~/shared/types/HistoricoVenda'

export interface ClienteFilters {
  cidade?: string
  sentimento?: string
  urgencia?: string
  faseObra?: string
  orderBy?: 'created_at' | 'nome' | 'cidade'
  orderDirection?: 'asc' | 'desc'
}

export interface VendaFilters {
  search?: string
  vendedor?: string
  startDate?: string
  endDate?: string
  minValue?: number | string
  maxValue?: number | string
  sortBy?: string
}

export const useClientes = () => {
  const supabase = useSupabaseClient<Database>()

  const getClientes = async (page: number = 1, pageSize: number = 20, filters?: ClienteFilters) => {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('crm_evastur')
      .select('*', { count: 'exact' })

    // Aplicar filtros
    if (filters?.cidade) {
      query = query.eq('cidade', filters.cidade)
    }
    if (filters?.sentimento) {
      query = query.eq('sentimento', filters.sentimento)
    }
    if (filters?.urgencia) {
      query = query.eq('urgencia', filters.urgencia)
    }
    if (filters?.faseObra) {
      query = query.eq('fase_obra', filters.faseObra)
    }

    // Ordenação
    const orderBy = filters?.orderBy || 'created_at'
    const orderDirection = filters?.orderDirection || 'desc'
    query = query.order(orderBy, { ascending: orderDirection === 'asc' })

    const { data, error, count } = await query.range(from, to)

    if (error) throw error

    return {
      data: data as CrmEvastur[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  }

  const getClienteById = async (id: number) => {
    const { data, error } = await supabase
      .from('crm_evastur')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as CrmEvastur
  }

  const getClienteByContatoId = async (contatoId: string) => {
    const { data, error } = await (supabase as any)
      .from('crm_evastur')
      .select('*')
      .eq('contato_id', contatoId)
      .single()

    if (error) throw error
    return data as CrmEvastur
  }

  const updateCliente = async (id: number, updates: Partial<CrmEvastur>) => {
    const { data, error } = await (supabase as any)
      .from('crm_evastur')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as CrmEvastur
  }

  const searchClientes = async (searchTerm: string, page: number = 1, pageSize: number = 20, filters?: ClienteFilters) => {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('crm_evastur')
      .select('*', { count: 'exact' })
      .or(`nome.ilike.%${searchTerm}%,nome_social.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,contato_id.ilike.%${searchTerm}%`)

    // Aplicar filtros
    if (filters?.cidade) {
      query = query.eq('cidade', filters.cidade)
    }
    if (filters?.sentimento) {
      query = query.eq('sentimento', filters.sentimento)
    }
    if (filters?.urgencia) {
      query = query.eq('urgencia', filters.urgencia)
    }
    if (filters?.faseObra) {
      query = query.eq('fase_obra', filters.faseObra)
    }

    // Ordenação
    const orderBy = filters?.orderBy || 'created_at'
    const orderDirection = filters?.orderDirection || 'desc'
    query = query.order(orderBy, { ascending: orderDirection === 'asc' })

    const { data, error, count } = await query.range(from, to)

    if (error) throw error

    return {
      data: data as CrmEvastur[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  }

  const getFilterOptions = async () => {
    const { data: cidades } = await supabase
      .from('crm_evastur')
      .select('cidade')
      .not('cidade', 'is', null)
      .order('cidade') as { data: Array<{ cidade: string | null }> | null }

    const { data: sentimentos } = await supabase
      .from('crm_evastur')
      .select('sentimento')
      .not('sentimento', 'is', null)
      .order('sentimento') as { data: Array<{ sentimento: string | null }> | null }

    const { data: urgencias } = await supabase
      .from('crm_evastur')
      .select('urgencia')
      .not('urgencia', 'is', null)
      .order('urgencia') as { data: Array<{ urgencia: string | null }> | null }

    const { data: fasesObra } = await supabase
      .from('crm_evastur')
      .select('fase_obra')
      .not('fase_obra', 'is', null)
      .order('fase_obra') as { data: Array<{ fase_obra: string | null }> | null }

    return {
      cidades: [...new Set((cidades || []).map(c => c.cidade).filter((c): c is string => !!c))],
      sentimentos: [...new Set((sentimentos || []).map(s => s.sentimento).filter((s): s is string => !!s))],
      urgencias: [...new Set((urgencias || []).map(u => u.urgencia).filter((u): u is string => !!u))],
      fasesObra: [...new Set((fasesObra || []).map(f => f.fase_obra).filter((f): f is string => !!f))]
    }
  }

  const getMensagensByContatoId = async (contatoId: string) => {
    const { data, error } = await supabase
      .from('historico_msg_evastur')
      .select('*')
      .eq('contato_id', contatoId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as HistoricoMsg[]
  }

  const getVendas = async (page: number = 1, pageSize: number = 20, filters?: VendaFilters) => {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = (supabase as any)
      .from('historico_vendas_evastur')
      .select('*', { count: 'exact' })

    if (filters?.search) {
      const search = `%${filters.search}%`
      query = query.or(`contact_name.ilike.${search},contato_id.ilike.${search},vendedor.ilike.${search}`)
    }

    if (filters?.vendedor) {
      query = query.eq('vendedor', filters.vendedor)
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate)
    }

    if (filters?.endDate) {
      // Adiciona o fim do dia para garantir que pega tudo daquela data
      query = query.lte('created_at', `${filters.endDate}T23:59:59`)
    }

    if (filters?.minValue !== undefined && filters?.minValue !== '') {
      query = query.gte('valor_venda', filters.minValue)
    }

    if (filters?.maxValue !== undefined && filters?.maxValue !== '') {
      query = query.lte('valor_venda', filters.maxValue)
    }

    // Ordenação
    switch (filters?.sortBy) {
      case 'date-desc':
        query = query.order('created_at', { ascending: false })
        break
      case 'date-asc':
        query = query.order('created_at', { ascending: true })
        break
      case 'value-desc':
        query = query.order('valor_venda', { ascending: false })
        break
      case 'value-asc':
        query = query.order('valor_venda', { ascending: true })
        break
      case 'name-asc':
        query = query.order('contact_name', { ascending: true })
        break
      case 'name-desc':
        query = query.order('contact_name', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data, error, count } = await query.range(from, to)

    if (error) throw error

    return {
      data: data as HistoricoVenda[],
      count: count || 0,
      totalPages: Math.ceil((count || 0) / pageSize)
    }
  }

  const getVendasStats = async () => {
    const pageSize = 1000
    let from = 0
    let total = 0
    let maior: number | null = null
    let menor: number | null = null
    let totalCount: number | null = null
    let fetched = 0
    let hasMore = true

    while (hasMore) {
      const { data, error, count } = await (supabase as any)
        .from('historico_vendas_evastur')
        .select('valor_venda', { count: 'exact' })
        .range(from, from + pageSize - 1)

      if (error) throw error

      if (typeof count === 'number') {
        totalCount = count
      }

      const rows = (data || []) as Array<{ valor_venda: number | null }>
      for (const row of rows) {
        if (row.valor_venda === null || row.valor_venda === undefined) continue
        const value = Number(row.valor_venda)
        total += value
        if (maior === null || value > maior) maior = value
        if (menor === null || value < menor) menor = value
      }

      fetched += rows.length
      from += pageSize
      if (totalCount !== null) {
        hasMore = fetched < totalCount
      } else {
        hasMore = rows.length === pageSize
      }
    }

    return {
      total: totalCount === 0 ? null : total,
      maior,
      menor
    }
  }

  const getVendasByContatoId = async (contatoId: string) => {
    const { data, error } = await (supabase as any)
      .from('historico_vendas_evastur')
      .select('*')
      .eq('contato_id', contatoId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as HistoricoVenda[]
  }

  const getAllVendasForChart = async () => {
    const pageSize = 1000
    let from = 0
    let allVendas: HistoricoVenda[] = []
    let totalCount: number | null = null
    let fetched = 0
    let hasMore = true

    while (hasMore) {
      const { data, error, count } = await (supabase as any)
        .from('historico_vendas_evastur')
        .select('created_at, valor_venda', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, from + pageSize - 1)

      if (error) throw error

      if (typeof count === 'number') {
        totalCount = count
      }

      const rows = (data || []) as HistoricoVenda[]
      allVendas = [...allVendas, ...rows]

      fetched += rows.length
      from += pageSize
      if (totalCount !== null) {
        hasMore = fetched < totalCount
      } else {
        hasMore = rows.length === pageSize
      }
    }

    return allVendas
  }

  const getVendedores = async () => {
    const { data } = await (supabase as any)
      .from('historico_vendas_evastur')
      .select('vendedor')
      .not('vendedor', 'is', null)
    
    const items = (data || []) as Array<{ vendedor: string }>
    return [...new Set(items.map(i => i.vendedor).filter(v => !!v))].sort()
  }

  return {
    getClientes,
    getClienteById,
    getClienteByContatoId,
    updateCliente,
    searchClientes,
    getFilterOptions,
    getMensagensByContatoId,
    getVendasByContatoId,
    getAllVendasForChart,
    getVendas,
    getVendasStats,
    getVendedores
  }
}
