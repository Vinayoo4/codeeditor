/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Manual Ledger Payment / Adjustment Modal
 */

import React, { useState } from 'react';
import { X, Sliders, Check, DollarSign, FileText } from 'lucide-react';
import { Party } from '../types';
import { applyBalanceChange } from '../services/partiesDomain';

interface AdjustmentModalProps {
  party: Party;
  onSave: (
    amount: number,
    title: string,
    sourceType: 'manual' | 'adjustment' | 'payment' | 'note',
    note?: string
  ) => Promise<void>;
  onClose: () => void;
}

export const AdjustmentModal: React.FC<AdjustmentModalProps> = ({ party, onSave, onClose }) => {
  const [amountType, setAmountType] = useState<'debit' | 'credit'>('debit');
  const [rawAmount, setRawAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('Payment Received');
  const [sourceType, setSourceType] = useState<'manual' | 'adjustment' | 'payment' | 'note'>('payment');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedVal = parseFloat(rawAmount) || 0;
  const actualAmount = amountType === 'debit' ? Math.abs(parsedVal) : -Math.abs(parsedVal);
  const projectedBalance = applyBalanceChange(party.currentBalance, actualAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await onSave(actualAmount, title.trim(), sourceType, note.trim());
      onClose();
    } catch (err) {
      console.error("Adjustment error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Record Payment / Ledger Entry
              </h3>
              <p className="text-xs text-slate-400">
                {party.name} ({party.partyCode})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Debit / Credit Direction */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Entry Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAmountType('credit');
                  setTitle('Payment Received');
                  setSourceType('payment');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  amountType === 'credit'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs">Payment / Credit (-)</div>
                <div className="text-[10px] opacity-75 font-normal">Reduces party balance</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAmountType('debit');
                  setTitle('Debit Invoice / Addition');
                  setSourceType('manual');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  amountType === 'debit'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="text-xs">Debit / Charge (+)</div>
                <div className="text-[10px] opacity-75 font-normal">Increases party balance</div>
              </button>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Amount ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={rawAmount}
                onChange={(e) => setRawAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Entry Title */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Entry Title / Description
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bank Transfer Payment Received or Manual Credit Adjustment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Note */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Internal Reference / Note
            </label>
            <textarea
              rows={2}
              placeholder="Optional transaction reference or check number..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          {/* Live Projection Box */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
            <span className="text-slate-500">Projected Balance After Entry:</span>
            <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
              ${projectedBalance.toFixed(2)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !parsedVal}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> Save Ledger Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
