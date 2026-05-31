import React, { useState } from 'react';
import { getDb, updateDb } from '../../db/mockDb';

export default function AdminPanel({ db, logAction }) {
  const [activeTab, setActiveTab] = useState('publish'); // 'publish', 'issues', 'guides', 'audit'

  // Publish form state
  const [adminType, setAdminType] = useState('issue');
  const [adminTitle, setAdminTitle] = useState('');
  const [adminTopic, setAdminTopic] = useState('');
  const [adminBody, setAdminBody] = useState('');

  // Edit state
  const [editingItem, setEditingItem] = useState(null);

  const handleAdminPublish = (e) => {
    e.preventDefault();
    if (!adminTitle || !adminBody || !adminTopic) return;
    const currentDb = getDb();
    const targetKey = adminType === 'issue' ? 'issues' : 'guides';

    if (editingItem) {
      const idx = currentDb[targetKey].findIndex(item => item.id === editingItem.id);
      if (idx !== -1) {
        currentDb[targetKey][idx] = {
          ...currentDb[targetKey][idx],
          title: adminTitle,
          topic: adminTopic,
          content: adminBody,
          summary: adminType === 'issue' ? adminBody.substring(0, 100) + '...' : undefined
        };
        logAction(`Updated admin ${adminType}: ${adminTitle}`);
      }
    } else {
      currentDb[targetKey].push({
        id: `admin-${Date.now()}`,
        title: adminTitle,
        topic: adminTopic,
        content: adminBody,
        summary: adminType === 'issue' ? adminBody.substring(0, 100) + '...' : undefined
      });
      logAction(`Published admin ${adminType}: ${adminTitle}`);
    }

    updateDb(currentDb);
    resetForm();
  };

  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      const currentDb = getDb();
      const targetKey = type === 'issue' ? 'issues' : 'guides';
      currentDb[targetKey] = currentDb[targetKey].filter(item => item.id !== id);
      updateDb(currentDb);
      logAction(`Deleted admin ${type}: ${id}`);
    }
  };

  const handleEdit = (item, type) => {
    setAdminType(type);
    setAdminTitle(item.title);
    setAdminTopic(item.topic || '');
    setAdminBody(item.content);
    setEditingItem(item);
    setActiveTab('publish');
  };

  const resetForm = () => {
    setAdminTitle('');
    setAdminTopic('');
    setAdminBody('');
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="border-b pb-4">
        <h2 className="text-3xl font-extrabold text-slate-800">Admin Engine</h2>
        <p className="text-slate-600">Global content management and system auditing dashboard.</p>
      </header>

      {/* Tabs */}
      <div className="flex space-x-2 border-b">
        {['publish', 'issues', 'guides', 'audit'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); if(tab !== 'publish') resetForm(); }}
            className={`px-4 py-2 text-sm font-bold capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {tab === 'publish' ? (editingItem ? 'Edit Content' : 'Publish Content') :
             tab === 'audit' ? 'Audit Log' : `Manage ${tab}`}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {/* PUBLISH TAB */}
        {activeTab === 'publish' && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl">
            <form onSubmit={handleAdminPublish} className="space-y-4">
              {!editingItem && (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Content Type</label>
                  <select value={adminType} onChange={e => setAdminType(e.target.value)} className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2 border">
                    <option value="issue">Newsletter Issue</option>
                    <option value="guide">Educational Guide</option>
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                  <input type="text" required value={adminTitle} onChange={e => setAdminTitle(e.target.value)} placeholder="Title" className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2 border" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Topic/Category</label>
                  <input type="text" required value={adminTopic} onChange={e => setAdminTopic(e.target.value)} placeholder="e.g. Markets" className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2 border" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Content Body</label>
                <textarea required rows={6} value={adminBody} onChange={e => setAdminBody(e.target.value)} placeholder="Full content text..." className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2 border" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-slate-900 text-white font-semibold py-2 rounded-lg hover:bg-slate-800 transition">
                  {editingItem ? 'Update Content' : 'Publish Content'}
                </button>
                {editingItem && (
                  <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* MANAGE ISSUES TAB */}
        {activeTab === 'issues' && (
          <div className="space-y-4">
            {db.issues.map(issue => (
              <div key={issue.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900">{issue.title}</h4>
                  <p className="text-xs text-slate-500">{issue.topic} • ID: {issue.id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(issue, 'issue')} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold bg-indigo-50 px-3 py-1 rounded-lg">Edit</button>
                  <button onClick={() => handleDelete(issue.id, 'issue')} className="text-rose-600 hover:text-rose-800 text-sm font-bold bg-rose-50 px-3 py-1 rounded-lg">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MANAGE GUIDES TAB */}
        {activeTab === 'guides' && (
          <div className="space-y-4">
            {db.guides.map(guide => (
              <div key={guide.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900">{guide.title}</h4>
                  <p className="text-xs text-slate-500">{guide.topic} • ID: {guide.id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(guide, 'guide')} className="text-indigo-600 hover:text-indigo-800 text-sm font-bold bg-indigo-50 px-3 py-1 rounded-lg">Edit</button>
                  <button onClick={() => handleDelete(guide.id, 'guide')} className="text-rose-600 hover:text-rose-800 text-sm font-bold bg-rose-50 px-3 py-1 rounded-lg">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AUDIT LOG TAB */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-col h-[600px]">
            <h3 className="font-bold text-xl mb-4 text-emerald-400">Live System Audit Log Stream</h3>
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs p-4 bg-black/50 rounded-lg border border-slate-700">
              {db.auditLogs.slice(0, 50).map((log, index) => {
                let timeStr = "";
                try {
                  timeStr = new Date(log.timestamp).toLocaleString();
                } catch(e) { timeStr = log.timestamp; }
                return (
                  <div key={index} className="flex gap-3 items-start opacity-80 hover:opacity-100 pb-2 border-b border-slate-800/50 last:border-0">
                    <span className="text-emerald-500 shrink-0">[{timeStr}]</span>
                    <span className="text-slate-300 break-words">{log.action}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}