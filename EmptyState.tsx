import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4', className)}>
      <div className="rounded-2xl bg-[#F7F7F7] p-5 mb-5">
        {icon || <InboxIcon className="w-10 h-10 text-[#8A8A8A]" />}
      </div>
      <h3 className="text-lg font-semibold text-[#111111] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#666666] text-center max-w-md mb-6">{description}</p>}
      {action}
    </div>
  );
}
