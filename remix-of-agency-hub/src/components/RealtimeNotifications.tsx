import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePushNotification } from '@/hooks/usePushNotification';
import { useModuleAccess } from '@/hooks/useUserRole';

export function RealtimeNotifications() {
  const { triggerNotification } = usePushNotification();
  const { isAdmin } = useModuleAccess();

  useEffect(() => {
    // Only admins should receive these global alerts
    if (!isAdmin) return;

    console.log("🔔 Realtime listener active for contracts...");

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
          console.log('🔔 Contract update received:', payload);
          const contract = payload.new;
          
          // Trigger ONLY if status just changed to 'assinado'
          if (contract.status === 'assinado' && payload.old?.status !== 'assinado') {
            console.log('✅ Contract signed! Triggering sound...');
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
          console.log('🔔 New signature record received:', payload);
          const sig = payload.new;
          
          triggerNotification(
            "Nova Assinatura! ✍️", 
            `${sig.signer_name} acabou de assinar um contrato.`, 
            "success", 
            "sale"
          );
        }
      )
      .subscribe((status) => {
        console.log("📡 Realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, triggerNotification]);

  return null; // This is a logic-only component
}
