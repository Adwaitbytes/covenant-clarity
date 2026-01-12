import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { CovenantGraph } from '@/components/CovenantGraph';
import { AmendmentTimeline } from '@/components/AmendmentTimeline';
import { mockFacilities } from '@/lib/mockData';
import { Covenant, Amendment } from '@/lib/types';

export default function Graph() {
  const facility = mockFacilities[0];
  const [selectedCovenant, setSelectedCovenant] = useState<Covenant | null>(null);
  const [selectedAmendment, setSelectedAmendment] = useState<Amendment | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 h-screen flex">
        {/* Graph Panel */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col"
          >
            <div className="mb-4">
              <h1 className="font-serif text-2xl font-medium text-foreground">
                {facility.name}
              </h1>
              <p className="text-sm text-muted-foreground">{facility.borrower}</p>
            </div>
            
            <div className="flex-1 rounded-xl border border-border overflow-hidden">
              <CovenantGraph
                covenants={facility.covenants}
                selectedCovenantId={selectedCovenant?.id}
                onSelectCovenant={setSelectedCovenant}
              />
            </div>
          </motion.div>
        </div>

        {/* Timeline Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-96 border-l border-border bg-surface-1 p-6 overflow-y-auto"
        >
          <h2 className="font-serif text-lg font-medium text-foreground mb-6">
            Amendments
          </h2>
          <AmendmentTimeline
            amendments={facility.amendments}
            selectedAmendmentId={selectedAmendment?.id}
            onSelectAmendment={setSelectedAmendment}
          />
        </motion.div>
      </main>
    </div>
  );
}
