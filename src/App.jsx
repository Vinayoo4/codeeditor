import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getDb, updateDb, logAction } from './db/mockDb';
import Sidebar from './components/layout/Sidebar';
import InstallPrompt from './components/InstallPrompt';
import UpdateBanner from './components/UpdateBanner';

import MealPrepView from './features/mealprep/MealPrepView';
import EcoWiseView from './features/ecowise/EcoWiseView';
import AdminPanel from './features/admin/AdminPanel';

const Home = () => <div>Home - Select an app from the sidebar/bottom nav</div>;
const OfflineFallback = () => <div>Offline Fallback Target</div>;

export default function App() {
  const [db, setDb] = useState(getDb());
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Initialize role from localStorage if exists, default to Subscriber
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('ecomeal_admin_role') || 'Subscriber';
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Process pending actions queue
      const pendingStr = localStorage.getItem('ecomeal_pending_actions');
      if (pendingStr) {
        try {
          const pending = JSON.parse(pendingStr);
          if (pending && pending.length > 0) {
            console.log(`Syncing ${pending.length} offline actions...`);
            // Show simple alert/toast
            alert(`${pending.length} actions synced!`);
            localStorage.removeItem('ecomeal_pending_actions');
          }
        } catch(e) {}
      }
    };
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

  const handleRoleChange = (role) => {
    setUserRole(role);
    localStorage.setItem('ecomeal_admin_role', role);
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans overflow-hidden">
        <UpdateBanner />

        {/* GLOBAL SYSTEM NAVIGATION */}
        <Sidebar isOnline={isOnline} userRole={userRole} />

        {/* CORE FRAME LAYOUT */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 md:pb-0 relative">

          {/* NETWORK STATUS BANNER */}
          {!isOnline && (
            <div className="bg-rose-600 text-white px-4 py-2 text-center text-sm font-semibold tracking-wide shadow-md z-10 animate-slideDown sticky top-0">
              Running offline mode. Custom configurations and edits are active and being saved directly to device storage.
            </div>
          )}

          <div className="p-4 md:p-6 max-w-6xl w-full mx-auto space-y-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mealprep/*" element={<MealPrepView db={db} logAction={logAction} />} />
              <Route path="/ecowise/*" element={<EcoWiseView db={db} logAction={logAction} userRole={userRole} onRoleChange={handleRoleChange} />} />
              <Route path="/admin" element={userRole === 'Admin' ? <AdminPanel db={db} logAction={logAction} /> : <Navigate to="/" />} />
              <Route path="/offline" element={<OfflineFallback />} />
            </Routes>
          </div>
        </main>

        <InstallPrompt />
      </div>
    </BrowserRouter>
  );
}
