
import { ref } from '#imports'
import type { WebhookEvent } from '~~/shared/types/WebhookEvent'
import type { WebhookEventType } from '~~/shared/constants/webhookEvents'
import { buildGenericWebhookPayload } from '~/utils/webhookPayload'

export const useWebhookEvents = () => {
  const events = ref<WebhookEvent[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  const fetchEvents = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ data: WebhookEvent[] }>('/api/admin/webhook-events')
      events.value = response.data || []
    } catch (e: any) {
      error.value = e.message || 'Erro ao carregar eventos'
      events.value = []
    } finally {
      loading.value = false
    }
  }

  const createEvent = async (payload: { nome_evento: WebhookEventType; horario_evento: string; acao_evento: string }) => {
    saving.value = true
    error.value = null

    try {
      await $fetch<{ data: WebhookEvent }>('/api/admin/webhook-events', {
        method: 'POST',
        body: payload
      })

      // Recarregar lista completa para garantir sincronização
      await fetchEvents()
    } catch (e: any) {
      error.value = e.message || 'Erro ao criar evento'
      throw e
    } finally {
      saving.value = false
    }
  }

  const updateEvent = async (id: number, payload: { nome_evento: WebhookEventType; horario_evento: string; acao_evento: string }) => {
    saving.value = true
    error.value = null

    try {
      const response = await $fetch<{ data: WebhookEvent }>(`/api/admin/webhook-events/${id}`, {
        method: 'PUT',
        body: payload
      })

      events.value = events.value.map((item) => (item.id === id ? response.data : item))
      return response.data
    } catch (e: any) {
      error.value = e.message || 'Erro ao atualizar evento'
      throw e
    } finally {
      saving.value = false
    }
  }

  const deleteEvent = async (id: number) => {
    saving.value = true
    error.value = null

    try {
      await $fetch(`/api/admin/webhook-events/${id}`, {
        method: 'DELETE'
      })

      events.value = events.value.filter((item) => item.id !== id)
    } catch (e: any) {
      error.value = e.message || 'Erro ao remover evento'
      throw e
    } finally {
      saving.value = false
    }
  }
  const triggerEvent = async (eventType: WebhookEventType, nome: string, data: string, contato_id: string) => {
    saving.value = true
    error.value = null
    try {
      const payload = buildGenericWebhookPayload({
        tipo_evento: eventType,
        nome,
        data,
        contato_id
      })
      await $fetch('/api/admin/webhook-events/trigger', {
        method: 'POST',
        body: payload
      })
    } catch (e: any) {
      error.value = e.message || 'Erro ao disparar evento'
      throw e
    } finally {
      saving.value = false
    }
  }

  return {
    events,
    loading,
    saving,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    triggerEvent
  }
}
