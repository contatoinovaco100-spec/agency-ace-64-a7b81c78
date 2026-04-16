
-- Table to control which clients each user can see
CREATE TABLE public.user_client_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, client_id)
);

ALTER TABLE public.user_client_access ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins manage client access" ON public.user_client_access
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can see their own access entries
CREATE POLICY "Users can view own access" ON public.user_client_access
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Also add a profiles insert policy so the trigger can create profiles
CREATE POLICY "Allow insert via trigger" ON public.profiles
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users to read all profiles (for admin page)
CREATE POLICY "Authenticated users can read all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (true);
