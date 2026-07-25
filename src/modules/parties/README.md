# Parties Module

The Parties module is the master relationship registry of the SALTEDHASH Business OS. It provides a local-first repository to store customers, suppliers, vendors, leads, and other contacts, and tracks balances owed and payable. It also attaches notes and tags, allows for viewing relationship history across Sales and Expenses, and exposes typed service methods for internal reuse.

## Architecture

This module follows a layered architecture to keep UI separated from the domain logic and ensure API readiness for future backend exposure:
- **UI Layer**: React components handling the party list, detailed view, creation form, summary, and action pickers (`src/modules/parties/components` and pages).
- **Domain Layer**: Functions handling business rules, balance changes, summaries, and validations (`src/modules/parties/services/partiesDomain.ts`, `partiesValidation.ts`, `partiesSelectors.ts`).
- **Repository Layer**: Encapsulates persistence logic for IndexedDB via Dexie (`src/modules/parties/services/partiesRepository.ts`).
- **API Service Layer**: Exposes clear service contracts and DTOs that serve the React hooks and can later easily map to a Node.js/Express router (`src/modules/parties/api/partiesService.ts`, `contracts.ts`, `dto.ts`).

## Offline & Local-First Structure

The module is designed to function fully offline. Data is saved in the browser using IndexedDB. No login or sign-up is required to use this capability. React hooks like `usePartiesList` and `usePartyDetail` interface strictly via the API service layer rather than making direct DB calls, achieving high modularity and clean decoupling.

## Integration & Reuse

The `partiesService` and UI components (like `QuickPartyPicker`) can be integrated cleanly into other domains (e.g. Sales, Expenses). Shared interfaces support reading details, filtering by type, appending ledger history items, and displaying quick action UI without redundant implementations.
