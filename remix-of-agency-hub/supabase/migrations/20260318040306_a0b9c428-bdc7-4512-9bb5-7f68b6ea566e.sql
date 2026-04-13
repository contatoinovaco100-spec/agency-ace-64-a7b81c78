
-- Module access enum
CREATE TYPE public.app_module AS ENUM ('comercial', 'operacional');

-- Table for module-level permissions per user
CREATE TABLE public.user_module_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module app_module NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module)
);

ALTER TABLE public.user_module_access ENABLE ROW LEVEL SECURITY;

-- Admins manage all
CREATE POLICY "Admins manage module access" ON public.user_module_access
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users read own
CREATE POLICY "Users view own module access" ON public.user_module_access
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
