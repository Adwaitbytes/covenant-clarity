import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Covenant, GraphNode, GraphEdge } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CovenantGraphProps {
  covenants: Covenant[];
  selectedCovenantId?: string;
  onSelectCovenant?: (covenant: Covenant | null) => void;
  className?: string;
  animated?: boolean;
}

function generateGraphLayout(covenants: Covenant[], width: number, height: number): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  
  const nodes: GraphNode[] = covenants.map((covenant, index) => {
    const angle = (index / covenants.length) * Math.PI * 2 - Math.PI / 2;
    const nodeRadius = covenant.materiality === 'high' ? 35 : covenant.materiality === 'medium' ? 28 : 22;
    
    return {
      id: covenant.id,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      covenant,
      radius: nodeRadius,
    };
  });

  const edges: GraphEdge[] = [];
  covenants.forEach((covenant) => {
    covenant.dependencies.forEach((depId) => {
      if (covenants.find(c => c.id === depId)) {
        edges.push({
          id: `${covenant.id}-${depId}`,
          source: covenant.id,
          target: depId,
          type: 'dependency',
        });
      }
    });
  });

  return { nodes, edges };
}

const statusColors = {
  compliant: 'hsl(150, 45%, 45%)',
  'at-risk': 'hsl(45, 70%, 50%)',
  breach: 'hsl(0, 50%, 50%)',
  pending: 'hsl(220, 15%, 45%)',
};

const statusGlowColors = {
  compliant: 'rgba(76, 175, 117, 0.4)',
  'at-risk': 'rgba(204, 163, 51, 0.4)',
  breach: 'rgba(191, 64, 64, 0.4)',
  pending: 'rgba(115, 123, 140, 0.3)',
};

export function CovenantGraph({ 
  covenants, 
  selectedCovenantId, 
  onSelectCovenant,
  className,
  animated = true 
}: CovenantGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({ nodes: [], edges: [] });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setGraphData(generateGraphLayout(covenants, dimensions.width, dimensions.height));
    }
  }, [covenants, dimensions]);

  const getNodeById = useCallback((id: string) => graphData.nodes.find(n => n.id === id), [graphData.nodes]);

  return (
    <div 
      ref={containerRef} 
      className={cn('relative w-full h-full min-h-[500px] bg-surface-0 rounded-xl overflow-hidden', className)}
    >
      {/* Background grid */}
      <div 
        className="absolute inset-0 bg-grid-pattern bg-grid opacity-30"
        style={{ backgroundSize: '40px 40px' }}
      />
      
      {/* Center glow */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(42, 65%, 58%) 0%, transparent 70%)',
        }}
      />

      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0"
      >
        <defs>
          {/* Gradient for edges */}
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(220, 10%, 25%)" />
            <stop offset="100%" stopColor="hsl(220, 10%, 35%)" />
          </linearGradient>
          
          {/* Glow filters for each status */}
          {Object.entries(statusGlowColors).map(([status, color]) => (
            <filter key={status} id={`glow-${status}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feFlood floodColor={color} floodOpacity="1" result="glowColor" />
              <feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}
        </defs>

        {/* Edges */}
        <g>
          {graphData.edges.map((edge, index) => {
            const sourceNode = getNodeById(edge.source);
            const targetNode = getNodeById(edge.target);
            
            if (!sourceNode || !targetNode) return null;

            const isHighlighted = hoveredNode === edge.source || hoveredNode === edge.target ||
              selectedCovenantId === edge.source || selectedCovenantId === edge.target;

            return (
              <motion.line
                key={edge.id}
                initial={animated ? { pathLength: 0, opacity: 0 } : {}}
                animate={{ 
                  pathLength: 1, 
                  opacity: isHighlighted ? 0.8 : 0.3,
                  strokeWidth: isHighlighted ? 2 : 1,
                }}
                transition={{ duration: 1, delay: index * 0.1 }}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHighlighted ? 'hsl(42, 65%, 58%)' : 'hsl(220, 10%, 30%)'}
                strokeDasharray={isHighlighted ? 'none' : '4 4'}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {graphData.nodes.map((node, index) => {
            const isSelected = selectedCovenantId === node.id;
            const isHovered = hoveredNode === node.id;
            const isRelated = graphData.edges.some(
              e => (hoveredNode === e.source && e.target === node.id) ||
                   (hoveredNode === e.target && e.source === node.id)
            );

            return (
              <motion.g
                key={node.id}
                initial={animated ? { scale: 0, opacity: 0 } : {}}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                }}
                transition={{ 
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                  delay: animated ? 0.5 + index * 0.05 : 0,
                }}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onSelectCovenant?.(isSelected ? null : node.covenant)}
              >
                {/* Outer glow ring */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + 8}
                  fill="transparent"
                  stroke={statusColors[node.covenant.status]}
                  strokeWidth={isSelected || isHovered ? 2 : 0}
                  strokeOpacity={0.3}
                  animate={{
                    r: isSelected || isHovered ? node.radius + 12 : node.radius + 8,
                  }}
                />
                
                {/* Main node */}
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill="hsl(220, 14%, 10%)"
                  stroke={statusColors[node.covenant.status]}
                  strokeWidth={isSelected ? 3 : 2}
                  filter={isSelected || isHovered ? `url(#glow-${node.covenant.status})` : undefined}
                  animate={{
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />

                {/* Status indicator */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={6}
                  fill={statusColors[node.covenant.status]}
                />

                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + node.radius + 18}
                  textAnchor="middle"
                  className="text-xs font-medium fill-foreground"
                  style={{ 
                    opacity: isHovered || isSelected || isRelated ? 1 : 0.7,
                    fontSize: '11px',
                  }}
                >
                  {node.covenant.name}
                </text>
              </motion.g>
            );
          })}
        </g>
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 right-4 p-4 glass rounded-lg"
          >
            {(() => {
              const node = getNodeById(hoveredNode);
              if (!node) return null;
              const covenant = node.covenant;
              
              return (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-serif text-base font-medium text-foreground">
                        {covenant.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {covenant.legalReference}
                      </p>
                    </div>
                    <span className={cn(
                      'px-2 py-0.5 text-xs font-medium rounded-full',
                      covenant.status === 'compliant' && 'bg-compliant/20 text-compliant',
                      covenant.status === 'at-risk' && 'bg-at-risk/20 text-at-risk',
                      covenant.status === 'breach' && 'bg-breach/20 text-breach',
                      covenant.status === 'pending' && 'bg-pending/20 text-pending',
                    )}>
                      {covenant.status === 'at-risk' ? 'At Risk' : covenant.status.charAt(0).toUpperCase() + covenant.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {covenant.threshold}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {covenant.currentValue && (
                      <span>Current: <span className="text-foreground">{covenant.currentValue}</span></span>
                    )}
                    <span>Frequency: <span className="text-foreground capitalize">{covenant.frequency}</span></span>
                    <span>Confidence: <span className="text-foreground">{covenant.confidence}%</span></span>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
