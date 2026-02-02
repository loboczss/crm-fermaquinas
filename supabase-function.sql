-- Função SQL para otimizar a consulta de estatísticas dos vendedores
-- Execute este SQL no Supabase SQL Editor para melhorar a performance

CREATE OR REPLACE FUNCTION get_vendedores_stats()
RETURNS TABLE (
  nome TEXT,
  total_conversas BIGINT,
  total_vendas BIGINT,
  valor_total_vendas NUMERIC
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH vendedores_conversas AS (
    SELECT 
      sender_name as nome,
      COUNT(DISTINCT contato_id) as total_conversas
    FROM historico_msg_artorius 
    WHERE message_type = 'outgoing' 
      AND sender_name IS NOT NULL 
      AND sender_name != ''
    GROUP BY sender_name
  ),
  vendedores_vendas AS (
    SELECT 
      vendedor as nome,
      COUNT(*) as total_vendas,
      COALESCE(SUM(valor_total), 0) as valor_total_vendas
    FROM vendas
    GROUP BY vendedor
  )
  SELECT 
    COALESCE(vc.nome, vv.nome) as nome,
    COALESCE(vc.total_conversas, 0) as total_conversas,
    COALESCE(vv.total_vendas, 0) as total_vendas,
    COALESCE(vv.valor_total_vendas, 0) as valor_total_vendas
  FROM vendedores_conversas vc
  FULL OUTER JOIN vendedores_vendas vv ON vc.nome = vv.nome
  WHERE COALESCE(vc.nome, vv.nome) IS NOT NULL
  ORDER BY COALESCE(vv.total_vendas, 0) DESC;
END;
$$;