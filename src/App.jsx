import React, { useState, useEffect } from 'react';
import { getDb, updateDb, logAction } from './db/mockDb';

export default function App() {
  const [activeApp, setActiveApp] = useState('mealprep'); // 'mealprep' | 'ecowise'
  const [db, setDb] = useState(getDb());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // App-specific UI States
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customPlanName, setCustomPlanName] = useState('');
  const [customPlanItems, setCustomPlanItems] = useState('');

  const [userRole, setUserRole] = useState('Subscriber'); // 'Subscriber' | 'Admin'
  const [newEmail, setNewEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [adminTitle, setAdminTitle] = useState('');
  const [adminBody, setAdminBody] = useState('');
  const [adminType, setAdminType] = useState('issue'); // 'issue' | 'guide'

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleUpdate = () => setDb(getDb());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('storage_updated', handleUpdate);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('storage_updated', handleUpdate);
    };
  }, []);

  // --- Meal Prep Actions ---
  const handleSaveCustomPlan = (e) => {
    e.preventDefault();
    if (!customPlanName) return;
    const newPlan = {
      id: 'custom-' + Date.now(),
      title: customPlanName,
      items: customPlanItems.split(',').map(i => i.trim()).filter(Boolean)
    };
    const currentDb = getDb();
    currentDb.userPlans.push(newPlan);
    updateDb(currentDb);
    logAction(`Created custom meal plan: ${customPlanName}`);
    setCustomPlanName('');
    setCustomPlanItems('');
  };

  // --- EcoWise Actions ---
  const handleSignUp = (e) => {
    e.preventDefault();
    if (!newEmail) return;
    logAction(`User signed up with email: ${newEmail}`);
    setIsSubscribed(true);
    setNewEmail('');
  };

  const handleSaveArticle = (id, title) => {
    const currentDb = getDb();
    if (currentDb.savedArticles.includes(id)) {
      currentDb.savedArticles = currentDb.savedArticles.filter(item => item !== id);
      logAction(`Unsaved article: ${title}`);
    } else {
      currentDb.savedArticles.push(id);
      logAction(`Saved article: ${title}`);
    }
    updateDb(currentDb);
  };

  const handleAdminPublish = (e) => {
    e.preventDefault();
    if (!adminTitle || !adminBody) return;
    const currentDb = getDb();
    const targetKey = adminType === 'issue' ? 'issues' : 'guides';

    currentDb[targetKey].push({
      id: `admin-${Date.now()}`,
      title: adminTitle,
      summary: adminBody.substring(0, 60) + '...',
      content: adminBody,
      topic: 'Admin Seed'
    });

    updateDb(currentDb);
    logAction(`Published admin ${adminType}: ${adminTitle}`);
    setAdminTitle('');
    setAdminBody('');
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">

      {/* GLOBAL SYSTEM NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 z-20">
        <div>
          <div className="p-5 border-b border-slate-800 bg-slate-950">
            <h1 className="text-xl font-black tracking-wider text-emerald-400">ECO-MEAL HUB</h1>
            <p className="text-xs text-slate-400 mt-1">Embedded Unified Engine</p>
          </div>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveApp('mealprep')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 ${activeApp === 'mealprep' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              🥗 Meal Prep Kit
            </button>
            <button
              onClick={() => setActiveApp('ecowise')}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 ${activeApp === 'ecowise' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              📈 EcoWise Wealth
            </button>
          </nav>
        </div>

        {/* CONNECTION STATUS SYSTEM INDICATOR */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400 animate-pulse'}`}>
              {isOnline ? '● Online' : '○ Offline'}
            </span>
          </div>
          <p className="text-slate-500 text-[10px] leading-relaxed">Changes update local caches instantly when offline.</p>
        </div>
      </aside>

      {/* CORE FRAME LAYOUT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* NETWORK STATUS BANNER */}
        {!isOnline && (
          <div className="bg-rose-600 text-white px-4 py-2 text-center text-sm font-semibold tracking-wide shadow-md z-10 animate-slideDown">
            Running offline mode. Custom configurations and edits are active and being saved directly to device storage.
          </div>
        )}

        <div className="p-6 max-w-6xl w-full mx-auto space-y-6">

          {/* ============================================ */}
          {/* SUB-SCREEN 1: MEAL PREP STARTER KIT          */}
          {/* ============================================ */}
          {activeApp === 'mealprep' && (
            <div className="space-y-8 animate-fadeIn">
              <header className="border-b pb-4">
                <h2 className="text-3xl font-extrabold text-slate-800">Meal Prep Starter Kit</h2>
                <p className="text-slate-600">Browse template configurations, auto-generate grocery lists, and build custom schedules offline.</p>
              </header>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Master Template List */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-bold text-slate-700">Available Meal Plan Templates</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {db.mealPlans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`p-5 rounded-xl border bg-white shadow-sm cursor-pointer transition transform hover:-translate-y-0.5 ${selectedPlan?.id === plan.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-gray-200 hover:border-emerald-300'}`}
                      >
                        <h4 className="font-bold text-slate-800 text-base">{plan.title}</h4>
                        <ul className="text-xs text-slate-500 mt-2 space-y-1">
                          {plan.days.map((day, idx) => <li key={idx}>{day}</li>)}
                        </ul>
                        <span className="text-xs text-emerald-600 font-semibold mt-3 block">View Grocery List →</span>
                      </div>
                    ))}
                  </div>

                  {/* Custom User Plans Layout */}
                  {db.userPlans.length > 0 && (
                    <div className="pt-4 space-y-4">
                      <h3 className="text-lg font-bold text-slate-700">Your Custom Saved Schedules</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {db.userPlans.map((plan) => (
                          <div key={plan.id} onClick={() => setSelectedPlan(plan)} className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/50 cursor-pointer hover:border-indigo-300">
                            <h4 className="font-bold text-indigo-900">{plan.title}</h4>
                            <p className="text-xs text-indigo-600 mt-1">{plan.items.length} items grouped in list.</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contextual Context Action Panel */}
                <div className="space-y-6">
                  {selectedPlan ? (
                    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-lg">{selectedPlan.title}</h3>
                        <button onClick={() => setSelectedPlan(null)} className="text-gray-400 hover:text-gray-600 text-sm">✕ Close</button>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Generated Grocery List</h4>
                        <ul className="bg-gray-50 rounded-lg p-3 border space-y-2">
                          {(selectedPlan.items || []).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                              <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-slate-50 border border-dashed border-gray-300 rounded-xl text-center">
                      <p className="text-sm text-slate-500">Select a structured meal plan template config to compile its grocery lists.</p>
                    </div>
                  )}

                  {/* Build Custom Entry Interface */}
                  <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                    <h3 className="font-bold text-slate-800 text-lg">Customize Local Plan</h3>
                    <form onSubmit={handleSaveCustomPlan} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Plan Title</label>
                        <input type="text" value={customPlanName} onChange={e => setCustomPlanName(e.target.value)} placeholder="e.g., Summer Cut Week 3" className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Grocery Items (Comma Separated)</label>
                        <textarea rows={2} value={customPlanItems} onChange={e => setCustomPlanItems(e.target.value)} placeholder="Apples, Chicken Breast, Rice" className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500" />
                      </div>
                      <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-2 rounded-lg hover:bg-slate-800 transition">Save Plan Offline</button>
                    </form>
                  </div>

                  {/* Tips & Guides Section */}
                  <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl space-y-4">
                    <h3 className="font-bold text-emerald-900 text-lg">Tips & FAQ Content</h3>
                    <div className="space-y-3">
                      {db.tips.map(tip => (
                        <div key={tip.id} className="text-sm">
                          <p className="font-semibold text-emerald-800">💡 {tip.q}</p>
                          <p className="text-emerald-700 mt-1">{tip.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* SUB-SCREEN 2: ECOWISE WEALTH DIGEST          */}
          {/* ============================================ */}
          {activeApp === 'ecowise' && (
            <div className="space-y-8 animate-fadeIn">
              <header className="border-b pb-4 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-extrabold text-slate-800">EcoWise Wealth Digest</h2>
                  <p className="text-slate-600">Sustainable investing education platform and asset tracking workspace.</p>
                </div>
                {/* Role Switcher configuration simulation */}
                <div className="flex bg-slate-200 p-1 rounded-lg">
                  <button onClick={() => setUserRole('Subscriber')} className={`px-3 py-1.5 rounded-md transition ${userRole === 'Subscriber' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'}`}>Subscriber</button>
                  <button onClick={() => setUserRole('Admin')} className={`px-3 py-1.5 rounded-md transition ${userRole === 'Admin' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'}`}>Admin Engine</button>
                </div>
              </header>

              {/* Subscriber Flows View */}
              {userRole === 'Subscriber' ? (
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Issues and Guides Master Feed Content */}
                  <div className="md:col-span-2 space-y-8">
                    <section>
                      <h3 className="text-xl font-bold text-slate-800 mb-4">Latest Newsletter Issues</h3>
                      <div className="space-y-4">
                        {db.issues.map(issue => (
                          <article key={issue.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-lg text-slate-900">{issue.title}</h4>
                              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{issue.topic}</span>
                            </div>
                            <p className="text-slate-600 text-sm font-medium mb-2">{issue.summary}</p>
                            <p className="text-slate-500 text-sm mb-4">{issue.content}</p>
                            <button
                              onClick={() => handleSaveArticle(issue.id, issue.title)}
                              className={`text-xs font-bold flex items-center gap-1.5 ${db.savedArticles.includes(issue.id) ? 'text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                              {db.savedArticles.includes(issue.id) ? '★ Saved Offline' : '☆ Save Article'}
                            </button>
                          </article>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xl font-bold text-slate-800 mb-4">Standalone Educational Guides</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {db.guides.map(guide => (
                          <div key={guide.id} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{guide.topic}</span>
                            <h4 className="font-bold text-slate-900 mt-1 mb-2">{guide.title}</h4>
                            <p className="text-sm text-slate-600">{guide.content}</p>
                            <button
                              onClick={() => handleSaveArticle(guide.id, guide.title)}
                              className={`text-xs font-bold mt-4 block text-left ${db.savedArticles.includes(guide.id) ? 'text-amber-600' : 'text-emerald-600'}`}
                            >
                              {db.savedArticles.includes(guide.id) ? '★ Saved to Device' : '💾 Cache Guide'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Sidebar tracking actions */}
                  <div className="space-y-6">
                    {/* Newsletter Opt-In component */}
                    <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg">
                      <h3 className="font-bold text-lg mb-2">Join the Engine Feed</h3>
                      <p className="text-slate-400 text-sm mb-4">Sign up to receive curated asset evaluations directly in your offline-cached digest index.</p>
                      {isSubscribed ? (
                        <div className="bg-emerald-500/20 text-emerald-300 p-3 rounded-lg text-sm text-center font-medium">✓ Subscription registered locally!</div>
                      ) : (
                        <form onSubmit={handleSignUp} className="space-y-3">
                          <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Enter email address" className="w-full text-sm text-slate-900 bg-white border-0 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500" />
                          <button type="submit" className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg hover:bg-emerald-500 transition">Subscribe</button>
                        </form>
                      )}
                    </div>

                    {/* Bookmarked items offline vault indicator */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-3">Your Bookmarked Items Vault ({db.savedArticles.length})</h3>
                      {db.savedArticles.length === 0 ? (
                        <p className="text-sm text-slate-500">No saved items. Click "Save Article" on entries to build your offline dashboard library.</p>
                      ) : (
                        <ul className="space-y-3">
                          {db.savedArticles.map(id => {
                            const item = [...db.issues, ...db.guides].find(i => i.id === id);
                            return item ? (
                              <li key={id} className="flex justify-between items-start gap-2 text-sm border-b pb-2 last:border-0">
                                <span className="font-medium text-slate-700">{item.title}</span>
                                <button onClick={() => handleSaveArticle(item.id, item.title)} className="text-rose-500 font-semibold hover:text-rose-700 text-xs shrink-0">Remove</button>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Admin Dashboard View Workspace Component */
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    <header>
                      <h3 className="font-bold text-xl text-slate-800">Admin Control Panel</h3>
                      <p className="text-sm text-slate-500 mt-1">Publish new content blocks directly into the global application storage cache.</p>
                    </header>
                    <form onSubmit={handleAdminPublish} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Content Deployment Architecture</label>
                        <select value={adminType} onChange={e => setAdminType(e.target.value)} className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2 border">
                          <option value="issue">Newsletter Issue Entry</option>
                          <option value="guide">Standalone Educational Guide</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Document Title</label>
                        <input type="text" required value={adminTitle} onChange={e => setAdminTitle(e.target.value)} placeholder="e.g., Solar ETF Trends 2026" className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2 border" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Content Body Payload</label>
                        <textarea required rows={4} value={adminBody} onChange={e => setAdminBody(e.target.value)} placeholder="Provide full analytical text data writeup..." className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2 border" />
                      </div>
                      <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-2 rounded-lg hover:bg-slate-800 transition">Publish Content Bundle</button>
                    </form>
                  </div>

                  {/* Audit Logs Visualization Screen */}
                  <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col h-[500px]">
                    <h3 className="font-bold text-xl mb-4">Live System Audit Log Stream</h3>
                    <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs p-4 bg-black/50 rounded-lg border border-slate-700">
                      {db.auditLogs.map((log, index) => (
                        <div key={index} className="flex gap-3 items-start opacity-80 hover:opacity-100">
                          <span className="text-emerald-400 shrink-0">[{log.timestamp.split('T')[1].substring(0, 8)}]</span>
                          <span className="text-slate-300 break-words">{log.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

    </div>
  );
}