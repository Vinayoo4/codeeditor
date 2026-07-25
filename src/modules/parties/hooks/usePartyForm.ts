/**
 * SALTEDHASH Business OS - Module 6: Parties
 * React Hook for Party Creation & Modification Form logic.
 */

import { useState } from 'react';
import { CreatePartyInput } from '../api/dto';
import { partiesService } from '../api/partiesService';
import { validateCreatePartyInput, ValidationError } from '../services/partiesValidation';
import { Party, PartyType } from '../types';

export function usePartyForm(initialParty?: Party, onSaved?: (savedParty: Party) => void) {
  const [values, setValues] = useState<CreatePartyInput>({
    name: initialParty?.name || '',
    type: initialParty?.type || 'customer',
    phone: initialParty?.phone || '',
    email: initialParty?.email || '',
    address: initialParty?.address || '',
    city: initialParty?.city || '',
    state: initialParty?.state || '',
    gstin: initialParty?.gstin || '',
    openingBalance: initialParty?.openingBalance || 0,
    notes: initialParty?.notes || '',
    tags: initialParty?.tags || [],
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = (field: keyof CreatePartyInput, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear field-specific error on change
    setValidationErrors((prev) => prev.filter((e) => e.field !== field));
  };

  const addTag = (tagText: string) => {
    const trimmed = tagText.trim().toLowerCase();
    if (!trimmed) return;
    if (values.tags?.includes(trimmed)) return;
    setValues((prev) => ({
      ...prev,
      tags: [...(prev.tags || []), trimmed],
    }));
  };

  const removeTag = (tagText: string) => {
    setValues((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagText) || [],
    }));
  };

  const saveParty = async (): Promise<Party | null> => {
    setSubmitError(null);
    const errors = validateCreatePartyInput(values);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return null;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (initialParty?.id) {
        result = await partiesService.updateParty({
          id: initialParty.id,
          name: values.name,
          type: values.type,
          phone: values.phone,
          email: values.email,
          address: values.address,
          city: values.city,
          state: values.state,
          gstin: values.gstin,
          notes: values.notes,
          tags: values.tags,
        });
      } else {
        result = await partiesService.createParty(values);
      }

      const partyData = result.data;
      if (onSaved) onSaved(partyData);
      return partyData;
    } catch (err) {
      const msg = String((err as Error).message || err);
      setSubmitError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    validationErrors,
    isSubmitting,
    submitError,
    updateField,
    addTag,
    removeTag,
    saveParty,
    isEdit: Boolean(initialParty?.id),
  };
}
