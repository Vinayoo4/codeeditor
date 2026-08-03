/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Party Detail Overview Card
 */

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Building,
  Tag,
  Copy,
  Check,
  PlusCircle,
  MinusCircle,
  Sliders,
  Edit,
  CopyPlus,
  Archive,
  QrCode,
  FileText,
} from 'lucide-react';
import { Party } from '../types';
import { getPartyBalanceSnapshot } from '../services/partiesDomain';

interface PartyDetailCardProps {
  party: Party;
  onEdit: () => void;
  onArchive: () => void;
  onDuplicate: () => void;
  onOpenAdjustment: () => void;
  onOpenSaleLink: () => void;
  onOpenExpenseLink: () => void;
  onOpenQrModal: () => void;
}

export const PartyDetailCard: React.FC<PartyDetailCardProps> = ({
  party,
  onEdit,
  onArchive,
  onDuplicate,
  onOpenAdjustment,
  onOpenSaleLink,
  onOpenExpenseLink,
  onOpenQrModal,
}) => {
  const [copied, setCopied] = useState(false);
  const balanceSnap = getPartyBalanceSnapshot(party);

  const handleCopy = () => {
    const text = `Party Code: ${party.partyCode}\nName: ${party.name}\nType: ${party.type}\nPhone: ${
      party.phone || 'N/A'
    }\nEmail: ${party.email || 'N/A'}\nBalance: ${balanceSnap.formattedAmount} (${balanceSnap.label})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md">
              {party.partyCode}
            </span>
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {party.type}
            </span>
            {party.status === 'archived' ? (
              <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-full">
                Archived
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                Active
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{party.name}</h1>
          {party.gstin && (
            <p className="text-xs text-slate-400 mt-0.5">GSTIN / Tax ID: {party.gstin}</p>
          )}
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={onDuplicate}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <CopyPlus className="w-3.5 h-3.5" /> Duplicate
          </button>
          <button
            onClick={onOpenQrModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            <QrCode className="w-3.5 h-3.5" /> Contact QR
          </button>
          <button
            onClick={onArchive}
            className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-xl transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
            {party.status === 'active' ? 'Archive' : 'Restore'}
          </button>
        </div>
      </div>

      {/* Balance Highlight Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-xl">
        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Ledger Status
          </div>
          <div
            className={`text-lg font-bold ${
              balanceSnap.variant === 'receivable'
                ? 'text-emerald-600 dark:text-emerald-400'
                : balanceSnap.variant === 'payable'
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {balanceSnap.label} ({balanceSnap.formattedAmount})
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Opening Balance
          </div>
          <div className="text-base font-semibold text-slate-800 dark:text-slate-200">
            ${(party.openingBalance || 0).toFixed(2)}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Current Balance
          </div>
          <div className="text-base font-semibold text-slate-800 dark:text-slate-200">
            ${(party.currentBalance || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Primary Transaction Action Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={onOpenSaleLink}
          className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> + Record Sale
        </button>

        <button
          onClick={onOpenExpenseLink}
          className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          <MinusCircle className="w-4 h-4" /> + Record Expense
        </button>

        <button
          onClick={onOpenAdjustment}
          className="flex-1 min-w-[160px] flex items-center justify-center gap-1.5 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Sliders className="w-4 h-4" /> Payment / Ledger Entry
        </button>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Contact Details */}
        <div className="space-y-2 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Contact Information</span>
            <button
              onClick={handleCopy}
              className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {party.phone ? (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`tel:${party.phone}`} className="hover:underline text-indigo-600 dark:text-indigo-400">
                  {party.phone}
                </a>
              </div>
            ) : (
              <div className="text-slate-400 italic">No phone number recorded</div>
            )}

            {party.whatsapp && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <a href={`https://wa.me/${party.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="hover:underline text-emerald-600 dark:text-emerald-400">
                  {party.whatsapp} (WA)
                </a>
              </div>
            )}

            {party.email ? (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`mailto:${party.email}`} className="hover:underline text-indigo-600 dark:text-indigo-400">
                  {party.email}
                </a>
              </div>
            ) : (
              <div className="text-slate-400 italic">No email address recorded</div>
            )}

            {party.website && (
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={party.website} target="_blank" rel="noreferrer" className="hover:underline text-indigo-600 dark:text-indigo-400">
                  Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Location & Address */}
        <div className="space-y-2 p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Location & Address
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
            {party.address && <p>{party.address}</p>}
            {(party.city || party.state) && (
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {[party.city, party.state].filter(Boolean).join(', ')}
              </p>
            )}
            {!party.address && !party.city && !party.state && (
              <p className="text-slate-400 italic">No address specified</p>
            )}
          </div>
        </div>
      </div>

      {/* Tags & Notes */}
      <div className="space-y-3 pt-2">
        {party.tags && party.tags.length > 0 && (
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" /> Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {party.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {party.notes && (
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Notes & Custom Terms
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700/80">
              {party.notes}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Linked Relationships</h4>
          <div className="space-y-2 text-xs">
            {party.relatedExpenseIds && party.relatedExpenseIds.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-slate-500 w-28">Linked Expenses:</span>
                {party.relatedExpenseIds.map(id => (
                  <span key={id} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-[11px] font-mono border border-slate-200 dark:border-slate-700">{id}</span>
                ))}
              </div>
            )}

            {party.relatedCatalogItemIds && party.relatedCatalogItemIds.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-slate-500 w-28">Linked Catalogue Items:</span>
                {party.relatedCatalogItemIds.map(id => (
                  <span key={id} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-[11px] font-mono border border-slate-200 dark:border-slate-700">{id}</span>
                ))}
              </div>
            )}

            {party.relatedPartyIds && party.relatedPartyIds.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-slate-500 w-28">Linked Parties:</span>
                {party.relatedPartyIds.map(id => (
                  <span key={id} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-[11px] font-mono border border-slate-200 dark:border-slate-700">{id}</span>
                ))}
              </div>
            )}

            {party.relatedTaskIds && party.relatedTaskIds.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-slate-500 w-28">Linked Tasks:</span>
                {party.relatedTaskIds.map(id => (
                  <span key={id} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-[11px] font-mono border border-slate-200 dark:border-slate-700">{id}</span>
                ))}
              </div>
            )}

            {(!party.relatedExpenseIds?.length && !party.relatedCatalogItemIds?.length && !party.relatedPartyIds?.length && !party.relatedTaskIds?.length) && (
              <div className="text-slate-400 italic text-[11px]">No linked records.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
