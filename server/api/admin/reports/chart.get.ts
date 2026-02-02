import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const days = Number(query.days) || 30

    const supabase = await serverSupabaseClient<Database>(event)

    try {
        console.time('report-rpc')
        // 1. Fetch Aggregated Daily Metrics via RPC
        // @ts-ignore
        const { data: rpcData, error: rpcError } = await supabase.rpc('get_daily_metrics', {
            days_param: days
        })

        if (rpcError) {
            console.error('RPC Error:', rpcError)
            throw rpcError
        }
        console.timeEnd('report-rpc')

        const resultData = (rpcData as any[] || []).map(row => ({
            data: row.data_dia,
            novosLeads: Number(row.novos_leads),
            recorrentes: Number(row.recorrentes),
            totalAtendimentos: Number(row.total_atendimentos),
            vendas: Number(row.vendas)
        }))

        // 2. Global Stats (Lightweight queries)
        const { count: totalVendasHistorico } = await supabase
            .from('historico_vendas_artorius')
            .select('*', { count: 'exact', head: true })

        const { data: totalRevData } = await supabase
            .from('historico_vendas_artorius')
            .select('valor_venda') // Fetching only this column is acceptable for sum if RPC not used for this specific global stat yet

        const totalFaturamentoHistorico = (totalRevData as any[])?.reduce((acc, curr) => acc + (curr.valor_venda || 0), 0) || 0

        // 3. "Today" Stats extraction
        // Assuming the RPC returns data up to TODAY, the last row should be today (if there was activity)
        // Adjust for timezone matching if needed, but usually the DB date is sufficient.
        const todayStr = new Date().toISOString().split('T')[0]
        const todayRow = resultData.find(d => d.data === todayStr) || { novosLeads: 0, recorrentes: 0, totalAtendimentos: 0, vendas: 0 }

        // Needs to match specific expectation or just use the row data
        // For faturamentoHoje, we might need a specific query if the RPC only returns count for sales
        // My RPC 'vendas' is count. 'faturamento' is not in daily metrics yet.
        // Let's add a quick query for today's revenue to be precise.

        const startToday = new Date()
        startToday.setHours(0, 0, 0, 0)

        const { data: todaySales } = await supabase
            .from('historico_vendas_artorius')
            .select('valor_venda')
            .gte('created_at', startToday.toISOString())

        const faturamentoHoje = (todaySales as any[])?.reduce((acc, curr) => acc + (curr.valor_venda || 0), 0) || 0


        const stats = {
            leadsHoje: todayRow.totalAtendimentos,
            novosLeadsHoje: todayRow.novosLeads,
            recorrentesHoje: todayRow.recorrentes,
            vendasHoje: todayRow.vendas,
            faturamentoHoje: faturamentoHoje, // Calculated separately
            vendasHistorico: totalVendasHistorico || 0,
            faturamentoHistorico: totalFaturamentoHistorico,
            mediaNovasLeadsPorDia: Math.round(resultData.reduce((acc, curr) => acc + curr.novosLeads, 0) / (resultData.length || 1))
        }

        return {
            success: true,
            data: resultData,
            stats,
            debug: { source: 'RPC_OPTIMIZED' }
        }

    } catch (e: any) {
        console.error('Handler Error:', e)
        throw createError({
            statusCode: 500,
            statusMessage: e.message
        })
    }
})
