/**
 * SALTEDHASH Business OS - Module 6: Parties
 * History Timeline Component
 */

import React from 'react';
import { History, FileText, ArrowUpRight, ArrowDownLeft, Sliders, Info, ShoppingBag, Receipt } from 'lucide-react';
import { PartyHistoryEntry } from '../types';
import { buildPartyTimelineItem } from '../services/partiesDomain';

interface PartyHistoryTimelineProps {
  entries: PartyHistoryEntry[];
  loading?: boolean;
}

export const PartyHistoryTimeline: React.FC<PartyHistoryTimelineProps> = ({ entries, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="h-5 w-36 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-2">
        <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          No Activity History Recorded Yet
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          When you record sales, expenses, payments, or ledger adjustments against this party, they will appear here in chronological order.
        </p>
      </div>
    );
  }

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'sale':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'expense':
        return <Receipt className="w-4 h-4 text-amber-600" />;
      case 'payment':
        return <ArrowDownLeft className="w-4 h-4 text-blue-600" />;
      case 'manual':
      case 'adjustment':
        return <Sliders className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Ledger & Activity History ({entries.length})
          </h2>
        </div>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {entries.map((entry) => {
          const item = buildPartyTimelineItem(entry);

          return (
            <div key={entry.id} className="relative group">
              {/* Timeline Bullet */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
              </div>

              {/* Card Container */}
              <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(entry.sourceType)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                        >
                          {item.sourceLabel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{item.dateFormatted}</p>
                    </div>
                  </div>

                  {/* Impact Amount & Balance After */}
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${
                        item.isPositive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {item.amountDisplay}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Balance After: ${entry.balanceAfter.toFixed(2)}
                    </div>
                  </div>
                </div>

                {entry.note && (
                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 italic pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    "{entry.note}"
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
