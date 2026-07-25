/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Party Detail & Ledger History Page
 */

import React, { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { usePartyDetail } from './hooks/usePartyDetail';
import { PartyDetailCard } from './components/PartyDetailCard';
import { PartyHistoryTimeline } from './components/PartyHistoryTimeline';
import { PartyForm } from './components/PartyForm';
import { AdjustmentModal } from './components/AdjustmentModal';
import { PartyQrModal } from './components/PartyQrModal';

interface PartyDetailPageProps {
  partyId: string;
  onBack: () => void;
  onOpenSaleLink: (partyId: string) => void;
  onOpenExpenseLink: (partyId: string) => void;
}

export const PartyDetailPage: React.FC<PartyDetailPageProps> = ({
  partyId,
  onBack,
  onOpenSaleLink,
  onOpenExpenseLink,
}) => {
  const {
    party,
    history,
    loading,
    error,
    refresh,
    archiveParty,
    duplicateParty,
    addAdjustment,
  } = usePartyDetail(partyId);

  const [isEditing, setIsEditing] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-xs text-slate-400">Loading party record and ledger history...</p>
      </div>
    );
  }

  if (error || !party) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl text-center space-y-3">
        <h3 className="text-base font-bold text-rose-800 dark:text-rose-300">
          Party Record Not Found
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400">
          {error || `No relationship record matching ID "${partyId}" was found.`}
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-rose-600 text-white font-semibold text-xs rounded-xl"
        >
          Return to Parties List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Back Button Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Parties
        </button>
      </div>

      {/* Editing Form Modal */}
      {isEditing ? (
        <PartyForm
          initialParty={party}
          onSaved={() => {
            setIsEditing(false);
            refresh();
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          {/* Main Party Overview Card */}
          <PartyDetailCard
            party={party}
            onEdit={() => setIsEditing(true)}
            onArchive={async () => {
              await archiveParty();
            }}
            onDuplicate={async () => {
              const newP = await duplicateParty();
              if (newP) onBack();
            }}
            onOpenAdjustment={() => setShowAdjustmentModal(true)}
            onOpenSaleLink={() => onOpenSaleLink(party.id)}
            onOpenExpenseLink={() => onOpenExpenseLink(party.id)}
            onOpenQrModal={() => setShowQrModal(true)}
          />

          {/* Activity Timeline */}
          <PartyHistoryTimeline entries={history} loading={loading} />
        </>
      )}

      {/* Manual Payment / Adjustment Modal */}
      {showAdjustmentModal && (
        <AdjustmentModal
          party={party}
          onSave={async (amount, title, sourceType, note) => {
            await addAdjustment(amount, title, sourceType, note);
          }}
          onClose={() => setShowAdjustmentModal(false)}
        />
      )}

      {/* Contact QR Modal */}
      {showQrModal && <PartyQrModal party={party} onClose={() => setShowQrModal(false)} />}
    </div>
  );
};
