
import { ref, computed } from '#imports'
import { useSupabaseClient } from '#imports'
import type { CrmArtorius } from '~~/shared/types/CrmArtorius'
import { buildBirthdayWebhookPayload } from '~/utils/webhookPayload'

export const useCalendario = () => {
    const supabase = useSupabaseClient()
    const currentMonth = ref(new Date().getMonth() + 1)
    const currentYear = ref(new Date().getFullYear())
    const birthdaysByDay = ref<Record<string, CrmArtorius[]>>({})
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchBirthdays = async () => {
        try {
            loading.value = true
            error.value = null

            const month = String(currentMonth.value).padStart(2, '0')
            const year = String(currentYear.value)

            const response = await $fetch(`/api/admin/birthdays`, {
                params: { month, year }
            })

            birthdaysByDay.value = response.data || {}
        } catch (e: any) {
            error.value = e.message || 'Erro ao buscar aniversários'
            console.error('Error fetching birthdays:', e)
        } finally {
            loading.value = false
        }
    }
    const triggerWebhook = async (nome: string, dia_aniversario: string, contato_id: string) => {
        try {
            const payload = buildBirthdayWebhookPayload({
                nome,
                data: dia_aniversario,
                contato_id
            })
            await $fetch('/api/admin/trigger-birthday-webhook', {
                method: 'POST',
                body: payload
            })
            return { success: true }
        } catch (e: any) {
            console.error('Error triggering webhook:', e)
            return { success: false, error: e.message }
        }
    }

    const goToNextMonth = () => {
        if (currentMonth.value === 12) {
            currentMonth.value = 1
            currentYear.value++
        } else {
            currentMonth.value++
        }
        fetchBirthdays()
    }

    const goToPrevMonth = () => {
        if (currentMonth.value === 1) {
            currentMonth.value = 12
            currentYear.value--
        } else {
            currentMonth.value--
        }
        fetchBirthdays()
    }

    const getBirthdaysForDay = (day: number): CrmArtorius[] => {
        const dayStr = String(day).padStart(2, '0')
        return birthdaysByDay.value[dayStr] || []
    }

    const hasBirthdayOnDay = (day: number): boolean => {
        const dayStr = String(day).padStart(2, '0')
        return !!birthdaysByDay.value[dayStr] && birthdaysByDay.value[dayStr].length > 0
    }

    const todayBirthdays = computed(() => {
        const today = new Date()
        const isCurrentMonth = currentMonth.value === today.getMonth() + 1 &&
            currentYear.value === today.getFullYear()

        if (!isCurrentMonth) return []

        return getBirthdaysForDay(today.getDate())
    })

    return {
        currentMonth,
        currentYear,
        birthdaysByDay,
        loading,
        error,
        todayBirthdays,
        fetchBirthdays,
        triggerWebhook,
        goToNextMonth,
        goToPrevMonth,
        getBirthdaysForDay,
        hasBirthdayOnDay
    }
}
