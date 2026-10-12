import React, { useState } from 'react';
import { PipelineBoard } from '@/features/acquisitions/components/PipelineBoard';
import { AcquisitionDeal } from '@/features/acquisitions/types/acquisition.types';

const INITIAL_DEALS: AcquisitionDeal[] = [
  {
    id: 'deal-101',
    targetCompany: 'CloudScale Analytics',
    industry: 'Enterprise SaaS',
    valuation: 28000000,
    stage: 'due_diligence',
    leadPartner: 'Sarah Jenkins',
    probability: 65,
    expectedCloseDate: 'Q3 2026',
  },
  {
    id: 'deal-102',
    targetCompany: 'PayMesh Networks',
    industry: 'FinTech',
    valuation: 42000000,
    stage: 'negotiation',
    leadPartner: 'Marcus Vance',
    probability: 80,
    expectedCloseDate: 'Q4 2026',
  },
  {
    id: 'deal-103',
    targetCompany: 'NeuroVision AI',
    industry: 'AI / DeepTech',
    valuation: 18500000,
    stage: 'sourcing',
    leadPartner: 'Alex Chen',
    probability: 40,
    expectedCloseDate: 'Q1 2027',
  },
  {
    id: 'deal-104',
    targetCompany: 'Fortress Vaults',
    industry: 'Cybersecurity',
    valuation: 35000000,
    stage: 'closing',
    leadPartner: 'Marcus Vance',
    probability: 90,
    expectedCloseDate: 'End of Month',
  },
];

export const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<AcquisitionDeal[]>(INITIAL_DEALS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Acquisition Deals Pipeline
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review, stage, and advance prospective targets through standard due
          diligence phases.
        </p>
      </div>

      <PipelineBoard deals={deals} onUpdateDeals={setDeals} />
    </div>
  );
};
