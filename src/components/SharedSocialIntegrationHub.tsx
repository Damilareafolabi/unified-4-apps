import React, { useState } from 'react';
import { 
  Share2, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Send, 
  Settings2, 
  RefreshCw, 
  Globe, 
  Twitter, 
  Linkedin, 
  Radio, 
  Sliders, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Video, 
  Bot,
  AlertTriangle,
  Lock,
  FileText,
  Key,
  Layers,
  Briefcase,
  HelpCircle,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OFFICIAL_INTEGRATION_REGISTER, SocialNetworkIntegration } from '../data/socialPartnershipRegister';

export interface ConnectedSocialAccount {
  id: string;
  networkId: string;
  accountHandle: string;
  productContext: 'lazyceo' | 'keydirect' | 'talentdock' | 'gigconnect';
  status: 'connected' | 'token_expiring' | 'disconnected';
  tokenExpiresAt: string;
  automatedPublishing: boolean;
  postsPublishedCount: number;
}

const initialConnectedAccounts: ConnectedSocialAccount[] = [
  {
    id: 'conn-meta-1',
    networkId: 'meta-fb-ig',
    accountHandle: '@lazyceo.official',
    productContext: 'lazyceo',
    status: 'connected',
    tokenExpiresAt: 'in 58 days',
    automatedPublishing: true,
    postsPublishedCount: 142
  },
  {
    id: 'conn-x-1',
    networkId: 'x-twitter-v2',
    accountHandle: '@LazyCEO_Pulse',
    productContext: 'lazyceo',
    status: 'connected',
    tokenExpiresAt: 'in 85 days',
    automatedPublishing: true,
    postsPublishedCount: 388
  },
  {
    id: 'conn-li-1',
    networkId: 'linkedin-org',
    accountHandle: 'SimeonJr Studios Global',
    productContext: 'lazyceo',
    status: 'connected',
    tokenExpiresAt: 'in 42 days',
    automatedPublishing: true,
    postsPublishedCount: 52
  },
  {
    id: 'conn-kd-yt',
    networkId: 'google-youtube',
    accountHandle: 'KeyDirect Real Estate 4K Walkthroughs',
    productContext: 'keydirect',
    status: 'connected',
    tokenExpiresAt: 'in 120 days',
    automatedPublishing: false,
    postsPublishedCount: 24
  }
];

export const SharedSocialIntegrationHub: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [selectedProduct, setSelectedProduct] = useState<'lazyceo' | 'keydirect' | 'talentdock' | 'gigconnect'>('lazyceo');
  const [activeTab, setActiveTab] = useState<'connections' | 'publisher' | 'register' | 'compliance'>('connections');
  const [accounts, setAccounts] = useState<ConnectedSocialAccount[]>(initialConnectedAccounts);
  
  // Cross-Network Blast State
  const [postDraft, setPostDraft] = useState(
    '🚀 Milestone reached: Our autonomous marketing infrastructure has now driven 100M+ organic impressions globally with zero manual fatigue.'
  );
  const [mediaAttached, setMediaAttached] = useState<string | null>(null);
  const [isMediaRealProperty, setIsMediaRealProperty] = useState(false);
  const [selectedTargetNetworks, setSelectedTargetNetworks] = useState<string[]>(['meta-fb-ig', 'x-twitter-v2', 'linkedin-org']);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchFeedback, setDispatchFeedback] = useState<string | null>(null);

  // Filter accounts for selected product tenant
  const productAccounts = accounts.filter(a => a.productContext === selectedProduct);

  const handleToggleAutomation = (accId: string) => {
    setAccounts(prev => prev.map(a => a.id === accId ? { ...a, automatedPublishing: !a.automatedPublishing } : a));
  };

  const handleDisconnect = (accId: string) => {
    setAccounts(prev => prev.filter(a => a.id !== accId));
    alert('Account disconnected and cached access tokens purged per privacy protocol.');
  };

  const handleSimulateOAuthConnect = (network: SocialNetworkIntegration) => {
    const handle = `@${selectedProduct}_${Math.random().toString(36).slice(2, 6)}`;
    const newAccount: ConnectedSocialAccount = {
      id: `conn-${Date.now()}`,
      networkId: network.id,
      accountHandle: handle,
      productContext: selectedProduct,
      status: 'connected',
      tokenExpiresAt: 'in 60 days',
      automatedPublishing: true,
      postsPublishedCount: 0
    };
    setAccounts(prev => [newAccount, ...prev]);
    confetti({ particleCount: 30, colors: ['#3b82f6', '#10b981', '#ffffff'] });
  };

  const handleDispatchCrossNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postDraft.trim()) return;

    // Strict Real Property Media Enforcement for KeyDirect
    if (selectedProduct === 'keydirect' && mediaAttached && !isMediaRealProperty) {
      alert('KeyDirect Strict Media Policy: You must confirm the uploaded media is genuine, unmanipulated property footage before syndication.');
      return;
    }

    setIsDispatching(true);
    setDispatchFeedback(null);

    try {
      await new Promise(r => setTimeout(r, 900));
      setDispatchFeedback(`Dispatched successfully to ${selectedTargetNetworks.length} authorized networks under the ${selectedProduct.toUpperCase()} tenant.`);
      confetti({ particleCount: 50, colors: ['#ef4444', '#10b981', '#6366f1'] });
      
      // Increment counter
      setAccounts(prev => prev.map(a => 
        selectedTargetNetworks.includes(a.networkId) && a.productContext === selectedProduct
          ? { ...a, postsPublishedCount: a.postsPublishedCount + 1 }
          : a
      ));
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-slate-100 font-sans">
      
      {/* Top Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer z-10"
            title="Close Social Hub"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Share2 className="w-3.5 h-3.5" />
            <span>Shared Global Social Integration & Partnership Programme</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Universal Social Connections Centre
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Unified OAuth connectors, secure token management, per-platform media compliance, and developer partnership registers serving all four ecosystem products.
          </p>
        </div>

        {/* Tenant Product Selector */}
        <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 px-2 block">Active Product Context:</span>
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'lazyceo', label: 'LazyCEO', color: 'bg-red-600' },
              { id: 'keydirect', label: 'KeyDirect', color: 'bg-amber-600' },
              { id: 'talentdock', label: 'TalentDock', color: 'bg-[#1dbf73]' },
              { id: 'gigconnect', label: 'GIGCONNECT', color: 'bg-indigo-600' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProduct(p.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedProduct === p.id 
                    ? `${p.color} text-white shadow-md` 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'connections' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Connected Accounts ({productAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('publisher')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'publisher' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Multi-Network Syndication Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('register')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Official Developer App Register ({OFFICIAL_INTEGRATION_REGISTER.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'compliance' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy & Data Deletion Compliance</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: CONNECTED ACCOUNTS FOR ACTIVE TENANT */}
      {/* ===================================================================== */}
      {activeTab === 'connections' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Connected Networks for <span className="text-indigo-400 uppercase">{selectedProduct}</span>
            </h3>
            <span className="text-xs text-slate-400">Strict tenant isolation active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {OFFICIAL_INTEGRATION_REGISTER.map(net => {
              const connected = productAccounts.find(a => a.networkId === net.id);
              return (
                <div key={net.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-lg hover:border-indigo-500/40 transition-all">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        {net.provider}
                      </span>
                      {connected ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Connected
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Not Connected</span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">{net.platformName}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {net.productUseCases[selectedProduct] || 'Authorized multi-channel syndication and publishing'}
                    </p>

                    {connected && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                        <div className="font-mono text-slate-200">{connected.accountHandle}</div>
                        <div className="text-[10px] text-slate-500 flex justify-between">
                          <span>Token expires: {connected.tokenExpiresAt}</span>
                          <span className="text-indigo-400">{connected.postsPublishedCount} posts sent</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    {connected ? (
                      <>
                        <button
                          onClick={() => handleToggleAutomation(connected.id)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                            connected.automatedPublishing ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {connected.automatedPublishing ? 'Automation On' : 'Paused'}
                        </button>
                        <button
                          onClick={() => handleDisconnect(connected.id)}
                          className="p-1.5 rounded-lg bg-slate-950 hover:bg-red-950/40 text-red-400 border border-red-900/40 cursor-pointer"
                          title="Disconnect & delete token"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleSimulateOAuthConnect(net)}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Connect with OAuth 2.0</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: MULTI-NETWORK PUBLISHING STUDIO */}
      {/* ===================================================================== */}
      {activeTab === 'publisher' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white">Multi-Network Syndication Studio</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Draft once and validate against per-platform character limits and media standards for {selectedProduct.toUpperCase()}.
            </p>
          </div>

          <form onSubmit={handleDispatchCrossNetwork} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Broadcast Content (Auto-validated across selected networks)
              </label>
              <textarea
                rows={4}
                value={postDraft}
                onChange={(e) => setPostDraft(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>{postDraft.length} characters</span>
                <span className={postDraft.length > 280 ? 'text-amber-400' : 'text-slate-400'}>
                  {postDraft.length > 280 ? 'Exceeds standard X/Twitter length (will auto-thread)' : 'Fits in single X tweet'}
                </span>
              </div>
            </div>

            {/* Target Networks Checklist */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Target Networks:</label>
              <div className="flex flex-wrap gap-2">
                {OFFICIAL_INTEGRATION_REGISTER.map(n => {
                  const isSelected = selectedTargetNetworks.includes(n.id);
                  return (
                    <button
                      type="button"
                      key={n.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTargetNetworks(selectedTargetNetworks.filter(id => id !== n.id));
                        } else {
                          setSelectedTargetNetworks([...selectedTargetNetworks, n.id]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {n.platformName.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Strict Media Policy for KeyDirect */}
            {selectedProduct === 'keydirect' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>KeyDirect Strict Real-Media Policy Check</span>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMediaRealProperty}
                    onChange={(e) => setIsMediaRealProperty(e.target.checked)}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span>I certify that this media contains genuine, non-AI-generated property footage.</span>
                </label>
              </div>
            )}

            {dispatchFeedback && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
                {dispatchFeedback}
              </div>
            )}

            <button
              type="submit"
              disabled={isDispatching || selectedTargetNetworks.length === 0}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isDispatching ? 'Validating & Syndicating...' : 'Dispatch Instant Cross-Network Post'}</span>
            </button>
          </form>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: OFFICIAL DEVELOPER APP & PARTNERSHIP REGISTER */}
      {/* ===================================================================== */}
      {activeTab === 'register' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Official Social Network Integration Register</h3>
              <p className="text-xs text-slate-400">Formal documentation of developer app IDs, production review statuses, and OAuth callback scopes.</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
              7 Platforms Documented
            </span>
          </div>

          <div className="space-y-3">
            {OFFICIAL_INTEGRATION_REGISTER.map(reg => (
              <div key={reg.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{reg.platformName}</h4>
                    <div className="text-xs text-slate-400">Owner: {reg.developerAccountOwner} • App ID: {reg.appId}</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    Status: {reg.registrationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">OAuth Callback</span>
                    <span className="text-slate-300 font-mono text-[11px] truncate block">{reg.oauthCallbackUrl}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Requested Scopes</span>
                    <span className="text-slate-300 text-[11px] truncate block">{reg.permissionsRequested.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Rate Limits</span>
                    <span className="text-slate-300 text-[11px] block">{reg.rateLimitNote}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">API Cost Model</span>
                    <span className="text-emerald-400 text-[11px] block">{reg.ongoingCostNotes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: COMPLIANCE & DATA DELETION URLS */}
      {/* ===================================================================== */}
      {activeTab === 'compliance' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 bg-slate-900/60">
          <div>
            <h3 className="text-xl font-bold text-white">Social Platform Privacy & Data Deletion Compliance</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict adherence to Meta Platform Terms, Google API Services User Data Policy, and TikTok Developer Terms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white uppercase">Privacy Policy</div>
              <p className="text-xs text-slate-400">Specifies exact data retention limits, zero selling of personal data, and token encryption.</p>
              <div className="text-xs font-mono text-indigo-400">https://simeonjrstudios.com/legal/privacy</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white uppercase">Terms of Service</div>
              <p className="text-xs text-slate-400">Enforces acceptable use, authentic media ownership, and anti-spam rate limits.</p>
              <div className="text-xs font-mono text-indigo-400">https://simeonjrstudios.com/legal/terms</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white uppercase">Data Deletion Callback</div>
              <p className="text-xs text-slate-400">Automated endpoint that purges stored tokens and identifiers when a user removes the app.</p>
              <div className="text-xs font-mono text-indigo-400">https://simeonjrstudios.com/legal/data-deletion</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white">User Data Deletion Instructions</h4>
            <p className="text-slate-400 leading-relaxed">
              Users may disconnect any connected social account at any time using the 1-click Disconnect button on this dashboard. Disconnecting immediately removes access tokens from our encrypted database and triggers a data-deletion receipt confirmation code.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
