import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineTask({
    meta: {
        name: 'birthday-automation',
        description: 'Triggers webhooks for customers having birthdays today'
    },
    async run({ payload, context }) {
        console.log('Running birthday automation task...')

        // 1. Get today's month and day
        const today = new Date()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        const birthdayFilter = `%-${month}-${day}` // Assuming YYYY-MM-DD

        // 2. Initialize Supabase (We need to handle events here carefully in tasks)
        // Nitro tasks don't have the same context as event handlers, so we might need a different approach 
        // to get the client if serverSupabaseClient requires an event.
        // However, in Nitro tasks we can use service role for automation.

        const supabaseUrl = process.env.NUXT_SUPABASE_URL
        const supabaseKey = process.env.NUXT_SUPABASE_KEY // Ideally Service Role Key for background tasks
        const webhookUrl = process.env.NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL

        if (!supabaseUrl || !supabaseKey || !webhookUrl) {
            return { result: 'Missing environment variables' }
        }

        try {
            // Manual fetch or use a fetch-based approach if serverSupabaseClient isn't ready for tasks
            // For simplicity and since we are in a task, let's use a direct fetch to Supabase REST API
            const res = await $fetch(`${supabaseUrl}/rest/v1/crm_evastur?data_nascimento=ilike.${birthdayFilter}&select=nome,nome_social,contato_id,data_nascimento`, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            })

            const birthdays = res as any[]
            console.log(`Found ${birthdays.length} birthdays today.`)

            const results = []
            for (const person of birthdays) {
                const nome = person.nome || person.nome_social || 'Sem nome'
                const contato_id = person.contato_id || 'unknown'

                console.log(`Triggering webhook for ${nome}...`)

                try {
                    await $fetch(webhookUrl, {
                        method: 'POST',
                        body: {
                            nome,
                            dia_aniversario: person.data_nascimento,
                            contato_id
                        }
                    })
                    results.push({ nome, status: 'success' })
                } catch (e: any) {
                    console.error(`Failed to trigger webhook for ${nome}:`, e.message)
                    results.push({ nome, status: 'failed', error: e.message })
                }
            }

            return { result: 'Automation completed', triggered: results.length, details: results }

        } catch (e: any) {
            console.error('Task failed:', e.message)
            return { result: 'Task failed', error: e.message }
        }
    }
})
