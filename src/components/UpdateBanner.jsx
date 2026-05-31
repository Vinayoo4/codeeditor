import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdateBanner() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-4 animate-slideDown">
      <span className="font-semibold text-sm">New version available — refresh</span>
      <button
        onClick={() => updateServiceWorker(true)}
        className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold hover:bg-blue-50 transition"
      >
        Refresh
      </button>
      <button
        onClick={() => setNeedRefresh(false)}
        className="text-blue-200 hover:text-white px-2 py-1 text-sm font-bold"
      >
        ✕
      </button>
    </div>
  );
}