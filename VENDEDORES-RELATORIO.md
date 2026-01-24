# Relatório de Vendedores

## Funcionalidades Implementadas

### 1. Tabela de Vendedores
- **Localização**: `/app/pages/relatorios.vue`
- **Componente**: `VendedoresTable.vue`
- **Composable**: `useVendedores.ts`

### 2. Dados Exibidos
- **Nome do Vendedor**: Extraído da coluna `sender_name` com `message_type = 'outgoing'`
- **Total de Conversas**: Contagem única de `contato_id` por vendedor
- **Total de Vendas**: Contagem de vendas na tabela `vendas` por vendedor
- **Valor Total**: Soma dos valores das vendas por vendedor

### 3. Performance
- **API Endpoint**: `/server/api/admin/vendedores-stats.get.ts`
- **Função SQL**: `supabase-function.sql` (opcional para melhor performance)

## Como usar

1. Acesse a página `/relatorios`
2. A tabela carrega automaticamente
3. Use o botão "Atualizar" para recarregar os dados

## Otimização (Opcional)

Execute o SQL em `supabase-function.sql` no Supabase SQL Editor para melhor performance.