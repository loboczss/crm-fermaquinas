import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event)

  try {
    const { data, error } = await supabase
      .from('eventos_webhook')
      .select('id, created_at, nome_evento, horario_evento, acao_evento, evento_ativo')
      .order('created_at', { ascending: false })

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return {
      success: true,
      data: data || []
    }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Failed to fetch webhook events'
    })
  }
})
