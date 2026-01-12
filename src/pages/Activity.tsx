import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { ActivityLog } from '@/components/ActivityLog';
import { mockActivityLog } from '@/lib/mockData';

export default function Activity() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-serif text-3xl font-medium text-foreground mb-2">
              Activity Log
            </h1>
            <p className="text-muted-foreground">
              Complete audit trail of all system actions
            </p>
          </motion.div>

          <ActivityLog entries={mockActivityLog} />
        </div>
      </main>
    </div>
  );
}
