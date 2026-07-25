/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Party Creation & Editing Form Component
 */

import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Tag, FileText, DollarSign, X, Check, Building, Plus } from 'lucide-react';
import { usePartyForm } from '../hooks/usePartyForm';
import { Party, PartyType } from '../types';

interface PartyFormProps {
  initialParty?: Party;
  onSaved: (party: Party) => void;
  onCancel: () => void;
}

export const PartyForm: React.FC<PartyFormProps> = ({ initialParty, onSaved, onCancel }) => {
  const {
    values,
    validationErrors,
    isSubmitting,
    submitError,
    updateField,
    addTag,
    removeTag,
    saveParty,
    isEdit,
  } = usePartyForm(initialParty, onSaved);

  const [newTagInput, setNewTagInput] = useState('');

  const getFieldError = (fieldName: string) => {
    return validationErrors.find((e) => e.field === fieldName)?.message;
  };

  const handleAddTagSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTagInput);
      setNewTagInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveParty();
  };

  const partyTypes: { label: string; value: PartyType; desc: string }[] = [
    { label: 'Customer', value: 'customer', desc: 'Buyers & clients who purchase goods or services' },
    { label: 'Supplier', value: 'supplier', desc: 'Raw material & inventory providers' },
    { label: 'Vendor', value: 'vendor', desc: 'Service, utility, or logistics contractors' },
    { label: 'Lead', value: 'lead', desc: 'Prospective clients or pipeline contacts' },
    { label: 'Other', value: 'other', desc: 'Miscellaneous business contacts' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isEdit ? `Edit Party (${initialParty?.partyCode})` : 'New Master Relationship Record'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isEdit
              ? 'Update contact details, address, tags, and notes for this party.'
              : 'Add a new customer, supplier, vendor, or lead to your local OS registry.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {submitError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300 rounded-xl text-xs font-medium">
          {submitError}
        </div>
      )}

      {/* Party Type Selection Cards */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Relationship / Party Type <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {partyTypes.map((pt) => {
            const isSelected = values.type === pt.value;
            return (
              <button
                key={pt.value}
                type="button"
                onClick={() => updateField('type', pt.value)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-xs font-bold capitalize">{pt.label}</div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                  {pt.desc}
                </div>
              </button>
            );
          })}
        </div>
        {getFieldError('type') && (
          <p className="text-[11px] text-rose-500 font-medium">{getFieldError('type')}</p>
        )}
      </div>

      {/* Name & GSTIN / Tax ID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Party Name / Business Entity <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Apex Traders Corp or John Doe"
              value={values.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          {getFieldError('name') && (
            <p className="text-[11px] text-rose-500 font-medium">{getFieldError('name')}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Tax Registration / GSTIN
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. US-TX-9823411"
              value={values.gstin || ''}
              onChange={(e) => updateField('gstin', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="+1 (555) 000-0000"
              value={values.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          {getFieldError('phone') && (
            <p className="text-[11px] text-rose-500 font-medium">{getFieldError('phone')}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="email"
              placeholder="contact@business.com"
              value={values.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
          {getFieldError('email') && (
            <p className="text-[11px] text-rose-500 font-medium">{getFieldError('email')}</p>
          )}
        </div>
      </div>

      {/* Address, City, State */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-3 space-y-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Street Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. 104 Market Street, Suite 2B"
              value={values.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">City</label>
          <input
            type="text"
            placeholder="e.g. Austin"
            value={values.city || ''}
            onChange={(e) => updateField('city', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">State / Region</label>
          <input
            type="text"
            placeholder="e.g. TX"
            value={values.state || ''}
            onChange={(e) => updateField('state', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Opening Balance (Only for new parties) */}
        {!isEdit && (
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Opening Balance ($)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={values.openingBalance || 0}
                onChange={(e) => updateField('openingBalance', parseFloat(e.target.value) || 0)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Positive = Customer owes you. Negative = You owe supplier.
            </p>
          </div>
        )}
      </div>

      {/* Tags Manager */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Tags & Categorization
        </label>
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[42px]">
          {values.tags?.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-rose-600 dark:hover:text-rose-400"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <div className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Add tag (Press Enter)..."
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTagSubmit}
              className="bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-w-[140px]"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Internal Notes & Terms
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <textarea
            rows={2}
            placeholder="e.g. Prefers Net-30 credit terms, contact person: Sarah"
            value={values.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Party' : 'Save Party Record'}
        </button>
      </div>
    </form>
  );
};
