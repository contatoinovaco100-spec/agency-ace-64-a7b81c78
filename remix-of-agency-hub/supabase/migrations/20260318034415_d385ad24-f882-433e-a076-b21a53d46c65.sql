ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_status_check;

ALTER TABLE public.tasks ADD CONSTRAINT tasks_status_check CHECK (
  status = ANY (
    ARRAY[
      'A fazer'::text,
      'Em andamento'::text,
      'Revisão'::text,
      'Concluído'::text,
      'Ideias / Backlog'::text,
      'Em copy'::text,
      'Em direção'::text,
      'Em gravação'::text,
      'Em edição'::text,
      'Finalizado'::text,
      'Em Copy'::text,
      'Em Direção'::text,
      'Em Gravação'::text,
      'Em Edição'::text
    ]
  )
);