import { cn } from '../../lib/utils';
import { AlertTriangle, AlertCircle, Info, CheckCircle, ChevronRight } from 'lucide-react';

interface AlertCardProps {
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  actionLabel?: string;
  onAction?: () => void;
  timestamp?: string;
}

const typeConfig = {
  critical: {
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-600',
  },
  warning: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50',
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-600',
  },
  info: {
    border: 'border-l-blue-500',
    bg: 'bg-blue-50',
    icon: <Info className="w-5 h-5 text-blue-500" />,
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-600',
  },
  success: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50',
    icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-600',
  },
};

export default function AlertCard({ title, message, type, actionLabel, onAction, timestamp }: AlertCardProps) {
  const config = typeConfig[type];

  return (
    <div className={cn(
      'group rounded-xl border border-[#EAEAEA] bg-white',
      'border-l-4 p-4 transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer',
      config.border,
    )} onClick={onAction}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-[#111111] truncate">{title}</h4>
            <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider', config.badge)}>
              {type}
            </span>
          </div>
          <p className="text-xs text-[#666666] leading-relaxed">{message}</p>
          {timestamp && (
            <p className="text-[10px] text-[#8A8A8A] mt-2">{timestamp}</p>
          )}
        </div>
        {actionLabel && (
          <button className="flex items-center gap-1 text-xs text-[#111111] font-medium hover:text-[#666666] transition-colors whitespace-nowrap">
            {actionLabel}
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
