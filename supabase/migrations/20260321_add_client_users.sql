CREATE TABLE public.client_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, client_id)
);

ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read" 
ON public.client_users FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated insert" 
ON public.client_users FOR INSERT 
TO authenticated 
WITH CHECK (true);
