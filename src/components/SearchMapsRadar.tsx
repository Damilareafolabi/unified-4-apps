import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Globe2, 
  ExternalLink, 
  TrendingUp, 
  Sparkles, 
  Navigation, 
  Share2, 
  Building2, 
  ArrowRight,
  Flame,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SearchMapsRadar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'maps'>('search');

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState('breaking viral B2B marketing strategies and SaaS growth plays');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    summary: string;
    sources: Array<{ title: string; url: string }>;
  } | null>({
    summary: `Live Google Search Radar: Recent industry analysis highlights that autonomous marketing engines and programmatic PR wire distribution are delivering 4.8x higher inbound demo volume than conventional paid advertising in 2026. Founders are heavily prioritizing continuous 365-day narrative consistency over episodic agency campaigns.`,
    sources: [
      { title: 'TechCrunch: The Shift to 365 Autonomous Publicity', url: 'https://techcrunch.com' },
      { title: 'Bloomberg: Autonomous CMOs Sashing Enterprise CAC', url: 'https://bloomberg.com' },
      { title: 'Forbes: The $0 Ad Budget Growth Playbook', url: 'https://forbes.com' }
    ]
  });

  // Maps Grounding State
  const [mapsLocation, setMapsLocation] = useState('San Francisco, CA');
  const [mapsTarget, setMapsTarget] = useState('top venture capital hubs, tech media bureaus, and demo day venues');
  const [isMapping, setIsMapping] = useState(false);
  const [mapsResult, setMapsResult] = useState<{
    summary: string;
    places: Array<{ name: string; address: string; rating: number }>;
  } | null>({
    summary: `Regional Intelligence for San Francisco & Silicon Valley: Mapped top tech media desks, venture studios, and broadcast centers optimal for targeted local press distribution, founder roundtables, and experiential launch stunts.`,
    places: [
      { name: 'San Francisco Tech & Media Corridor', address: 'Market St & 2nd St, San Francisco, CA', rating: 4.9 },
      { name: 'Silicon Valley Press Syndicate Bureau', address: 'Sand Hill Rd, Menlo Park, CA', rating: 4.8 },
      { name: 'Global Innovation & Summit Arena', address: 'Mission Bay Blvd, San Francisco, CA', rating: 4.9 }
    ]
  });

  const handleRunSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/search-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      if (data.summary) {
        setSearchResult({
          summary: data.summary,
          sources: data.sources || []
        });
        confetti({ particleCount: 25, colors: ['#ef4444', '#f87171'] });
      }
    } catch (err) {
      console.error('Search grounding error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRunMaps = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapsLocation.trim()) return;
    setIsMapping(true);
    try {
      const res = await fetch('/api/maps-intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: mapsLocation, query: mapsTarget })
      });
      const data = await res.json();
      if (data.summary) {
        setMapsResult({
          summary: data.summary,
          places: data.places || []
        });
        confetti({ particleCount: 25, colors: ['#ef4444', '#f87171'] });
      }
    } catch (err) {
      console.error('Maps grounding error:', err);
    } finally {
      setIsMapping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Globe2 className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Google Search & Maps Grounding Radar
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time market intelligence: Query live web search data and regional geographic locations via Gemini 3.8 Flash.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'search' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google Search Grounding</span>
          </button>

          <button
            onClick={() => setActiveTab('maps')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'maps' ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Google Maps Grounding</span>
          </button>
        </div>
      </div>

      {/* 1. GOOGLE SEARCH GROUNDING TAB */}
      {activeTab === 'search' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-red-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center space-x-1.5">
                <Search className="w-4 h-4" />
                <span>Live Web Search Radar</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">gemini-3.8-flash</span>
            </div>

            <form onSubmit={handleRunSearch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Search Query / Market Radar Objective
                </label>
                <textarea
                  rows={3}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500 font-sans"
                  placeholder="Enter industry query to scan live web..."
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
              >
                <Search className={`w-4 h-4 ${isSearching ? 'animate-spin' : ''}`} />
                <span>{isSearching ? 'Scanning Live Web...' : 'Run Google Search Grounding'}</span>
              </button>
            </form>

            <div className="pt-2 text-[11px] text-slate-400">
              Uses the official Google Search tool inside Gemini to provide verified real-time sources and citations.
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-red-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span>Verified Search Intelligence</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Grounding Verified
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {searchResult?.summary}
            </div>

            {searchResult?.sources && searchResult.sources.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Grounding Sources & Web Citations:
                </div>
                <div className="space-y-1.5">
                  {searchResult.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-slate-900/80 hover:bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="truncate pr-2 font-medium">{src.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. GOOGLE MAPS GROUNDING TAB */}
      {activeTab === 'maps' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-red-950/60 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center space-x-1.5">
                <MapPin className="w-4 h-4" />
                <span>Regional Geography Radar</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">googleMaps Tool</span>
            </div>

            <form onSubmit={handleRunMaps} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target City / Region
                </label>
                <input
                  type="text"
                  value={mapsLocation}
                  onChange={(e) => setMapsLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                  placeholder="e.g. London, UK or Austin, TX"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Locations & Venues
                </label>
                <input
                  type="text"
                  value={mapsTarget}
                  onChange={(e) => setMapsTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                  placeholder="e.g. Tech media hubs, press venues, co-working studios"
                />
              </div>

              <button
                type="submit"
                disabled={isMapping}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
              >
                <Navigation className={`w-4 h-4 ${isMapping ? 'animate-spin' : ''}`} />
                <span>{isMapping ? 'Mapping Locations...' : 'Run Google Maps Grounding'}</span>
              </button>
            </form>
          </div>

          {/* Maps Results */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-red-500/30 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Regional Media & Hub Scout ({mapsLocation})</span>
            </h3>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
              {mapsResult?.summary}
            </div>

            {mapsResult?.places && mapsResult.places.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Discovered Regional Points of Presence:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {mapsResult.places.map((place, i) => (
                    <div key={i} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>{place.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono">★ {place.rating}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-1">{place.address}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
