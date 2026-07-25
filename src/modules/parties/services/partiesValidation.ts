/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Field & Rule Validation Layer
 */

import { CreatePartyInput, UpdatePartyInput } from '../api/dto';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateCreatePartyInput(input: CreatePartyInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name check
  if (!input.name || !input.name.trim()) {
    errors.push({ field: 'name', message: 'Party name is required.' });
  } else if (input.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Party name must be at least 2 characters long.' });
  }

  // Type check
  const validTypes = ['customer', 'supplier', 'vendor', 'lead', 'other'];
  if (!input.type || !validTypes.includes(input.type)) {
    errors.push({ field: 'type', message: 'Please select a valid party type.' });
  }

  // Email format check
  if (input.email && input.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email.trim())) {
      errors.push({ field: 'email', message: 'Invalid email address format.' });
    }
  }

  // Phone check (basic digit/character check if provided)
  if (input.phone && input.phone.trim()) {
    if (input.phone.trim().length < 5) {
      errors.push({ field: 'phone', message: 'Phone number should be at least 5 digits.' });
    }
  }

  // Opening balance check
  if (input.openingBalance !== undefined && isNaN(Number(input.openingBalance))) {
    errors.push({ field: 'openingBalance', message: 'Opening balance must be a valid number.' });
  }

  return errors;
}

export function validateUpdatePartyInput(input: UpdatePartyInput): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.id) {
    errors.push({ field: 'id', message: 'Party ID is required for updates.' });
  }

  if (input.name !== undefined) {
    if (!input.name || !input.name.trim()) {
      errors.push({ field: 'name', message: 'Party name cannot be empty.' });
    } else if (input.name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Party name must be at least 2 characters long.' });
    }
  }

  if (input.email && input.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email.trim())) {
      errors.push({ field: 'email', message: 'Invalid email address format.' });
    }
  }

  return errors;
}
