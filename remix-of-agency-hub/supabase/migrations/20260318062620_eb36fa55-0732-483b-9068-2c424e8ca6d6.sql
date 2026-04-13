
CREATE POLICY "Public can view portfolio" ON public.portfolio_projects FOR SELECT TO anon USING (true);
