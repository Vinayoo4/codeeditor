/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Empty State Component
 */

import React from 'react';
import { Users, Plus, Sparkles, UserPlus, Truck } from 'lucide-react';

interface EmptyPartiesStateProps {
  onAddNew: () => void;
}

export const EmptyPartiesState: React.FC<EmptyPartiesStateProps> = ({
  onAddNew,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-xs space-y-6 my-6">
      <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-indigo-100 dark:border-indigo-900">
        <Users className="w-8 h-8" />
      </div>

      <div className="max-w-md mx-auto space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Master Relationship Registry
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          The Parties module is the central contact and ledger hub for your Business OS. Store customers, suppliers, vendors, and leads, track balances, and generate records used by Sales & Expenses.
        </p>
      </div>

      {/* Suggested Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-left text-xs">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
            <UserPlus className="w-4 h-4 text-emerald-600" /> Customers
          </div>
          <p className="text-[11px] text-slate-400">Track buyers, credit sales, and receivables owed to you.</p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
            <Truck className="w-4 h-4 text-amber-600" /> Suppliers
          </div>
          <p className="text-[11px] text-slate-400">Track raw material providers and payable balances you owe.</p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/80">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600" /> API Package
          </div>
          <p className="text-[11px] text-slate-400">Fully local-first & structured with reusable API DTO contracts.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onAddNew}
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add First Party Record
        </button>
      </div>
    </div>
  );
};
