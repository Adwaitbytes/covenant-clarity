import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { ComplianceCard } from '@/components/ComplianceCard';
import { mockFacilities } from '@/lib/mockData';

export default function Compliance() {
  const facility = mockFacilities[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="font-serif text-3xl font-medium text-foreground mb-2">
              Compliance State
            </h1>
            <p className="text-muted-foreground">{facility.name}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {facility.covenants.map((covenant, index) => (
              <ComplianceCard key={covenant.id} covenant={covenant} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
