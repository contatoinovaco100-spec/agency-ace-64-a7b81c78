import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAgency } from '@/contexts/AgencyContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface Budget {
  id: string; client_id: string; title: string; charged_value: number; notes: string; created_at: string;
}
interface BudgetItem {
  id: string; budget_id: string; category: string; description: string; estimated_cost: number; actual_cost: number;
}

const COST_CATEGORIES = ['Equipe', 'Locação', 'Equipamento', 'Pós-produção', 'Transporte', 'Alimentação', 'Elenco', 'Licenças/Música', 'Outro'];

export default function BudgetsPage() {
  const { clients } = useAgency();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetItems, setBudgetItems] = useState<Record<string, BudgetItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ client_id: '', title: '', charged_value: '', notes: '' });
  const [itemForm, setItemForm] = useState({ budget_id: '', category: '', description: '', estimated_cost: '', actual_cost: '' });
  const [addingItemFor, setAddingItemFor] = useState<string | null>(null);

  const fetchBudgets = async () => {
    const { data } = await supabase.from('project_budgets').select('*').order('created_at', { ascending: false });
    setBudgets((data as any[]) || []);
    setLoading(false);
  };

  const fetchItems = async (budgetId: string) => {
    const { data } = await supabase.from('budget_items').select('*').eq('budget_id', budgetId).order('created_at');
    setBudgetItems(prev => ({ ...prev, [budgetId]: (data as any[]) || [] }));
  };

  useEffect(() => { fetchBudgets(); }, []);

  const handleSaveBudget = async () => {
    if (!form.client_id || !form.title) { toast.error('Cliente e título são obrigatórios'); return; }
    await supabase.from('project_budgets').insert({
      client_id: form.client_id, title: form.title,
      charged_value: Number(form.charged_value) || 0, notes: form.notes,
    } as any);
    setForm({ client_id: '', title: '', charged_value: '', notes: '' });
    setOpen(false); toast.success('Orçamento criado'); fetchBudgets();
  };

  const handleAddItem = async () => {
    if (!itemForm.category || !addingItemFor) return;
    await supabase.from('budget_items').insert({
      budget_id: addingItemFor, category: itemForm.category, description: itemForm.description,
      estimated_cost: Number(itemForm.estimated_cost) || 0, actual_cost: Number(itemForm.actual_cost) || 0,
    } as any);
    setItemForm({ budget_id: '', category: '', description: '', estimated_cost: '', actual_cost: '' });
    setAddingItemFor(null); toast.success('Item adicionado');
    fetchItems(addingItemFor);
  };

  const handleDeleteItem = async (itemId: string, budgetId: string) => {
    await supabase.from('budget_items').delete().eq('id', itemId);
    fetchItems(budgetId);
  };

  const handleDeleteBudget = async (id: string) => {
    await supabase.from('project_budgets').delete().eq('id', id);
    toast.success('Orçamento removido'); fetchBudgets();
  };

  const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const totalEstimated = budgets.reduce((acc, b) => {
    const items = budgetItems[b.id] || [];
    return acc + items.reduce((s, i) => s + i.estimated_cost, 0);
  }, 0);
  const totalActual = budgets.reduce((acc, b) => {
    const items = budgetItems[b.id] || [];
    return acc + items.reduce((s, i) => s + i.actual_cost, 0);
  }, 0);
  const totalCharged = budgets.reduce((s, b) => s + b.charged_value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">Custos detalhados por projeto</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Novo Orçamento</Button></DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Novo Orçamento</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Cliente *</Label>
                <Select value={form.client_id} onValueChange={v => setForm({ ...form, client_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.companyName}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Título do Projeto *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Valor cobrado do cliente (R$)</Label><Input type="number" value={form.charged_value} onChange={e => setForm({ ...form, charged_value: e.target.value })} /></div>
              <div><Label>Observações</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              <Button className="w-full" onClick={handleSaveBudget}>Criar Orçamento</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><DollarSign className="h-8 w-8 text-primary" /><div><p className="text-2xl font-bold text-foreground">{fmt(totalCharged)}</p><p className="text-xs text-muted-foreground">Valor cobrado total</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><TrendingDown className="h-8 w-8 text-amber-500" /><div><p className="text-2xl font-bold text-foreground">{fmt(totalEstimated)}</p><p className="text-xs text-muted-foreground">Custo estimado total</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><TrendingUp className="h-8 w-8 text-emerald-500" /><div><p className="text-2xl font-bold text-foreground">{fmt(totalCharged - totalActual)}</p><p className="text-xs text-muted-foreground">Lucro real</p></div></CardContent></Card>
      </div>

      {loading ? <p className="text-muted-foreground">Carregando...</p> : budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <DollarSign className="h-12 w-12 mb-3 opacity-40" /><p>Nenhum orçamento criado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {budgets.map(b => {
            const client = clients.find(c => c.id === b.client_id);
            const items = budgetItems[b.id] || [];
            const estTotal = items.reduce((s, i) => s + i.estimated_cost, 0);
            const actTotal = items.reduce((s, i) => s + i.actual_cost, 0);
            const margin = b.charged_value - actTotal;
            return (
              <Collapsible key={b.id} onOpenChange={open => { if (open && !budgetItems[b.id]) fetchItems(b.id); }}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{b.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{client?.companyName || 'Sem cliente'}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">Cobrado: {fmt(b.charged_value)}</p>
                            {items.length > 0 && <p className={`text-xs ${margin >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Margem: {fmt(margin)}</p>}
                          </div>
                          <button onClick={e => { e.stopPropagation(); handleDeleteBudget(b.id); }}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      {items.length > 0 && (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Categoria</TableHead><TableHead>Descrição</TableHead>
                              <TableHead className="text-right">Estimado</TableHead><TableHead className="text-right">Real</TableHead>
                              <TableHead className="w-10"></TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map(i => (
                              <TableRow key={i.id}>
                                <TableCell><Badge variant="secondary">{i.category}</Badge></TableCell>
                                <TableCell>{i.description || '—'}</TableCell>
                                <TableCell className="text-right">{fmt(i.estimated_cost)}</TableCell>
                                <TableCell className="text-right">{fmt(i.actual_cost)}</TableCell>
                                <TableCell><button onClick={() => handleDeleteItem(i.id, b.id)}><Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" /></button></TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="font-semibold">
                              <TableCell colSpan={2}>Total</TableCell>
                              <TableCell className="text-right">{fmt(estTotal)}</TableCell>
                              <TableCell className="text-right">{fmt(actTotal)}</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      )}
                      {addingItemFor === b.id ? (
                        <div className="border rounded-lg p-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Select value={itemForm.category} onValueChange={v => setItemForm({ ...itemForm, category: v })}>
                              <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                              <SelectContent>{COST_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                            </Select>
                            <Input placeholder="Descrição" value={itemForm.description} onChange={e => setItemForm({ ...itemForm, description: e.target.value })} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input type="number" placeholder="Custo estimado" value={itemForm.estimated_cost} onChange={e => setItemForm({ ...itemForm, estimated_cost: e.target.value })} />
                            <Input type="number" placeholder="Custo real" value={itemForm.actual_cost} onChange={e => setItemForm({ ...itemForm, actual_cost: e.target.value })} />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleAddItem}>Adicionar</Button>
                            <Button size="sm" variant="outline" onClick={() => setAddingItemFor(null)}>Cancelar</Button>
                          </div>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => setAddingItemFor(b.id)}><Plus className="mr-1 h-3.5 w-3.5" />Adicionar custo</Button>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}
