import { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
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

const statusColors: Record<string, string> = {
  compliant: '#4caf75',
  'at-risk': '#cca333',
  breach: '#bf4040',
  pending: '#737b8c',
};

export const CovenantGraph = forwardRef<HTMLDivElement, CovenantGraphProps>(({ 
  covenants, 
  selectedCovenantId, 
  onSelectCovenant,
  className,
  animated = true 
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }>({ nodes: [], edges: [] });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    };

    updateDimensions();
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setGraphData(generateGraphLayout(covenants, dimensions.width, dimensions.height));
    }
  }, [covenants, dimensions]);

  const getNodeById = useCallback((id: string) => graphData.nodes.find(n => n.id === id), [graphData.nodes]);

  return (
    <div 
      ref={(node) => {
        (containerRef as any).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cn('relative w-full h-full min-h-[400px] bg-surface-0 rounded-xl overflow-hidden', className)}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
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
        {/* Edges */}
        <g>
          {graphData.edges.map((edge) => {
            const sourceNode = getNodeById(edge.source);
            const targetNode = getNodeById(edge.target);
            
            if (!sourceNode || !targetNode) return null;

            const isHighlighted = hoveredNode === edge.source || hoveredNode === edge.target ||
              selectedCovenantId === edge.source || selectedCovenantId === edge.target;

            return (
              <line
                key={edge.id}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHighlighted ? '#cca752' : '#3a3f4a'}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeOpacity={isHighlighted ? 0.8 : 0.3}
                strokeDasharray={isHighlighted ? 'none' : '4 4'}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {graphData.nodes.map((node) => {
            const isSelected = selectedCovenantId === node.id;
            const isHovered = hoveredNode === node.id;
            const color = statusColors[node.covenant.status];

            return (
              <g
                key={node.id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onSelectCovenant?.(isSelected ? null : node.covenant)}
              >
                {/* Outer glow ring */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + 10}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={2}
                    strokeOpacity={0.3}
                  />
                )}
                
                {/* Main node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius}
                  fill="#12151a"
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                />

                {/* Status indicator */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={6}
                  fill={color}
                />

                {/* Label */}
                <text
                  x={node.x}
                  y={node.y + node.radius + 18}
                  textAnchor="middle"
                  fill="#f5f3ef"
                  fontSize="11"
                  fontWeight="500"
                  opacity={isHovered || isSelected ? 1 : 0.7}
                >
                  {node.covenant.name}
                </text>
              </g>
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
                      `status-${covenant.status}`
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
});

CovenantGraph.displayName = 'CovenantGraph';
