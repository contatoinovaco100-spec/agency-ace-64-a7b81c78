
-- Add video-specific columns to tasks table
ALTER TABLE public.tasks 
  ADD COLUMN task_type text NOT NULL DEFAULT 'Geral',
  ADD COLUMN video_name text NOT NULL DEFAULT '',
  ADD COLUMN platform text NOT NULL DEFAULT '',
  ADD COLUMN format text NOT NULL DEFAULT '',
  ADD COLUMN video_objective text NOT NULL DEFAULT '',
  ADD COLUMN script_writer text NOT NULL DEFAULT '',
  ADD COLUMN editor text NOT NULL DEFAULT '',
  ADD COLUMN video_idea text NOT NULL DEFAULT '',
  ADD COLUMN full_script text NOT NULL DEFAULT '',
  ADD COLUMN video_references text NOT NULL DEFAULT '',
  ADD COLUMN observations text NOT NULL DEFAULT '';

-- Create task checklist items table
CREATE TABLE public.task_checklist_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  label text NOT NULL,
  checked boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.task_checklist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to task_checklist_items" ON public.task_checklist_items
  FOR ALL TO public USING (true) WITH CHECK (true);

-- Create task comments table
CREATE TABLE public.task_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  author text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to task_comments" ON public.task_comments
  FOR ALL TO public USING (true) WITH CHECK (true);

-- Create storage bucket for task attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('task-attachments', 'task-attachments', true);

CREATE POLICY "Allow all uploads to task-attachments" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'task-attachments');

CREATE POLICY "Allow all reads from task-attachments" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'task-attachments');

CREATE POLICY "Allow all deletes from task-attachments" ON storage.objects
  FOR DELETE TO public USING (bucket_id = 'task-attachments');

-- Create task attachments table
CREATE TABLE public.task_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to task_attachments" ON public.task_attachments
  FOR ALL TO public USING (true) WITH CHECK (true);
