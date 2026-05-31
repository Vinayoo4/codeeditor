import React, { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We no longer need the prompt. Clear it up
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 md:bottom-4 md:left-auto md:right-4 md:translate-x-0 bg-white p-4 rounded-xl shadow-2xl z-50 border border-emerald-100 flex items-center gap-4 animate-slideUp">
      <div>
        <h4 className="font-bold text-slate-800 text-sm">Install EcoMeal Hub</h4>
        <p className="text-xs text-slate-500">Add to home screen for offline access</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handleInstallClick} className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition">Install</button>
        <button onClick={handleDismiss} className="text-slate-400 hover:text-slate-600 px-2 py-1.5 text-sm">✕</button>
      </div>
    </div>
  );
}