/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Search & Filter Controls
 */

import React from 'react';
import { Search, Filter, LayoutGrid, List, RotateCcw, X } from 'lucide-react';
import { PartyListQuery } from '../api/dto';
import { PartyType } from '../types';

interface PartyFiltersProps {
  query: PartyListQuery;
  onChange: (updates: Partial<PartyListQuery>) => void;
  onReset: () => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  availableCities?: string[];
  availableTags?: string[];
}

export const PartyFilters: React.FC<PartyFiltersProps> = ({
  query,
  onChange,
  onReset,
  viewMode,
  onViewModeChange,
  availableCities = [],
  availableTags = [],
}) => {
  const typeTabs: { label: string; value: PartyType | 'all' }[] = [
    { label: 'All', value: 'all' },
    { label: 'Customers', value: 'customer' },
    { label: 'Suppliers', value: 'supplier' },
    { label: 'Vendors', value: 'vendor' },
    { label: 'Leads', value: 'lead' },
  ];

  const isFiltered =
    query.search ||
    (query.type && query.type !== 'all') ||
    (query.status && query.status !== 'active') ||
    query.city ||
    query.tag;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 mb-4 shadow-xs space-y-3">
      {/* Top Row: Search & View Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search party name, code, phone, email, city, tags..."
            value={query.search || ''}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {query.search && (
            <button
              onClick={() => onChange({ search: '' })}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <select
            value={query.status || 'active'}
            onChange={(e) => onChange({ status: e.target.value as any })}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="active">Active Parties</option>
            <option value="archived">Archived Parties</option>
            <option value="all">All Statuses</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            value={query.sortBy || 'updatedAt'}
            onChange={(e) => onChange({ sortBy: e.target.value as any })}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="updatedAt">Recently Updated</option>
            <option value="name">Name (A-Z)</option>
            <option value="code">Party Code</option>
            <option value="balance">Highest Balance</option>
            <option value="createdAt">Date Created</option>
          </select>

          {/* Grid / Table Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid View"
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Table View"
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Type Tabs & Optional Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {typeTabs.map((tab) => {
            const isActive = (query.type || 'all') === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onChange({ type: tab.value })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* City / Tag Filters & Clear Button */}
        <div className="flex items-center gap-2">
          {availableCities.length > 0 && (
            <select
              value={query.city || ''}
              onChange={(e) => onChange({ city: e.target.value })}
              className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300"
            >
              <option value="">All Cities</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          {availableTags.length > 0 && (
            <select
              value={query.tag || ''}
              onChange={(e) => onChange({ tag: e.target.value })}
              className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-600 dark:text-slate-300"
            >
              <option value="">All Tags</option>
              {availableTags.map((t) => (
                <option key={t} value={t}>
                  #{t}
                </option>
              ))}
            </select>
          )}

          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
