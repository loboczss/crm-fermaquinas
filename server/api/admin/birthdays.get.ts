import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const month = query.month as string
    const year = query.year as string

    if (!month || !year) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Month and year are required'
        })
    }

    const supabase = await serverSupabaseClient<Database>(event)

    try {
        const birthdayPattern = `%-${month}-%`

        const { data, error } = await supabase
            .from('crm_evastur')
            .select('id, nome, nome_social, data_nascimento, contato_id')
            .filter('data_nascimento', 'ilike', birthdayPattern)

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: error.message
            })
        }

        const filteredBirthdays = (data || []) as any[]

        const birthdaysByDay: Record<string, typeof filteredBirthdays> = {}

        filteredBirthdays.forEach((person) => {
            const day = person.data_nascimento.split('-')[2]

            if (!birthdaysByDay[day]) {
                birthdaysByDay[day] = []
            }

            birthdaysByDay[day].push(person)
        })

        return {
            success: true,
            data: birthdaysByDay,
            month,
            year
        }
    } catch (e: any) {
        throw createError({
            statusCode: 500,
            statusMessage: e.message || 'Failed to fetch birthdays'
        })
    }
})
