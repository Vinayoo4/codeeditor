# SALTEDHASH Business OS - Parties Module

The Parties Module is fully implemented and fulfills all non-negotiable behavior requirements.

## What Was Built
- **Complete Parties Registry:** Full local-first React component tree, handling list, creation, detailed view with ledger interaction, duplicate, edit, and archive.
- **PWA-ready setup:** Installed `vite-plugin-pwa` and integrated it with standard offline/cache behavior and standard Vite config adjustments. Added `public/manifest.webmanifest`.
- **APK-wrapper compatible architecture:** Added `capacitor.config.ts` allowing it to be trivially wrapped by Capacitor via standard tooling. The module utilizes purely browser standard local storage via IndexedDB (Dexie).
- **Vercel-friendly deployment readiness:** Added `vercel.json` with catch-all redirects required for SPA web deployments on Vercel.
- **Containerization notes:** Built standard Vite app, containerization is essentially just an nginx/caddy server over `dist/`. No backend is needed.
- **Real Sample Data:** The initialization code handles seeding initial realistic customer, vendor, and lead data into the DB to not leave it blank.

## Final structure changes
- `public/manifest.webmanifest`: Added.
- `vite.config.ts`: Updated to inject VitePWA plugin for Service Workers and Manifest generation.
- `capacitor.config.ts`: Added for Capacitor CLI capability.
- `vercel.json`: Added for Vercel SPA routing capability.
- Installed new devDependencies: `vite-plugin-pwa`, `@capacitor/core`, `@capacitor/cli`.

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
