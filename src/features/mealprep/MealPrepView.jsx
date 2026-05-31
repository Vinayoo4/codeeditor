import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { getDb, updateDb } from '../../db/mockDb';

function MealPrepList({ db, logAction }) {
  const navigate = useNavigate();
  const [customPlanName, setCustomPlanName] = useState('');
  const [customPlanItems, setCustomPlanItems] = useState('');
  const [editingPlanId, setEditingPlanId] = useState(null);

  const handleSaveCustomPlan = (e) => {
    e.preventDefault();
    if (!customPlanName) return;

    const items = customPlanItems.split(',').map(i => i.trim()).filter(Boolean);
    const currentDb = getDb();

    if (editingPlanId) {
      const idx = currentDb.userPlans.findIndex(p => p.id === editingPlanId);
      if (idx !== -1) {
        currentDb.userPlans[idx] = { ...currentDb.userPlans[idx], title: customPlanName, items };
        logAction(`Updated custom plan: ${customPlanName}`);
      }
    } else {
      const newPlan = {
        id: 'custom-' + Date.now(),
        title: customPlanName,
        items
      };
      currentDb.userPlans.push(newPlan);
      logAction(`Created custom meal plan: ${customPlanName}`);
      // Push to offline queue if offline
      if (!navigator.onLine) {
        const queue = JSON.parse(localStorage.getItem('ecomeal_pending_actions') || '[]');
        queue.push({ type: 'CREATE_PLAN', data: newPlan });
        localStorage.setItem('ecomeal_pending_actions', JSON.stringify(queue));
      }
    }

    updateDb(currentDb);
    setCustomPlanName('');
    setCustomPlanItems('');
    setEditingPlanId(null);
  };

  const handleEditClick = (plan, e) => {
    e.stopPropagation();
    setEditingPlanId(plan.id);
    setCustomPlanName(plan.title);
    setCustomPlanItems(plan.items.join(', '));
  };

  const handleDeleteClick = (planId, e) => {
    e.stopPropagation();
    const currentDb = getDb();
    currentDb.userPlans = currentDb.userPlans.filter(p => p.id !== planId);
    updateDb(currentDb);
    logAction(`Deleted custom plan`);
  };

  return (
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
                onClick={() => navigate(`/mealprep/${plan.id}`)}
                className="p-5 rounded-xl border bg-white shadow-sm cursor-pointer transition transform hover:-translate-y-0.5 border-gray-200 hover:border-emerald-300"
              >
                <h4 className="font-bold text-slate-800 text-base">{plan.title}</h4>
                <ul className="text-xs text-slate-500 mt-2 space-y-1">
                  {plan.days.slice(0, 3).map((day, idx) => <li key={idx}>{day}</li>)}
                  {plan.days.length > 3 && <li>...and {plan.days.length - 3} more days</li>}
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
                  <div key={plan.id} onClick={() => navigate(`/mealprep/${plan.id}`)} className="p-5 rounded-xl border border-indigo-100 bg-indigo-50/50 cursor-pointer hover:border-indigo-300 relative group">
                    <h4 className="font-bold text-indigo-900 pr-12">{plan.title}</h4>
                    <p className="text-xs text-indigo-600 mt-1">{plan.items.length} items grouped in list.</p>
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handleEditClick(plan, e)} className="text-indigo-500 hover:text-indigo-700 text-xs font-bold">Edit</button>
                      <button onClick={(e) => handleDeleteClick(plan.id, e)} className="text-rose-500 hover:text-rose-700 text-xs font-bold">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contextual Context Action Panel */}
        <div className="space-y-6">

          <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">{editingPlanId ? 'Edit Custom Plan' : 'Customize Local Plan'}</h3>
            <form onSubmit={handleSaveCustomPlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Plan Title</label>
                <input type="text" value={customPlanName} onChange={e => setCustomPlanName(e.target.value)} placeholder="e.g., Summer Cut Week 3" className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Grocery Items (Comma Separated)</label>
                <textarea rows={2} value={customPlanItems} onChange={e => setCustomPlanItems(e.target.value)} placeholder="Apples, Chicken Breast, Rice" className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-slate-900 text-white font-semibold py-2 rounded-lg hover:bg-slate-800 transition">
                  {editingPlanId ? 'Update Plan' : 'Save Plan Offline'}
                </button>
                {editingPlanId && (
                  <button type="button" onClick={() => { setEditingPlanId(null); setCustomPlanName(''); setCustomPlanItems(''); }} className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 font-bold">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

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
  );
}

function MealPrepDetail({ db }) {
  const { planId } = useParams();
  const navigate = useNavigate();

  const plan = db.mealPlans.find(p => p.id === planId) || db.userPlans.find(p => p.id === planId);

  // Local state for checkboxes
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (planId) {
      const stored = localStorage.getItem(`grocerycheck_${planId}`);
      if (stored) {
        setCheckedItems(JSON.parse(stored));
      }
    }
  }, [planId]);

  const toggleCheck = (item) => {
    const newChecked = { ...checkedItems, [item]: !checkedItems[item] };
    setCheckedItems(newChecked);
    localStorage.setItem(`grocerycheck_${planId}`, JSON.stringify(newChecked));
  };

  const clearAllChecks = () => {
    setCheckedItems({});
    localStorage.removeItem(`grocerycheck_${planId}`);
  };

  const handleExport = () => {
    if (!plan) return;
    const items = plan.items || [];
    const text = `Grocery List for ${plan.title}\n\n` + items.map(item => `[${checkedItems[item] ? 'X' : ' '}] ${item}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grocerylist.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!plan) {
    return (
      <div>
        <p>Plan not found.</p>
        <button onClick={() => navigate('/mealprep')} className="text-emerald-600">Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <button onClick={() => navigate('/mealprep')} className="text-slate-500 hover:text-slate-700 text-sm font-bold flex items-center gap-1">← Back to plans</button>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-black text-slate-800 mb-4">{plan.title}</h2>

        {plan.days && (
          <div className="mb-8">
            <h3 className="font-bold text-slate-700 border-b pb-2 mb-3">7-Day Schedule</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {plan.days.map((day, idx) => (
                <li key={idx} className="bg-slate-50 p-2 rounded">{day}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="flex justify-between items-end border-b pb-2 mb-3">
            <h3 className="font-bold text-slate-700">Grocery List</h3>
            <div className="flex gap-2">
              <button onClick={clearAllChecks} className="text-xs text-rose-500 hover:text-rose-700 font-bold border border-rose-200 px-2 py-1 rounded">Clear Checks</button>
              <button onClick={handleExport} className="text-xs text-emerald-600 hover:text-emerald-800 font-bold border border-emerald-200 px-2 py-1 rounded flex items-center gap-1">↓ Export .txt</button>
            </div>
          </div>

          <ul className="grid sm:grid-cols-2 gap-2">
            {(plan.items || []).map((item, idx) => (
              <li key={idx} className={`flex items-center gap-3 p-3 rounded-lg border ${checkedItems[item] ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-200 text-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={!!checkedItems[item]}
                  onChange={() => toggleCheck(item)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-5 h-5 cursor-pointer"
                />
                <span className={`font-medium ${checkedItems[item] ? 'line-through opacity-70' : ''}`}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function MealPrepView({ db, logAction }) {
  return (
    <Routes>
      <Route path="/" element={<MealPrepList db={db} logAction={logAction} />} />
      <Route path="/:planId" element={<MealPrepDetail db={db} />} />
    </Routes>
  );
}