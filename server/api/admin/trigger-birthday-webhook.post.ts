export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { nome, dia_aniversario, contato_id } = body

    if (!nome || !dia_aniversario || !contato_id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields: nome, dia_aniversario, contato_id'
        })
    }

    console.log('--- Webhook Trigger Activity ---')
    console.log('Data:', { nome, dia_aniversario, contato_id })

    const config = useRuntimeConfig(event)
    const webhookUrl = config.public.webhookBirthdayUrl as string
    console.log('Webhook URL (from config):', webhookUrl)

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
            body: { nome, dia_aniversario, contato_id }
        })

        console.log('Webhook Success:', response)
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
