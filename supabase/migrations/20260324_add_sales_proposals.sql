
-- Create sales_proposals table
CREATE TABLE IF NOT EXISTS public.sales_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sales_proposals_updated_at
    BEFORE UPDATE ON public.sales_proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE public.sales_proposals ENABLE ROW LEVEL SECURITY;

-- Allow public read access to proposals by slug
CREATE POLICY "Allow public read access to proposals by slug"
ON public.sales_proposals FOR SELECT
USING (true);

-- Allow authenticated users to manage proposals
CREATE POLICY "Allow authenticated users to manage proposals"
ON public.sales_proposals FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
