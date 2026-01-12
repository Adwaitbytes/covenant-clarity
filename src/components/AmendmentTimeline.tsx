import { motion } from 'framer-motion';
import { Amendment } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AmendmentTimelineProps {
  amendments: Amendment[];
  selectedAmendmentId?: string;
  onSelectAmendment?: (amendment: Amendment | null) => void;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const changeTypeConfig = {
  modification: { label: 'Modified', color: 'text-accent' },
  waiver: { label: 'Waiver', color: 'text-at-risk' },
  addition: { label: 'Added', color: 'text-compliant' },
  removal: { label: 'Removed', color: 'text-breach' },
};

export function AmendmentTimeline({ 
  amendments, 
  selectedAmendmentId, 
  onSelectAmendment 
}: AmendmentTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
      
      <div className="space-y-6">
        {amendments.map((amendment, index) => {
          const isSelected = selectedAmendmentId === amendment.id;
          const config = changeTypeConfig[amendment.changeType];

          return (
            <motion.div
              key={amendment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative pl-14"
            >
              {/* Timeline dot */}
              <div 
                className={cn(
                  'absolute left-4 top-1 w-5 h-5 rounded-full border-2 transition-all duration-300',
                  isSelected 
                    ? 'bg-primary border-primary scale-110' 
                    : 'bg-surface-1 border-border-strong hover:border-primary/50'
                )}
              />

              {/* Card */}
              <motion.button
                onClick={() => onSelectAmendment?.(isSelected ? null : amendment)}
                className={cn(
                  'w-full text-left p-4 rounded-lg border transition-all duration-300',
                  isSelected
                    ? 'bg-primary/10 border-primary/30 shadow-glow-sm'
                    : 'bg-card border-border hover:border-primary/20 hover:bg-card-hover'
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-serif text-base font-medium text-foreground">
                      {amendment.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Effective: {formatDate(amendment.effectiveDate)}
                    </p>
                  </div>
                  <span className={cn('text-xs font-medium', config.color)}>
                    {config.label}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {amendment.summary}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Requested by: <span className="text-foreground/80">{amendment.requestedBy}</span>
                  </span>
                  <span className={cn(
                    'px-2 py-0.5 rounded-full',
                    amendment.status === 'executed' && 'bg-compliant/15 text-compliant',
                    amendment.status === 'approved' && 'bg-accent/15 text-accent',
                    amendment.status === 'pending' && 'bg-pending/15 text-pending',
                  )}>
                    {amendment.status.charAt(0).toUpperCase() + amendment.status.slice(1)}
                  </span>
                </div>

                {/* Impacted covenants */}
                {amendment.impactedCovenants.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border-subtle">
                    <p className="text-xs text-muted-foreground mb-1">
                      {amendment.impactedCovenants.length} covenant{amendment.impactedCovenants.length > 1 ? 's' : ''} impacted
                    </p>
                  </div>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
