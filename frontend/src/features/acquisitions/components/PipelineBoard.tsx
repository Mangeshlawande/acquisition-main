import React, { useState } from 'react';
import { AcquisitionDeal, DealStage } from '../types/acquisition.types';
import { DealCard } from './DealCard';
import { Button } from '@/components/ui/button';
import { CreateDealModal } from './CreateDealModal';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface PipelineBoardProps {
  deals: AcquisitionDeal[];
  onUpdateDeals: (updatedDeals: AcquisitionDeal[]) => void;
}

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  deals,
  onUpdateDeals,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const stages: { key: DealStage; label: string; dotColor: string }[] = [
    {
      key: 'sourcing',
      label: '1. Sourcing & Discovery',
      dotColor: 'bg-blue-500',
    },
    {
      key: 'due_diligence',
      label: '2. Due Diligence',
      dotColor: 'bg-amber-500',
    },
    {
      key: 'negotiation',
      label: '3. Terms & Negotiation',
      dotColor: 'bg-purple-500',
    },
    {
      key: 'closing',
      label: '4. Definitive Agreement',
      dotColor: 'bg-indigo-500',
    },
    {
      key: 'completed',
      label: '5. Closed & Acquired',
      dotColor: 'bg-emerald-500',
    },
  ];

  const handleAdvanceStage = (dealId: string, nextStage: DealStage) => {
    const updated = deals.map(d =>
      d.id === dealId ? { ...d, stage: nextStage } : d
    );
    onUpdateDeals(updated);
  };

  const handleCreateDeal = (newDeal: AcquisitionDeal) => {
    onUpdateDeals([newDeal, ...deals]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Live Acquisition Stages
          </h3>
          <p className="text-xs text-slate-500">
            Track target progression from initial evaluation to closing
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          size="sm"
          className="flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Target
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map(st => {
          const stageDeals = deals.filter(d => d.stage === st.key);
          const stageValuation = stageDeals.reduce(
            (sum, d) => sum + d.valuation,
            0
          );

          return (
            <div
              key={st.key}
              className="bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col min-w-[240px] min-h-[450px]"
            >
              {/* Stage Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${st.dotColor}`} />
                  <span className="text-xs font-bold text-slate-700">
                    {st.label}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                  {stageDeals.length}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 font-medium mb-3">
                Vol: {formatCurrency(stageValuation)}
              </div>

              {/* Deal Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageDeals.map(d => (
                  <DealCard
                    key={d.id}
                    deal={d}
                    onAdvanceStage={handleAdvanceStage}
                  />
                ))}
                {stageDeals.length === 0 && (
                  <div className="h-32 flex items-center justify-center text-center p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    No active targets in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <CreateDealModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateDeal={handleCreateDeal}
      />
    </div>
  );
};
