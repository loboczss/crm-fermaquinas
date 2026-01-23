import { createClient } from '@supabase/supabase-js'
import type { WebhookEventType } from '../../shared/constants/webhookEvents'

const TIME_ZONE = 'America/Sao_Paulo'

const getNowInTimeZone = () => {
  const nowText = new Date().toLocaleString('en-US', { timeZone: TIME_ZONE })
  return new Date(nowText)
}

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const addDays = (date: Date, days: number) => {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + days)
  return copy
}

const getWebhookUrl = () => {
  return process.env.NUXT_PUBLIC_WEBHOOK_BIRTHDAY_URL
}

const getSupabaseClient = () => {
  const supabaseUrl = process.env.NUXT_SUPABASE_URL
  const supabaseKey = process.env.NUXT_SUPABASE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase env vars')
  }

  return createClient(supabaseUrl, supabaseKey)
}

const sendToWebhook = async (data: any) => {
  const webhookUrl = getWebhookUrl()

  if (!webhookUrl) {
    throw new Error('Webhook URL not configured')
  }

  try {
    await $fetch(webhookUrl, {
      method: 'POST',
      body: data
    })
    return { status: 'success' }
  } catch (e: any) {
    return { status: 'failed', error: e.message }
  }
}

const triggerBirthdayWebhooks = async (date: Date, eventType: string) => {
  const supabase = getSupabaseClient()

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const birthdayFilter = `%-${month}-${day}`

  const { data: birthdays, error } = await supabase
    .from('crm_evastur')
    .select('nome, nome_social, contato_id, data_nascimento')
    .ilike('data_nascimento', birthdayFilter)

  if (error) {
    console.error('[Webhook] Erro ao buscar aniversariantes:', error)
    throw error
  }

  const results = []
  for (const person of birthdays || []) {
    const nome = person.nome || person.nome_social || 'Sem nome'
    const contato_id = person.contato_id || 'unknown'

    const result = await sendToWebhook({
      tipo_evento: eventType,
      nome,
      data_nascimento: person.data_nascimento,
      contato_id,
      data_referencia: formatDate(date)
    })

    results.push({ nome, ...result })
  }

  return results
}

const triggerEmbarqueWebhooks = async (startDate: Date, eventType: string) => {
  const supabase = getSupabaseClient()

  const start = formatDate(startDate)
  const end = formatDate(addDays(startDate, 1))

  const { data: embarques, error } = await supabase
    .from('historico_vendas_evastur')
    .select('contact_name, embarque, obs_pendencias, observacao, fornecedor, contato_id')
    .gte('embarque', start)
    .lt('embarque', end)

  if (error) {
    console.error('[Webhook] Erro ao buscar embarques:', error)
    throw error
  }

  const results = []
  for (const item of embarques || []) {
    const nome = item.contact_name || 'Sem nome'
    const contato_id = item.contato_id || 'unknown'
    const data_embarque = item.embarque || ''

    const result = await sendToWebhook({
      tipo_evento: eventType,
      nome,
      contato_id,
      data_embarque,
      fornecedor: item.fornecedor || '',
      observacoes: [item.obs_pendencias, item.observacao].filter(Boolean).join(' | '),
      data_referencia: start
    })

    results.push({ nome, ...result })
  }

  return results
}

const triggerFollowUpWebhooks = async (eventType: string) => {
  const supabase = getSupabaseClient()
  const now = getNowInTimeZone()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  // Buscar todas as mensagens
  const { data: messages, error } = await supabase
    .from('historico_msg_evastur')
    .select('contato_id, contact_name, created_at, message_type')
    .lt('created_at', oneDayAgo.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Webhook] Erro ao buscar mensagens:', error)
    throw error
  }

  // Agrupar por contato_id e pegar a última mensagem de cada
  const contactMap = new Map()
  for (const msg of messages || []) {
    if (!contactMap.has(msg.contato_id)) {
      contactMap.set(msg.contato_id, msg)
    }
  }

  // Filtrar apenas os que têm última mensagem como outgoing
  const results = []
  for (const [contato_id, lastMsg] of contactMap.entries()) {
    if (lastMsg.message_type === 'outgoing') {
      const result = await sendToWebhook({
        tipo_evento: eventType,
        nome: lastMsg.contact_name || 'Sem nome',
        contato_id,
        ultima_mensagem: lastMsg.created_at,
        data_referencia: formatDate(now)
      })

      results.push({ nome: lastMsg.contact_name, ...result })
    }
  }

  return results
}

const triggerClientesInativosWebhooks = async (eventType: string) => {
  const supabase = getSupabaseClient()
  const now = getNowInTimeZone()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Buscar vendas dos últimos 30 dias
  const { data: recentSales, error: salesError } = await supabase
    .from('historico_vendas_evastur')
    .select('contato_id')
    .gte('created_at', thirtyDaysAgo.toISOString())

  if (salesError) {
    console.error('[Webhook] Erro ao buscar vendas recentes:', salesError)
    throw salesError
  }

  const activeContactIds = new Set((recentSales || []).map((s: any) => s.contato_id))

  // Buscar todos os clientes
  const { data: allClients, error: clientsError } = await supabase
    .from('crm_evastur')
    .select('contato_id, nome, nome_social, data_nascimento')

  if (clientsError) {
    console.error('[Webhook] Erro ao buscar clientes:', clientsError)
    throw clientsError
  }

  // Filtrar clientes inativos
  const results = []
  for (const client of allClients || []) {
    if (!activeContactIds.has(client.contato_id)) {
      const nome = client.nome || client.nome_social || 'Sem nome'

      const result = await sendToWebhook({
        tipo_evento: eventType,
        nome,
        contato_id: client.contato_id,
        data_nascimento: client.data_nascimento,
        dias_sem_compra: 30,
        data_referencia: formatDate(now)
      })

      results.push({ nome, ...result })
    }
  }

  return results
}

export const triggerWebhookEvent = async (eventType: WebhookEventType, baseDate?: string) => {
  const now = getNowInTimeZone()
  const dateBase = baseDate ? new Date(baseDate) : now

  console.log(`[Webhook] Disparando evento: ${eventType}`)

  switch (eventType) {
    case 'aniversario_hoje':
      return triggerBirthdayWebhooks(dateBase, 'aniversario_hoje')
    case 'aniversario_amanha':
      return triggerBirthdayWebhooks(addDays(dateBase, 1), 'aniversario_amanha')
    case 'embarque_hoje':
      return triggerEmbarqueWebhooks(dateBase, 'embarque_hoje')
    case 'embarque_d1':
      return triggerEmbarqueWebhooks(addDays(dateBase, 1), 'embarque_d1')
    case 'followup_pendente':
      return triggerFollowUpWebhooks('followup_pendente')
    case 'clientes_inativos_30d':
      return triggerClientesInativosWebhooks('clientes_inativos_30d')
    default:
      return []
  }
}

export const getCurrentTimeInTimeZone = () => {
  const now = getNowInTimeZone()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
