-- Create diagnostics table
CREATE TABLE IF NOT EXISTS public.diagnostics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can manage their own diagnostics"
  ON public.diagnostics FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can read diagnostics by slug"
  ON public.diagnostics FOR SELECT TO anon, authenticated USING (true);
