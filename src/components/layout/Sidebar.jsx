import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOnline, userRole }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Header (Visible only on < md) */}
      <div className="md:hidden bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center z-30 relative">
        <h1 className="text-xl font-black tracking-wider text-emerald-400">ECO-MEAL HUB</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-2"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer overlay */}
      <aside className={`${isMobileMenuOpen ? 'fixed inset-0 pt-16 z-20 block' : 'hidden'} md:flex md:w-64 bg-slate-900 text-white flex-col justify-between border-r border-slate-800 transition-all`}>
        <div>
          <div className="p-5 border-b border-slate-800 bg-slate-950 hidden md:block">
            <h1 className="text-xl font-black tracking-wider text-emerald-400">ECO-MEAL HUB</h1>
            <p className="text-xs text-slate-400 mt-1">Embedded Unified Engine</p>
          </div>
          <nav className="p-4 space-y-2">
            <Link
              to="/mealprep"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 ${currentPath.startsWith('/mealprep') ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              🥗 Meal Prep Kit
            </Link>
            <Link
              to="/ecowise"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 ${currentPath.startsWith('/ecowise') ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              📈 EcoWise Wealth
            </Link>
            {userRole === 'Admin' && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition flex items-center gap-3 ${currentPath.startsWith('/admin') ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mr-1">ADMIN MODE</span> Panel
              </Link>
            )}
          </nav>
        </div>

        {/* CONNECTION STATUS SYSTEM INDICATOR */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs space-y-2 mt-auto">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${isOnline ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400 animate-pulse'}`}>
              {isOnline ? '● Online' : '○ Offline'}
            </span>
          </div>
          <p className="text-slate-500 text-[10px] leading-relaxed hidden md:block">Changes update local caches instantly when offline.</p>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Visible only on < md) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-2 z-30">
        <Link to="/mealprep" className={`p-3 rounded-xl flex flex-col items-center ${currentPath.startsWith('/mealprep') ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span className="text-xl mb-1">🥗</span>
          <span className="text-[10px] font-bold">Meal Prep</span>
        </Link>
        <Link to="/ecowise" className={`p-3 rounded-xl flex flex-col items-center ${currentPath.startsWith('/ecowise') ? 'text-emerald-400' : 'text-slate-400'}`}>
          <span className="text-xl mb-1">📈</span>
          <span className="text-[10px] font-bold">EcoWise</span>
        </Link>
        {userRole === 'Admin' && (
          <Link to="/admin" className={`p-3 rounded-xl flex flex-col items-center ${currentPath.startsWith('/admin') ? 'text-rose-400' : 'text-slate-400'}`}>
            <span className="text-xl mb-1">⚙️</span>
            <span className="text-[10px] font-bold">Admin</span>
          </Link>
        )}
      </div>
    </>
  );
}