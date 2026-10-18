import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  Globe, 
  Building, 
  ExternalLink, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Zap,
  UserCheck,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  trackGigConnectJobSaved, 
  trackGigConnectApplicationPrepared, 
  trackGigConnectApplicationSubmitted, 
  trackGigConnectInterviewRecorded,
  trackGigConnectSubscriptionStarted
} from '../lib/analytics';

export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Contract' | 'Part-time';
  salaryRange: string;
  currency: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  skills: string[];
  description: string;
  sourceUrl: string;
  verifiedEmployer: boolean;
  matchScore: number;
  matchReason: string;
  postedDate: string;
  isScamRisk?: boolean;
}

const initialJobs: JobVacancy[] = [
  {
    id: 'job-1',
    title: 'Senior Full-Stack TypeScript / React Engineer',
    company: 'CloudScale Global Inc.',
    location: 'Remote (Worldwide)',
    country: 'United States',
    workMode: 'Remote',
    employmentType: 'Full-time',
    salaryRange: '$120,000 - $160,000',
    currency: 'USD',
    experienceLevel: 'Senior',
    skills: ['TypeScript', 'React 19', 'Node.js', 'Firebase', 'Tailwind'],
    description: 'Lead engineering on our high-growth cloud SaaS products. Architect scalable multi-tenant services and high-velocity frontend interfaces.',
    sourceUrl: 'https://careers.cloudscale.global/jobs/101',
    verifiedEmployer: true,
    matchScore: 96,
    matchReason: 'Direct overlap with your TypeScript, React & Firebase verified portfolio.',
    postedDate: '1 day ago'
  },
  {
    id: 'job-2',
    title: 'AI Automation & Prompt Engineer',
    company: 'HyperDrive Systems',
    location: 'London / Hybrid',
    country: 'United Kingdom',
    workMode: 'Hybrid',
    employmentType: 'Full-time',
    salaryRange: '£75,000 - £95,000',
    currency: 'GBP',
    experienceLevel: 'Mid',
    skills: ['Google Gemini API', 'Python', 'LLM Grounding', 'Express', 'LangChain'],
    description: 'Design autonomous multi-agent pipelines and search-grounded marketing bots for enterprise customers.',
    sourceUrl: 'https://hyperdrive.tech/careers/ai-lead',
    verifiedEmployer: true,
    matchScore: 92,
    matchReason: 'Matches your Gemini AI & autonomous marketing agent implementations.',
    postedDate: '2 days ago'
  },
  {
    id: 'job-3',
    title: 'Product Growth & Autonomous Marketing Specialist',
    company: 'Apex Media Ventures',
    location: 'Lagos / Remote',
    country: 'Nigeria',
    workMode: 'Remote',
    employmentType: 'Contract',
    salaryRange: '₦1,800,000 - ₦2,500,000 / mo',
    currency: 'NGN',
    experienceLevel: 'Mid',
    skills: ['LazyCEO Autopilot', 'Social Syndication', 'PR Distribution', 'Analytics'],
    description: 'Orchestrate 365-day publicity flywheels, viral short-form distribution, and institutional PR wire releases.',
    sourceUrl: 'https://apexmedia.ng/careers/growth',
    verifiedEmployer: true,
    matchScore: 98,
    matchReason: 'Perfect candidate match with LazyCEO publicity automation competencies.',
    postedDate: '3 hours ago'
  },
  {
    id: 'job-4',
    title: 'PropTech Frontend Architect',
    company: 'PrimeEstates Global',
    location: 'Berlin, Germany',
    country: 'Germany',
    workMode: 'Remote',
    employmentType: 'Full-time',
    salaryRange: '€85,000 - €110,000',
    currency: 'EUR',
    experienceLevel: 'Senior',
    skills: ['Three.js', 'WebGL', '360 Panoramas', 'Vite', 'React'],
    description: 'Build immersive 3D virtual tour spheres and interactive real estate inspection portals for global investors.',
    sourceUrl: 'https://primeestates.de/careers/proptech',
    verifiedEmployer: true,
    matchScore: 89,
    matchReason: 'High relevance to your KeyDirect 360 virtual tour and Three.js implementation.',
    postedDate: 'Just now'
  }
];

export const GigConnectPlatform: React.FC = () => {
  const [jobs] = useState<JobVacancy[]>(initialJobs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkMode, setSelectedWorkMode] = useState('All');
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);
  
  // ResumeForgeAIBuddy Integration State
  const [activeTab, setActiveTab] = useState<'hunter' | 'resumeforge' | 'tracker'>('hunter');
  const [cvTailored, setCvTailored] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<{ id: string; job: JobVacancy; date: string; status: string }[]>([]);

  // Filter Jobs
  const filteredJobs = jobs.filter(j => {
    if (selectedWorkMode !== 'All' && j.workMode !== selectedWorkMode) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q)) ||
        j.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleToggleSaveJob = (job: JobVacancy) => {
    if (savedJobIds.includes(job.id)) {
      setSavedJobIds(savedJobIds.filter(id => id !== job.id));
    } else {
      setSavedJobIds([...savedJobIds, job.id]);
      trackGigConnectJobSaved(job.id, job.title);
      confetti({ particleCount: 20, colors: ['#6366f1', '#ffffff'] });
    }
  };

  const handlePrepareApplication = (job: JobVacancy) => {
    setSelectedJob(job);
    setCvTailored(true);
    trackGigConnectApplicationPrepared(job.id, 'ResumeForge AI v2.4 (Tailored)');
  };

  const handleConfirmSubmitApplication = () => {
    if (!selectedJob) return;
    setApplicationSubmitted(true);
    trackGigConnectApplicationSubmitted(selectedJob.id, selectedJob.company);
    setAppliedJobs(prev => [
      { id: `app-${Date.now()}`, job: selectedJob, date: 'Today', status: 'Submitted & Confirmed' },
      ...prev
    ]);
    confetti({ particleCount: 40, colors: ['#4f46e5', '#10b981', '#ffffff'] });
  };

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 font-sans pb-20">
      
      {/* Platform Hero Banner */}
      <div className="border-b border-indigo-950/60 bg-gradient-to-b from-indigo-950/30 via-transparent to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <Bot className="w-3.5 h-3.5 animate-pulse" />
                <span>Job Pilot Hunter • Integrated with ResumeForgeAIBuddy</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                GIG<span className="text-indigo-400">CONNECT</span> Global Career Pilot
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Autonomous job-search intelligence. Find verified global vacancies, tailor targeted CVs via ResumeForgeAIBuddy, and submit confirmed applications with zero recruiter fees.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-slate-900 border border-indigo-900/40 text-center">
                <div className="text-lg font-black text-indigo-400">{jobs.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Verified Leads</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-indigo-900/40 text-center">
                <div className="text-lg font-black text-emerald-400">96%</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Max AI Match</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-indigo-900/40 text-center">
                <div className="text-lg font-black text-white">{appliedJobs.length}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Submissions</div>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center space-x-2 mt-8 border-t border-slate-800/80 pt-4">
            <button
              onClick={() => setActiveTab('hunter')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'hunter' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Job Pilot Hunter ({filteredJobs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('resumeforge')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'resumeforge' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>ResumeForgeAIBuddy Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                activeTab === 'tracker' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Application Tracker ({appliedJobs.length})</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: JOB PILOT HUNTER */}
        {activeTab === 'hunter' && (
          <div className="space-y-6">
            
            {/* Search and Filters Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search role, skills (TypeScript, Gemini, React), or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-2 w-full md:w-auto">
                {['All', 'Remote', 'Hybrid', 'On-site'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSelectedWorkMode(mode)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedWorkMode === mode 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map(job => {
                const isSaved = savedJobIds.includes(job.id);
                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg group relative"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            {job.workMode} • {job.employmentType}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-indigo-400 transition-colors">
                            {job.title}
                          </h3>
                          <div className="text-xs text-slate-400 flex items-center space-x-2 mt-1">
                            <span className="font-semibold text-slate-300">{job.company}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-400" /> {job.location}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleSaveJob(job)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            isSaved 
                              ? 'bg-indigo-600 border-indigo-500 text-white' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title="Save Vacancy"
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Salary & Match Score Badge */}
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
                        <div className="text-xs font-black text-emerald-400 font-mono">
                          {job.salaryRange}
                        </div>
                        <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
                          <Sparkles className="w-3 h-3" />
                          <span>{job.matchScore}% Match Score</span>
                        </div>
                      </div>

                      {/* AI Match Explanation */}
                      <p className="text-[11px] text-slate-400 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60 leading-relaxed">
                        <strong className="text-indigo-300 font-semibold">AI Match Rationale:</strong> {job.matchReason}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-mono">Posted {job.postedDate}</span>
                      <button
                        onClick={() => handlePrepareApplication(job)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Tailor & Apply</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: RESUMEFORGE AI BUDDY INTEGRATION */}
        {activeTab === 'resumeforge' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-900/40 space-y-6 bg-slate-900/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Partner Integration Hub
                </span>
                <h2 className="text-2xl font-black text-white mt-1">ResumeForgeAIBuddy Suite</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronize your active CV versions, generate tailored executive summaries, and format standard PDF applications.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> API Connected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase">Primary CV Profile</h4>
                <div className="text-sm font-semibold text-indigo-300">Senior Full-Stack & AI Engineer.pdf</div>
                <div className="text-[11px] text-slate-500">Updated today • 4 pages • ATS Score 98/100</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase">Tailored Variant 02</h4>
                <div className="text-sm font-semibold text-emerald-300">Autonomous CMO & Growth Architect.pdf</div>
                <div className="text-[11px] text-slate-500">Optimized for marketing director roles</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white uppercase">Tailored Variant 03</h4>
                <div className="text-sm font-semibold text-amber-300">PropTech 3D Virtual Tour Specialist.pdf</div>
                <div className="text-[11px] text-slate-500">Specialized for Three.js & architectural UI</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/40 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">ResumeForgeAIBuddy Policy:</strong> All AI-generated CV tailoring strictly reflects the candidate’s real credentials and verified deliverables. No false qualifications or fabricated employment history are permitted.
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATION TRACKER */}
        {activeTab === 'tracker' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Application Command Centre</h3>
                <p className="text-xs text-slate-400 mt-0.5">Track verified submission receipts, employer confirmations, and scheduled interview rounds.</p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                {appliedJobs.length} Confirmed Submissions
              </span>
            </div>

            {appliedJobs.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">No applications dispatched yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Use the Job Pilot Hunter to discover opportunities and tailor your CV with ResumeForgeAIBuddy.
                </p>
                <button
                  onClick={() => setActiveTab('hunter')}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Browse Vacancies Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {appliedJobs.map(app => (
                  <div key={app.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{app.job.title}</div>
                      <div className="text-xs text-slate-400">{app.job.company} • {app.job.location}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                        {app.status}
                      </span>
                      <button
                        onClick={() => {
                          trackGigConnectInterviewRecorded(app.job.id, 'Interview Round 1');
                          alert(`Recorded interview invitation for: ${app.job.title}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white"
                      >
                        + Log Interview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* SMART APPLICATION PILOT MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-indigo-900/60 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 text-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Smart Application Pilot</h3>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div>
              <div className="text-xs uppercase font-bold text-indigo-400">{selectedJob.company}</div>
              <h2 className="text-lg font-black text-white mt-0.5">{selectedJob.title}</h2>
              <div className="text-xs text-slate-400 mt-1">{selectedJob.location} • {selectedJob.salaryRange}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>ResumeForgeAIBuddy Tailoring Complete</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Matched 5 core technical competencies: {selectedJob.skills.join(', ')}. ATS keywords verified with 98% pass confidence.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Confirmation Notice:</strong> This application will be submitted directly to the verified employer ({selectedJob.company}). Please confirm review of your materials.
              </span>
            </div>

            <div className="pt-3 flex items-center justify-end space-x-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleConfirmSubmitApplication();
                  setSelectedJob(null);
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Submit Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
