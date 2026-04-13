
-- Contracts table
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  contractor_name TEXT NOT NULL DEFAULT '',
  contractor_cpf_cnpj TEXT NOT NULL DEFAULT '',
  contractor_address TEXT NOT NULL DEFAULT '',
  client_name TEXT NOT NULL DEFAULT '',
  client_cpf_cnpj TEXT NOT NULL DEFAULT '',
  client_email TEXT NOT NULL DEFAULT '',
  client_address TEXT NOT NULL DEFAULT '',
  services TEXT NOT NULL DEFAULT '',
  scope_description TEXT NOT NULL DEFAULT '',
  monthly_value NUMERIC NOT NULL DEFAULT 0,
  duration_months INTEGER NOT NULL DEFAULT 12,
  payment_due_day INTEGER NOT NULL DEFAULT 10,
  additional_clauses TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'rascunho',
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users manage contracts" ON public.contracts
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public can read for signing
CREATE POLICY "Public can read sent contracts" ON public.contracts
  FOR SELECT TO anon
  USING (status IN ('enviado', 'assinado'));

-- Contract signatures
CREATE TABLE public.contract_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  signer_name TEXT NOT NULL,
  signer_cpf TEXT NOT NULL,
  signer_email TEXT NOT NULL,
  ip_address TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  accepted BOOLEAN NOT NULL DEFAULT false,
  signed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contract_signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users view signatures" ON public.contract_signatures
  FOR SELECT TO authenticated USING (true);

-- Public can insert (signing)
CREATE POLICY "Public can sign contracts" ON public.contract_signatures
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Public can view own signatures" ON public.contract_signatures
  FOR SELECT TO anon
  USING (true);

-- Update trigger
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
