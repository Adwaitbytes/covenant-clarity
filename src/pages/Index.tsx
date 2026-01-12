import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { CovenantGraph } from '@/components/CovenantGraph';
import { mockCovenants } from '@/lib/mockData';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float" style={{ background: 'hsl(42, 65%, 58%, 0.1)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-float" style={{ background: 'hsl(210, 60%, 50%, 0.1)', animationDelay: '2s' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-surface-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'hsl(42, 65%, 58%, 0.2)' }}>
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Enterprise Loan Intelligence</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl font-medium text-foreground mb-6 tracking-tight"
          >
            From legal text to
            <br />
            <span className="text-gradient">live compliance</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            See the live compliance state of your loan — not just the documents.
            A new infrastructure layer for syndicated loans.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              to="/facilities"
              className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all duration-300"
            >
              View Facilities
            </Link>
            <Link
              to="/graph"
              className="px-8 py-3 border border-border text-foreground font-medium rounded-lg hover:border-primary hover:bg-surface-1 transition-colors"
            >
              Explore Graph
            </Link>
          </motion.div>

          {/* Graph Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
            <div className="h-[400px] rounded-xl border border-border overflow-hidden">
              <CovenantGraph covenants={mockCovenants} animated={true} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { title: 'Graph-Native', desc: 'Visualize covenant dependencies and relationships in real-time' },
              { title: 'Amendment Tracking', desc: 'See exactly how each amendment impacts your covenant structure' },
              { title: 'Confidence Scoring', desc: 'Understand not just status, but the reasoning behind each assessment' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl border border-border bg-card"
              >
                <h3 className="font-serif text-xl font-medium text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
