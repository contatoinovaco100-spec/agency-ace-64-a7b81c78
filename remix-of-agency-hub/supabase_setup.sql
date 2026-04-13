-- SUPABASE SETUP - DIAGNOSTIC PIPELINE (VERSÃO FINAL PRODUÇÃO)
-- 1. CRIAR A TABELA DE DIAGNÓSTICOS
CREATE TABLE IF NOT EXISTS public.diagnostics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    slug TEXT UNIQUE NOT NULL,
    client_name TEXT,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. HABILITAR RLS (Row Level Security)
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICAS DE ACESSO
-- Permite leitura pública (para os clientes verem o link)
CREATE POLICY "Leitura Pública de Diagnósticos" 
ON public.diagnostics FOR SELECT 
USING (true);

-- Permite inserção para usuários autenticados (consultores)
CREATE POLICY "Inserção para Consultores Autenticados" 
ON public.diagnostics FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Permite update para usuários autenticados (consultores)
CREATE POLICY "Update para Consultores Autenticados" 
ON public.diagnostics FOR UPDATE 
USING (auth.role() = 'authenticated');

-- 4. CONFIGURAR STORAGE (BUCKET task-attachments)
-- Nota: O bucket 'task-attachments' já deve existir via UI, 
-- mas estas políticas garantem que ele seja acessível.

-- Permite que qualquer um veja as imagens (público)
CREATE POLICY "Imagens Públicas"
ON storage.objects FOR SELECT
USING ( bucket_id = 'task-attachments' );

-- Permite que usuários autenticados subam imagens
CREATE POLICY "Upload para Consultores"
ON storage.objects FOR INSERT
WITH CHECK ( 
    bucket_id = 'task-attachments' 
    AND auth.role() = 'authenticated' 
);

-- 5. ATUALIZAR O CACHE DO ESQUEMA
-- (Execute isso no SQL Editor do Supabase se o erro persistir)
NOTIFY pgrst, 'reload schema';
