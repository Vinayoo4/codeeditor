/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Shareable Contact Card & QR Code Modal
 */

import React, { useState } from 'react';
import { X, QrCode, Copy, Check, Share2, Building, Phone, Mail, MapPin } from 'lucide-react';
import { Party } from '../types';

interface PartyQrModalProps {
  party: Party;
  onClose: () => void;
}

export const PartyQrModal: React.FC<PartyQrModalProps> = ({ party, onClose }) => {
  const [copied, setCopied] = useState(false);

  // Generate vCard format text
  const vCardText = `BEGIN:VCARD
VERSION:3.0
FN:${party.name}
ORG:${party.name}
TITLE:${party.type.toUpperCase()} - ${party.partyCode}
TEL:${party.phone || ''}
EMAIL:${party.email || ''}
ADR:;;${party.address || ''};${party.city || ''};${party.state || ''};;
NOTE:SALTEDHASH Business OS Party Record ${party.partyCode}
END:VCARD`;

  const handleCopyVCard = () => {
    navigator.clipboard.writeText(vCardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick SVG QR mock renderer using matrix blocks
  const qrBlocks = Array.from({ length: 49 }, (_, i) => (i * 17) % 2 === 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 text-center">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <QrCode className="w-4 h-4 text-indigo-600" /> Digital Contact Card
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contact Badge */}
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded">
            {party.partyCode}
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">{party.name}</h3>
          <p className="text-xs uppercase font-semibold text-indigo-600 dark:text-indigo-400">
            {party.type}
          </p>
        </div>

        {/* Generated QR Graphic Box */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl inline-block shadow-md my-2">
          <div className="grid grid-cols-7 gap-1 w-32 h-32 p-2 bg-white rounded-xl">
            {qrBlocks.map((isDark, idx) => (
              <div
                key={idx}
                className={`rounded-xs ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}
              />
            ))}
          </div>
        </div>

        {/* Contact info list */}
        <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 text-left bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
          {party.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{party.phone}</span>
            </div>
          )}
          {party.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{party.email}</span>
            </div>
          )}
          {(party.city || party.state) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{[party.city, party.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleCopyVCard}
            className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'vCard Copied!' : 'Copy vCard Data'}
          </button>
        </div>
      </div>
    </div>
  );
};
