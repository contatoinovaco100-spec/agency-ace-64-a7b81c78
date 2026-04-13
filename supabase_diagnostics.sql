-- Create diagnostics table
CREATE TABLE IF NOT EXISTS public.diagnostics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    slug TEXT UNIQUE NOT NULL,
    title TEXT,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow all for authenticated users" ON public.diagnostics
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.diagnostics;
