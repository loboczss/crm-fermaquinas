export default defineTask({
  meta: {
    name: 'embarque',
    description: 'Triggers webhooks for shipments one day before the embark date'
  },
  async run() {
    console.log('--- Scheduled Task: Embarque Automation ---')

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const dayAfter = new Date(tomorrow)
    dayAfter.setDate(tomorrow.getDate() + 1)

    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    const startDate = formatDate(tomorrow)
    const endDate = formatDate(dayAfter)

    const supabaseUrl = process.env.NUXT_SUPABASE_URL
    const supabaseKey = process.env.NUXT_SUPABASE_KEY
    const webhookUrl = process.env.NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL

    if (!supabaseUrl || !supabaseKey || !webhookUrl) {
      console.error('Task aborted: Missing environment variables')
      return { result: 'Missing environment variables' }
    }

    try {
      console.log(`Searching for embarques between ${startDate} and ${endDate}`)
      
      let allEmbarques: any[] = []
      let from = 0
      const step = 1000
      let hasMore = true

      while (hasMore) {
        const res = await $fetch(`${supabaseUrl}/rest/v1/historico_vendas_artorius?embarque=gte.${startDate}&embarque=lt.${endDate}&select=contact_name,embarque,obs_pendencias,observacao`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Range': `${from}-${from + step - 1}`
          }
        })
        
        const data = res as any[]
        if (data && data.length > 0) {
          allEmbarques = [...allEmbarques, ...data]
          from += step
          hasMore = data.length === step
        } else {
          hasMore = false
        }
      }

      console.log(`Found ${allEmbarques.length} embarques for tomorrow.`)

      const results = []
      for (const item of allEmbarques) {
        const nome = item.contact_name || 'Sem nome'
        const data_embarque = item.embarque || ''
        const observacoes = [item.obs_pendencias, item.observacao].filter(Boolean).join(' | ')

        try {
          await $fetch(webhookUrl, {
            method: 'POST',
            body: {
              nome,
              data_embarque,
              observacoes
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
