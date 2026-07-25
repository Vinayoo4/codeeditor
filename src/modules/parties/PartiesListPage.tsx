/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Main Parties Registry List Page
 */

import React, { useState } from 'react';
import { Plus, Database, Code, RefreshCw } from 'lucide-react';
import { usePartiesList } from './hooks/usePartiesList';
import { PartyBalanceSummary } from './components/PartyBalanceSummary';
import { PartyFilters } from './components/PartyFilters';
import { PartyList } from './components/PartyList';
import { EmptyPartiesState } from './components/EmptyPartiesState';
import { PartyForm } from './components/PartyForm';
import { PartyQrModal } from './components/PartyQrModal';
import { ApiInspectorModal } from './components/ApiInspectorModal';
import { seedInitialPartiesData } from '../../db/database';
import { Party } from './types';
import { extractUniqueCities, extractUniqueTags } from './services/partiesSelectors';

interface PartiesListPageProps {
  onNavigateToDetail: (id: string) => void;
  onNavigateToNew: () => void;
  onOpenSaleLink: (partyId: string) => void;
  onOpenExpenseLink: (partyId: string) => void;
}

export const PartiesListPage: React.FC<PartiesListPageProps> = ({
  onNavigateToDetail,
  onNavigateToNew,
  onOpenSaleLink,
  onOpenExpenseLink,
}) => {
  const { parties, total, summary, query, loading, updateQuery, resetQuery, refresh } =
    usePartiesList();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [editingParty, setEditingParty] = useState<Party | null>(null);
  const [qrParty, setQrParty] = useState<Party | null>(null);
  const [showApiInspector, setShowApiInspector] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const availableCities = extractUniqueCities(parties);
  const availableTags = extractUniqueTags(parties);

  const handleSeedDemoData = async () => {
    setIsSeeding(true);
    await seedInitialPartiesData(true);
    await refresh();
    setIsSeeding(false);
  };

  const handleArchive = async (id: string) => {
    const { partiesService } = await import('./api/partiesService');
    await partiesService.archiveParty(id);
    await refresh();
  };

  const handleDuplicate = async (id: string) => {
    const { partiesService } = await import('./api/partiesService');
    await partiesService.duplicateParty(id);
    await refresh();
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 py-6">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Parties Registry
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-800">
              Module 6
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Master Relationship & Ledger Registry for Customers, Suppliers, Vendors, and Leads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* API Inspector Modal Launcher */}
          <button
            onClick={() => setShowApiInspector(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors"
          >
            <Code className="w-4 h-4 text-indigo-600" />
            <span>API Inspector</span>
          </button>

          {/* Seed Demo Data Button */}
          <button
            onClick={handleSeedDemoData}
            disabled={isSeeding}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
          >
            <Database className="w-4 h-4 text-indigo-500" />
            <span>{isSeeding ? 'Seeding...' : 'Reset Demo Data'}</span>
          </button>

          {/* Add New Party Primary Action */}
          <button
            onClick={onNavigateToNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Party</span>
          </button>
        </div>
      </div>

      {/* Balance Summary Stat Cards */}
      <PartyBalanceSummary summary={summary} loading={loading} />

      {/* Filter Bar */}
      <PartyFilters
        query={query}
        onChange={updateQuery}
        onReset={resetQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        availableCities={availableCities}
        availableTags={availableTags}
      />

      {/* Editing Form Modal */}
      {editingParty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <PartyForm
              initialParty={editingParty}
              onSaved={() => {
                setEditingParty(null);
                refresh();
              }}
              onCancel={() => setEditingParty(null)}
            />
          </div>
        </div>
      )}

      {/* Contact QR Modal */}
      {qrParty && <PartyQrModal party={qrParty} onClose={() => setQrParty(null)} />}

      {/* API Inspector Modal */}
      {showApiInspector && <ApiInspectorModal onClose={() => setShowApiInspector(false)} />}

      {/* Main Party List or Empty State */}
      {parties.length === 0 && !loading ? (
        <EmptyPartiesState onAddNew={onNavigateToNew} onSeedDemoData={handleSeedDemoData} />
      ) : (
        <PartyList
          parties={parties}
          viewMode={viewMode}
          onViewDetail={onNavigateToDetail}
          onEdit={(party) => setEditingParty(party)}
          onArchive={handleArchive}
          onDuplicate={handleDuplicate}
          onOpenSaleLink={onOpenSaleLink}
          onOpenExpenseLink={onOpenExpenseLink}
          onOpenQrModal={(party) => setQrParty(party)}
        />
      )}
    </div>
  );
};
