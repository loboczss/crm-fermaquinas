import { getCurrentTimeInTimeZone, triggerWebhookEvent } from '../utils/webhook-events'
import { WEBHOOK_EVENT_OPTIONS, type WebhookEventType } from '../../shared/constants/webhookEvents'

export default defineTask({
  meta: {
    name: 'webhook-events',
    description: 'Runs webhook events based on schedule stored in eventos_webhook'
  },
  async run() {
    console.log('--- Scheduled Task: Webhook Events ---')

    const supabaseUrl = process.env.NUXT_SUPABASE_URL
    const supabaseKey = process.env.NUXT_SUPABASE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Task aborted: Missing environment variables')
      return { result: 'Missing environment variables' }
    }

    const nowTime = getCurrentTimeInTimeZone()
    console.log(`Checking events for time: ${nowTime}`)

    try {
      interface WebhookEventRow {
        id: number
        nome_evento: string | null
        horario_evento: string | null
        acao_evento: string | null
      }

      let allEvents: WebhookEventRow[] = []
      let from = 0
      const step = 1000
      let hasMore = true

      while (hasMore) {
        const res = await $fetch(`${supabaseUrl}/rest/v1/eventos_webhook?select=id,nome_evento,horario_evento,acao_evento&acao_evento=eq.webhook`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Range: `${from}-${from + step - 1}`
          }
        })

        const data = res as WebhookEventRow[]
        if (data && data.length > 0) {
          allEvents = [...allEvents, ...data]
          from += step
          hasMore = data.length === step
        } else {
          hasMore = false
        }
      }

      const allowedEvents = new Set(WEBHOOK_EVENT_OPTIONS.map((item) => item.value))
      const dueEvents = allEvents.filter((item) => item.horario_evento === nowTime && item.nome_evento && allowedEvents.has(item.nome_evento))

      if (dueEvents.length === 0) {
        return { result: 'No events to run' }
      }

      const results = []
      for (const event of dueEvents) {
        const eventType = event.nome_evento as WebhookEventType
        const output = await triggerWebhookEvent(eventType)
        results.push({ eventType, triggered: output.length })
      }

      return { result: 'Events executed', details: results }
    } catch (e: any) {
      console.error('Task failed:', e.message)
      return { result: 'Task failed', error: e.message }
    }
  }
})
