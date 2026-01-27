
import { ref } from '#imports'
import { useSupabaseClient } from '#imports'
import { buildEmbarqueWebhookPayload } from '~/utils/webhookPayload'

export interface EmbarqueItem {
    id: number
    contact_name: string | null
    embarque: string | null
    contato_id: string | null
    fornecedor: string | null
    obs_pendencias: string | null
    observacao: string | null
}

export const useEmbarques = () => {
    const supabase = useSupabaseClient()
    const upcomingEmbarques = ref<EmbarqueItem[]>([])
    const embarquesByDay = ref<Record<string, EmbarqueItem[]>>({})
    const loading = ref(false)
    const error = ref<string | null>(null)

    const formatDate = (date: Date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const fetchUpcomingEmbarques = async () => {
        loading.value = true
        try {
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(today.getDate() + 1)

            const dayAfter = new Date(tomorrow)
            dayAfter.setDate(tomorrow.getDate() + 1)

            const start = formatDate(today)
            const end = formatDate(dayAfter)

            let allData: EmbarqueItem[] = []
            let from = 0
            const pageSize = 1000
            let hasMore = true

            while (hasMore) {
                const { data, error: sbError } = await (supabase as any)
                    .from('historico_vendas_evastur')
                    .select('id, contact_name, embarque, contato_id, fornecedor, obs_pendencias, observacao')
                    .gte('embarque', start)
                    .lt('embarque', end)
                    .range(from, from + pageSize - 1)

                if (sbError) throw sbError

                if (data && data.length > 0) {
                    allData = [...allData, ...data]
                    from += pageSize
                    hasMore = data.length === pageSize
                } else {
                    hasMore = false
                }
            }

            upcomingEmbarques.value = allData as EmbarqueItem[]
        } catch (e: any) {
            console.error('Erro ao buscar embarques:', e)
            upcomingEmbarques.value = []
        } finally {
            loading.value = false
        }
    }

    const fetchEmbarquesByMonth = async (month: number, year: number) => {
        loading.value = true
        error.value = null

        try {
            const monthStr = String(month).padStart(2, '0')
            const yearStr = String(year)

            const response = await $fetch('/api/admin/embarques', {
                params: { month: monthStr, year: yearStr }
            })

            embarquesByDay.value = response.data || {}
        } catch (e: any) {
            error.value = e.message || 'Erro ao buscar embarques'
            console.error('Erro ao buscar embarques:', e)
            embarquesByDay.value = {}
        } finally {
            loading.value = false
        }
    }


    // Suporte a datas dd/mm/aaaa
    const getEmbarquesForDay = (day: number): EmbarqueItem[] => {
        const dayStr = String(day).padStart(2, '0')
        // Aceita tanto chave "01" quanto datas dd/mm/aaaa
        if (embarquesByDay.value[dayStr]) return embarquesByDay.value[dayStr]
        // Busca por datas dd/mm/aaaa
        const found = Object.entries(embarquesByDay.value).find(([k]) => {
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(k)) {
                return k.startsWith(dayStr + '/')
            }
            return false
        })
        return found ? found[1] : []
    }

    const hasEmbarqueOnDay = (day: number): boolean => {
        const dayStr = String(day).padStart(2, '0')
        return !!embarquesByDay.value[dayStr] && embarquesByDay.value[dayStr].length > 0
    }
    const triggerWebhook = async (nome: string, data_embarque: string, contato_id: string, observacoes?: string) => {
        try {
            const payload = buildEmbarqueWebhookPayload({
                nome,
                data: data_embarque,
                contato_id,
                observacoes
            })
            await $fetch('/api/admin/trigger-embarque-webhook', {
                method: 'POST',
                body: payload
            })
            return { success: true }
        } catch (e: any) {
            console.error('Error triggering webhook:', e)
            return { success: false, error: e.message }
        }
    }

    return {
        upcomingEmbarques,
        embarquesByDay,
        loading,
        error,
        fetchUpcomingEmbarques,
        fetchEmbarquesByMonth,
        getEmbarquesForDay,
        hasEmbarqueOnDay,
        triggerWebhook
    }
}
