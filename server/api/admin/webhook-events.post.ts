import { createClient } from '@supabase/supabase-js'
import { WEBHOOK_EVENT_OPTIONS } from '../../../shared/constants/webhookEvents'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nome_evento, horario_evento, acao_evento } = body

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
      .insert({
        nome_evento,
        horario_evento,
        acao_evento: acao_evento || 'webhook',
        evento_ativo: acao_evento === 'webhook'
      })
      .select('id, created_at, nome_evento, horario_evento, acao_evento, evento_ativo')

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return {
      success: true,
      data: data?.[0] || data
    }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Failed to create webhook event'
    })
  }
})
