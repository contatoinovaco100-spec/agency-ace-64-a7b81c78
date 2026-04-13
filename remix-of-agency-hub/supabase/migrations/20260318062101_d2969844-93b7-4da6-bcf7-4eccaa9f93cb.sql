
-- Portfolio
CREATE TABLE public.portfolio_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  video_url text NOT NULL DEFAULT '',
  thumbnail_url text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  completed_at date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users manage portfolio" ON public.portfolio_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Equipment
CREATE TABLE public.equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  serial_number text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Disponível',
  condition text NOT NULL DEFAULT 'Bom',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users manage equipment" ON public.equipment FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Shooting Schedule
CREATE TABLE public.shooting_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  location text NOT NULL DEFAULT '',
  shooting_date date NOT NULL,
  start_time time,
  end_time time,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  cast_notes text NOT NULL DEFAULT '',
  equipment_notes text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Agendada',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.shooting_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users manage shooting_schedules" ON public.shooting_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Project Budgets
CREATE TABLE public.project_budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT '',
  charged_value numeric NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users manage project_budgets" ON public.project_budgets FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid REFERENCES public.project_budgets(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  estimated_cost numeric NOT NULL DEFAULT 0,
  actual_cost numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users manage budget_items" ON public.budget_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
