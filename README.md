# SALTEDHASH Business OS - Parties Module

The Parties Module is the canonical relationship and stakeholder layer of SALTEDHASH Business OS. It provides a local-first repository to store customers, suppliers, vendors, leads, and other contacts, tracking their metadata, balances owed, and relationships across the system.

## What Was Built
- **Complete Parties Registry:** Full local-first React component tree, handling list, creation, detailed view with ledger interaction, duplicate, edit, and archive.
- **Relationship Management:** The module acts as a canonical graph for business relationships. You can link parties to other parties, expenses, catalogue items, and tasks directly.
- **Offline-First Resilience:** Data is saved locally using IndexedDB (via Dexie). The application works seamlessly offline and fetches records instantly.
- **Duplicate Prevention:** Seeding and migration logic includes strict validation against unique identity slugs and email/name matches to avoid messy identity duplication or stale records upon refresh.
- **PWA & Cross-Platform Ready:** Configured with `vite-plugin-pwa` for manifest and offline caching. Ready for APK packaging with Capacitor (`capacitor.config.ts`) and SPA deployment (`vercel.json`).

## How it Works
- **Data Source:** Records are strictly local. Real initial sample data (customers, vendors, leads) is seeded upon first load but deduplication ensures user records are never overwritten.
- **Adding/Editing:** Users can click "Add New Party" or "Edit" on a record to update their profile, add categorization tags, or link them to other known records via comma-separated ID lists.
- **Relationships:** Linked entity IDs (Expenses, Catalogue Items, etc.) are maintained on the Party object and surfaced as simple readable lists within the detail view, preventing dead-ends while allowing loose coupling with other future modules.

## Local Run & Build
- **Install:** `npm install`
- **Run local dev:** `npm run dev`
- **Build optimized PWA bundle:** `npm run build`
- **Preview local build:** `npm run preview`

## Known Intentional v1 Limits
- The module has lightweight balance tracking only. It does not implement full double-entry accounting.
- It does not implement an auth layer as specified in requirements.
- Uses IndexedDB (Dexie) strictly for offline-first capabilities. Cross-device sync relies entirely on potential future additions (e.g. Dexie Cloud or generic CRDT), but is not present in v1.
- App depends on `lucide-react` for standard UI iconography.
