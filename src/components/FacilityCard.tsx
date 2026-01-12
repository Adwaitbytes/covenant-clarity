import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facility } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface FacilityCardProps {
  facility: Facility;
  index?: number;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function FacilityCard({ facility, index = 0 }: FacilityCardProps) {
  const compliantCount = facility.covenants.filter(c => c.status === 'compliant').length;
  const atRiskCount = facility.covenants.filter(c => c.status === 'at-risk').length;
  const breachCount = facility.covenants.filter(c => c.status === 'breach').length;
  
  const overallStatus = breachCount > 0 ? 'breach' : atRiskCount > 0 ? 'at-risk' : 'compliant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/facilities/${facility.id}`}
        className="group block"
      >
        <div className="relative p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-glow">
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                  {facility.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {facility.borrower}
                </p>
              </div>
              <StatusBadge status={overallStatus} size="sm" />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount</p>
                <p className="text-lg font-medium text-foreground">
                  {formatCurrency(facility.amount, facility.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Maturity</p>
                <p className="text-lg font-medium text-foreground">
                  {formatDate(facility.maturityDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Lenders</p>
                <p className="text-lg font-medium text-foreground">
                  {facility.lenders.length}
                </p>
              </div>
            </div>

            {/* Covenant Overview */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-compliant" />
                    <span className="text-sm text-muted-foreground">{compliantCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-at-risk" />
                    <span className="text-sm text-muted-foreground">{atRiskCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-breach" />
                    <span className="text-sm text-muted-foreground">{breachCount}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Compliance</span>
                  <div className="w-16 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${facility.complianceScore}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className={cn(
                        'h-full rounded-full',
                        facility.complianceScore >= 80 ? 'bg-compliant' :
                        facility.complianceScore >= 60 ? 'bg-at-risk' : 'bg-breach'
                      )}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {facility.complianceScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Agent */}
            <div className="mt-4 pt-4 border-t border-border-subtle">
              <p className="text-xs text-muted-foreground">
                Agent: <span className="text-foreground/70">{facility.agent}</span>
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
