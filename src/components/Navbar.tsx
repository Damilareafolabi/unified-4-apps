import React, { useState } from 'react';
import { 
  Rocket, 
  BarChart3, 
  Share2, 
  CalendarDays, 
  Zap, 
  Globe, 
  Sparkles,
  ArrowRight,
  Database,
  Bot,
  Wand2,
  MessageSquare,
  Search,
  LogIn,
  LogOut,
  User as UserIcon,
  Key,
  Layers,
  Award,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { User } from 'firebase/auth';

interface NavbarProps {
  activePlatform: 'lazyceo' | 'studio' | 'keydirect' | 'gigconnect';
  setActivePlatform: (platform: 'lazyceo' | 'studio' | 'keydirect' | 'gigconnect') => void;
  currentTab: 'marketing' | 'engine' | 'analytics' | 'channels' | 'media' | 'chat' | 'radar';
  setCurrentTab: (tab: 'marketing' | 'engine' | 'analytics' | 'channels' | 'media' | 'chat' | 'radar') => void;
  autopilotActive: boolean;
  setAutopilotActive: (active: boolean) => void;
  onTriggerPulse: () => void;
  isPulsing: boolean;
  firebaseSynced: boolean;
  currentUser: User | null;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  studioBrandName?: string;
  onOpenFounderDashboard?: () => void;
  onOpenSocialHub?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePlatform,
  setActivePlatform,
  currentTab,
  setCurrentTab,
  autopilotActive,
  setAutopilotActive,
  onTriggerPulse,
  isPulsing,
  firebaseSynced,
  currentUser,
  onGoogleSignIn,
  onSignOut,
  studioBrandName = 'SimeonJr Studio Hub',
  onOpenFounderDashboard,
  onOpenSocialHub
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Mini Platform Switcher Banner (Multi-Platform Ecosystem) */}
        <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60 text-[11px] overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-slate-400 font-semibold hidden md:inline">Ecosystem Switcher:</span>
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              {/* PLATFORM 1: LAZYCEO (RED THEME) */}
              <button
                onClick={() => setActivePlatform('lazyceo')}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  activePlatform === 'lazyceo'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3 h-3 text-white" />
                <span>LazyCEO Autopilot</span>
              </button>

              {/* PLATFORM 2: FREELANCE MARKETPLACE (EMERALD GREEN #1dbf73) */}
              <button
                onClick={() => setActivePlatform('studio')}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  activePlatform === 'studio'
                    ? 'bg-[#1dbf73] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-white" />
                <span>{studioBrandName}</span>
              </button>

              {/* PLATFORM 3: KEYDIRECT REAL ESTATE (AFRICAN PROPTECH) */}
              <button
                onClick={() => setActivePlatform('keydirect')}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  activePlatform === 'keydirect'
                    ? 'bg-[#c52222] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-white" />
                <span>KeyDirect Real Estate</span>
              </button>

              {/* PLATFORM 4: GIGCONNECT (GLOBAL CAREER PILOT) */}
              <button
                onClick={() => setActivePlatform('gigconnect')}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  activePlatform === 'gigconnect'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-white" />
                <span>GIGCONNECT</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-slate-400 shrink-0">
            {onOpenFounderDashboard && (
              <button
                onClick={onOpenFounderDashboard}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                title="Open Private Founder Control Centre & Income Zone"
              >
                <ShieldCheck className="w-3 h-3 text-red-400" />
                <span>Founder Console</span>
              </button>
            )}

            {onOpenSocialHub && (
              <button
                onClick={onOpenSocialHub}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                title="Universal Social Connections Centre"
              >
                <Share2 className="w-3 h-3 text-indigo-300" />
                <span>Social Hub</span>
              </button>
            )}

            {firebaseSynced && (
              <span className="hidden sm:inline-flex items-center space-x-1 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <Database className="w-2.5 h-2.5" />
                <span>Firestore Live</span>
              </span>
            )}
            <span className="hidden xl:inline text-slate-500 font-semibold">4 Global Platforms</span>
          </div>
        </div>

        {/* Main Header Controls */}
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand */}
          {activePlatform === 'lazyceo' ? (
            <div className="flex items-center space-x-2.5 cursor-pointer shrink-0" onClick={() => setCurrentTab('marketing')}>
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-md shadow-red-500/25">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                  <img 
                    src="/src/assets/images/red_robot_logo_1792157120575.jpg" 
                    alt="LazyCEO Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">
                  Lazy<span className="text-red-500 neon-text-red">CEO</span>
                </span>
                <span className="hidden xl:inline-flex items-center ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/30">
                  Autonomous CMO
                </span>
              </div>
            </div>
          ) : activePlatform === 'studio' ? (
            <div className="flex items-center space-x-2.5 cursor-pointer shrink-0" onClick={() => setActivePlatform('studio')}>
              <div className="w-9 h-9 rounded-xl bg-[#1dbf73] flex items-center justify-center shadow-md p-0.5">
                <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#1dbf73]" />
                </div>
              </div>
              <div>
                <div className="text-base font-black tracking-tight text-white leading-none flex items-center gap-1.5">
                  <span>{studioBrandName}</span>
                  <span className="px-1.5 py-0.2 rounded bg-black/60 border border-[#1dbf73]/50 text-[#1dbf73] text-[9px] font-black">PRO</span>
                </div>
                <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                  Verified Freelance Marketplace
                </div>
              </div>
            </div>
          ) : activePlatform === 'keydirect' ? (
            <div className="flex items-center space-x-2.5 cursor-pointer shrink-0" onClick={() => setActivePlatform('keydirect')}>
              <div className="w-9 h-9 rounded-xl bg-[#c52222] flex items-center justify-center shadow-md">
                <Key className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-base font-black tracking-tight text-white leading-none">
                  KEYDIRECT
                </div>
                <div className="text-[9px] font-extrabold tracking-widest text-red-400 uppercase mt-0.5">
                  REAL ESTATE
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5 cursor-pointer shrink-0" onClick={() => setActivePlatform('gigconnect')}>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-base font-black tracking-tight text-white leading-none flex items-center gap-1.5">
                  <span>GIGCONNECT</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-950 border border-indigo-400/40 text-indigo-300 text-[9px] font-bold">CAREER PILOT</span>
                </div>
                <div className="text-[9px] font-extrabold tracking-widest text-indigo-400 uppercase mt-0.5">
                  RESUMEFORGE AI BUDDY
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items (When in LazyCEO platform) */}
          {activePlatform === 'lazyceo' ? (
            <nav className="hidden lg:flex items-center space-x-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80">
              <button
                onClick={() => setCurrentTab('marketing')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentTab === 'marketing'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Marketing
              </button>

              <button
                onClick={() => setCurrentTab('engine')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentTab === 'engine'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>365 Engine</span>
              </button>

              <button
                onClick={() => setCurrentTab('media')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentTab === 'media'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Media Studio</span>
              </button>

              <button
                onClick={() => setCurrentTab('chat')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentTab === 'chat'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>SimeonJr Chatbot</span>
              </button>

              <button
                onClick={() => setCurrentTab('radar')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentTab === 'radar'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search & Maps</span>
              </button>

              <button
                onClick={() => setCurrentTab('analytics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentTab === 'analytics'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Analytics
              </button>

              <button
                onClick={() => setCurrentTab('channels')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentTab === 'channels'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Social & PR
              </button>
            </nav>
          ) : activePlatform === 'studio' ? (
            <div className="hidden lg:flex items-center space-x-2 text-xs">
              <span className="text-[#1dbf73] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1dbf73] animate-pulse" />
                {studioBrandName}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Turnkey Freelance Marketplace</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono">48H Turnaround</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-2 text-xs">
              <span className="text-slate-300 font-semibold">Nigerian Direct Real Estate Portal</span>
              <span className="text-slate-600">•</span>
              <span className="text-red-400 font-mono">Automarket powered by LazyCEO</span>
            </div>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5">
            
            {activePlatform === 'lazyceo' ? (
              <button
                onClick={onTriggerPulse}
                disabled={isPulsing}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-md shadow-red-600/30 active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                <Zap className={`w-3.5 h-3.5 fill-current ${isPulsing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">
                  {isPulsing ? 'Pulsing...' : 'Daily Pulse'}
                </span>
              </button>
            ) : activePlatform === 'studio' ? (
              <button
                onClick={() => setActivePlatform('lazyceo')}
                className="flex items-center space-x-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Market on LazyCEO</span>
              </button>
            ) : (
              <button
                onClick={() => setActivePlatform('lazyceo')}
                className="flex items-center space-x-1 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-md cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Switch to LazyCEO</span>
              </button>
            )}

            {/* Google Sign-In with Firebase Auth */}
            {currentUser && !currentUser.isAnonymous ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-red-500/40 p-1 rounded-xl transition-all"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="User avatar"
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-bold text-slate-200 pr-1 max-w-[100px] truncate">
                    {currentUser.displayName || 'Entrepreneur'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs">
                    <div className="px-2 py-1.5 border-b border-slate-800 text-slate-400 truncate">
                      {currentUser.email}
                    </div>
                    <button
                      onClick={() => {
                        onSignOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full mt-1 flex items-center space-x-2 px-2 py-1.5 text-left text-red-400 hover:bg-slate-800 rounded-lg transition-colors font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs border border-slate-800 hover:border-red-500/40 transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Google Sign-In</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Horizontal Sub-Navigation */}
        {activePlatform === 'lazyceo' && (
          <div className="lg:hidden flex items-center space-x-2 py-2 border-t border-slate-800/60 overflow-x-auto text-[11px] no-scrollbar">
            {[
              { id: 'marketing', label: 'Marketing' },
              { id: 'engine', label: '365 Engine' },
              { id: 'media', label: 'AI Media Studio' },
              { id: 'chat', label: 'SimeonJr Chatbot' },
              { id: 'radar', label: 'Search & Maps' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'channels', label: 'Social & PR' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`px-2.5 py-1 rounded-md font-bold whitespace-nowrap transition-colors ${
                  currentTab === tab.id ? 'bg-red-600 text-white' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

      </div>
    </header>
  );
};
