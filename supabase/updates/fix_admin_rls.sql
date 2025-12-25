-- =====================================================
-- FIX DEFINITIVO: Admin vê todos os profiles
-- Execute este SQL no SQL Editor do Supabase
-- =====================================================

-- PASSO 1: Verificar usuários existentes
SELECT id, email, role, full_name, project_name 
FROM public.profiles;

-- PASSO 2: Criar função is_admin mais simples e segura
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = auth.uid();
    
    RETURN user_role IN ('admin', 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- PASSO 3: Remover TODAS as policies antigas de profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- PASSO 4: Criar policies simples e funcionais

-- Política de leitura: usuário vê próprio OU é admin vê todos
CREATE POLICY "profiles_read_policy" 
ON public.profiles 
FOR SELECT 
USING (
    auth.uid() = id  -- Usuário pode ver próprio perfil
    OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')  -- Admin vê todos
);

-- Política de atualização: usuário atualiza próprio OU admin atualiza todos
CREATE POLICY "profiles_update_policy" 
ON public.profiles 
FOR UPDATE 
USING (
    auth.uid() = id  
    OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'super_admin')
);

-- PASSO 5: Garantir que RLS está ativo
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- PASSO 6: Definir usuário admin (SUBSTITUA pelo email correto)
-- Primeiro veja a lista de emails:
SELECT email FROM public.profiles;

-- Depois atualize o admin:
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'andre@teste.com'; -- MUDE PARA SEU EMAIL

-- VERIFICAR RESULTADO:
SELECT id, email, role, full_name FROM public.profiles ORDER BY role, created_at;
