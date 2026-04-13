import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import logoInova from '@/assets/logo-inova.png';
import { cn } from '@/lib/utils';
import { Clapperboard, Calendar, Target, FileText, Link2, MessageSquare, Loader2, ChevronDown, ChevronRight } from 'lucide-react';

interface TaskData {
  id: string;
  title: string;
  video_name: string;
  description: string;
  video_idea: string;
  full_script: string;
  video_references: string;
  observations: string;
  video_objective: string;
  platform: string;
  format: string;
  due_date: string | null;
  assignee: string;
  client_id: string | null;
  priority: string;
  status: string;
  creative_direction: string;
  editing_style: string;
  strategic_notes: string;
}

function TaskCard({ task, index }: { task: TaskData; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const videoName = task.video_name || task.title || 'Sem título';

  const sections = [
    { icon: Target, label: 'Objetivo', content: task.video_objective },
    { icon: FileText, label: 'Ideia do Vídeo', content: task.video_idea },
    { icon: FileText, label: 'Roteiro', content: task.full_script, large: true },
    { icon: Link2, label: 'Referências', content: task.video_references, isLinks: true },
    { icon: Clapperboard, label: 'Direção Criativa', content: task.creative_direction },
    { icon: Clapperboard, label: 'Estilo de Edição', content: task.editing_style },
    { icon: MessageSquare, label: 'Notas Estratégicas', content: task.strategic_notes },
    { icon: MessageSquare, label: 'Observações', content: task.observations },
  ].filter(s => s.content);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-secondary/20"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Clapperboard className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground">#{index + 1}</span>
            <h3 className="text-base font-semibold text-foreground truncate">{videoName}</h3>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {task.platform && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">{task.platform}</span>
            )}
            {task.format && (
              <span className="rounded-full bg-info/10 px-2.5 py-0.5 text-[11px] font-medium text-info">{task.format}</span>
            )}
            {task.status && (
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">{task.status}</span>
            )}
            {task.due_date && (
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </span>
            )}
          </div>
        </div>
        {open ? <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" /> : <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />}
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-border p-5 space-y-4">
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          {sections.map((section, i) => (
            <div key={i}>
              <div className="mb-1.5 flex items-center gap-2">
                <section.icon className="h-3.5 w-3.5 text-primary" />
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">{section.label}</h4>
              </div>
              {section.isLinks ? (
                <div className="space-y-1">
                  {section.content!.split('\n').filter(Boolean).map((line, j) => (
                    <a key={j} href={line.trim().startsWith('http') ? line.trim() : `https://${line.trim()}`} target="_blank" rel="noopener noreferrer" className="block text-sm text-primary underline underline-offset-2 hover:text-primary/80 break-all">
                      {line.trim()}
                    </a>
                  ))}
                </div>
              ) : (
                <p className={cn(
                  'text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed',
                  section.large && 'rounded-lg bg-secondary/30 p-3 font-mono text-xs'
                )}>
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClientContentPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [clientName, setClientName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!taskId) return;
    loadContent(taskId);
  }, [taskId]);

  const loadContent = async (id: string) => {
    setLoading(true);

    // First try as a task ID
    const { data: singleTask } = await supabase.from('tasks').select('*').eq('id', id).maybeSingle();

    if (singleTask) {
      // Found a task — load all tasks for the same client
      const clientId = singleTask.client_id;
      if (clientId) {
        const { data: clientData } = await supabase.from('clients').select('company_name').eq('id', clientId).single();
        if (clientData) setClientName(clientData.company_name);

        const { data: allTasks } = await supabase.from('tasks').select('*').eq('client_id', clientId).order('created_at');
        setTasks((allTasks || [singleTask]) as TaskData[]);
      } else {
        setTasks([singleTask as TaskData]);
      }
      setLoading(false);
      return;
    }

    // Try as a client ID
    const { data: clientData } = await supabase.from('clients').select('company_name').eq('id', id).maybeSingle();
    if (clientData) {
      setClientName(clientData.company_name);
      const { data: allTasks } = await supabase.from('tasks').select('*').eq('client_id', id).order('created_at');
      if (allTasks && allTasks.length > 0) {
        setTasks(allTasks as TaskData[]);
        setLoading(false);
        return;
      }
    }

    setNotFound(true);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || tasks.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <img src={logoInova} alt="Inova" className="h-12" />
        <p className="text-lg text-muted-foreground">Conteúdo não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <img src={logoInova} alt="Inova" className="h-10" />
          <div className="text-right">
            {clientName && <p className="text-sm font-medium text-foreground">{clientName}</p>}
            <p className="text-xs text-muted-foreground">{tasks.length} {tasks.length === 1 ? 'conteúdo' : 'conteúdos'}</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Ideias de Conteúdo</h1>
          <p className="text-sm text-muted-foreground">Confira as ideias preparadas para você</p>
        </div>

        <div className="space-y-4">
          {tasks.map((task, i) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-border pt-6 text-center">
          <img src={logoInova} alt="Inova" className="mx-auto h-8 opacity-50" />
          <p className="mt-2 text-xs text-muted-foreground">Conteúdo preparado pela equipe Inova</p>
        </div>
      </main>
    </div>
  );
}
