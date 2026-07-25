/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Balance Summary Stat Cards
 */

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Scale, Users, UserCheck } from 'lucide-react';
import { PartySummaryResponse } from '../api/dto';

interface PartyBalanceSummaryProps {
  summary?: PartySummaryResponse | null;
  loading?: boolean;
}

export const PartyBalanceSummary: React.FC<PartyBalanceSummaryProps> = ({ summary, loading }) => {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const formatCurrency = (val: number) =>
    `$${Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
      {/* Receivables */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          <span>Total Receivables</span>
          <span className="p-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-md">
            <ArrowDownLeft className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
          {formatCurrency(summary.totalReceivables)}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">Owed to your business</div>
      </div>

      {/* Payables */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          <span>Total Payables</span>
          <span className="p-1 bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 rounded-md">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl font-bold text-rose-600 dark:text-rose-400">
          {formatCurrency(summary.totalPayables)}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">You owe to suppliers</div>
      </div>

      {/* Net Balance */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          <span>Net Ledger Position</span>
          <span className="p-1 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 rounded-md">
            <Scale className="w-4 h-4" />
          </span>
        </div>
        <div
          className={`text-xl font-bold ${
            summary.netBalance >= 0
              ? 'text-slate-900 dark:text-white'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {summary.netBalance >= 0 ? '+' : '-'}
          {formatCurrency(summary.netBalance)}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">
          {summary.netBalance >= 0 ? 'Positive net balance' : 'Payables exceed receivables'}
        </div>
      </div>

      {/* Total Active Parties */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          <span>Active Registry</span>
          <span className="p-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-md">
            <UserCheck className="w-4 h-4" />
          </span>
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-white">
          {summary.activeCount} <span className="text-xs font-normal text-slate-400">parties</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span>{summary.totalCustomers} Cust</span> • <span>{summary.totalSuppliers} Supp</span> •{' '}
          <span>{summary.totalVendors} Vend</span>
        </div>
      </div>
    </div>
  );
};
