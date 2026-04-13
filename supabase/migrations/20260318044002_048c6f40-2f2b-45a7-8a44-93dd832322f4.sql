
CREATE POLICY "Public can update contract status on sign"
ON public.contracts
FOR UPDATE
TO anon
USING (status = 'enviado')
WITH CHECK (status = 'assinado');
