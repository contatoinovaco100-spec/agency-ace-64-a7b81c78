import { useState } from 'react';
import { useAgency } from '@/contexts/AgencyContext';
import { TeamMember } from '@/types/agency';
import { Plus, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';

const permOptions = ['Admin', 'Editor', 'Visualizador'];

export default function TeamPage() {
  const { team, tasks, addTeamMember, updateTeamMember, deleteTeamMember } = useAgency();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<Partial<TeamMember>>({});

  const openNew = () => { setEditing(null); setForm({ permissions: 'Editor' }); setDialogOpen(true); };
  const openEdit = (m: TeamMember) => { setEditing(m); setForm(m); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      updateTeamMember({ ...editing, ...form } as TeamMember);
    } else {
      addTeamMember({ ...form, id: crypto.randomUUID() } as TeamMember);
    }
    setDialogOpen(false);
  };

  const getTaskCount = (name: string) => tasks.filter(t => t.assignee === name && t.status !== 'Concluído').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading font-semibold text-foreground">Equipe</h1>
          <p className="text-body text-muted-foreground">{team.length} membros</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Novo Membro</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-shadow cursor-pointer rounded-lg bg-card p-5 transition-default hover:bg-secondary/30"
            onClick={() => openEdit(member)}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-body font-semibold text-primary">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="text-body font-medium text-foreground">{member.name}</p>
                <p className="text-caption text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-caption text-muted-foreground">
                <Mail className="h-3 w-3" />
                <span>{member.email}</span>
              </div>
              <span className="rounded bg-secondary px-1.5 py-0.5 text-caption text-muted-foreground">{member.permissions}</span>
            </div>
            <div className="mt-2 text-caption text-muted-foreground">
              {getTaskCount(member.name)} tarefas pendentes
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Membro' : 'Novo Membro'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div><Label>Nome</Label><Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Cargo</Label><Input value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div>
              <Label>Permissões</Label>
              <Select value={form.permissions || 'Editor'} onValueChange={v => setForm({ ...form, permissions: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{permOptions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">{editing ? 'Salvar' : 'Adicionar'}</Button>
              {editing && (
                <Button variant="outline" className="text-destructive" onClick={() => { deleteTeamMember(editing.id); setDialogOpen(false); }}>Excluir</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
