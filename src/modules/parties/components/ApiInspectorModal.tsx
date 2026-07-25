/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Interactive API Contract Explorer & DTO Payload Inspector
 */

import React, { useState } from 'react';
import { X, Code, Play, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { PartiesApiAdapter } from '../api/adapters';
import { partiesService } from '../api/partiesService';

interface ApiInspectorModalProps {
  onClose: () => void;
}

export const ApiInspectorModal: React.FC<ApiInspectorModalProps> = ({ onClose }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/parties');
  const [responseJson, setResponseJson] = useState<string>('// Select an endpoint and click "Execute Live Contract Method"');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const endpoints = [
    { id: 'GET /api/parties', name: 'GET /api/parties', desc: 'List parties with query filters & global summary' },
    { id: 'GET /api/parties/:id', name: 'GET /api/parties/:id', desc: 'Get single party record by ID with history counts' },
    { id: 'GET /api/parties/summary', name: 'GET /api/parties/summary', desc: 'Get receivables, payables, and net ledger position' },
    { id: 'GET /api/parties/:id/history', name: 'GET /api/parties/:id/history', desc: 'Get timeline activity history entries' },
    { id: 'POST /api/parties', name: 'POST /api/parties', desc: 'Create new party record via CreatePartyInput DTO' },
    { id: 'PATCH /api/parties/:id', name: 'PATCH /api/parties/:id', desc: 'Update party details via UpdatePartyInput DTO' },
    { id: 'POST /api/parties/:id/archive', name: 'POST /api/parties/:id/archive', desc: 'Toggle party active/archived status' },
    { id: 'POST /api/parties/:id/duplicate', name: 'POST /api/parties/:id/duplicate', desc: 'Duplicate party into new active record' },
  ];

  const handleExecute = async () => {
    setLoading(true);
    setResponseJson('Executing live service contract...');

    try {
      let res: any;
      const list = await partiesService.getParties();
      const sampleParty = list.data[0];

      switch (selectedEndpoint) {
        case 'GET /api/parties':
          res = await PartiesApiAdapter.handleGetParties({ status: 'active', limit: 5 });
          break;

        case 'GET /api/parties/:id':
          if (sampleParty) {
            res = await PartiesApiAdapter.handleGetPartyById(sampleParty.id);
          } else {
            res = { status: 404, error: 'No party found to query' };
          }
          break;

        case 'GET /api/parties/summary':
          res = await PartiesApiAdapter.handleGetSummary();
          break;

        case 'GET /api/parties/:id/history':
          if (sampleParty) {
            res = await PartiesApiAdapter.handleGetHistory(sampleParty.id);
          } else {
            res = { status: 404, error: 'No party found to query history' };
          }
          break;

        case 'POST /api/parties':
          res = await PartiesApiAdapter.handleCreateParty({
            name: `Test Partner ${Math.floor(Math.random() * 1000)}`,
            type: 'customer',
            phone: '+1 (555) 999-0000',
            city: 'API Sandbox City',
            openingBalance: 150,
            tags: ['api-test', 'sandboxed'],
          });
          break;

        case 'PATCH /api/parties/:id':
          if (sampleParty) {
            res = await PartiesApiAdapter.handleUpdateParty({
              id: sampleParty.id,
              notes: `Updated via API Inspector at ${new Date().toLocaleTimeString()}`,
            });
          }
          break;

        case 'POST /api/parties/:id/archive':
          if (sampleParty) {
            res = await PartiesApiAdapter.handleArchiveParty(sampleParty.id);
          }
          break;

        case 'POST /api/parties/:id/duplicate':
          if (sampleParty) {
            res = await PartiesApiAdapter.handleDuplicateParty(sampleParty.id);
          }
          break;

        default:
          res = { status: 200, message: 'Select valid contract endpoint' };
      }

      setResponseJson(JSON.stringify(res, null, 2));
    } catch (err) {
      setResponseJson(JSON.stringify({ status: 500, error: String(err) }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(responseJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Internal API Contract Explorer & DTO Inspector
              </h2>
              <p className="text-xs text-slate-400">
                Execute live service methods & verify JSON-safe DTO contract responses.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden flex-1">
          {/* Endpoint List Sidebar */}
          <div className="space-y-1 overflow-y-auto pr-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Service Contracts ({endpoints.length})
            </label>
            {endpoints.map((ep) => {
              const isSelected = selectedEndpoint === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-mono text-xs">{ep.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal line-clamp-1 mt-0.5">
                    {ep.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Response Payload Preview */}
          <div className="md:col-span-2 flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
              <span className="font-mono font-semibold text-indigo-400">{selectedEndpoint}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy JSON'}
                </button>
                <button
                  onClick={handleExecute}
                  disabled={loading}
                  className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  <Play className="w-3 h-3 fill-white" />
                  {loading ? 'Executing...' : 'Run Live Contract'}
                </button>
              </div>
            </div>

            <pre className="p-4 text-xs font-mono text-slate-200 overflow-auto flex-1 leading-relaxed">
              <code>{responseJson}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
