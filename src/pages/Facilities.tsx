import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { FacilityCard } from '@/components/FacilityCard';
import { mockFacilities } from '@/lib/mockData';

export default function Facilities() {
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
              Facilities
            </h1>
            <p className="text-muted-foreground">
              {mockFacilities.length} active facilities under management
            </p>
          </motion.div>

          <div className="grid gap-6">
            {mockFacilities.map((facility, index) => (
              <FacilityCard key={facility.id} facility={facility} index={index} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
