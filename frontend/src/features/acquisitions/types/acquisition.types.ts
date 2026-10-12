export type DealStage =
  | 'sourcing'
  | 'due_diligence'
  | 'negotiation'
  | 'closing'
  | 'completed';

export interface AcquisitionDeal {
  id: string;
  targetCompany: string;
  industry: string;
  valuation: number;
  stage: DealStage;
  leadPartner: string;
  probability: number;
  expectedCloseDate: string;
  notes?: string;
}

export interface MetricItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtitle: string;
}
