import { WEBHOOK_EVENT_OPTIONS } from '../../../../shared/constants/webhookEvents'
import { triggerWebhookEvent } from '../../../utils/webhook-events'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Accept both legacy and new payload shapes:
    // legacy: { eventType, date }
    // new: { tipo_evento, data, nome, contato_id, ... }
    const eventType = body.eventType || body.tipo_evento || body.nome_evento
    const date = body.date || body.data || body.data_referencia || null

    console.log('[Trigger Webhook] Recebido:', { eventType, date })

    const allowedEvents = new Set(WEBHOOK_EVENT_OPTIONS.map((item) => item.value))

    if (!eventType || !allowedEvents.has(eventType)) {
      console.error('[Trigger Webhook] Tipo de evento inválido:', eventType)
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid event type'
      })
    }

    console.log('[Trigger Webhook] Disparando evento:', eventType)
    const results = await triggerWebhookEvent(eventType, date)

    console.log('[Trigger Webhook] Resultados:', results)
    return { success: true, results }
  } catch (e: any) {
    console.error('[Trigger Webhook] Erro:', e)
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Failed to trigger webhook event'
    })
  }
})
