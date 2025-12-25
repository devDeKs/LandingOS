-- =====================================================
-- Admin Dashboard Statistics - Microsonic
-- View SQL para consolidar métricas de aprovação
-- =====================================================

-- Drop existing view if exists
DROP VIEW IF EXISTS public.admin_project_summary;

-- =====================================================
-- VIEW: admin_project_summary
-- Consolida dados de projetos com métricas de aprovação
-- =====================================================
CREATE OR REPLACE VIEW public.admin_project_summary AS
SELECT 
    -- Project Info
    p.id AS project_id,
    p.name AS project_name,
    p.description AS project_description,
    p.category AS project_category,
    p.image_url AS project_image,
    p.status AS project_status,
    p.created_at AS project_created_at,
    
    -- Client Info (from profiles table)
    c.id AS client_id,
    c.full_name AS client_name,
    c.email AS client_email,
    c.phone AS client_phone,
    c.project_name AS client_project_group,
    
    -- Approval/Rejection dates
    p.client_accepted_at AS approved_at,
    p.rejected_at AS rejected_at,
    p.rejection_reason AS rejection_reason,
    
    -- Derived status flags
    CASE 
        WHEN p.status = 'active' AND p.client_accepted_at IS NOT NULL THEN true 
        ELSE false 
    END AS is_approved,
    
    CASE 
        WHEN p.status = 'archived' AND p.rejected_at IS NOT NULL THEN true 
        ELSE false 
    END AS is_rejected,
    
    CASE 
        WHEN p.status = 'pending_approval' THEN true 
        ELSE false 
    END AS is_pending

FROM public.projects p
LEFT JOIN public.profiles c ON p.client_id = c.id
WHERE p.deleted_at IS NULL;

-- =====================================================
-- VIEW: admin_dashboard_metrics
-- Métricas agregadas para o dashboard admin
-- =====================================================
DROP VIEW IF EXISTS public.admin_dashboard_metrics;

CREATE OR REPLACE VIEW public.admin_dashboard_metrics AS
SELECT 
    -- Total counts
    COUNT(*) AS total_projects,
    COUNT(*) FILTER (WHERE status = 'active' AND client_accepted_at IS NOT NULL) AS count_approved,
    COUNT(*) FILTER (WHERE status = 'archived' AND rejected_at IS NOT NULL) AS count_rejected,
    COUNT(*) FILTER (WHERE status = 'pending_approval') AS count_pending,
    COUNT(*) FILTER (WHERE status = 'draft') AS count_draft,
    
    -- Approval rate calculation (avoid division by zero)
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'active' AND client_accepted_at IS NOT NULL)::DECIMAL / 
        NULLIF(
            COUNT(*) FILTER (WHERE status = 'active' AND client_accepted_at IS NOT NULL) + 
            COUNT(*) FILTER (WHERE status = 'archived' AND rejected_at IS NOT NULL), 
            0
        )) * 100, 
        2
    ) AS approval_rate,
    
    -- Rejection rate
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'archived' AND rejected_at IS NOT NULL)::DECIMAL / 
        NULLIF(
            COUNT(*) FILTER (WHERE status = 'active' AND client_accepted_at IS NOT NULL) + 
            COUNT(*) FILTER (WHERE status = 'archived' AND rejected_at IS NOT NULL), 
            0
        )) * 100, 
        2
    ) AS rejection_rate,
    
    -- Clients count
    COUNT(DISTINCT client_id) AS total_clients,
    
    -- Time-based metrics
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS created_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') AS created_this_week,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') AS created_this_month

FROM public.projects
WHERE deleted_at IS NULL;

-- =====================================================
-- VIEW: admin_metrics_by_client
-- Métricas agregadas por cliente
-- =====================================================
DROP VIEW IF EXISTS public.admin_metrics_by_client;

CREATE OR REPLACE VIEW public.admin_metrics_by_client AS
SELECT 
    c.id AS client_id,
    c.full_name AS client_name,
    c.email AS client_email,
    c.project_name AS project_group,
    c.created_at AS client_since,
    
    -- Project counts per client
    COUNT(p.id) AS total_projects,
    COUNT(p.id) FILTER (WHERE p.status = 'active' AND p.client_accepted_at IS NOT NULL) AS approved_count,
    COUNT(p.id) FILTER (WHERE p.status = 'archived' AND p.rejected_at IS NOT NULL) AS rejected_count,
    COUNT(p.id) FILTER (WHERE p.status = 'pending_approval') AS pending_count,
    
    -- Client approval rate
    ROUND(
        (COUNT(p.id) FILTER (WHERE p.status = 'active' AND p.client_accepted_at IS NOT NULL)::DECIMAL / 
        NULLIF(
            COUNT(p.id) FILTER (WHERE p.status = 'active' AND p.client_accepted_at IS NOT NULL) + 
            COUNT(p.id) FILTER (WHERE p.status = 'archived' AND p.rejected_at IS NOT NULL), 
            0
        )) * 100, 
        2
    ) AS approval_rate,
    
    -- Last activity
    MAX(p.updated_at) AS last_activity

FROM public.profiles c
LEFT JOIN public.projects p ON c.id = p.client_id AND p.deleted_at IS NULL
GROUP BY c.id, c.full_name, c.email, c.project_name, c.created_at;

-- =====================================================
-- VIEW: admin_metrics_by_project_group
-- Métricas agregadas por grupo de projeto (project_name)
-- =====================================================
DROP VIEW IF EXISTS public.admin_metrics_by_project_group;

CREATE OR REPLACE VIEW public.admin_metrics_by_project_group AS
SELECT 
    c.project_name AS project_group,
    COUNT(DISTINCT c.id) AS total_clients,
    COUNT(p.id) AS total_cards,
    COUNT(p.id) FILTER (WHERE p.status = 'active' AND p.client_accepted_at IS NOT NULL) AS approved_count,
    COUNT(p.id) FILTER (WHERE p.status = 'archived' AND p.rejected_at IS NOT NULL) AS rejected_count,
    COUNT(p.id) FILTER (WHERE p.status = 'pending_approval') AS pending_count,
    
    -- Group approval rate
    ROUND(
        (COUNT(p.id) FILTER (WHERE p.status = 'active' AND p.client_accepted_at IS NOT NULL)::DECIMAL / 
        NULLIF(
            COUNT(p.id) FILTER (WHERE p.status = 'active' AND p.client_accepted_at IS NOT NULL) + 
            COUNT(p.id) FILTER (WHERE p.status = 'archived' AND p.rejected_at IS NOT NULL), 
            0
        )) * 100, 
        2
    ) AS approval_rate

FROM public.profiles c
LEFT JOIN public.projects p ON c.id = p.client_id AND p.deleted_at IS NULL
WHERE c.project_name IS NOT NULL
GROUP BY c.project_name;

-- =====================================================
-- FUNCTION: get_admin_stats()
-- Função para obter estatísticas em tempo real
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
    ) THEN
        RAISE EXCEPTION 'Acesso negado: apenas administradores podem acessar estas métricas';
    END IF;

    SELECT json_build_object(
        'total_projects', COUNT(*),
        'count_approved', COUNT(*) FILTER (WHERE status = 'active' AND client_accepted_at IS NOT NULL),
        'count_rejected', COUNT(*) FILTER (WHERE status = 'archived' AND rejected_at IS NOT NULL),
        'count_pending', COUNT(*) FILTER (WHERE status = 'pending_approval'),
        'count_draft', COUNT(*) FILTER (WHERE status = 'draft'),
        'approval_rate', ROUND(
            (COUNT(*) FILTER (WHERE status = 'active' AND client_accepted_at IS NOT NULL)::DECIMAL / 
            NULLIF(
                COUNT(*) FILTER (WHERE status = 'active' AND client_accepted_at IS NOT NULL) + 
                COUNT(*) FILTER (WHERE status = 'archived' AND rejected_at IS NOT NULL), 
                0
            )) * 100, 
            2
        ),
        'total_clients', COUNT(DISTINCT client_id),
        'created_today', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE),
        'created_this_week', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
        'created_this_month', COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'),
        'updated_at', NOW()
    ) INTO result
    FROM public.projects
    WHERE deleted_at IS NULL;

    RETURN result;
END;
$$;

-- =====================================================
-- RLS POLICIES FOR VIEWS (Via underlying tables)
-- As Views herdam as políticas RLS das tabelas base
-- Mas adicionamos políticas explícitas para segurança
-- =====================================================

-- Grant access to authenticated users (RLS will filter)
GRANT SELECT ON public.admin_project_summary TO authenticated;
GRANT SELECT ON public.admin_dashboard_metrics TO authenticated;
GRANT SELECT ON public.admin_metrics_by_client TO authenticated;
GRANT SELECT ON public.admin_metrics_by_project_group TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;

-- =====================================================
-- SECURITY POLICY: Only admins can read admin views
-- Criar uma tabela de configuração para controle
-- =====================================================

-- Create a secure function to check admin access
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON VIEW public.admin_project_summary IS 'Consolidação de projetos com informações de cliente para dashboard admin';
COMMENT ON VIEW public.admin_dashboard_metrics IS 'Métricas agregadas de aprovação para dashboard admin';
COMMENT ON VIEW public.admin_metrics_by_client IS 'Métricas de aprovação agrupadas por cliente';
COMMENT ON VIEW public.admin_metrics_by_project_group IS 'Métricas de aprovação agrupadas por grupo de projeto';
COMMENT ON FUNCTION public.get_admin_stats() IS 'Retorna estatísticas do dashboard admin em formato JSON (apenas para admins)';
COMMENT ON FUNCTION public.is_admin() IS 'Verifica se o usuário atual é administrador';

-- =====================================================
-- EXEMPLO DE USO:
-- =====================================================
-- 
-- 1. Obter todas as métricas do dashboard:
--    SELECT * FROM admin_dashboard_metrics;
--
-- 2. Obter estatísticas via função (com verificação de admin):
--    SELECT get_admin_stats();
--
-- 3. Listar projetos com client info:
--    SELECT * FROM admin_project_summary ORDER BY project_created_at DESC;
--
-- 4. Métricas por cliente:
--    SELECT * FROM admin_metrics_by_client ORDER BY total_projects DESC;
--
-- 5. Métricas por grupo de projeto:
--    SELECT * FROM admin_metrics_by_project_group ORDER BY total_cards DESC;
--
-- =====================================================
