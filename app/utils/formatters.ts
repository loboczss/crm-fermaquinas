export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '-'
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

// Aceita string dd/mm/aaaa ou Date
export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return '-'
  if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    // dd/mm/aaaa
    const [dd, mm, yyyy] = value.split('/')
    return `${dd}/${mm}/${yyyy}`
  }
  const date = new Date(value)
  if (isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
