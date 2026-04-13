-- Create client_briefings table
CREATE TABLE IF NOT EXISTS public.client_briefings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name text NOT NULL DEFAULT '',
  responsible_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  segment text NOT NULL DEFAULT '',
  instagram text NOT NULL DEFAULT '',
  goals_3_months text NOT NULL DEFAULT '',
  target_age_range text NOT NULL DEFAULT '',
  target_gender text NOT NULL DEFAULT '',
  audience_pain_points text NOT NULL DEFAULT '',
  audience_desires text NOT NULL DEFAULT '',
  purchase_triggers text NOT NULL DEFAULT '',
  purchase_blockers text NOT NULL DEFAULT '',
  current_perception text NOT NULL DEFAULT '',
  desired_perception text NOT NULL DEFAULT '',
  differentials text NOT NULL DEFAULT '',
  competitors text NOT NULL DEFAULT '',
  communication_style text NOT NULL DEFAULT '',
  things_to_avoid text NOT NULL DEFAULT '',
  monthly_revenue text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'novo',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.client_briefings ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (public form)
CREATE POLICY "Anyone can insert briefings"
  ON public.client_briefings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users to read all briefings
CREATE POLICY "Authenticated users can read briefings"
  ON public.client_briefings
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update briefings
CREATE POLICY "Authenticated users can update briefings"
  ON public.client_briefings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete briefings
CREATE POLICY "Authenticated users can delete briefings"
  ON public.client_briefings
  FOR DELETE
  TO authenticated
  USING (true);
