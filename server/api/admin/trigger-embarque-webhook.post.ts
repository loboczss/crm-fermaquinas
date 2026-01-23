export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { nome, data_embarque, observacoes } = body

  if (!nome || !data_embarque) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: nome, data_embarque'
    })
  }

  const config = useRuntimeConfig(event)
  const webhookUrl = config.public.webhookEmbarqueUrl as string

  if (!webhookUrl) {
    console.error('Webhook URL not configured in .env')
    throw createError({
      statusCode: 500,
      statusMessage: 'Webhook URL not configured'
    })
  }

  try {
    const response = await $fetch(webhookUrl, {
      method: 'POST',
      body: { nome, data_embarque, observacoes: observacoes || '' }
    })

    return {
      success: true,
      message: 'Webhook triggered successfully',
      response
    }
  } catch (error: any) {
    console.error('Webhook Error:', error.message)
    console.error('Error details:', error.response?._data || error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to trigger webhook'
    })
  }
})
