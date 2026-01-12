import { motion } from 'framer-motion';
import { Covenant } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface ComplianceCardProps {
  covenant: Covenant;
  index?: number;
  onExplain?: (covenant: Covenant) => void;
}

export function ComplianceCard({ covenant, index = 0, onExplain }: ComplianceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        'p-5 rounded-xl border transition-all duration-300',
        covenant.status === 'compliant' && 'bg-compliant/5 border-compliant/20',
        covenant.status === 'at-risk' && 'bg-at-risk/5 border-at-risk/20',
        covenant.status === 'breach' && 'bg-breach/5 border-breach/20',
        covenant.status === 'pending' && 'bg-card border-border',
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-serif text-lg font-medium text-foreground">
            {covenant.name}
          </h4>
          <p className="text-sm text-muted-foreground mt-0.5">
            {covenant.legalReference} • {covenant.type.charAt(0).toUpperCase() + covenant.type.slice(1)} Covenant
          </p>
        </div>
        <StatusBadge status={covenant.status} confidence={covenant.confidence} />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Threshold</span>
          <span className="text-foreground font-medium">{covenant.threshold}</span>
        </div>
        {covenant.currentValue && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current Value</span>
            <span className={cn(
              'font-medium',
              covenant.status === 'compliant' && 'text-compliant',
              covenant.status === 'at-risk' && 'text-at-risk',
              covenant.status === 'breach' && 'text-breach',
              covenant.status === 'pending' && 'text-foreground',
            )}>
              {covenant.currentValue}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Test Frequency</span>
          <span className="text-foreground capitalize">{covenant.frequency}</span>
        </div>
        {covenant.nextTestDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next Test</span>
            <span className="text-foreground">
              {new Date(covenant.nextTestDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>

      {/* Confidence bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Confidence Level</span>
          <span>{covenant.confidence}%</span>
        </div>
        <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${covenant.confidence}%` }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className={cn(
              'h-full rounded-full',
              covenant.confidence >= 80 ? 'bg-compliant' :
              covenant.confidence >= 60 ? 'bg-at-risk' : 'bg-breach'
            )}
          />
        </div>
      </div>

      {/* Why button */}
      <button
        onClick={() => onExplain?.(covenant)}
        className="w-full py-2.5 text-sm font-medium text-primary hover:text-primary-glow border border-primary/30 hover:border-primary/50 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Why is this {covenant.status === 'at-risk' ? 'at risk' : covenant.status}?
      </button>
    </motion.div>
  );
}
