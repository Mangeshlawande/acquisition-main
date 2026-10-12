import React from 'react';
import { AcquisitionDeal, DealStage } from '../types/acquisition.types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Building, DollarSign, Calendar, ArrowRight } from 'lucide-react';

export interface DealCardProps {
  deal: AcquisitionDeal;
  onAdvanceStage?: (dealId: string, nextStage: DealStage) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onAdvanceStage }) => {
  const nextStages: Record<DealStage, DealStage | null> = {
    sourcing: 'due_diligence',
    due_diligence: 'negotiation',
    negotiation: 'closing',
    closing: 'completed',
    completed: null,
  };

  const next = nextStages[deal.stage];

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <h4
          title={deal.targetCompany}
          className="text-sm font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1"
        >
          {deal.targetCompany}
        </h4>
        <Badge variant="outline" className="text-[10px] shrink-0 font-medium">
          {deal.industry}
        </Badge>
      </div>

      <div className="space-y-2 my-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
          <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{formatCurrency(deal.valuation)}</span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">Lead: {deal.leadPartner}</span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Target Close: {deal.expectedCloseDate}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
          {deal.probability}% Win Prob
        </span>

        {next && onAdvanceStage && (
          <button
            onClick={() => onAdvanceStage(deal.id, next)}
            className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 hover:underline transition-colors"
          >
            Advance <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
