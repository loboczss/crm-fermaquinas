export default defineTask({
    meta: {
        name: 'birthday',
        description: 'Triggers webhooks for customers having birthdays today'
    },
    async run() {
        console.log('--- Scheduled Task: Birthday Automation ---')

        // 1. Get today's month and day
        const today = new Date()
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        const birthdayFilter = `%-${month}-${day}`

        const supabaseUrl = process.env.NUXT_SUPABASE_URL
        const supabaseKey = process.env.NUXT_SUPABASE_KEY
        const webhookUrl = process.env.NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL

        if (!supabaseUrl || !supabaseKey || !webhookUrl) {
            console.error('Task aborted: Missing environment variables')
            return { result: 'Missing environment variables' }
        }

        try {
            console.log(`Searching for birthdays on: ${month}-${day}`)
            const res = await $fetch(`${supabaseUrl}/rest/v1/crm_artorius?data_nascimento=ilike.${birthdayFilter}&select=nome,nome_social,contato_id,data_nascimento`, {
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
