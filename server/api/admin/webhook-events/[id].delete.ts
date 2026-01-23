import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid event id'
    })
  }

  const supabase = await serverSupabaseClient<Database>(event)

  try {
    const { error } = await supabase
      .from('eventos_webhook')
      .delete()
      .eq('id', id)

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    return { success: true }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Failed to delete webhook event'
    })
  }
})
