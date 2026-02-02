import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const month = query.month as string
  const year = query.year as string

  if (!month || !year) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Month and year are required'
    })
  }

  const supabase = await serverSupabaseClient<Database>(event)

  const monthNumber = Number(month)
  const yearNumber = Number(year)

  if (Number.isNaN(monthNumber) || Number.isNaN(yearNumber)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid month or year'
    })
  }

  const pad = (value: number) => String(value).padStart(2, '0')
  const startDate = `${year}-${pad(monthNumber)}-01`
  const nextMonthDate = new Date(yearNumber, monthNumber, 1)
  const nextMonth = pad(nextMonthDate.getMonth() + 1)
  const nextMonthYear = nextMonthDate.getFullYear()
  const endDateExclusive = `${nextMonthYear}-${nextMonth}-01`

  try {
    const pad = (value: number) => String(value).padStart(2, '0')
    const startDate = `${year}-${pad(monthNumber)}-01`
    const nextMonthDate = new Date(yearNumber, monthNumber, 1)
    const nextMonth = pad(nextMonthDate.getMonth() + 1)
    const nextMonthYear = nextMonthDate.getFullYear()
    const endDateExclusive = `${nextMonthYear}-${nextMonth}-01`

    let allRows: any[] = []
    let from = 0
    const pageSize = 1000
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from('historico_vendas_artorius')
        .select('id, contact_name, embarque, contato_id, fornecedor, obs_pendencias, observacao')
        .gte('embarque', startDate)
        .lt('embarque', endDateExclusive)
        .range(from, from + pageSize - 1)

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: error.message
        })
      }

      if (data && data.length > 0) {
        allRows = [...allRows, ...data]
        from += pageSize
        hasMore = data.length === pageSize
      } else {
        hasMore = false
      }
    }

    const embarquesByDay: Record<string, any[]> = {}

    allRows.forEach((item) => {
      if (!item.embarque) return
      const datePart = item.embarque.split('T')[0]
      const day = datePart.split('-')[2]

      if (!embarquesByDay[day]) {
        embarquesByDay[day] = []
      }

      embarquesByDay[day].push(item)
    })

    return {
      success: true,
      data: embarquesByDay,
      month,
      year
    }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e.message || 'Failed to fetch embarques'
    })
  }
})
