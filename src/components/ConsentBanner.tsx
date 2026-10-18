import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Check, X, SlidersHorizontal, ExternalLink } from 'lucide-react';
import { getStoredConsent, setStoredConsent, UserConsent } from '../lib/analytics';

export const ConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [consent, setConsent] = useState<UserConsent>(getStoredConsent());

  useEffect(() => {
    const hasConsented = localStorage.getItem('gmp_user_consent_set');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const updated = setStoredConsent({
      analytics_storage: 'granted',
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    });
    setConsent(updated);
    localStorage.setItem('gmp_user_consent_set', 'true');
    setShowBanner(false);
    setModalOpen(false);
  };

  const handleRejectNonEssential = () => {
    const updated = setStoredConsent({
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    setConsent(updated);
    localStorage.setItem('gmp_user_consent_set', 'true');
    setShowBanner(false);
    setModalOpen(false);
  };

  const handleSavePreferences = () => {
    setStoredConsent(consent);
    localStorage.setItem('gmp_user_consent_set', 'true');
    setShowBanner(false);
    setModalOpen(false);
  };

  return (
    <>
      {/* Floating Bottom Consent Banner */}
      {showBanner && !modalOpen && (
        <aside 
          aria-label="Privacy and Cookie Consent"
          className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-50 bg-slate-950/95 border border-slate-800 text-slate-100 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up"
        >
          <div className="flex items-start space-x-3.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 shrink-0 mt-0.5">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Privacy & Measurement Consent</span>
                <span className="text-[10px] font-mono uppercase bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">GMP / GA4 Ready</span>
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
                We use privacy-preserving analytics (Google Analytics 4 & Firebase Analytics) to measure feature performance, orders, and viewings. No passwords, CV contents, or private communications are ever sent to analytics tools.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Preferences
            </button>
            <button
              onClick={handleRejectNonEssential}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </aside>
      )}

      {/* Detailed Preferences Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-5 text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Google Marketing Platform Consent Controls</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Analytics Storage */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="font-bold text-white">Analytics Storage (GA4 & Firebase)</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Permits tracking of page views, campaign milestones, and feature conversions with strict data sanitization.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.analytics_storage === 'granted'}
                  onChange={(e) => setConsent({ ...consent, analytics_storage: e.target.checked ? 'granted' : 'denied' })}
                  className="mt-1 accent-blue-600 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Ad Storage & Floodlight */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="font-bold text-white">Ad Storage & Floodlight (DV360 / CM360)</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Enables advertising conversion verification and campaign attribution.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.ad_storage === 'granted'}
                  onChange={(e) => setConsent({ ...consent, ad_storage: e.target.checked ? 'granted' : 'denied' })}
                  className="mt-1 accent-blue-600 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Ad Personalization */}
              <div className="flex items-start justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="font-bold text-white">Ad Personalization & User Data</div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Allows anonymous audience modeling without transmitting sensitive personal files or financial credentials.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={consent.ad_personalization === 'granted'}
                  onChange={(e) => setConsent({
                    ...consent,
                    ad_personalization: e.target.checked ? 'granted' : 'denied',
                    ad_user_data: e.target.checked ? 'granted' : 'denied'
                  })}
                  className="mt-1 accent-blue-600 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500 font-mono">Consent Mode v2 Compliant</span>
              <div className="flex space-x-2">
                <button
                  onClick={handleRejectNonEssential}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
                >
                  Reject Optional
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-bold"
                >
                  Save Choices
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
