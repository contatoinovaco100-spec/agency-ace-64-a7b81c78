import { toast } from "sonner";
import { useCallback, useState } from "react";

// Típos de sons disponíveis
export type NotificationSoundType = 'default' | 'sale' | 'agenda' | 'overdue' | 'lula' | 'rodrigo_faro' | 'tome' | 'magnata';

// URLs dos sons. Você pode trocar por arquivos locais depois (ex: '/sounds/dinheiro.mp3')
const SOUND_URLS: Record<NotificationSoundType, string> = {
  default: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
  // Som de caixa registradora estável (Mixkit)
  sale: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3", 
  agenda: "https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3", 
  overdue: "https://assets.mixkit.co/active_storage/sfx/2866/2866-preview.mp3", 
  // Mantendo os memes com fallback
  lula: "https://www.myinstants.com/media/sounds/pense-no-lula.mp3",
  tome: "https://www.myinstants.com/media/sounds/toma-rodrigo-faro.mp3",
  rodrigo_faro: "https://www.myinstants.com/media/sounds/cavalo_2.mp3",
  magnata: "https://www.myinstants.com/media/sounds/bom-dia-magnata.mp3",
};

export function usePushNotification() {
  const playSound = useCallback((type: NotificationSoundType = 'default') => {
    console.log(`🎵 Attempting to play sound: ${type}`);
    try {
      const audioUrl = SOUND_URLS[type] || SOUND_URLS.default;
      const audio = new Audio(audioUrl);
      audio.volume = type === 'sale' ? 0.8 : 0.6;
      audio.play().then(() => {
        console.log(`✅ Sound ${type} played successfully`);
      }).catch(error => {
        console.warn("❌ Audio play failed. Interaction might be required:", error);
        toast.info("Clique na página para ativar os alertas sonoros! 🔊", {
          position: "bottom-right",
          duration: 3000
        });
      });
    } catch (e) {
      console.error("Failed to play notification sound.", e);
    }
  }, []);

  const triggerNotification = useCallback((
    title: string, 
    description?: string, 
    type: "default" | "success" | "error" | "info" | "warning" = "default",
    soundType: NotificationSoundType = 'default'
  ) => {
    // 1. Roll the exact sound requested
    playSound(soundType);

    // 2. Tenta a nativa do sistema se o cliente aceitou
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body: description,
          icon: "/favicon.ico", 
        });
      } catch (e) {
        console.error("Native notification failed:", e);
      }
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    // 3. Mostra na tela bonito com Sonner
    const toastFn = type === "default" ? toast : toast[type];
    
    toastFn(title, {
      description: description,
      duration: type === 'error' || soundType === 'overdue' ? 8000 : 5000, // Atrasadas ficam na tela por mais tempo
      position: "top-right",
      className: "shadow-2xl border border-primary/20 bg-background/95 backdrop-blur-sm",
    });

  }, [playSound]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      toast.error("Seu navegador não suporta notificações de origem.");
      return false;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      toast.success("Notificações ativadas com sucesso!");
      playSound('default');
      return true;
    }
    return false;
  }, [playSound]);

  const [isPrimed, setIsPrimed] = useState(() => {
    // Check if audio was already primed in this session
    return sessionStorage.getItem('audio_primed') === 'true';
  });

  const primeAudio = useCallback(() => {
    console.log("🔔 Priming audio context...");
    playSound('default');
    setIsPrimed(true);
    sessionStorage.setItem('audio_primed', 'true');
    toast.success("Alertas sonoros ativados para esta sessão! 🔊");
  }, [playSound]);

  return {
    triggerNotification,
    requestPermission,
    playSound,
    primeAudio,
    isPrimed
  };
}
