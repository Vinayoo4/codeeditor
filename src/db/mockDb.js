const SEED_DATA = {
  // --- MEAL PREP DATA ---
  mealPlans: [
    { id: 'mp-1', title: 'High-Protein Plant Week', days: ['Mon: Tofu Scramble', 'Tue: Lentil Dahl', 'Wed: Chickpea Salad'], items: ['Tofu', 'Lentils', 'Chickpeas', 'Spinach'] },
    { id: 'mp-2', title: 'Low-Carb Express Keto', days: ['Mon: Grilled Salmon', 'Tue: Chicken Avocado', 'Wed: Egg Muffins'], items: ['Salmon', 'Chicken', 'Avocado', 'Eggs'] }
  ],
  tips: [
    { id: 't-1', q: 'How long does prepped food last?', a: 'Most cooked meals stay fresh in airtight containers for 4 to 5 days.' },
    { id: 't-2', q: 'Can I freeze roasted vegetables?', a: 'Yes, but high-water vegetables like zucchini might get mushy.' }
  ],
  userPlans: [],

  // --- ECOWISE WEALTH DATA ---
  issues: [
    { id: 'is-1', title: 'The Rise of Green Bonds', summary: 'How fixed-income assets are funding global solar infrastructure project expansions.', content: 'Full text: Green bonds have grown 40% year over year...', topic: 'Bonds' },
    { id: 'is-2', title: 'Micro-Hydro Power Investing', summary: 'Evaluating localized water energy grids for community-led return options.', content: 'Full text: Local hydro projects present unique, low-correlation investment opportunities...', topic: 'Hydro' }
  ],
  guides: [
    { id: 'g-1', title: 'ESG Scoring 1001', content: 'Environmental, Social, and Governance scoring structures broken down into actionable steps.', topic: 'Basics' }
  ],
  savedArticles: [],
  auditLogs: [{ timestamp: new Date().toISOString(), action: 'Database initialized successfully.' }]
};
export const initDb = () => {
  if (!localStorage.getItem('ecomeal_db')) {
    localStorage.setItem('ecomeal_db', JSON.stringify(SEED_DATA));
  }
};
export const getDb = () => {
  initDb();
  return JSON.parse(localStorage.getItem('ecomeal_db'));
};
export const updateDb = (data) => {
  localStorage.setItem('ecomeal_db', JSON.stringify(data));
  window.dispatchEvent(new Event('storage_updated'));
};
export const logAction = (action) => {
  const db = getDb();
  db.auditLogs.unshift({ timestamp: new Date().toISOString(), action });
  updateDb(db);
};