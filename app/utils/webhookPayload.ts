// Função utilitária para padronizar o payload do webhook
// Sempre retorna o objeto no formato desejado

export interface WebhookPayload {
  tipo_evento: string;
  nome: string;
  data: string;
  contato_id: string;
  observacoes?: string;
}

// birthday
export function buildBirthdayWebhookPayload({ nome, data, contato_id }: { nome: string; data: string; contato_id: string }): WebhookPayload {
  return {
    tipo_evento: 'aniversario_hoje',
    nome,
    data,
    contato_id,
  };
}

// embarque
export function buildEmbarqueWebhookPayload({ nome, data, contato_id, observacoes }: { nome: string; data: string; contato_id: string; observacoes?: string }): WebhookPayload {
  return {
    tipo_evento: 'embarque',
    nome,
    data,
    contato_id,
    observacoes
  };
}

// evento genérico
export function buildGenericWebhookPayload({ tipo_evento, nome, data, contato_id }: { tipo_evento: string; nome: string; data: string; contato_id: string }): WebhookPayload {
  return {
    tipo_evento,
    nome,
    data,
    contato_id,
  };
}
