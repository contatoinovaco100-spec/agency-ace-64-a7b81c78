import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePushNotification } from '@/hooks/usePushNotification';
import { useModuleAccess } from '@/hooks/useUserRole';

export function RealtimeNotifications() {
  const { triggerNotification } = usePushNotification();
  const { isAdmin } = useModuleAccess();

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'contracts',
        },
        (payload) => {
          const contract = payload.new;
          
          if (contract.status === 'assinado' && payload.old?.status !== 'assinado') {
            triggerNotification(
              "Venda Confirmada! 💰", 
              `O contrato "${contract.title}" foi assinado por ${contract.client_name}.`, 
              "success", 
              "sale"
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contract_signatures',
        },
        (payload) => {
          const sig = payload.new;
          
          triggerNotification(
            "Nova Assinatura! ✍️", 
            `${sig.signer_name} acabou de assinar um contrato.`, 
            "success", 
            "sale"
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, triggerNotification]);

  return null; // This is a logic-only component
}
