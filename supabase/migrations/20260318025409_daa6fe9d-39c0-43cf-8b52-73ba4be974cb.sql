
-- Add pipeline-specific columns to tasks
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS creative_direction text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS editing_style text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS strategic_notes text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS recording_notes text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS editor_comments text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS current_stage_owner text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS copywriter text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS director text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS videomaker text NOT NULL DEFAULT '';

-- Stage history table
CREATE TABLE public.task_stage_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  from_stage text NOT NULL DEFAULT '',
  to_stage text NOT NULL,
  changed_by text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.task_stage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to task_stage_history" ON public.task_stage_history
  FOR ALL TO public USING (true) WITH CHECK (true);
