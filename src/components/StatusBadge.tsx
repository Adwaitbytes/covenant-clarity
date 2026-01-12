import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CovenantStatus } from '@/lib/types';

interface StatusBadgeProps {
  status: CovenantStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  confidence?: number;
}

const statusConfig: Record<CovenantStatus, { label: string; className: string }> = {
  compliant: {
    label: 'Compliant',
    className: 'status-compliant',
  },
  'at-risk': {
    label: 'At Risk',
    className: 'status-at-risk',
  },
  breach: {
    label: 'Breach',
    className: 'status-breach',
  },
  pending: {
    label: 'Pending',
    className: 'status-pending',
  },
};

export function StatusBadge({ status, size = 'md', showLabel = true, confidence }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        config.className,
        sizeClasses[size]
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          status === 'compliant' && 'bg-compliant',
          status === 'at-risk' && 'bg-at-risk',
          status === 'breach' && 'bg-breach',
          status === 'pending' && 'bg-pending'
        )}
      />
      {showLabel && config.label}
      {confidence !== undefined && (
        <span className="opacity-70 ml-1">({confidence}%)</span>
      )}
    </motion.span>
  );
}
