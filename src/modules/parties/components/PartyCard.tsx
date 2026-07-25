/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Individual Party Card Component
 */

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Tag,
  Copy,
  Check,
  MoreVertical,
  ExternalLink,
  PlusCircle,
  MinusCircle,
  Archive,
  CopyPlus,
  Edit,
  Eye,
  QrCode,
} from 'lucide-react';
import { Party } from '../types';
import { getPartyBalanceSnapshot } from '../services/partiesDomain';

interface PartyCardProps {
  party: Party;
  onViewDetail: (id: string) => void;
  onEdit: (party: Party) => void;
  onArchive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onOpenSaleLink: (partyId: string) => void;
  onOpenExpenseLink: (partyId: string) => void;
  onOpenQrModal?: (party: Party) => void;
}

export const PartyCard: React.FC<PartyCardProps> = ({
  party,
  onViewDetail,
  onEdit,
  onArchive,
  onDuplicate,
  onOpenSaleLink,
  onOpenExpenseLink,
  onOpenQrModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const balanceSnap = getPartyBalanceSnapshot(party);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'customer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'supplier':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'vendor':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'lead':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const handleCopyContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    const info = `${party.name} (${party.partyCode}) | ${party.phone || ''} ${party.email || ''}`.trim();
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onViewDetail(party.id)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      {/* Header Row */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] font-mono font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded">
                {party.partyCode}
              </span>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadge(
                  party.type
                )}`}
              >
                {party.type}
              </span>
              {party.status === 'archived' && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-full">
                  Archived
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
              {party.name}
            </h3>
          </div>

          {/* Quick Menu Button */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-7 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-20 py-1 text-xs">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onViewDetail(party.id);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                >
                  <Eye className="w-3.5 h-3.5" /> View Details
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(party);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Record
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDuplicate(party.id);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                >
                  <CopyPlus className="w-3.5 h-3.5" /> Duplicate
                </button>
                {onOpenQrModal && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenQrModal(party);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Share QR Contact
                  </button>
                )}
                <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onArchive(party.id);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2 text-rose-600 dark:text-rose-400"
                >
                  <Archive className="w-3.5 h-3.5" />
                  {party.status === 'active' ? 'Archive Party' : 'Restore Party'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact info list */}
        <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 my-2.5">
          {party.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a
                href={`tel:${party.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                {party.phone}
              </a>
            </div>
          )}

          {party.email && (
            <div className="flex items-center gap-2 line-clamp-1">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a
                href={`mailto:${party.email}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
              >
                {party.email}
              </a>
            </div>
          )}

          {(party.city || party.state) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {[party.city, party.state].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {party.tags && party.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 my-2">
            {party.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded"
              >
                #{tag}
              </span>
            ))}
            {party.tags.length > 3 && (
              <span className="text-[10px] text-slate-400">+{party.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Balance Snapshot & Quick Link Buttons */}
      <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        {/* Balance Badge */}
        <div
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex flex-col ${
            balanceSnap.variant === 'receivable'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              : balanceSnap.variant === 'payable'
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
          }`}
        >
          <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">
            {balanceSnap.label}
          </span>
          <span className="text-sm">{balanceSnap.formattedAmount}</span>
        </div>

        {/* Quick Action Icon Row */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleCopyContact}
            title={copied ? 'Copied!' : 'Copy Contact Info'}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onOpenSaleLink(party.id)}
            title="Create Sale for Party"
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-md transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenExpenseLink(party.id)}
            title="Create Expense for Party"
            className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-md transition-colors"
          >
            <MinusCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
