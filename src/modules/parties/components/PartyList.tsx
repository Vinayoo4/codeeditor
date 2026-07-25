/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Party List View Container (Grid + Table modes)
 */

import React from 'react';
import { Party } from '../types';
import { PartyCard } from './PartyCard';
import { getPartyBalanceSnapshot } from '../services/partiesDomain';
import { Eye, Edit, CopyPlus, Archive, PlusCircle, MinusCircle, QrCode } from 'lucide-react';

interface PartyListProps {
  parties: Party[];
  viewMode: 'grid' | 'table';
  onViewDetail: (id: string) => void;
  onEdit: (party: Party) => void;
  onArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onOpenSaleLink: (partyId: string) => void;
  onOpenExpenseLink: (partyId: string) => void;
  onOpenQrModal?: (party: Party) => void;
}

export const PartyList: React.FC<PartyListProps> = ({
  parties,
  viewMode,
  onViewDetail,
  onEdit,
  onArchive,
  onDuplicate,
  onOpenSaleLink,
  onOpenExpenseLink,
  onOpenQrModal,
}) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {parties.map((party) => (
          <PartyCard
            key={party.id}
            party={party}
            onViewDetail={onViewDetail}
            onEdit={onEdit}
            onArchive={onArchive}
            onDuplicate={onDuplicate}
            onOpenSaleLink={onOpenSaleLink}
            onOpenExpenseLink={onOpenExpenseLink}
            onOpenQrModal={onOpenQrModal}
          />
        ))}
      </div>
    );
  }

  // Table View Mode
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Party Name</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Contact & Location</th>
              <th className="py-3 px-4">Balance Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {parties.map((party) => {
              const balanceSnap = getPartyBalanceSnapshot(party);
              return (
                <tr
                  key={party.id}
                  onClick={() => onViewDetail(party.id)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-slate-400">
                    {party.partyCode}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {party.name}
                    {party.tags && party.tags.length > 0 && (
                      <div className="flex gap-1 mt-0.5">
                        {party.tags.slice(0, 2).map((t, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                      {party.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    <div>{party.phone || party.email || '—'}</div>
                    <div className="text-[11px] text-slate-400">
                      {[party.city, party.state].filter(Boolean).join(', ')}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex flex-col px-2 py-0.5 rounded text-xs font-medium ${
                        balanceSnap.variant === 'receivable'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : balanceSnap.variant === 'payable'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <span className="text-[9px] uppercase font-bold">{balanceSnap.label}</span>
                      <span>{balanceSnap.formattedAmount}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onViewDetail(party.id)}
                        title="View Details"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(party)}
                        title="Edit Party"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenSaleLink(party.id)}
                        title="Create Sale"
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-md"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenExpenseLink(party.id)}
                        title="Create Expense"
                        className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 rounded-md"
                      >
                        <MinusCircle className="w-3.5 h-3.5" />
                      </button>
                      {onOpenQrModal && (
                        <button
                          onClick={() => onOpenQrModal(party)}
                          title="Share Contact Card"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
