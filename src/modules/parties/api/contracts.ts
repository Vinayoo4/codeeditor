/**
 * SALTEDHASH Business OS - Module 6: Parties
 * Interface contracts for the Parties Service.
 * This defines the boundary between UI/Routes and the Domain/Repository logic.
 */

import {
  ArchivePartyResponse,
  CreatePartyInput,
  DuplicatePartyResponse,
  PartyDetailResponse,
  PartyHistoryResponse,
  PartyListQuery,
  PartyListResponse,
  PartySummaryResponse,
  RecordAdjustmentInput,
  UpdatePartyInput,
} from './dto';
import { PartyHistoryEntry } from '../types';

export interface IPartiesService {
  /**
   * Retrieves a paginated & filtered list of parties along with global summary stats.
   */
  getParties(query?: PartyListQuery): Promise<PartyListResponse>;

  /**
   * Fetches a single party detail record by ID including history summary.
   */
  getPartyById(id: string): Promise<PartyDetailResponse>;

  /**
   * Creates a new party record with generated party code and initial history entry.
   */
  createParty(input: CreatePartyInput): Promise<PartyDetailResponse>;

  /**
   * Updates an existing party record.
   */
  updateParty(input: UpdatePartyInput): Promise<PartyDetailResponse>;

  /**
   * Toggles the status of a party between active and archived.
   */
  archiveParty(id: string): Promise<ArchivePartyResponse>;

  /**
   * Duplicates an existing party record into a new active party with new party code.
   */
  duplicateParty(id: string): Promise<DuplicatePartyResponse>;

  /**
   * Calculates global balance stats and counts across all parties.
   */
  getPartySummary(query?: PartyListQuery): Promise<PartySummaryResponse>;

  /**
   * Retrieves full activity history entries for a given party.
   */
  getPartyHistory(partyId: string): Promise<PartyHistoryResponse>;

  /**
   * Records a ledger adjustment, sale, expense, or payment entry against a party's balance.
   */
  recordAdjustment(input: RecordAdjustmentInput): Promise<PartyHistoryEntry>;
}
