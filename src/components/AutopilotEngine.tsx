import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Newspaper, 
  Globe2, 
  Send, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Filter,
  Plus,
  RefreshCw,
  Sliders,
  DollarSign,
  Share2,
  Twitter,
  Linkedin,
  Bot
} from 'lucide-react';
import { CampaignMatrix, DailyPost, WeeklyDrop, MonthlyPR, YearlyCampaign, CadenceType, BusinessProfile } from '../types';
import confetti from 'canvas-confetti';

interface AutopilotEngineProps {
  campaign: CampaignMatrix;
  businessProfile: BusinessProfile;
  onOpenProfileModal: () => void;
  onOpenPRModal: (pr: MonthlyPR) => void;
  onDispatchPost: (post: DailyPost) => void;
  onUpdateCampaign: (newCampaign: CampaignMatrix) => void;
}

export const AutopilotEngine: React.FC<AutopilotEngineProps> = ({
  campaign,
  businessProfile,
  onOpenProfileModal,
  onOpenPRModal,
  onDispatchPost,
  onUpdateCampaign
}) => {
  const [activeCadence, setActiveCadence] = useState<'all' | CadenceType>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDispatch = async (post: DailyPost) => {
    setDispatchingId(post.id);
    try {
      const res = await fetch('/api/dispatch-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post, channels: [post.platform] })
      });
      const data = await res.json();
      if (data.success) {
        onDispatchPost(post);
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#ef4444', '#dc2626', '#f87171', '#ffffff']
        });
      }
    } catch (err) {
      console.error('Dispatch failed:', err);
    } finally {
      setDispatchingId(null);
    }
  };

  const renderPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'x':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <span>X (Twitter)</span>
          </span>
        );
      case 'linkedin':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span>LinkedIn</span>
          </span>
        );
      case 'threads':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <span>Threads</span>
          </span>
        );
      case 'pr_wire':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <span>PR Wire</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <span>{platform}</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Active Business Profile & Quick Action */}
      <div className="glass-panel p-6 rounded-2xl border border-red-950/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/30 rounded flex items-center space-x-1">
              <Bot className="w-3 h-3 text-red-400" />
              <span>Active Autopilot Business</span>
            </span>
            <span className="text-xs text-slate-400">• {businessProfile.industry}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {businessProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {businessProfile.tagline}
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={onOpenProfileModal}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-red-600/30"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate New AI 365 Matrix</span>
          </button>
        </div>
      </div>

      {/* Strategic 365 Overview & Telemetry Card */}
      <div className="glass-panel p-6 rounded-2xl border border-red-950/60 bg-slate-900/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>365 Strategic Autonomous Roadmap</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Cadence: 24/7/365 Non-Stop
          </span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed max-w-4xl">
          {campaign.overview}
        </p>

        {/* Projection Metric Highlights */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-medium">Estimated Annual Reach</div>
            <div className="text-lg sm:text-xl font-bold text-red-400 font-mono mt-0.5">
              {campaign.metricsEstimate?.estimatedAnnualReach || '5,400,000+'}
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-medium">Global Press Mentions</div>
            <div className="text-lg sm:text-xl font-bold text-rose-400 font-mono mt-0.5">
              {campaign.metricsEstimate?.estimatedPressMentions || 48} Outlets
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-medium">Hours Reclaimed</div>
            <div className="text-lg sm:text-xl font-bold text-amber-300 font-mono mt-0.5">
              {campaign.metricsEstimate?.estimatedSavedHours || 1480} Hours / yr
            </div>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-400 uppercase font-medium">Agency Retainer Saved</div>
            <div className="text-lg sm:text-xl font-bold text-white font-mono mt-0.5">
              {campaign.metricsEstimate?.estimatedSavedAgencyFees || '$156,000'}
            </div>
          </div>
        </div>
      </div>

      {/* Cadence Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveCadence('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeCadence === 'all'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All 365 Cadences
          </button>
          <button
            onClick={() => setActiveCadence('daily')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeCadence === 'daily'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Daily Micro-Hooks ({campaign.dailyPosts.length})</span>
          </button>
          <button
            onClick={() => setActiveCadence('weekly')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeCadence === 'weekly'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Weekly Essays ({campaign.weeklyDrops.length})</span>
          </button>
          <button
            onClick={() => setActiveCadence('monthly')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeCadence === 'monthly'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Monthly Wire PR ({campaign.monthlyPR.length})</span>
          </button>
          <button
            onClick={() => setActiveCadence('yearly')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeCadence === 'yearly'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Yearly Flagship ({campaign.yearlyCampaigns.length})</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Autopilot Dispatch Queue Active</span>
        </div>
      </div>

      {/* SECTION 1: DAILY POSTS */}
      {(activeCadence === 'all' || activeCadence === 'daily') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span>Daily Micro-Distribution Stream</span>
              </h2>
              <p className="text-xs text-slate-400">
                Automated high-velocity social hooks distributed across X, Threads, and LinkedIn daily.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Cadence: Daily 3x
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaign.dailyPosts.map((post) => (
              <div
                key={post.id}
                className="glass-card p-5 rounded-xl border border-slate-800 hover:border-red-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {renderPlatformBadge(post.platform)}
                      <span className="text-[11px] text-slate-400 font-mono">
                        Day {post.dayNumber} • {post.scheduledTime}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        post.status === 'published'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{post.headline}</h3>

                  <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-900 text-xs text-slate-200 font-sans whitespace-pre-line leading-relaxed mb-3">
                    {post.content}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.hashtags.map((tag, i) => (
                      <span key={i} className="text-[10px] text-red-400/90 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400 text-[11px]">
                    Proj. Reach: <span className="text-white font-mono font-semibold">{post.projectedReach.toLocaleString()}</span>
                    {post.impressions ? (
                      <span className="text-red-400 ml-2 font-mono">({post.impressions.toLocaleString()} views)</span>
                    ) : null}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(post.content, post.id)}
                      className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800/60 hover:bg-slate-800 transition-colors"
                      title="Copy content"
                    >
                      {copiedId === post.id ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDispatch(post)}
                      disabled={dispatchingId === post.id}
                      className="flex items-center space-x-1 bg-red-600/15 hover:bg-red-600/25 text-red-400 border border-red-500/35 px-2.5 py-1 rounded text-[11px] font-semibold transition-all disabled:opacity-50"
                    >
                      <Send className={`w-3 h-3 ${dispatchingId === post.id ? 'animate-spin' : ''}`} />
                      <span>{post.status === 'published' ? 'Dispatch Again' : 'Publish Now'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: WEEKLY DROPS */}
      {(activeCadence === 'all' || activeCadence === 'weekly') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                <span>Weekly Thought Leadership & Newsletters</span>
              </h2>
              <p className="text-xs text-slate-400">
                1,200+ word essays and deep-dives establishing category dominance across LinkedIn and Substack.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Cadence: 1x Weekly
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaign.weeklyDrops.map((drop) => (
              <div
                key={drop.id}
                className="glass-card p-5 rounded-xl border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Week {drop.weekNumber} Executive Drop
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {drop.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{drop.title}</h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {drop.summary}
                  </p>

                  <div className="bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-lg mb-3">
                    <div className="text-[10px] text-rose-300 font-bold uppercase tracking-wider">
                      Executive Takeaway:
                    </div>
                    <div className="text-xs text-rose-200 mt-0.5">
                      "{drop.keyTakeaway}"
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {drop.channels.map((ch, i) => (
                      <span key={i} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Projected Reach: <span className="text-white font-mono font-semibold">{drop.projectedReach.toLocaleString()}</span>
                  </span>

                  <button
                    onClick={() => handleCopy(`${drop.title}\n\n${drop.summary}\n\nKey Takeaway: ${drop.keyTakeaway}`, drop.id)}
                    className="flex items-center space-x-1 text-slate-300 hover:text-white text-[11px] bg-slate-800 px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedId === drop.id ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === drop.id ? 'Copied' : 'Copy Essay'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: MONTHLY PR WIRE RELEASES */}
      {(activeCadence === 'all' || activeCadence === 'monthly') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Newspaper className="w-4 h-4 text-red-400" />
                <span>Monthly Global Press Releases (Newswire Syndication)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Institutional AP-standard press releases syndicating across PR Newswire, Bloomberg, and 450+ media outlets.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Cadence: 1x Monthly
            </span>
          </div>

          <div className="space-y-4">
            {campaign.monthlyPR.map((pr) => (
              <div
                key={pr.id}
                className="glass-panel p-6 rounded-xl border border-slate-800 hover:border-red-500/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded border border-red-500/20">
                      {pr.month}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {pr.dateline}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {pr.status === 'syndicated' ? (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        SYNDICATED TO 462 NEWSROOMS
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        READY FOR WIRE TRANSMISSION
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                  {pr.headline}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                  <span className="font-semibold text-slate-200">[{pr.dateline}] — </span>
                  {pr.leadParagraph}
                </p>

                <div className="bg-slate-900/80 p-3 rounded-lg border-l-2 border-red-500 mb-4 text-xs text-slate-300 italic">
                  {pr.quote}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-800 text-xs gap-3">
                  <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] overflow-x-auto">
                    <span className="font-medium text-slate-300">Target Wires:</span>
                    {pr.targetWires.map((wire, idx) => (
                      <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono text-[10px]">
                        {wire}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenPRModal(pr)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      Read Full Wire Release
                    </button>
                    <button
                      onClick={() => {
                        handleCopy(`${pr.headline}\n\n${pr.dateline}\n\n${pr.leadParagraph}\n\n${pr.quote}`, pr.id);
                        confetti({ particleCount: 20, colors: ['#ef4444', '#f87171'] });
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-red-600/30"
                    >
                      {copiedId === pr.id ? 'Copied Wire Format' : 'Export Press Release'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: YEARLY FLAGSHIP TENTPOLES */}
      {(activeCadence === 'all' || activeCadence === 'yearly') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Globe2 className="w-4 h-4 text-amber-400" />
                <span>Yearly Flagship Tentpoles (Annual Market Shakers)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Major annual benchmark whitepapers, virtual keynotes, and industry awards driving permanent brand authority.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Cadence: 4x Quarterly Flagships
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {campaign.yearlyCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="glass-card p-5 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {camp.quarter} Flagship
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">
                      {camp.status || 'Active Plan'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                    {camp.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {camp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Expected Global Impressions</div>
                  <div className="text-base font-bold text-amber-300 font-mono mt-0.5">
                    {camp.expectedImpressions}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
