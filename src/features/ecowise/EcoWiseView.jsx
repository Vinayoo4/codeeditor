import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { getDb, updateDb } from '../../db/mockDb';

function EcoWiseList({ db, logAction, userRole, onRoleChange }) {
  const navigate = useNavigate();
  const [newEmail, setNewEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSignUp = (e) => {
    e.preventDefault();
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError('');
    logAction(`User signed up with email: ${newEmail}`);
    setIsSubscribed(true);
    setNewEmail('');
  };

  const handleSaveArticle = (id, title, e) => {
    if (e) e.stopPropagation();
    const currentDb = getDb();
    if (currentDb.savedArticles.includes(id)) {
      currentDb.savedArticles = currentDb.savedArticles.filter(item => item !== id);
      logAction(`Unsaved article: ${title}`);
    } else {
      currentDb.savedArticles.push(id);
      logAction(`Saved article: ${title}`);

      if (!navigator.onLine) {
        const queue = JSON.parse(localStorage.getItem('ecomeal_pending_actions') || '[]');
        queue.push({ type: 'SAVE_ARTICLE', data: { id, title } });
        localStorage.setItem('ecomeal_pending_actions', JSON.stringify(queue));
      }
    }
    updateDb(currentDb);
  };

  const issuesToDisplay = showSavedOnly ? db.issues.filter(i => db.savedArticles.includes(i.id)) : db.issues;
  const guidesToDisplay = showSavedOnly ? db.guides.filter(g => db.savedArticles.includes(g.id)) : db.guides;

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="border-b pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">EcoWise Wealth Digest</h2>
          <p className="text-slate-600">Sustainable investing education platform and asset tracking workspace.</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-lg self-start md:self-auto">
          <button onClick={() => onRoleChange('Subscriber')} className={`px-3 py-1.5 rounded-md transition text-sm ${userRole === 'Subscriber' ? 'bg-white text-slate-900 shadow font-bold' : 'text-slate-600'}`}>Subscriber</button>
          <button onClick={() => onRoleChange('Admin')} className={`px-3 py-1.5 rounded-md transition text-sm ${userRole === 'Admin' ? 'bg-white text-slate-900 shadow font-bold' : 'text-slate-600'}`}>Admin Engine</button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Issues and Guides Master Feed Content */}
        <div className="md:col-span-2 space-y-8">

          <div className="flex justify-end">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${showSavedOnly ? 'bg-amber-100 border-amber-200 text-amber-800' : 'bg-white border-gray-200 text-slate-600'}`}
            >
              {showSavedOnly ? '★ Showing Saved Articles' : 'Show All Articles'}
            </button>
          </div>

          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Latest Newsletter Issues</h3>
            {issuesToDisplay.length === 0 ? (
              <p className="text-slate-500 italic">No issues found.</p>
            ) : (
              <div className="space-y-4">
                {issuesToDisplay.map(issue => (
                  <article
                    key={issue.id}
                    onClick={() => navigate(`/ecowise/issue/${issue.id}`)}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-emerald-300 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-slate-900">{issue.title}</h4>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">{issue.topic}</span>
                    </div>
                    <p className="text-slate-600 text-sm font-medium mb-2">{issue.summary}</p>
                    <button
                      onClick={(e) => handleSaveArticle(issue.id, issue.title, e)}
                      className={`text-xs font-bold flex items-center gap-1.5 mt-4 ${db.savedArticles.includes(issue.id) ? 'text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {db.savedArticles.includes(issue.id) ? '★ Saved Offline (Unsave)' : '☆ Save Article'}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Standalone Educational Guides</h3>
            {guidesToDisplay.length === 0 ? (
              <p className="text-slate-500 italic">No guides found.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {guidesToDisplay.map(guide => (
                  <div
                    key={guide.id}
                    onClick={() => navigate(`/ecowise/guide/${guide.id}`)}
                    className="bg-slate-50 p-5 rounded-xl border border-slate-200 cursor-pointer hover:border-emerald-300 transition"
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{guide.topic}</span>
                    <h4 className="font-bold text-slate-900 mt-1 mb-2">{guide.title}</h4>
                    <button
                      onClick={(e) => handleSaveArticle(guide.id, guide.title, e)}
                      className={`text-xs font-bold mt-4 block text-left ${db.savedArticles.includes(guide.id) ? 'text-amber-600' : 'text-emerald-600'}`}
                    >
                      {db.savedArticles.includes(guide.id) ? '★ Saved to Device (Unsave)' : '💾 Cache Guide'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar tracking actions */}
        <div className="space-y-6">
          {/* Newsletter Opt-In component */}
          <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-2">Join the Engine Feed</h3>
            <p className="text-slate-400 text-sm mb-4">Sign up to receive curated asset evaluations directly in your offline-cached digest index.</p>
            {isSubscribed ? (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-emerald-200">
                <h4 className="font-bold text-emerald-600 text-center mb-1">You are subscribed!</h4>
                <p className="text-xs text-slate-600 text-center">Check your inbox for the first EcoWise Digest issue.</p>
              </div>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-3">
                <input
                  type="text"
                  value={newEmail}
                  onChange={e => { setNewEmail(e.target.value); setEmailError(''); }}
                  placeholder="Enter email address"
                  className={`w-full text-sm text-slate-900 bg-white rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none ${emailError ? 'border-2 border-rose-500' : 'border-0'}`}
                />
                {emailError && <p className="text-rose-400 text-xs font-bold">{emailError}</p>}
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
                      <span
                        onClick={() => navigate(id.startsWith('is-') ? `/ecowise/issue/${id}` : `/ecowise/guide/${id}`)}
                        className="font-medium text-slate-700 cursor-pointer hover:text-emerald-600"
                      >
                        {item.title}
                      </span>
                      <button onClick={(e) => handleSaveArticle(item.id, item.title, e)} className="text-rose-500 font-semibold hover:text-rose-700 text-xs shrink-0 bg-rose-50 px-2 py-1 rounded">Unsave</button>
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleDetail({ db, type }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = type === 'issue'
    ? db.issues.find(i => i.id === id)
    : db.guides.find(g => g.id === id);

  if (!item) {
    return (
      <div>
        <p>Article not found.</p>
        <button onClick={() => navigate('/ecowise')} className="text-emerald-600">Back</button>
      </div>
    );
  }

  const isSaved = db.savedArticles.includes(item.id);

  const handleSaveToggle = () => {
    const currentDb = getDb();
    if (isSaved) {
      currentDb.savedArticles = currentDb.savedArticles.filter(savedId => savedId !== item.id);
    } else {
      currentDb.savedArticles.push(item.id);
    }
    updateDb(currentDb);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <button onClick={() => navigate('/ecowise')} className="text-slate-500 hover:text-slate-700 text-sm font-bold flex items-center gap-1">← Back to Feed</button>

      <article className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 block">{item.topic}</span>
            <h1 className="text-3xl font-black text-slate-900">{item.title}</h1>
          </div>
          <button
            onClick={handleSaveToggle}
            className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${isSaved ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'}`}
          >
            {isSaved ? '★ Saved' : '☆ Save'}
          </button>
        </div>

        {type === 'issue' && (
          <p className="text-lg text-slate-600 font-medium mb-8 border-l-4 border-emerald-500 pl-4 py-1">
            {item.summary}
          </p>
        )}

        <div className="prose max-w-none text-slate-700 leading-relaxed space-y-4">
          {item.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

export default function EcoWiseView({ db, logAction, userRole, onRoleChange }) {
  return (
    <Routes>
      <Route path="/" element={<EcoWiseList db={db} logAction={logAction} userRole={userRole} onRoleChange={onRoleChange} />} />
      <Route path="/issue/:id" element={<ArticleDetail db={db} type="issue" />} />
      <Route path="/guide/:id" element={<ArticleDetail db={db} type="guide" />} />
    </Routes>
  );
}