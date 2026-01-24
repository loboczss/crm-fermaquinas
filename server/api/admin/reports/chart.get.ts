import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const days = Number(query.days) || 30

    const supabase = await serverSupabaseClient<Database>(event)

    // Range for the REPORT
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)

    // Logic: Mimic SQL CTE for "First Interaction"
    // 1. Fetch FULL history of message timestamps + contact_ids
    // 2. Build map of { contact_id: first_seen_date }
    // 3. Aggregate daily based on strict comparison

    try {
        // 1. Fetch ALL History (Paginated to handle 50k+ rows)
        let allHistoryRows: any[] = []
        let hasMore = true
        let page = 0
        const pageSize = 1000 // Reduced to 1000 to match default API limits

        console.log('Fetching history...')

        // Fetching lightweight columns only
        while (hasMore) {
            const { data, error } = await supabase
                .from('historico_msg_evastur')
                .select('contato_id, created_at')
                .range(page * pageSize, (page + 1) * pageSize - 1)
                .order('created_at', { ascending: true })

            if (error) {
                console.error('Error fetching history:', error)
                throw error
            }

            if (data && data.length > 0) {
                allHistoryRows = allHistoryRows.concat(data)
                // If we got fewer rows than requested, we reached the end
                if (data.length < pageSize) hasMore = false
                page++
            } else {
                hasMore = false
            }
        }
        console.log(`Fetched ${allHistoryRows.length} rows total.`)

        // 2. Build "First Seen" Map (CTE replacement)
        const firstSeenMap = new Map<string, string>() // contato_id -> YYYY-MM-DD
        const activityByDay = new Map<string, Set<string>>() // YYYY-MM-DD -> Set<contato_id>

        allHistoryRows.forEach(row => {
            if (!row.contato_id || !row.created_at) return

            // Fix: Parse date robustly using Date object
            const dateObj = new Date(row.created_at)
            if (isNaN(dateObj.getTime())) return // Skip invalid dates

            const dateStr = dateObj.toISOString().split('T')[0] // YYYY-MM-DD

            // CTE Logic: MIN(created_at)
            // Since rows are ordered by date, the first time we encounter a contact is valid.
            if (!firstSeenMap.has(row.contato_id)) {
                firstSeenMap.set(row.contato_id, dateStr)
            }

            // Organize for daily aggregation
            if (!activityByDay.has(dateStr)) {
                activityByDay.set(dateStr, new Set())
            }
            activityByDay.get(dateStr)!.add(row.contato_id)
        })

        // 3. Aggregate for the requested period
        const resultData = []
        let totalNovosPeriodo = 0

        for (let i = 0; i < days; i++) {
            const d = new Date(startDate)
            d.setDate(d.getDate() + i)
            const dayKey = d.toISOString().split('T')[0]

            const activeContacts = activityByDay.get(dayKey)

            let novos = 0
            let recorrentes = 0
            let totalUnicos = 0

            if (activeContacts) {
                totalUnicos = activeContacts.size

                activeContacts.forEach(contatoId => {
                    const firstSeen = firstSeenMap.get(contatoId)

                    // Rules:
                    // New: day == first_seen
                    // Recurring: day > first_seen
                    if (firstSeen === dayKey) {
                        novos++
                    } else if (firstSeen && firstSeen < dayKey) {
                        recorrentes++
                    }
                })
            }

            resultData.push({
                data: dayKey,
                novosLeads: novos,
                recorrentes: recorrentes,
                totalAtendimentos: totalUnicos,
                vendas: 0 // Will fill next
            })

            totalNovosPeriodo += novos
        }

        // 4. Sales Data (Keep existing logic)
        const { data: salesData, error: salesError } = await supabase
            .from('historico_vendas_evastur')
            .select('created_at, valor_venda')
            .gte('created_at', startDate.toISOString())

        if (salesError) console.error(salesError)

        const salesRows = (salesData as any[]) || []

        // Map sales to days
        const salesByDay = new Map<string, number>()
        salesRows.forEach(s => {
            if (!s.created_at) return
            try {
                const k = new Date(s.created_at).toISOString().split('T')[0]
                salesByDay.set(k, (salesByDay.get(k) || 0) + 1)
            } catch (e) {
                // ignore invalid dates
            }
        })

        // Merge sales into result
        resultData.forEach(day => {
            day.vendas = salesByDay.get(day.data) || 0
        })

        // 5. Global Stats
        // Use a fast count for total sales history
        const { count: totalVendasHistorico } = await supabase
            .from('historico_vendas_evastur')
            .select('*', { count: 'exact', head: true })

        // Value sum - fetch column only
        // To be safe with limits, we rely on the specific sales history logic.
        // Assuming sales table is smaller than messages (<50k likely), but safe to just fetch column.
        const { data: totalRevData } = await supabase
            .from('historico_vendas_evastur')
            .select('valor_venda')

        const totalFaturamentoHistorico = (totalRevData as any[])?.reduce((acc, curr) => acc + (curr.valor_venda || 0), 0) || 0

        // "Leads Hoje" logic using server time
        // Adjust for Brazil Timezone (UTC-3) roughly without external libs
        // If server is UTC, we want to subtract 3 hours to get 'Sao_Paulo' date
        const now = new Date()
        now.setHours(now.getHours() - 3)
        const todayKey = now.toISOString().split('T')[0]

        const todayLeadsCount = activityByDay.get(todayKey)?.size || 0

        // "Novos Leads Hoje"
        let novosLeadsHoje = 0
        activityByDay.get(todayKey)?.forEach(id => {
            if (firstSeenMap.get(id) === todayKey) novosLeadsHoje++
        })

        const recorrentesHoje = todayLeadsCount - novosLeadsHoje

        // "Vendas e Faturamento Hoje"
        let vendasHoje = 0
        let faturamentoHoje = 0

        salesRows.forEach(s => {
            if (!s.created_at) return
            try {
                // Adjust for timezone if needed, or simple split if constructed consistently
                // We reused the 'salesByDay' logic which constructs K from ISO split. 
                // Let's match the 'todayKey' logic (UTC-3 adjustment we did earlier)
                const sDate = new Date(s.created_at)
                sDate.setHours(sDate.getHours() - 3)
                const sKey = sDate.toISOString().split('T')[0]

                if (sKey === todayKey) {
                    vendasHoje++
                    faturamentoHoje += (s.valor_venda || 0)
                }
            } catch (e) { }
        })

        const stats = {
            leadsHoje: todayLeadsCount,
            novosLeadsHoje: novosLeadsHoje,
            recorrentesHoje: recorrentesHoje,
            vendasHoje: vendasHoje,
            faturamentoHoje: faturamentoHoje,
            vendasHistorico: totalVendasHistorico || 0,
            faturamentoHistorico: totalFaturamentoHistorico,
            mediaNovasLeadsPorDia: Math.round(totalNovosPeriodo / days)
        }

        const debug = {
            totalFetchedRows: allHistoryRows.length,
            firstRowDate: allHistoryRows[0]?.created_at,
            lastRowDate: allHistoryRows[allHistoryRows.length - 1]?.created_at,
            mapSize: firstSeenMap.size,
            activityDaysCount: activityByDay.size,
            sampleRow: allHistoryRows[0]
        }

        return {
            success: true,
            data: resultData,
            stats,
            debug
        }

    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: e.message
        })
    }
})
