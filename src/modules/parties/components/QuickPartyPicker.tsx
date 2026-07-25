/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Quick Party Picker Component for Sales, Expenses, and Inter-Module Workflows
 */

import React, { useState, useEffect } from 'react';
import { User, Search, Plus, Check, ChevronDown, Phone, Sparkles } from 'lucide-react';
import { Party, QuickPartyOption } from '../types';
import { usePartiesList } from '../hooks/usePartiesList';
import { getPartiesForPicker } from '../services/partiesDomain';
import { PartyForm } from './PartyForm';

interface QuickPartyPickerProps {
  selectedPartyId?: string;
  onSelectParty: (party: Party | null) => void;
  filterType?: 'customer' | 'supplier' | 'vendor' | 'all';
  placeholder?: string;
  label?: string;
}

export const QuickPartyPicker: React.FC<QuickPartyPickerProps> = ({
  selectedPartyId,
  onSelectParty,
  filterType = 'all',
  placeholder = 'Select or search party...',
  label = 'Party / Contact',
}) => {
  const { parties, refresh } = usePartiesList({ status: 'active' });
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);

  const pickerOptions: QuickPartyOption[] = getPartiesForPicker(parties, filterType);

  const filteredOptions = pickerOptions.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.partyCode.toLowerCase().includes(search.toLowerCase()) ||
      (p.phone && p.phone.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedParty = parties.find((p) => p.id === selectedPartyId);

  return (
    <div className="space-y-1 relative">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {/* Picker Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <User className="w-4 h-4 text-slate-400 shrink-0" />
          {selectedParty ? (
            <div className="truncate text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedParty.name}
              </span>{' '}
              <span className="text-slate-400 font-mono">({selectedParty.partyCode})</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 truncate">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {selectedParty && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                selectedParty.currentBalance > 0
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : selectedParty.currentBalance < 0
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              ${Math.abs(selectedParty.currentBalance).toFixed(2)}
            </span>
          )}
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-2 space-y-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, code, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
              autoFocus
            />
          </div>

          {/* Party Option List */}
          <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400">No matching parties found</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.id === selectedPartyId;
                const partyObj = parties.find((p) => p.id === opt.id) || null;

                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      onSelectParty(partyObj);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-medium'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-semibold flex items-center gap-1.5">
                        {opt.name}
                        <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                          {opt.type}
                        </span>
                      </div>
                      {opt.phone && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" /> {opt.phone}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-mono">
                        ${Math.abs(opt.currentBalance).toFixed(2)}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Create Action */}
          <button
            onClick={() => {
              setIsOpen(false);
              setShowQuickAddModal(true);
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-lg transition-colors border border-indigo-200 dark:border-indigo-800"
          >
            <Plus className="w-3.5 h-3.5" /> + Quick Create New Party
          </button>
        </div>
      )}

      {/* Quick Add Party Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <PartyForm
              onSaved={(newParty) => {
                setShowQuickAddModal(false);
                refresh();
                onSelectParty(newParty);
              }}
              onCancel={() => setShowQuickAddModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
