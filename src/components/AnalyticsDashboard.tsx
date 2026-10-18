import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Newspaper, 
  DollarSign, 
  Clock, 
  Globe, 
  Share2, 
  ArrowUpRight, 
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Bot
} from 'lucide-react';
import { AnalyticsSummary, ChannelPerformance, GeographicMetric, AutopilotLog } from '../types';

interface AnalyticsDashboardProps {
  logs: AutopilotLog[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ logs }) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '365d'>('30d');
  const [analytics, setAnalytics] = useState<{
    summary: AnalyticsSummary;
    channels: ChannelPerformance[];
    geographicReach: GeographicMetric[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Fetch or calculate scaled analytics based on timeframe
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?timeRange=${timeRange}`);
        const data = await res.json();
        if (data.success) {
          setAnalytics({
            summary: data.summary,
            channels: data.channels,
            geographicReach: data.geographicReach
          });
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // Chart data simulation points for the SVG Curve
  const chartPointsByRange: Record<string, { label: string; value: number }[]> = {
    '24h': [
      { label: '00:00', value: 12000 },
      { label: '04:00', value: 8500 },
      { label: '08:00', value: 42000 },
      { label: '12:00', value: 78000 },
      { label: '16:00', value: 92000 },
      { label: '20:00', value: 64000 },
      { label: '23:59', value: 49000 },
    ],
    '7d': [
      { label: 'Mon', value: 120000 },
      { label: 'Tue', value: 185000 },
      { label: 'Wed', value: 240000 },
      { label: 'Thu', value: 310000 },
      { label: 'Fri', value: 280000 },
      { label: 'Sat', value: 150000 },
      { label: 'Sun', value: 195000 },
    ],
    '30d': [
      { label: 'Week 1', value: 280000 },
      { label: 'Week 2', value: 420000 },
      { label: 'Week 3', value: 680000 },
      { label: 'Week 4', value: 940000 },
      { label: 'Week 5', value: 1485200 },
    ],
    '365d': [
      { label: 'Q1 (Launch)', value: 1850000 },
      { label: 'Q2 (Syndicate)', value: 3420000 },
      { label: 'Q3 (Global Keynote)', value: 6890000 },
      { label: 'Q4 (Annual Surge)', value: 14850000 },
    ]
  };

  const chartData = chartPointsByRange[timeRange];
  const maxValue = Math.max(...chartData.map(d => d.value));

  // Pre-calculated default summary while loading
  const summary = analytics?.summary || {
    totalImpressions: 1485200,
    totalEngagements: 96400,
    pressMentions: 28,
    inboundLeads: 1840,
    hoursSaved: 120,
    agencyCostAvoided: '$12,500'
  };

  const channels = analytics?.channels || [
    { name: 'X / Twitter', share: 34, impressions: 510000, growth: '+28.4%' },
    { name: 'LinkedIn', share: 36, impressions: 540000, growth: '+42.1%' },
    { name: 'PR Wire & Syndicates', share: 18, impressions: 270000, growth: '+19.6%' },
    { name: 'Threads / Meta', share: 12, impressions: 165200, growth: '+15.2%' }
  ];

  const geographicReach = analytics?.geographicReach || [
    { country: 'United States', percentage: 42, flag: '🇺🇸' },
    { country: 'United Kingdom', percentage: 18, flag: '🇬🇧' },
    { country: 'Germany & EU', percentage: 16, flag: '🇪🇺' },
    { country: 'Japan & APAC', percentage: 14, flag: '🇯🇵' },
    { country: 'Rest of World', percentage: 10, flag: '🌐' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Performance Analytics & Global Telemetry
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-channel reach, organic engagement, wire syndication, and inbound conversion tracking.
          </p>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start sm:self-auto">
          {(['24h', '7d', '30d', '365d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                timeRange === range
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '365 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Impressions */}
        <div className="glass-card p-4 rounded-xl border border-slate-800 col-span-2 sm:col-span-1 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Impressions</span>
            <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
              +38.4%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-2">
            {summary.totalImpressions.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <Eye className="w-3.5 h-3.5 text-red-400" />
            <span>Across 4 continents & 6 networks</span>
          </div>
        </div>

        {/* Engagements */}
        <div className="glass-card p-4 rounded-xl border border-slate-800 col-span-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Engagements</div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono mt-2">
            {summary.totalEngagements.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">6.5% avg CTR</div>
        </div>

        {/* Press Mentions */}
        <div className="glass-card p-4 rounded-xl border border-slate-800 col-span-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Press Pickups</div>
          <div className="text-xl sm:text-2xl font-black text-red-400 font-mono mt-2">
            {summary.pressMentions}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Global newsrooms</div>
        </div>

        {/* Agency Saved */}
        <div className="glass-card p-4 rounded-xl border border-slate-800 col-span-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Agency Retainer Saved</div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-mono mt-2">
            {summary.agencyCostAvoided}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">vs traditional agency</div>
        </div>

        {/* Hours Saved */}
        <div className="glass-card p-4 rounded-xl border border-slate-800 col-span-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Hours Reclaimed</div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-2">
            {summary.hoursSaved}h
          </div>
          <div className="text-[10px] text-slate-500 mt-1">100% autonomous</div>
        </div>

      </div>

      {/* Main Interactive Chart Section: Impressions & Reach Growth */}
      <div className="glass-panel p-6 rounded-2xl border border-red-950/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span>Global Reach Velocity Curve</span>
            </h2>
            <p className="text-xs text-slate-400">
              Daily and compound visibility growth over the selected timeframe ({timeRange.toUpperCase()}).
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-300">Autopilot Reach</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span className="text-slate-300">Baseline Target</span>
            </div>
          </div>
        </div>

        {/* Custom SVG Area & Line Chart in Glowing Red */}
        <div className="relative w-full h-64 sm:h-72">
          
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradientRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
                <stop offset="80%" stopColor="#ef4444" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75].map((factor, idx) => (
              <line
                key={idx}
                x1="0"
                y1={240 * factor}
                x2="700"
                y2={240 * factor}
                stroke="#1f2430"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}

            {/* Compute SVG Path Points */}
            {(() => {
              const count = chartData.length;
              const points = chartData.map((d, i) => {
                const x = (i / (count - 1)) * 700;
                const y = 220 - (d.value / (maxValue * 1.15)) * 190;
                return { x, y, ...d };
              });

              const dArea = `M ${points[0].x} 240 ` +
                points.map(p => `L ${p.x} ${p.y}`).join(' ') +
                ` L ${points[points.length - 1].x} 240 Z`;

              const dLine = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

              return (
                <>
                  <path d={dArea} fill="url(#chartGradientRed)" />
                  <path d={dLine} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {points.map((p, i) => (
                    <g key={i}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={hoveredPointIndex === i ? 6 : 4}
                        className="fill-slate-950 stroke-red-500 stroke-2 cursor-pointer transition-all duration-150"
                        onMouseEnter={() => setHoveredPointIndex(i)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono mt-3 px-1">
            {chartData.map((d, i) => (
              <div 
                key={i} 
                className={`text-center cursor-pointer transition-colors ${hoveredPointIndex === i ? 'text-red-400 font-bold' : ''}`}
                onMouseEnter={() => setHoveredPointIndex(i)}
                onMouseLeave={() => setHoveredPointIndex(null)}
              >
                <div>{d.label}</div>
                <div className="text-[10px] text-slate-500 font-semibold">{d.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Two Column Section: Channel Breakdown & Global Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Channel Share of Voice */}
        <div className="glass-panel p-6 rounded-2xl border border-red-950/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-red-400" />
              <span>Channel Share of Voice & Velocity</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Real-time</span>
          </div>

          <div className="space-y-4">
            {channels.map((ch, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-200">{ch.name}</span>
                    <span className="text-[10px] text-red-400 font-mono">{ch.growth}</span>
                  </div>
                  <div className="text-slate-400 font-mono">
                    <span className="text-white font-bold">{ch.impressions.toLocaleString()}</span> ({ch.share}%)
                  </div>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      idx === 0 ? 'bg-sky-500' : idx === 1 ? 'bg-blue-600' : idx === 2 ? 'bg-red-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${ch.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Automated cross-platform balancing</span>
            <span className="text-red-400 font-semibold">100% Synced</span>
          </div>
        </div>

        {/* Global Geographic Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-red-950/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Globe className="w-4 h-4 text-rose-400" />
              <span>Global Audience & Syndication Reach</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">4 Continents</span>
          </div>

          <div className="space-y-3.5">
            {geographicReach.map((geo, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5 w-40">
                  <span className="text-base">{geo.flag}</span>
                  <span className="text-slate-300 font-medium">{geo.country}</span>
                </div>

                <div className="flex-1 mx-4">
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full"
                      style={{ width: `${geo.percentage}%` }}
                    />
                  </div>
                </div>

                <span className="text-white font-bold font-mono w-10 text-right">
                  {geo.percentage}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Wire syndication indexing in local media</span>
            <span className="text-rose-400 font-semibold">Global PR Enabled</span>
          </div>
        </div>

      </div>

      {/* Live Autopilot Execution Log Stream */}
      <div className="glass-panel p-6 rounded-2xl border border-red-950/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-red-500" />
              <span>Live Autopilot Execution & Syndication Stream</span>
            </h3>
            <p className="text-xs text-slate-400">
              Auditable timestamp log of all autonomous dispatches across connected social media and global wire newsrooms.
            </p>
          </div>
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>DISPATCH DAEMON ACTIVE</span>
          </span>
        </div>

        <div className="space-y-2.5">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {log.timestamp}
                </span>
                <span className="font-semibold text-slate-200">
                  {log.title}
                </span>
              </div>

              <div className="flex items-center space-x-4 self-end sm:self-auto">
                <span className="text-[11px] text-slate-400 font-medium">
                  {log.channel}
                </span>
                <span className="text-[11px] font-mono text-red-400">
                  +{log.reach.toLocaleString()} reach
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
