import { createClient } from '@supabase/supabase-js'
import { WEBHOOK_EVENT_OPTIONS } from '../../../../shared/constants/webhookEvents'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)
  const body = await readBody(event)
  const { nome_evento, horario_evento, acao_evento } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event id'
    })
  }

  const allowedEvents = new Set(WEBHOOK_EVENT_OPTIONS.map((item) => item.value))

  if (!nome_evento || !allowedEvents.has(nome_evento)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event name'
    })
  }

  if (!horario_evento) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event time is required'
    })
  }

  const supabaseUrl = process.env.NUXT_SUPABASE_URL
  const supabaseKey = process.env.NUXT_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing Supabase configuration'
    })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    const { data, error } = await supabase
      .from('eventos_webhook')
      .update({
        nome_evento,
        horario_evento,
        acao_evento: acao_evento || 'webhook'
      })
      .eq('id', id)
      .select('id, created_at, nome_evento, horario_evento, acao_evento')
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return {
      success: true,
      data
    }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Failed to update webhook event'
    })
  }
})
