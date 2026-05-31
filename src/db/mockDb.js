const SEED_DATA = {
  db_version: "1.1",
  _seeded: true,
  // --- MEAL PREP DATA ---
  mealPlans: [
    {
      id: 'mp-1',
      title: 'High-Protein Plant Week',
      days: [
        'Mon: Tofu Scramble, Chickpea Salad, Lentil Dahl',
        'Tue: Oatmeal, Tempeh Wrap, Black Bean Burger',
        'Wed: Smoothie Bowl, Quinoa Bowl, Edamame Stir-fry',
        'Thu: Avocado Toast, Falafel Wrap, Veggie Chili',
        'Fri: Tofu Scramble, Lentil Soup, Seitan Roast',
        'Sat: Pancakes, Hummus Wrap, Pasta Primavera',
        'Sun: Granola, Vegan Sushi, Pad Thai'
      ],
      items: ['Tofu', 'Lentils', 'Chickpeas', 'Spinach', 'Tempeh', 'Black Beans', 'Quinoa', 'Edamame', 'Avocado', 'Seitan', 'Hummus', 'Pasta']
    },
    {
      id: 'mp-2',
      title: 'Low-Carb Express Keto',
      days: [
        'Mon: Eggs & Bacon, Chicken Salad, Grilled Salmon',
        'Tue: Keto Pancakes, Tuna Salad, Steak & Asparagus',
        'Wed: Egg Muffins, Cobb Salad, Chicken Avocado',
        'Thu: Omelet, Turkey Roll-ups, Pork Chops',
        'Fri: Greek Yogurt, Keto Pizza, Shrimp Scampi',
        'Sat: Sausage & Eggs, BLT Salad, Zucchini Noodles',
        'Sun: Keto Waffles, Chicken Wings, Ribeye'
      ],
      items: ['Salmon', 'Chicken', 'Avocado', 'Eggs', 'Bacon', 'Tuna', 'Steak', 'Asparagus', 'Turkey', 'Pork Chops', 'Shrimp', 'Zucchini', 'Ribeye']
    },
    {
      id: 'mp-3',
      title: 'Mediterranean Family Week',
      days: [
        'Mon: Greek Yogurt & Honey, Greek Salad, Lemon Herb Chicken',
        'Tue: Feta & Spinach Omelet, Hummus Plate, Baked Cod',
        'Wed: Whole Wheat Toast, Tabouli, Falafel & Tzatziki',
        'Thu: Fruit & Nuts, Caprese Salad, Eggplant Parmesan',
        'Fri: Oatmeal, Lentil Soup, Grilled Swordfish',
        'Sat: Shakshuka, Quinoa Salad, Lamb Kebabs',
        'Sun: Frittata, Mediterranean Wrap, Moussaka'
      ],
      items: ['Greek Yogurt', 'Honey', 'Feta', 'Spinach', 'Hummus', 'Cod', 'Whole Wheat Bread', 'Tzatziki', 'Eggplant', 'Swordfish', 'Lamb', 'Quinoa']
    }
  ],
  tips: [
    { id: 't-1', q: 'How long does prepped food last?', a: 'Most cooked meals stay fresh in airtight containers for 4 to 5 days.' },
    { id: 't-2', q: 'Can I freeze roasted vegetables?', a: 'Yes, but high-water vegetables like zucchini might get mushy.' }
  ],
  userPlans: [],

  // --- ECOWISE WEALTH DATA ---
  issues: [
    {
      id: 'is-1',
      title: 'The Rise of Green Bonds',
      summary: 'How fixed-income assets are funding global solar infrastructure project expansions.',
      content: 'Green bonds have grown 40% year over year. Investors are increasingly looking to allocate capital towards sustainable projects that offer stable fixed-income returns while directly contributing to climate change mitigation. These instruments work identically to traditional bonds but stipulate that the raised capital must strictly fund environmentally beneficial projects, such as massive solar farms or wind energy infrastructure. As governments worldwide offer tax incentives, the yield on green bonds has become highly competitive, making them a cornerstone for modern ESG portfolios.',
      topic: 'Bonds'
    },
    {
      id: 'is-2',
      title: 'Micro-Hydro Power Investing',
      summary: 'Evaluating localized water energy grids for community-led return options.',
      content: 'Local hydro projects present unique, low-correlation investment opportunities. Unlike massive dam projects that can disrupt local ecosystems, micro-hydro power harnesses the natural flow of smaller rivers or streams. This approach provides clean, reliable baseline energy to rural or decentralized communities. For investors, micro-hydro often involves community-based infrastructure funds that offer steady dividend yields. Because these projects are highly localized, their returns are often insulated from broader macro-economic commodity swings, providing an excellent diversification tool for ESG-focused wealth generation.',
      topic: 'Hydro'
    },
    {
      id: 'is-3',
      title: 'Carbon Credit Markets 2026',
      summary: 'A deep dive into the anticipated changes in global compliance and voluntary carbon markets.',
      content: 'As we approach 2026, carbon credit markets are poised for a significant structural overhaul. Regulatory frameworks in Europe and North America are tightening, transitioning many voluntary offset programs into strict compliance markets. This shift is expected to drastically reduce the supply of "cheap" credits, driving up the price of high-quality, verifiable carbon removal projects (such as direct air capture and verified reforestation). Investors eyeing this space should focus on platforms and funds that aggregate high-tier credits, as the premium on verified permanence will dictate future returns.',
      topic: 'Markets'
    }
  ],
  guides: [
    {
      id: 'g-1',
      title: 'ESG Scoring 101',
      content: 'Environmental, Social, and Governance (ESG) scoring structures break down complex corporate behaviors into actionable metrics. The "E" evaluates a company\'s ecological footprint (carbon emissions, waste management). The "S" assesses how it manages relationships with employees, suppliers, customers, and communities. The "G" deals with leadership, executive pay, audits, and shareholder rights. Understanding these scores allows retail investors to align their capital with their values without sacrificing long-term yield. This guide covers the top three agencies—MSCI, Sustainalytics, and Bloomberg—and how to interpret their distinct rating methodologies.',
      topic: 'Basics'
    },
    {
      id: 'g-2',
      title: 'How to Read an ESG Report',
      content: 'Corporate ESG reports can often be dense, spanning hundreds of pages filled with marketing jargon and complex data tables. To cut through the noise, start by locating the "Materiality Assessment"—a matrix showing which issues the company deems most critical to its specific business model. Next, cross-reference their stated goals with the actual performance metrics in the data appendix (look for Scope 1, 2, and 3 emissions). Beware of "greenwashing," where companies highlight minor charitable efforts to obscure major environmental liabilities. A strong ESG report will use standardized frameworks like SASB or TCFD to ensure data comparability.',
      topic: 'Analysis'
    }
  ],
  savedArticles: [],
  auditLogs: [
    { timestamp: new Date().toISOString(), action: 'Database initialized with seed data successfully.' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), action: 'System maintenance check completed.' },
    { timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), action: 'Platform version 1.0 deployed.' }
  ]
};

export const initDb = () => {
  const existingData = localStorage.getItem('ecomeal_db');
  if (!existingData) {
    localStorage.setItem('ecomeal_db', JSON.stringify(SEED_DATA));
  } else {
    try {
      const parsed = JSON.parse(existingData);
      if (!parsed._seeded) {
        localStorage.setItem('ecomeal_db', JSON.stringify({ ...parsed, ...SEED_DATA, _seeded: true, db_version: "1.1" }));
      }
    } catch(e) {
      localStorage.setItem('ecomeal_db', JSON.stringify(SEED_DATA));
    }
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
