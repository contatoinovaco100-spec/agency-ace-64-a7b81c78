CREATE TABLE public.client_meta_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  instagram_account_id text NOT NULL DEFAULT '',
  facebook_page_id text NOT NULL DEFAULT '',
  access_token text NOT NULL DEFAULT '',
  account_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id)
);

ALTER TABLE public.client_meta_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users manage meta accounts"
  ON public.client_meta_accounts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER update_client_meta_accounts_updated_at
  BEFORE UPDATE ON public.client_meta_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();