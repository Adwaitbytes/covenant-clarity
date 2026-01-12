// Core domain types for Covenant Graph

export type CovenantStatus = 'compliant' | 'at-risk' | 'breach' | 'pending';

export interface Covenant {
  id: string;
  name: string;
  type: 'financial' | 'reporting' | 'affirmative' | 'negative' | 'informational';
  threshold: string;
  frequency: 'quarterly' | 'semi-annual' | 'annual' | 'monthly' | 'ongoing';
  status: CovenantStatus;
  currentValue?: string;
  lastTested?: string;
  nextTestDate?: string;
  dependencies: string[];
  description: string;
  legalReference: string;
  materiality: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
}

export interface Amendment {
  id: string;
  title: string;
  effectiveDate: string;
  documentId: string;
  summary: string;
  impactedCovenants: string[];
  changeType: 'modification' | 'waiver' | 'addition' | 'removal';
  status: 'pending' | 'approved' | 'executed';
  requestedBy: string;
}

export interface Facility {
  id: string;
  name: string;
  borrower: string;
  agent: string;
  currency: string;
  amount: number;
  status: 'active' | 'pending' | 'closed';
  closingDate: string;
  maturityDate: string;
  covenants: Covenant[];
  amendments: Amendment[];
  lenders: Lender[];
  complianceScore: number;
  lastUpdated: string;
}

export interface Lender {
  id: string;
  name: string;
  commitment: number;
  share: number;
  role: 'lead' | 'participant' | 'agent';
}

export interface Document {
  id: string;
  name: string;
  type: 'facility-agreement' | 'amendment' | 'waiver' | 'notice' | 'compliance-certificate';
  uploadedAt: string;
  uploadedBy: string;
  status: 'processing' | 'parsed' | 'reviewed' | 'approved';
  covenantCount?: number;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  entity: string;
  entityId: string;
  details: string;
  category: 'document' | 'covenant' | 'compliance' | 'amendment' | 'access' | 'system';
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  covenant: Covenant;
  radius: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'dependency' | 'condition' | 'reference';
}

export interface ComplianceState {
  facilityId: string;
  overallScore: number;
  covenantStates: {
    covenantId: string;
    status: CovenantStatus;
    confidence: number;
    reasoning: string;
    dataSource: string;
    amendmentReference?: string;
  }[];
  lastCalculated: string;
  nextTestDate: string;
}
