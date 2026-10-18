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
  Newspaper, 
  Radio, 
  Sliders, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Video,
  Bot
} from 'lucide-react';
import { SocialChannel, AutopilotLog } from '../types';
import confetti from 'canvas-confetti';

interface SocialIntegrationHubProps {
  channels: SocialChannel[];
  onToggleConnect: (channelId: string) => void;
  onToggleAutomation: (channelId: string) => void;
  onNewLog: (log: AutopilotLog) => void;
}

export const SocialIntegrationHub: React.FC<SocialIntegrationHubProps> = ({
  channels,
  onToggleConnect,
  onToggleAutomation,
  onNewLog
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testSuccessId, setTestSuccessId] = useState<string | null>(null);
  
  // Blast Dispatcher Box
  const [blastContent, setBlastContent] = useState<string>(
    '🚀 Milestone reached: OmniPulse Global just crossed 100M autonomous impressions worldwide. Marketing is no longer an agency overhead—it is automated software infrastructure.'
  );
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['ch-x', 'ch-linkedin', 'ch-prwire']);
  const [isBlasting, setIsBlasting] = useState(false);
  const [blastFeedback, setBlastFeedback] = useState<string | null>(null);

  // Connection Test Simulator
  const handleTestPing = (channelId: string) => {
    setTestingId(channelId);
    setTestSuccessId(null);
    setTimeout(() => {
      setTestingId(null);
      setTestSuccessId(channelId);
      setTimeout(() => setTestSuccessId(null), 3000);
    }, 800);
  };

  // Toggle selection for blast
  const toggleSelectBlastChannel = (id: string) => {
    if (selectedChannels.includes(id)) {
      setSelectedChannels(selectedChannels.filter(c => c !== id));
    } else {
      setSelectedChannels([...selectedChannels, id]);
    }
  };

  // Fire live blast
  const handleFireBlast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blastContent || selectedChannels.length === 0) return;
    setIsBlasting(true);
    setBlastFeedback(null);

    try {
      const channelNames = selectedChannels.map(id => {
        const found = channels.find(c => c.id === id);
        return found ? found.name : id;
      });

      const res = await fetch('/api/dispatch-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: { content: blastContent, headline: 'Instant Global Blast' },
          channels: channelNames
        })
      });

      const data = await res.json();
      if (data.success) {
        setBlastFeedback(`Dispatched successfully across ${selectedChannels.length} networks!`);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#dc2626', '#f87171', '#ffffff']
        });

        // Add to live log
        onNewLog({
          id: `log-${Date.now()}`,
          timestamp: 'Just Now',
          title: `Omnichannel Blast: "${blastContent.slice(0, 48)}..."`,
          channel: channelNames.join(', '),
          cadence: 'daily',
          reach: 34500,
          status: 'DISTRIBUTED'
        });
      }
    } catch (err) {
      console.error('Blast failed:', err);
      setBlastFeedback('Blast failed to dispatch. Check connection credentials.');
    } finally {
      setIsBlasting(false);
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'x':
        return <Twitter className="w-5 h-5 text-sky-400" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-400" />;
      case 'threads':
        return <Radio className="w-5 h-5 text-purple-400" />;
      case 'pr_wire':
        return <Newspaper className="w-5 h-5 text-red-500" />;
      case 'youtube':
        return <Video className="w-5 h-5 text-rose-500" />;
      default:
        return <Share2 className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Automated Social Media & Global Wire Integration
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connect your brand channels, configure autonomous posting frequency, and execute omnichannel wire blasts.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400">
          <ShieldCheck className="w-4 h-4 text-red-400" />
          <span>OAuth & Cloud Firestore Encryption Active</span>
        </div>
      </div>

      {/* Connected Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`glass-panel p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              channel.connected
                ? 'border-red-950/60 hover:border-red-500/40'
                : 'border-slate-800/40 opacity-70 bg-slate-950/40'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {renderIcon(channel.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {channel.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {channel.handle}
                    </p>
                  </div>
                </div>

                {/* Connection Status Pill */}
                <button
                  onClick={() => onToggleConnect(channel.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    channel.connected
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-slate-800 hover:text-slate-400 hover:border-slate-700'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-red-500/20 hover:text-red-300'
                  }`}
                  title={channel.connected ? 'Click to Disconnect' : 'Click to Connect'}
                >
                  {channel.connected ? 'Connected' : 'Connect'}
                </button>
              </div>

              {/* Channel Metrics */}
              <div className="grid grid-cols-2 gap-2 my-4 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Audience / Reach</span>
                  <div className="text-sm font-bold text-slate-200 font-mono mt-0.5">
                    {channel.followersCount}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Monthly Vol</span>
                  <div className="text-sm font-bold text-rose-400 font-mono mt-0.5">
                    {channel.monthlyReach}
                  </div>
                </div>
              </div>

              {/* Autopilot Automation Switch */}
              <div className="flex items-center justify-between py-2 border-t border-slate-800 text-xs">
                <div>
                  <div className="font-semibold text-slate-200">Autopilot Posting</div>
                  <div className="text-[10px] text-slate-400">{channel.frequency}</div>
                </div>

                <button
                  onClick={() => onToggleAutomation(channel.id)}
                  disabled={!channel.connected}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out disabled:opacity-40 ${
                    channel.automated && channel.connected ? 'bg-red-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                      channel.automated && channel.connected ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Card Footer: Test Ping & Last Sync */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sync: {channel.lastSync}</span>

              {channel.connected && (
                <button
                  onClick={() => handleTestPing(channel.id)}
                  disabled={testingId === channel.id}
                  className="flex items-center space-x-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${testingId === channel.id ? 'animate-spin text-red-400' : ''}`} />
                  <span>
                    {testingId === channel.id
                      ? 'Pinging...'
                      : testSuccessId === channel.id
                      ? '✓ 200 OK'
                      : 'Test Ping'}
                  </span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Omnichannel Instant Blast Console */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-red-950/60 bg-slate-900/50 relative shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-red-500" />
              <span>Omnichannel Instant Blast Console</span>
            </h2>
            <p className="text-xs text-slate-400">
              Trigger a simultaneous ad-hoc broadcast across all connected global channels and PR endpoints.
            </p>
          </div>
          <span className="text-xs font-mono text-red-400">
            {selectedChannels.length} Channels Selected
          </span>
        </div>

        <form onSubmit={handleFireBlast} className="space-y-4">
          
          {/* Target Channel Toggles */}
          <div className="flex flex-wrap gap-2">
            {channels.filter(c => c.connected).map(c => {
              const selected = selectedChannels.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleSelectBlastChannel(c.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    selected
                      ? 'bg-red-500/15 text-red-400 border-red-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {renderIcon(c.type)}
                  <span>{c.name}</span>
                  {selected && <CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
                </button>
              );
            })}
          </div>

          {/* Text Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Dispatch Message / Breaking Announcement
            </label>
            <textarea
              rows={3}
              value={blastContent}
              onChange={(e) => setBlastContent(e.target.value)}
              placeholder="Write your breaking announcement or viral hook..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400">
              {blastFeedback ? (
                <span className="text-red-400 font-semibold">{blastFeedback}</span>
              ) : (
                <span>Auto-formats to platform constraints (Twitter 280 char, LinkedIn long-form, PR Newswire dateline).</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isBlasting || selectedChannels.length === 0}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-red-600/30 disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isBlasting ? 'animate-spin' : ''}`} />
              <span>{isBlasting ? 'Broadcasting Globally...' : 'Fire Omnichannel Blast'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
