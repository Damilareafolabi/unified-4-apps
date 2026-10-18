import React, { useState } from 'react';
import { 
  Rocket, 
  Sparkles, 
  Globe2, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ChevronRight,
  ShieldCheck,
  Send,
  Newspaper,
  Twitter,
  Linkedin,
  Flame,
  Radio,
  Cpu,
  HelpCircle,
  Play,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MarketingSiteProps {
  onLaunchDashboard: () => void;
  onOpenPitch: (businessName: string) => void;
}

export const MarketingSite: React.FC<MarketingSiteProps> = ({
  onLaunchDashboard,
  onOpenPitch
}) => {
  // Interactive Live Pitch State
  const [pitchName, setPitchName] = useState('OmniPulse Global');
  const [pitchCategory, setPitchCategory] = useState('Enterprise SaaS & AI Agents');
  const [pitchLoading, setPitchLoading] = useState(false);
  const [pitchAngles, setPitchAngles] = useState<Array<{ platform: string; type: string; text: string }>>([
    {
      platform: 'X / Twitter',
      type: 'Viral Contrarian Hook',
      text: 'Most B2B SaaS companies burn $20k/mo on ads that stop working when payments stop. Here is how OmniPulse Global automated 1.4M organic impressions 365 days a year with our autonomous red robot engine:'
    },
    {
      platform: 'PR Newswire',
      type: 'Global Press Release Wire',
      text: 'FOR IMMEDIATE RELEASE: OmniPulse Global Deploys Autonomous 365 Marketing Infrastructure to Slashes Enterprise Customer Acquisition Costs Across 4 Continents.'
    },
    {
      platform: 'LinkedIn Authority',
      type: 'Executive Thought Leadership',
      text: 'The best founders in 2026 are not writing tweets at 11 PM. They let an autonomous marketing engine pull their business into the global spotlight while they build product.'
    }
  ]);

  // ROI Calculator State
  const [monthlySpend, setMonthlySpend] = useState<number>(8000);
  const [weeklyHours, setWeeklyHours] = useState<number>(18);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Trigger Instant Live Pitch from API
  const handleGeneratePitch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchName) return;
    setPitchLoading(true);
    try {
      const res = await fetch('/api/instant-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessName: pitchName, category: pitchCategory })
      });
      const data = await res.json();
      if (data.angles && data.angles.length > 0) {
        setPitchAngles(data.angles);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error getting instant pitch:', err);
    } finally {
      setPitchLoading(false);
    }
  };

  // Calculations for ROI
  const annualAgencyCost = monthlySpend * 12;
  const lazyCeoCost = 199 * 12; // $2,388/year
  const annualSavings = Math.max(0, annualAgencyCost - lazyCeoCost);
  const annualHoursSaved = weeklyHours * 50;

  return (
    <div className="relative overflow-hidden bg-[#06070a] text-slate-100">
      
      {/* Background ambient red radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-red-600/25 via-rose-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[750px] -left-40 w-96 h-96 bg-red-600/15 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[1700px] -right-40 w-96 h-96 bg-rose-600/15 blur-[130px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-500/15 via-rose-500/10 to-red-500/15 border border-red-500/35 text-red-400 backdrop-blur-md shadow-lg shadow-red-500/10">
            <Bot className="w-4 h-4 animate-pulse text-red-400" />
            <span>Autonomous 365 Marketing • Pulling Your Business to Exponential Growth</span>
            <span className="text-red-700">|</span>
            <span className="text-slate-300">Daily • Weekly • Monthly • Yearly</span>
          </div>
        </div>

        {/* Hero Grid with Visual Asset: Red Robot Pulling Business */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-6">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
              The Red Robot <br />
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent neon-text-red">
                Pulling Your Business
              </span> <br />
              To Global Fame.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
              Stop wasting hundreds of hours manual marketing. <strong className="text-white font-semibold">LazyCEO</strong> runs an unstoppable autonomous engine that automarkets, syndicates press releases, and commands social media 365 days a year on complete autopilot.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onLaunchDashboard}
                className="flex items-center justify-center space-x-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-extrabold px-8 py-4 rounded-xl text-base shadow-xl shadow-red-600/35 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Rocket className="w-5 h-5 text-white" />
                <span>Launch 365 Dashboard Now</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>

              <a
                href="#live-demo"
                className="flex items-center justify-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-4 rounded-xl text-base border border-red-950/80 transition-all hover:border-red-500/40"
              >
                <Sparkles className="w-4 h-4 text-red-400" />
                <span>Test Live AI Pitch</span>
              </a>
            </div>

            {/* Quick Live Proof Badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-red-950/60 max-w-lg">
              <div className="glass-card p-3 rounded-xl border border-slate-800">
                <div className="text-lg sm:text-xl font-extrabold text-white">365 Days</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Non-Stop Engine</div>
              </div>
              <div className="glass-card p-3 rounded-xl border border-slate-800">
                <div className="text-lg sm:text-xl font-extrabold text-red-400">450+</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Wire Outlets</div>
              </div>
              <div className="glass-card p-3 rounded-xl border border-slate-800">
                <div className="text-lg sm:text-xl font-extrabold text-rose-300">14.8M+</div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Audience Reach</div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card: The Red Robot Pulling Business */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-2xl shadow-red-600/20 group">
              
              {/* Image Asset */}
              <img 
                src="/src/assets/images/red_robot_mascot_1792157107008.jpg" 
                alt="LazyCEO Red Robot Pulling Business to Exponential Growth" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Glowing overlay caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-600/90 text-white w-max shadow-md">
                  <Flame className="w-3.5 h-3.5" />
                  <span>The Red Robot Advantage</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-white mt-2 leading-snug drop-shadow-md">
                  Accelerating founders, executive teams, and startups forward while automating 100% of global marketing.
                </p>
              </div>

            </div>

            {/* Floating Telemetry Badge */}
            <div className="hidden sm:flex absolute -bottom-5 -left-5 glass-panel p-3.5 rounded-xl border border-red-500/40 shadow-xl items-center space-x-3 bg-slate-950/90">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Full-Stack Cloud Persistence</div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Firebase Firestore Synced</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Global Media Ticker */}
        <div className="mt-16 pt-8 border-t border-red-950/60">
          <p className="text-center text-xs font-bold tracking-wider uppercase text-red-400/80 mb-6">
            Autonomous Syndication Endpoints & Global Newsroom Distribution
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-400 font-semibold text-xs sm:text-sm">
            <div className="flex items-center space-x-1.5"><Newspaper className="w-4 h-4 text-red-500" /><span className="text-slate-300">PR NEWSWIRE</span></div>
            <div className="flex items-center space-x-1.5"><Globe2 className="w-4 h-4 text-rose-500" /><span className="text-slate-300">BLOOMBERG WIRE</span></div>
            <div className="flex items-center space-x-1.5"><TrendingUp className="w-4 h-4 text-red-400" /><span className="text-slate-300">YAHOO FINANCE</span></div>
            <div className="flex items-center space-x-1.5"><Twitter className="w-4 h-4 text-sky-400" /><span className="text-slate-300">X (TWITTER) VIRAL</span></div>
            <div className="flex items-center space-x-1.5"><Linkedin className="w-4 h-4 text-blue-400" /><span className="text-slate-300">LINKEDIN PULSE</span></div>
            <div className="flex items-center space-x-1.5"><Zap className="w-4 h-4 text-amber-400" /><span className="text-slate-300">TECH MEDIA DESKS</span></div>
          </div>
        </div>

      </section>

      {/* Interactive Live Demo Widget Section */}
      <section id="live-demo" className="py-16 bg-slate-900/30 border-y border-red-950/60 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest text-red-400 uppercase">Live AI Publicity Engine</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Test Run the Red Robot on Your Business
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
              Type your company name and niche to watch the autonomous AI engine generate instant viral publicity hooks engineered to command attention.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-red-500/30 shadow-2xl relative">
            <div className="absolute top-3 right-4 flex items-center space-x-1.5 text-[11px] text-red-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>GEMINI 3.8 FLASH ENGINE</span>
            </div>

            <form onSubmit={handleGeneratePitch} className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Business Name</label>
                <input
                  type="text"
                  value={pitchName}
                  onChange={(e) => setPitchName(e.target.value)}
                  placeholder="e.g. ApexGrowth AI"
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Industry / Category</label>
                <input
                  type="text"
                  value={pitchCategory}
                  onChange={(e) => setPitchCategory(e.target.value)}
                  placeholder="e.g. B2B FinTech or E-commerce"
                  className="w-full bg-slate-950/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="sm:col-span-1 flex items-end">
                <button
                  type="submit"
                  disabled={pitchLoading}
                  className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-all shadow-md shadow-red-500/20 disabled:opacity-60"
                >
                  <Sparkles className={`w-4 h-4 ${pitchLoading ? 'animate-spin' : ''}`} />
                  <span>{pitchLoading ? 'Pulling...' : 'Generate'}</span>
                </button>
              </div>
            </form>

            {/* Generated Angle Previews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pitchAngles.map((angle, idx) => (
                <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-red-500/50 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        {angle.platform}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {angle.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      "{angle.text}"
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ready to Auto-Dispatch</span>
                    </span>
                    <button 
                      onClick={onLaunchDashboard}
                      className="text-red-400 hover:text-red-300 font-bold flex items-center space-x-0.5"
                    >
                      <span>Deploy</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400 gap-3">
              <span>This is 1% of the 365 Autopilot capability. Full engine produces complete daily, weekly, monthly & yearly matrices.</span>
              <button
                onClick={onLaunchDashboard}
                className="text-red-400 hover:text-red-300 font-bold flex items-center space-x-1"
              >
                <span>Open Full Autopilot Engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* The 365 Cadence Breakdown Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-red-400 uppercase">The 365 Autopilot Engine</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Non-Stop Global Publicity Across All 4 Cadences
          </h2>
          <p className="text-slate-300 mt-4 text-base sm:text-lg">
            Traditional agencies stop working after 5 PM. The LazyCEO red robot operates 24/7/365, ensuring your business stays top-of-mind worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Daily Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-red-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Cadence 01</span>
              <h3 className="text-xl font-bold text-white mt-1">Daily Micro-Distribution</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                3x daily high-velocity viral hooks, contrarian insights, and trend-jacking posts across X, Threads, and LinkedIn timed to executive attention windows.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>3x Daily Multi-Platform Drops</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Algorithmic engagement hooks</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Automated hashtag & tag mapping</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
              365 drops / year
            </div>
          </div>

          {/* Weekly Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-rose-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Cadence 02</span>
              <h3 className="text-xl font-bold text-white mt-1">Weekly Deep-Dives</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                Authoritative executive newsletters, LinkedIn Pulse essays, and technical thought leadership establishing your company as the category authority.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>1,200+ word executive op-eds</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Substack & LinkedIn syndication</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Founder personal brand building</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
              52 long-form assets / year
            </div>
          </div>

          {/* Monthly Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-red-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold mb-4">
                <Newspaper className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Cadence 03</span>
              <h3 className="text-xl font-bold text-white mt-1">Monthly Wire PR</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                Institutional AP-standard press releases distributed across PR Newswire, Bloomberg, Yahoo Finance, and regional news desks.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>450+ Newsroom syndication</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>SEO authoritative backlink surge</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>Official dateline executive quotes</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
              12 global wire releases / year
            </div>
          </div>

          {/* Yearly Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Cadence 04</span>
              <h3 className="text-xl font-bold text-white mt-1">Yearly Flagship Tentpoles</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                Four massive annual anchor initiatives: Industry Benchmark Whitepapers, Virtual Summits, Award Submissions, and Viral Year-in-Review celebrations.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Q1 State of the Industry Index</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Q2 Virtual Keynote & Demo Day</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Q4 Viral Retrospective Gala</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
              4 major tentpole campaigns
            </div>
          </div>

        </div>
      </section>

      {/* Interactive ROI & Agency Savings Calculator */}
      <section className="py-16 bg-slate-900/30 border-y border-red-950/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold tracking-widest text-red-400 uppercase">Capital & Time Savings</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Calculate What the Red Robot Saves You
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto mt-2">
              Compare traditional $15,000/mo agency retainers against LazyCEO's autonomous 365 cloud infrastructure.
            </p>
          </div>

          <div className="glass-panel p-6 sm:p-10 rounded-2xl border border-red-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders Left */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Current Monthly Marketing / Agency Budget
                  </label>
                  <span className="text-red-400 font-mono font-bold text-sm">
                    ${monthlySpend.toLocaleString()}/mo
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="30000"
                  step="500"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full accent-red-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>$1,000</span>
                  <span>$15,000 (Avg Agency Retainer)</span>
                  <span>$30,000+</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Hours Spent on Content, PR & Social per Week
                  </label>
                  <span className="text-rose-400 font-mono font-bold text-sm">
                    {weeklyHours} Hours / week
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  step="1"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full accent-rose-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>2 hours</span>
                  <span>20 hours (Half your week)</span>
                  <span>40 hours</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p>
                  Backed by enterprise Firestore cloud database sync. Your campaign roadmaps, scheduled queues, and performance analytics persist securely across devices.
                </p>
              </div>
            </div>

            {/* Projected Results Card */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 rounded-xl border border-red-500/40 text-center relative shadow-xl shadow-red-950/40">
              <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">
                Annual Capital Saved
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight my-2">
                ${annualSavings.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Compared to traditional agency retainers + PR fees
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Founder Hours Reclaimed:</span>
                  <span className="text-white font-bold font-mono">{annualHoursSaved.toLocaleString()} hrs / yr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Yearly Content Output:</span>
                  <span className="text-red-400 font-bold">1,200+ Assets (365 Days)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wire Distribution Outlets:</span>
                  <span className="text-rose-400 font-bold">450+ Newsrooms</span>
                </div>
              </div>

              <button
                onClick={onLaunchDashboard}
                className="w-full mt-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-md shadow-red-500/25"
              >
                Claim Your Autopilot System
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-red-400 uppercase">Transparent Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
            Put the Red Robot to Work for You
          </h2>
          <p className="text-slate-400 mt-3 text-base">
            No long contracts. Full 365-day autopilot marketing and global wire publicity included.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1 */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Solo Founder</h3>
              <p className="text-slate-400 text-xs mt-1">For bootstrapped founders needing daily social presence.</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$49</span>
                <span className="text-slate-400 text-xs ml-2">/ month</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>365 Daily Autopilot Posts (X & Threads)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>1x Weekly Long-form LinkedIn Article</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Firebase Cloud Persistence</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onLaunchDashboard}
              className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl text-xs transition-colors"
            >
              Start Free Trial
            </button>
          </div>

          {/* Plan 2: Featured */}
          <div className="relative glass-panel p-8 rounded-2xl border-2 border-red-500 shadow-2xl shadow-red-600/15 flex flex-col justify-between bg-slate-900/95">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              Most Popular • Full 365 Suite
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hyper-Growth 365</h3>
              <p className="text-slate-400 text-xs mt-1">Full autonomous publicity flywheel for scaling businesses.</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-black text-white">$199</span>
                <span className="text-slate-400 text-xs ml-2">/ month</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-slate-200">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="font-semibold text-white">Full 365 Daily / Weekly / Monthly / Yearly Suite</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Omnichannel (X, LinkedIn, Threads, Substack)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>12x Monthly Global PR Wire Releases</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>4x Yearly Flagship Benchmark Campaigns</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Real-time Firebase Cloud Sync & Analytics</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onLaunchDashboard}
              className="mt-8 w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-extrabold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-red-600/30"
            >
              Deploy 365 Red Robot Engine
            </button>
          </div>

          {/* Plan 3 */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Global Syndicate</h3>
              <p className="text-slate-400 text-xs mt-1">Multi-brand & enterprise institutional wire distribution.</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-4xl font-extrabold text-white">$499</span>
                <span className="text-slate-400 text-xs ml-2">/ month</span>
              </div>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Unlimited Brand Entities & Executives</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Custom PR Wire Direct Media Desk Routing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Dedicated Autonomous AI Narrative Model</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onLaunchDashboard}
              className="mt-8 w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl text-xs transition-colors"
            >
              Contact Enterprise Desk
            </button>
          </div>

        </div>
      </section>

      {/* Bottom CTA Banner with Mascot */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border-2 border-red-500/40 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/40 text-center relative overflow-hidden shadow-2xl shadow-red-950/40">
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 p-0.5 shadow-lg shadow-red-600/30 overflow-hidden">
              <img 
                src="/src/assets/images/red_robot_logo_1792157120575.jpg" 
                alt="LazyCEO Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to Let the Red Robot Pull Your Business?
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Join founders across 4 continents running perpetual 365-day publicity with real Firebase cloud persistence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onLaunchDashboard}
                className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold px-8 py-4 rounded-xl text-sm transition-all shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2"
              >
                <Rocket className="w-4 h-4" />
                <span>Launch LazyCEO Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-red-950/60 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <img 
              src="/src/assets/images/red_robot_logo_1792157120575.jpg" 
              alt="Logo" 
              className="w-5 h-5 rounded object-cover" 
            />
            <span className="font-bold text-slate-300">LazyCEO</span>
            <span>— The Red Robot Autonomous Marketing Engine</span>
          </div>
          <div>
            Built with Firebase Firestore & Gemini AI. Daily • Weekly • Monthly • Yearly.
          </div>
        </div>
      </footer>

    </div>
  );
};
