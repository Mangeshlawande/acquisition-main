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
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Live Acquisition Stages
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
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

      <div className="overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-4 min-w-max xl:min-w-0 xl:grid xl:grid-cols-5">
          {stages.map(st => {
            const stageDeals = deals.filter(d => d.stage === st.key);
            const stageValuation = stageDeals.reduce(
              (sum, d) => sum + d.valuation,
              0
            );

            return (
              <div
                key={st.key}
                className="bg-slate-100/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col w-[280px] sm:w-[290px] xl:w-auto shrink-0 xl:shrink min-h-[480px]"
              >
                {/* Stage Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${st.dotColor} shrink-0`}
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {st.label}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-xs">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-3">
                  Vol: {formatCurrency(stageValuation)}
                </div>

                {/* Deal Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                  {stageDeals.map(d => (
                    <DealCard
                      key={d.id}
                      deal={d}
                      onAdvanceStage={handleAdvanceStage}
                    />
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="h-32 flex items-center justify-center text-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-xs">
                      No active targets in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CreateDealModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateDeal={handleCreateDeal}
      />
    </div>
  );
};
