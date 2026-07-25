/**
 * SALTEDHASH Business OS - Module 6: Parties
 * API Route Adapters and Handler Wrappers.
 * Wraps service responses into standardized HTTP-ready JSON payloads.
 */

import { partiesService } from './partiesService';
import { CreatePartyInput, PartyListQuery, RecordAdjustmentInput, UpdatePartyInput } from './dto';

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

function successResponse<T>(data: T, status = 200): ApiResponse<T> {
  return {
    status,
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

function errorResponse(error: string, status = 400): ApiResponse<never> {
  return {
    status,
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}

export const PartiesApiAdapter = {
  async handleGetParties(query?: PartyListQuery): Promise<ApiResponse<any>> {
    try {
      const result = await partiesService.getParties(query);
      return successResponse(result);
    } catch (err) {
      return errorResponse(String((err as Error).message || err));
    }
  },

  async handleGetPartyById(id: string): Promise<ApiResponse<any>> {
    try {
      const result = await partiesService.getPartyById(id);
      return successResponse(result);
    } catch (err) {
      return errorResponse(String((err as Error).message || err), 404);
    }
  },

  async handleCreateParty(input: CreatePartyInput): Promise<ApiResponse<any>> {
    try {
      const result = await partiesService.createParty(input);
      return successResponse(result, 201);
    } catch (err) {
      return errorResponse(String((err as Error).message || err), 422);
    }
  },

  async handleUpdateParty(input: UpdatePartyInput): Promise<ApiResponse<any>> {
    try {
      const result = await partiesService.updateParty(input);
      return successResponse(result);
    } catch (err) {
      return errorResponse(String((err as Error).message || err), 422);
    }
  },

  async handleArchiveParty(id: string): Promise<ApiResponse<any>> {
    try {
      const result = await partiesService.archiveParty(id);
      return successResponse(result);
    } catch (err) {
      return errorResponse(String((err as Error).message || err));
    }
  },

  async handleDuplicateParty(id: string): Promise<ApiResponse<any>> {
    try {
      const result = await partiesService.duplicateParty(id);
      return successResponse(result, 201);
    } catch (err) {
      return errorResponse(String((err as Error).message || err));
    }
  },

  async handleGetSummary(query?: PartyListQuery): Promise<ApiResponse<any>> {
    try {
      const result = await partiesService.getPartySummary(query);
      return successResponse(result);
    } catch (err) {
      return errorResponse(String((err as Error).message || err));
    }
  },

  async handleGetHistory(partyId: string): Promise<ApiResponse<any>> {
    try {
      const result = await partiesService.getPartyHistory(partyId);
      return successResponse(result);
    } catch (err) {
      return errorResponse(String((err as Error).message || err));
    }
  },

  async handleRecordAdjustment(input: RecordAdjustmentInput): Promise<ApiResponse<any>> {
    try {
      const result = await partiesService.recordAdjustment(input);
      return successResponse(result);
    } catch (err) {
      return errorResponse(String((err as Error).message || err));
    }
  },
};
