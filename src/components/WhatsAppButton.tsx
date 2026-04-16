import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

function cleanPhone(phone: string): string {
  // Remove everything except digits
  const digits = phone.replace(/\D/g, '');
  // If starts with 0, assume Brazil and prepend 55
  if (digits.startsWith('0')) return '55' + digits.slice(1);
  // If no country code (less than 12 digits for BR), prepend 55
  if (digits.length <= 11) return '55' + digits;
  return digits;
}

interface WhatsAppButtonProps {
  phone: string;
  name?: string;
  message?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function WhatsAppButton({ phone, name, message, size = 'sm', className }: WhatsAppButtonProps) {
  if (!phone) return null;

  const defaultMessage = name
    ? `Olá ${name}, tudo bem? Aqui é da INOVA Co.`
    : 'Olá, tudo bem? Aqui é da INOVA Co.';

  const text = encodeURIComponent(message || defaultMessage);
  const url = `https://wa.me/${cleanPhone(phone)}?text=${text}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      title={`Abrir WhatsApp: ${phone}`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md bg-success/10 text-success transition-default hover:bg-success/20',
        size === 'sm' ? 'px-2 py-1 text-caption' : 'px-3 py-1.5 text-body',
        className
      )}
    >
      <MessageCircle className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      <span className="font-medium">WhatsApp</span>
    </button>
  );
}
