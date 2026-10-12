import React, { useState } from 'react';
import { MetricCards } from '@/features/acquisitions/components/MetricCards';
import { PipelineBoard } from '@/features/acquisitions/components/PipelineBoard';
import { AcquisitionDeal } from '@/features/acquisitions/types/acquisition.types';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Building2, ShieldCheck } from 'lucide-react';

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
    notes: 'Series B data infrastructure provider with 85% ARR retention.',
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
    notes: 'Cross-border B2B settlement rails.',
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
  {
    id: 'deal-105',
    targetCompany: 'BioStream Systems',
    industry: 'HealthTech',
    valuation: 14000000,
    stage: 'completed',
    leadPartner: 'Sarah Jenkins',
    probability: 100,
    expectedCloseDate: 'Closed',
  },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [deals, setDeals] = useState<AcquisitionDeal[]>(INITIAL_DEALS);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 p-6 sm:p-8 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-300 mb-1">
            <Building2 className="w-4 h-4" />
            Portfolio Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name || 'Operator'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            All active mergers & acquisitions pipeline metrics, risk indicators,
            and user sessions are synchronized in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-medium text-emerald-300">
          <ShieldCheck className="w-4 h-4" />
          <span>Backend Session Active</span>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <MetricCards deals={deals} />

      {/* Pipeline Kanban */}
      <PipelineBoard deals={deals} onUpdateDeals={setDeals} />
    </div>
  );
};
