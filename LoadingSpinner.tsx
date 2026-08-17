import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn('relative', sizeMap[size])}>
        <div className={cn(
          'absolute inset-0 rounded-full border-2 border-[#EAEAEA]',
          sizeMap[size]
        )} />
        <div className={cn(
          'absolute inset-0 rounded-full border-2 border-transparent border-t-[#111111] animate-spin',
          sizeMap[size]
        )} />
      </div>
      {text && <p className="text-sm text-[#666666]">{text}</p>}
    </div>
  );
}
