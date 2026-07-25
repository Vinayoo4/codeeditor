/**
 * SALTEDHASH Business OS - Module 6: Parties
 * New Party Creation Page
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { PartyForm } from './components/PartyForm';
import { Party } from './types';

interface NewPartyPageProps {
  onBack: () => void;
  onPartyCreated: (party: Party) => void;
}

export const NewPartyPage: React.FC<NewPartyPageProps> = ({ onBack, onPartyCreated }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Parties List
        </button>
      </div>

      <PartyForm onSaved={onPartyCreated} onCancel={onBack} />
    </div>
  );
};
