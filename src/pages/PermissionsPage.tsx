import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole, AppModule, MODULE_LABELS, MODULE_DESCRIPTIONS } from '@/hooks/useUserRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Shield, Users, Loader2, Briefcase, Settings2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  full_name: string;
}

interface ModuleAccess {
  user_id: string;
  module: AppModule;
}

const MODULE_ICONS: Record<AppModule, typeof Briefcase> = {
  comercial: Briefcase,
  operacional: Settings2,
};

export default function PermissionsPage() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [accessMap, setAccessMap] = useState<ModuleAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    const [{ data: profiles }, { data: access }] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('user_module_access').select('user_id, module'),
    ]);

    if (profiles) {
      setUsers(
        profiles
          .filter(p => p.id !== user?.id)
          .map(p => ({ id: p.id, full_name: p.full_name || 'Sem nome' }))
      );
    }
    if (access) setAccessMap(access as ModuleAccess[]);
    setLoading(false);
  };

  const hasAccess = (userId: string, mod: AppModule) =>
    accessMap.some(a => a.user_id === userId && a.module === mod);

  const toggleModule = async (userId: string, mod: AppModule) => {
    setSaving(true);
    const exists = hasAccess(userId, mod);

    if (exists) {
      await supabase.from('user_module_access').delete().eq('user_id', userId).eq('module', mod);
      setAccessMap(prev => prev.filter(a => !(a.user_id === userId && a.module === mod)));
    } else {
      await supabase.from('user_module_access').insert({ user_id: userId, module: mod });
      setAccessMap(prev => [...prev, { user_id: userId, module: mod }]);
    }
    setSaving(false);
  };

  if (roleLoading || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  const allModules: AppModule[] = ['comercial', 'operacional'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Permissões</h1>
          <p className="text-sm text-muted-foreground">
            Controle quais módulos cada colaborador pode acessar
          </p>
        </div>
      </div>

      {/* Module legend */}
      <div className="grid gap-3 sm:grid-cols-2">
        {allModules.map(mod => {
          const Icon = MODULE_ICONS[mod];
          return (
            <Card key={mod} className="border-border/50">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{MODULE_LABELS[mod]}</p>
                  <p className="text-xs text-muted-foreground">{MODULE_DESCRIPTIONS[mod]}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum colaborador cadastrado ainda.</p>
            <p className="text-sm text-muted-foreground">
              Quando alguém se cadastrar no sistema, aparecerá aqui para você gerenciar o acesso.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map(u => (
            <Card key={u.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                    {u.full_name.charAt(0).toUpperCase()}
                  </div>
                  <CardTitle className="text-base">{u.full_name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {allModules.map(mod => {
                    const Icon = MODULE_ICONS[mod];
                    const active = hasAccess(u.id, mod);
                    return (
                      <label
                        key={mod}
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{MODULE_LABELS[mod]}</p>
                            <p className="text-xs text-muted-foreground">{MODULE_DESCRIPTIONS[mod]}</p>
                          </div>
                        </div>
                        <Switch
                          checked={active}
                          onCheckedChange={() => toggleModule(u.id, mod)}
                          disabled={saving}
                        />
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
