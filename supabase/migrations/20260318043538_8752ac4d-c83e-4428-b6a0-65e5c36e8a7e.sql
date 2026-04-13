
ALTER TABLE public.contracts
  ADD COLUMN plan_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN deliverables JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.contract_signatures
  ADD COLUMN signature_hash TEXT NOT NULL DEFAULT '';
