import { ref, onMounted } from '#imports'
import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'
import type { CrmArtorius } from '~~/shared/types/CrmArtorius'

export const useBirthdays = () => {
    const supabase = useSupabaseClient<Database>()
    const birthdaysToday = ref<CrmArtorius[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchBirthdaysToday = async () => {
        try {
            loading.value = true
            error.value = null

            const today = new Date()
            const month = String(today.getMonth() + 1).padStart(2, '0')
            const day = String(today.getDate()).padStart(2, '0')
            const todayString = `${month}-${day}` // Assuming format in DB is MM-DD or we match parts

            // Supabase query to find birthdays today
            // Since data_nascimento is YYYY-MM-DD or similar, we use ilike or regex if supported, 
            // but for simplicity and common Supabase patterns, we'll fetch all and filter or use a specific RPC if available.
            // However, we can use filter with %MM-DD
            const { data, error: sbError } = await (supabase as any)
                .from('crm_artorius')
                .select('id, nome, nome_social, data_nascimento, contato_id')
                .filter('data_nascimento', 'ilike', `%-${todayString}`)

            if (sbError) throw sbError

            birthdaysToday.value = data || []
        } catch (e: any) {
            error.value = e.message || 'Erro ao buscar aniversariantes'
            console.error('Error fetching birthdays:', e)
        } finally {
            loading.value = false
        }
    }

    return {
        birthdaysToday,
        loading,
        error,
        fetchBirthdaysToday
    }
}
