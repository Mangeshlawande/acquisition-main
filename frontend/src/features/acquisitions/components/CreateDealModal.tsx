import React, { useState } from 'react';
import { AcquisitionDeal, DealStage } from '../types/acquisition.types';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDeal: (deal: AcquisitionDeal) => void;
}

export const CreateDealModal: React.FC<CreateDealModalProps> = ({
  isOpen,
  onClose,
  onCreateDeal,
}) => {
  const { success } = useToast();
  const [formData, setFormData] = useState({
    targetCompany: '',
    industry: 'FinTech',
    valuation: '15000000',
    stage: 'sourcing' as DealStage,
    leadPartner: 'Investment Committee',
    probability: '40',
    expectedCloseDate: 'Q4 2026',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.targetCompany.trim()) return;

    const newDeal: AcquisitionDeal = {
      id: `deal-${Date.now()}`,
      targetCompany: formData.targetCompany,
      industry: formData.industry,
      valuation: Number(formData.valuation) || 1000000,
      stage: formData.stage,
      leadPartner: formData.leadPartner,
      probability: Number(formData.probability) || 50,
      expectedCloseDate: formData.expectedCloseDate,
      notes: formData.notes,
    };

    onCreateDeal(newDeal);
    success(
      `Target "${newDeal.targetCompany}" added to pipeline!`,
      'Deal Created'
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Acquisition Target"
      description="Add a company to the evaluation pipeline"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Target Company Name"
          type="text"
          placeholder="e.g. Apex Data Systems"
          required
          value={formData.targetCompany}
          onChange={e =>
            setFormData({ ...formData, targetCompany: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Industry Sector
            </label>
            <select
              value={formData.industry}
              onChange={e =>
                setFormData({ ...formData, industry: e.target.value })
              }
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Enterprise SaaS">Enterprise SaaS</option>
              <option value="FinTech">FinTech</option>
              <option value="AI / DeepTech">AI / DeepTech</option>
              <option value="HealthTech">HealthTech</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <Input
            label="Est. Valuation ($ USD)"
            type="number"
            value={formData.valuation}
            onChange={e =>
              setFormData({ ...formData, valuation: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Lead Partner"
            type="text"
            value={formData.leadPartner}
            onChange={e =>
              setFormData({ ...formData, leadPartner: e.target.value })
            }
          />

          <Input
            label="Win Probability (%)"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={e =>
              setFormData({ ...formData, probability: e.target.value })
            }
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add to Pipeline</Button>
        </div>
      </form>
    </Modal>
  );
};
