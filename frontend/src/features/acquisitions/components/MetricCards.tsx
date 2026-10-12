import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign, Target, Award } from 'lucide-react';
import { AcquisitionDeal } from '../types/acquisition.types';
import { formatCurrency } from '@/lib/utils';

export const MetricCards: React.FC<{ deals: AcquisitionDeal[] }> = ({
  deals,
}) => {
  const totalValuation = deals.reduce((acc, d) => acc + d.valuation, 0);
  const activeDeals = deals.filter(d => d.stage !== 'completed').length;
  const avgDealSize = deals.length > 0 ? totalValuation / deals.length : 0;
  const completedDeals = deals.filter(d => d.stage === 'completed').length;
  const winRate =
    deals.length > 0 ? Math.round((completedDeals / deals.length) * 100) : 0;

  const metrics = [
    {
      title: 'Total Pipeline Value',
      value: formatCurrency(totalValuation),
      icon: DollarSign,
      color: 'text-brand-600 bg-brand-50 border-brand-200',
      subtitle: `${deals.length} total opportunities`,
    },
    {
      title: 'Active Deal Targets',
      value: activeDeals.toString(),
      icon: Target,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      subtitle: 'Currently in evaluation/diligence',
    },
    {
      title: 'Average Deal Size',
      value: formatCurrency(avgDealSize),
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      subtitle: 'Across all active verticals',
    },
    {
      title: 'Closed Target Rate',
      value: `${winRate}%`,
      icon: Award,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      subtitle: `${completedDeals} deals completed`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Card key={idx} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {m.title}
              </span>
              <div className={`p-2 rounded-xl border ${m.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {m.value}
            </div>
            <p className="text-xs text-slate-400 mt-1">{m.subtitle}</p>
          </Card>
        );
      })}
    </div>
  );
};
