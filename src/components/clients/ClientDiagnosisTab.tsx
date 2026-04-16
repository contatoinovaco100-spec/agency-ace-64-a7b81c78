import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BriefingRow } from '@/components/BriefingDetailDialog';
import { Loader2, Target, Users, Heart, ShieldAlert, Star, Swords, MessageCircle, DollarSign, FileText, Edit2, Check, X, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Props {
  clientId: string;
}

export function ClientDiagnosisTab({ clientId }: Props) {
  const [briefing, setBriefing] = useState<Partial<BriefingRow> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchBriefing() {
      setLoading(true);
      const { data, error } = await supabase
        .from('client_briefings')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching briefing:', error);
      } else {
        setBriefing(data);
      }
      setLoading(false);
    }

    if (clientId) {
      fetchBriefing();
    }
  }, [clientId]);

  const handleSave = async () => {
    if (!clientId) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('client_briefings')
        .upsert({
          ...briefing,
          client_id: clientId,
          updated_at: new Date().toISOString(),
          status: 'published' // Default to published when saved from CRM
        })
        .select()
        .single();

      if (error) throw error;
      setBriefing(data);
      setIsEditing(false);
      toast.success('Diagnóstico salvo com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!briefing && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-border rounded-xl bg-secondary/10">
        <FileText className="h-10 w-10 text-muted-foreground mb-3 opacity-20" />
        <p className="text-sm font-medium text-foreground">Nenhum diagnóstico encontrado</p>
        <p className="text-xs text-muted-foreground max-w-[200px] mt-1 mb-4">
          Crie um diagnóstico estratégico para estruturar o posicionamento deste cliente.
        </p>
        <Button size="sm" onClick={() => setIsEditing(true)} className="gap-2">
          <Edit2 className="h-4 w-4" /> Iniciar Diagnóstico
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-caption font-semibold uppercase tracking-widest text-primary flex items-center gap-2">
          <Star className="h-4 w-4 fill-primary" /> Diagnóstico Estratégico
        </h3>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} disabled={saving}>
                <X className="h-4 w-4 mr-1" /> Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="gap-1.5 h-8">
              <Edit2 className="h-3.5 w-3.5" /> Editar
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs opacity-70">Objetivos para 3 meses</Label>
              <Textarea 
                value={briefing?.goals_3_months || ''} 
                onChange={e => setBriefing({...briefing, goals_3_months: e.target.value})}
                placeholder="Ex: Aumentar faturamento em 30%..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs opacity-70">Faixa Etária</Label>
                <Input 
                  value={briefing?.target_age_range || ''} 
                  onChange={e => setBriefing({...briefing, target_age_range: e.target.value})}
                  placeholder="Ex: 25-45"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs opacity-70">Gênero</Label>
                <Input 
                  value={briefing?.target_gender || ''} 
                  onChange={e => setBriefing({...briefing, target_gender: e.target.value})}
                  placeholder="Ex: Masculino/Feminino"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs opacity-70">Dores do Público</Label>
              <Textarea 
                value={briefing?.audience_pain_points || ''} 
                onChange={e => setBriefing({...briefing, audience_pain_points: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs opacity-70">Desejos do Público</Label>
              <Textarea 
                value={briefing?.audience_desires || ''} 
                onChange={e => setBriefing({...briefing, audience_desires: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs opacity-70">Diferenciais</Label>
              <Textarea 
                value={briefing?.differentials || ''} 
                onChange={e => setBriefing({...briefing, differentials: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs opacity-70">Concorrência</Label>
              <Textarea 
                value={briefing?.competitors || ''} 
                onChange={e => setBriefing({...briefing, competitors: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs opacity-70">Estilo de Comunicação</Label>
              <Input 
                value={briefing?.communication_style || ''} 
                onChange={e => setBriefing({...briefing, communication_style: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs opacity-70">Faturamento Mensal</Label>
              <Input 
                value={briefing?.monthly_revenue || ''} 
                onChange={e => setBriefing({...briefing, monthly_revenue: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs opacity-70">Percepção Desejada</Label>
              <Textarea 
                value={briefing?.desired_perception || ''} 
                onChange={e => setBriefing({...briefing, desired_perception: e.target.value})}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DiagnosisSection icon={Target} label="Objetivos para 3 meses" value={briefing?.goals_3_months || ''} accent="amber" />
            <DiagnosisSection icon={Users} label="Público-Alvo" value={`${briefing?.target_age_range || ''} · ${briefing?.target_gender || ''}`} accent="blue" />
            <DiagnosisSection icon={ShieldAlert} label="Dores do Público" value={briefing?.audience_pain_points || ''} accent="red" />
            <DiagnosisSection icon={Heart} label="Desejos do Público" value={briefing?.audience_desires || ''} accent="emerald" />
            <DiagnosisSection icon={Star} label="Diferenciais" value={briefing?.differentials || ''} accent="pink" />
            <DiagnosisSection icon={Swords} label="Concorrência" value={briefing?.competitors || ''} accent="indigo" />
            <DiagnosisSection icon={MessageCircle} label="Estilo de Comunicação" value={briefing?.communication_style || ''} accent="violet" />
            <DiagnosisSection icon={DollarSign} label="Expectativa de Faturamento" value={briefing?.monthly_revenue || ''} accent="green" />
          </div>

          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
            <p className="text-caption font-semibold text-primary uppercase tracking-widest mb-2">Percepção Desejada</p>
            <p className="text-body text-foreground leading-relaxed italic">"{briefing?.desired_perception || ''}"</p>
          </div>
        </>
      )}
    </div>
  );
}

function DiagnosisSection({ icon: Icon, label, value, accent }: { icon: any, label: string, value: string, accent: string }) {
  const colors: Record<string, string> = {
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    emerald: 'bg-emerald-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
    violet: 'bg-violet-500',
    green: 'bg-green-500',
  };

  return (
    <Card className="border-border/40 bg-card/50 overflow-hidden group hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-1.5 h-1.5 rounded-full ${colors[accent] || 'bg-primary'}`} />
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        </div>
        <p className="text-body text-foreground leading-relaxed pl-3.5">{value || '—'}</p>
      </CardContent>
    </Card>
  );
}
