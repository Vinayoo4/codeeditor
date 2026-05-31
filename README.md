# EcoMeal Hub PWA

**SALTEDHASH** presents EcoMeal Hub: A unified Progressive Web App merging the Meal Prep Starter Kit and the EcoWise Wealth Digest into one seamless, offline-first experience.

## Description

EcoMeal Hub is a dual-purpose application.
- **Meal Prep Kit:** Browse templates, generate grocery lists, and build custom weekly meal schedules that persist offline.
- **EcoWise Wealth:** Read curated sustainable investing newsletters and in-depth guides, save items to your personal offline vault, and access admin tools to publish new content on the go.

## Quick Start

Installation: npm install
Development Server: npm run dev
Build for Production: npm run build
Preview Production Build: npm run preview

## Available Routes

- \`/\` - Home page, acting as an entry hub.
- \`/mealprep\` - Full view of the Meal Prep Starter Kit.
- \`/mealprep/:planId\` - Detailed view of a specific meal plan, including an interactive and exportable grocery list.
- \`/ecowise\` - Full view of the EcoWise Wealth Digest newsletter and guides.
- \`/ecowise/issue/:id\` - Detailed view of a specific newsletter issue.
- \`/ecowise/guide/:id\` - Detailed view of a specific educational guide.
- \`/admin\` - A role-gated admin control panel for content management.
- \`/offline\` - The fallback page shown when the app is launched offline and the requested route is not cached.

## Admin Mode

To access the Admin panel, navigate to the **EcoWise Wealth Digest** section (\`/ecowise\`) and click the **Admin Engine** toggle in the top header. This selection will persist locally. You can then access the Admin Panel via the sidebar (desktop) or bottom navigation (mobile).

## Data Management

All data is stored locally in your browser's \`localStorage\` to ensure immediate offline availability.
- To completely reset the app to its original seed data, run \`localStorage.clear()\` in your browser's developer console and refresh the page.

## PWA Installation

- **Chrome / Android:** Click the "Install EcoMeal Hub" banner that appears at the bottom of the screen, or use the install icon in the URL bar.
- **Safari / iOS:** Tap the "Share" icon in the Safari navigation bar and select "Add to Home Screen".
