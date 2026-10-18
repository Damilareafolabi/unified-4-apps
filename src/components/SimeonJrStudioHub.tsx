import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Zap, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Send, 
  DollarSign, 
  Star, 
  ShieldCheck, 
  MessageSquare, 
  Layers, 
  ExternalLink, 
  Copy, 
  Plus, 
  Flame, 
  Cpu, 
  UserCheck, 
  ThumbsUp, 
  Share2, 
  FileText, 
  X, 
  Sliders, 
  Rocket, 
  Globe2, 
  ArrowRight,
  TrendingUp,
  MapPin,
  Bot,
  Search,
  Heart,
  Edit3,
  Award,
  Filter,
  Check,
  RefreshCw
} from 'lucide-react';
import { 
  StudioGig, 
  StudioJob, 
  StudioProposal, 
  StudioActivityPost, 
  GigPackageTier,
  initialStudioGigs, 
  initialStudioJobs, 
  initialStudioProposals, 
  simeonJrProfile, 
  initialStudioActivity, 
  marketingKit 
} from '../data/studioData';
import confetti from 'canvas-confetti';

interface SimeonJrStudioHubProps {
  onPromoteWithLazyCEO?: (gigOrService: any) => void;
  onSaveJobToFirestore?: (job: StudioJob) => void;
  onSaveProposalToFirestore?: (proposal: StudioProposal) => void;
  onSaveGigToFirestore?: (gig: StudioGig) => void;
  onSendMessageToFirestore?: (msg: any) => void;
  userUid?: string;
  brandName?: string;
  onUpdateBrandName?: (name: string) => void;
}

export function SimeonJrStudioHub({
  onPromoteWithLazyCEO,
  onSaveJobToFirestore,
  onSaveProposalToFirestore,
  onSaveGigToFirestore,
  onSendMessageToFirestore,
  userUid = 'demo-user',
  brandName: initialBrandProp,
  onUpdateBrandName
}: SimeonJrStudioHubProps) {
  // Customizable Platform Brand Name (NOT hardcoded, persisted in localStorage)
  const [brandName, setBrandName] = useState<string>(() => {
    return initialBrandProp || localStorage.getItem('studio_custom_brand_name') || 'SimeonJr Studio Hub';
  });
  const [isEditingBrand, setIsEditingBrand] = useState<boolean>(false);
  const [tempBrandName, setTempBrandName] = useState<string>(brandName);

  // Sync when prop changes
  useEffect(() => {
    if (initialBrandProp && initialBrandProp !== brandName) {
      setBrandName(initialBrandProp);
      setTempBrandName(initialBrandProp);
    }
  }, [initialBrandProp]);

  // Navigation
  const [activeTab, setActiveTab] = useState<'gigs' | 'jobs' | 'profile' | 'ai' | 'marketing-kit' | 'chat'>('gigs');
  
  // Data State
  const [gigs, setGigs] = useState<StudioGig[]>(initialStudioGigs);
  const [jobs, setJobs] = useState<StudioJob[]>(initialStudioJobs);
  const [proposals, setProposals] = useState<StudioProposal[]>(initialStudioProposals);
  const [activity, setActivity] = useState<StudioActivityPost[]>(initialStudioActivity);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoriteGigIds, setFavoriteGigIds] = useState<string[]>([]);

  // Modals & Package Selection
  const [orderModalGig, setOrderModalGig] = useState<StudioGig | null>(null);
  const [selectedPackageTier, setSelectedPackageTier] = useState<'Basic' | 'Standard' | 'Premium'>('Standard');
  const [proposalModalJob, setProposalModalJob] = useState<StudioJob | null>(null);
  const [postJobModalOpen, setPostJobModalOpen] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // AI Superpowers state
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [generatedProposalText, setGeneratedProposalText] = useState<string>('');
  const [bidAmount, setBidAmount] = useState<number>(1200);
  const [estimatedDays, setEstimatedDays] = useState<number>(3);

  // Estimator form state
  const [estimatorType, setEstimatorType] = useState<string>('Full-Stack Web App with AI');
  const [estimatorScope, setEstimatorScope] = useState<string>('Need an end-to-end web app with Google Auth, real-time Firestore database, and interactive AI chat.');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Firebase Auth', 'Firestore Database', 'Gemini AI API', 'Responsive UI']);
  const [urgencyLevel, setUrgencyLevel] = useState<string>('Rush (48 Hours)');
  const [estimationResult, setEstimationResult] = useState<any>(null);

  // Direct Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; text: string; time: string }>>([
    {
      id: 'm-1',
      sender: 'Lead Developer',
      text: 'Hey! Welcome to our freelance studio. We clone rapid engineering workflows to ship complete web apps in 48 hours. What project are you looking to architect today?',
      time: '10:00 AM'
    }
  ]);
  const [inputMsg, setInputMsg] = useState<string>('');

  // Persist brand name when changed
  const handleSaveBrandName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempBrandName.trim()) {
      const sanitized = tempBrandName.trim();
      setBrandName(sanitized);
      localStorage.setItem('studio_custom_brand_name', sanitized);
      if (onUpdateBrandName) {
        onUpdateBrandName(sanitized);
      }
      setIsEditingBrand(false);
      confetti({ particleCount: 35, colors: ['#1dbf73', '#ffffff'] });
    }
  };

  // Helper copy function
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Toggle Favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favoriteGigIds.includes(id)) {
      setFavoriteGigIds(favoriteGigIds.filter(f => f !== id));
    } else {
      setFavoriteGigIds([...favoriteGigIds, id]);
      confetti({ particleCount: 15, colors: ['#1dbf73'] });
    }
  };

  // Filter Gigs
  const filteredGigs = gigs.filter(g => {
    const matchesCat = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesQuery = searchQuery === '' || 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  // Generate AI Proposal
  const handleGenerateAiProposal = async (job: StudioJob) => {
    setAiGenerating(true);
    try {
      const res = await fetch('/api/studio/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          jobDescription: job.description,
          clientName: job.clientName,
          budget: job.budgetUSD,
          skillsRequired: job.skillsRequired
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedProposalText(data.coverLetter);
        setBidAmount(data.bidAmountUSD || job.budgetUSD);
        setEstimatedDays(data.estimatedDays || 3);
        confetti({ particleCount: 30, colors: ['#1dbf73', '#ffffff'] });
      }
    } catch (err) {
      console.error('Proposal error:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  // Run AI Project Estimator
  const handleRunEstimator = async () => {
    setAiGenerating(true);
    try {
      const res = await fetch('/api/studio/estimate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType: estimatorType,
          scopeDetails: estimatorScope,
          selectedFeatures,
          urgency: urgencyLevel
        })
      });
      const data = await res.json();
      if (data.success) {
        setEstimationResult(data);
        confetti({ particleCount: 45, colors: ['#1dbf73', '#f59e0b', '#3b82f6'] });
      }
    } catch (err) {
      console.error('Estimator error:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  // Submit Proposal
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalModalJob) return;

    const newProposal: StudioProposal = {
      id: `prop-${Date.now()}`,
      jobId: proposalModalJob.id,
      freelancerName: `${brandName} (Verified Lead)`,
      bidAmountUSD: bidAmount,
      estimatedDays,
      coverLetter: generatedProposalText,
      aiGenerated: true,
      milestones: [
        { title: 'Phase 1: DB & Architecture', amountUSD: Math.round(bidAmount * 0.4), deliveryDays: 1 },
        { title: 'Phase 2: Core Features & AI', amountUSD: Math.round(bidAmount * 0.4), deliveryDays: Math.max(1, estimatedDays - 2) },
        { title: 'Phase 3: QA & Live Launch', amountUSD: Math.round(bidAmount * 0.2), deliveryDays: 1 }
      ],
      status: 'submitted',
      createdAt: 'Just Now'
    };

    setProposals([newProposal, ...proposals]);
    if (onSaveProposalToFirestore) {
      onSaveProposalToFirestore(newProposal);
    }

    setJobs(jobs.map(j => j.id === proposalModalJob.id ? { ...j, proposalsCount: j.proposalsCount + 1 } : j));
    setProposalModalJob(null);
    confetti({ particleCount: 50, colors: ['#1dbf73', '#3b82f6', '#ffffff'] });
  };

  // Send Direct Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'Client',
      text: inputMsg,
      time: 'Just now'
    };

    setChatMessages(prev => [...prev, userMessage]);
    if (onSendMessageToFirestore) {
      onSendMessageToFirestore(userMessage);
    }

    const clientQuery = inputMsg;
    setInputMsg('');

    setTimeout(() => {
      const response = {
        id: `msg-${Date.now() + 1}`,
        sender: `${brandName} (Online)`,
        text: `Thanks for reaching out! Regarding "${clientQuery.slice(0, 45)}...", we can build and ship this turnkey in 48-72 hours with React 19, Firebase, and Gemini AI. Check our package tiers or let us know your milestone requirements!`,
        time: 'Just now'
      };
      setChatMessages(prev => [...prev, response]);
      if (onSendMessageToFirestore) {
        onSendMessageToFirestore(response);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-sans pb-24">
      
      {/* ======================================================== */}
      {/* FIVERR TOP BRANDING & MARKETPLACE SUB-HEADER */}
      {/* ======================================================== */}
      <div className="bg-[#0f1422] border-b border-slate-800/80 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Dynamic Brand Name (Configurable & NOT hardcoded) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1dbf73] via-emerald-600 to-teal-700 p-0.5 shadow-lg shadow-emerald-950/40">
              <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                <Award className="w-5 h-5 text-[#1dbf73]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                  {brandName}
                  <button
                    onClick={() => {
                      setTempBrandName(brandName);
                      setIsEditingBrand(true);
                    }}
                    title="Customize platform brand name"
                    className="p-1 rounded-md text-slate-400 hover:text-[#1dbf73] hover:bg-slate-800/80 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </h1>

                <span className="px-2 py-0.5 rounded bg-black/60 border border-[#1dbf73]/50 text-[#1dbf73] text-[10px] font-black uppercase tracking-wider">
                  Pro Verified
                </span>
              </div>

              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online in Lagos 🇳🇬
                </span>
                <span className="text-slate-600">•</span>
                <span>Verified Pro Marketplace</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">48h Delivery</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {onPromoteWithLazyCEO && (
              <button
                onClick={() => onPromoteWithLazyCEO({
                  name: brandName,
                  tagline: 'Turnkey full-stack web applications & AI bots in 48 hours.',
                  industry: 'Freelance Marketplace & Rapid Full-Stack Development',
                  audience: 'Global Founders, Startup CTOs, Business Owners',
                  tone: 'Professional, High-Velocity, ROI-Focused',
                  targetGeo: 'United States, United Kingdom, Nigeria, Europe, Global',
                  valueProp: 'Turnkey 48h MVP development using React 19, Firebase Auth & Firestore, Gemini AI. Save 80% vs 5-person agencies.',
                  website: 'https://studio.hub',
                  foundedYear: '2026'
                })}
                className="px-3.5 py-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Rocket className="w-3.5 h-3.5 text-red-500" />
                Market with LazyCEO (Red Engine)
              </button>
            )}

            <button
              onClick={() => setActiveTab('chat')}
              className="px-4 py-1.5 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Contact Seller
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FIVERR TOP CATEGORY RIBBON NAVIGATION */}
      {/* ======================================================== */}
      <div className="bg-[#0b0e17] border-b border-slate-800/80 px-4 sm:px-8 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 text-xs whitespace-nowrap">
          <div className="flex items-center gap-6 text-slate-300 font-medium">
            {[
              { id: 'All', label: 'All Services' },
              { id: 'Programming & Tech', label: '💻 Programming & Tech' },
              { id: 'AI Services & Agents', label: '🤖 AI Services & Agents' },
              { id: 'Firebase Backend', label: '🛡️ Firebase Backend' },
              { id: 'UI/UX & SaaS', label: '🎨 UI/UX & SaaS' },
              { id: 'Digital Marketing', label: '📈 Digital Marketing' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-1 transition-all border-b-2 cursor-pointer ${
                  selectedCategory === cat.id 
                    ? 'text-[#1dbf73] border-[#1dbf73] font-bold' 
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPostJobModalOpen(true)}
            className="text-xs font-bold text-[#1dbf73] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Post a Project Brief
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* FIVERR HERO SEARCH & DISCOVERY BANNER */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0e1320] via-[#090c14] to-[#07080d] border-b border-slate-800 px-4 sm:px-8 py-10">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[#1dbf73] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Turnkey Services Delivered in 48 Hours with Production Code
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Find the right <span className="text-[#1dbf73]">freelance service</span>, right now
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Browse pre-packaged gigs with transparent 3-tier packages, post project briefs with Gemini AI proposals, or chat directly with certified full-stack engineers.
          </p>

          {/* Fiverr Iconic Search Bar */}
          <div className="max-w-2xl mx-auto mt-6">
            <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl focus-within:border-[#1dbf73] transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for any service (e.g. React 19, Voice AI, Firebase Backend, Marketplace)..."
                className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-white mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {}}
                className="px-5 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
              >
                Search
              </button>
            </div>

            {/* Popular Tags */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Popular:</span>
              {['React 19', 'Gemini 2.5', 'Firebase Auth', 'Rapid 48h MVP', 'PropTech Clone'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="sticky top-14 z-30 bg-[#0a0d14]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto no-scrollbar gap-2 py-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('gigs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'gigs' 
                  ? 'bg-[#1dbf73] text-white shadow-md shadow-emerald-950/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Turnkey Gigs Catalog
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{gigs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'jobs' 
                  ? 'bg-[#1dbf73] text-white shadow-md shadow-emerald-950/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Project Briefs & Jobs
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">{jobs.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-[#1dbf73] text-white shadow-md shadow-emerald-950/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Seller Profile & Feed
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'ai' 
                  ? 'bg-[#1dbf73] text-white shadow-md shadow-emerald-950/40' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Superpowers Suite
            </button>

            <button
              onClick={() => setActiveTab('marketing-kit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'marketing-kit' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Viral Marketing Kit & Cold DMs
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'chat' 
                  ? 'bg-[#1dbf73] text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Inbox & Chat
            </button>
          </div>

          <button
            onClick={() => setPostJobModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#1dbf73]" />
            Post a Request
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">

        {/* ======================================================== */}
        {/* 1. FIVERR-STYLE GIGS CATALOG (ICONIC FIVERR CARDS) */}
        {/* ======================================================== */}
        {activeTab === 'gigs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#1dbf73]" />
                Explore Turnkey Services in {selectedCategory}
              </h3>
              <span className="text-xs text-slate-400">{filteredGigs.length} services available</span>
            </div>

            {/* Gigs Grid (Fiverr Card Architecture) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGigs.map(gig => (
                <div 
                  key={gig.id}
                  onClick={() => {
                    setOrderModalGig(gig);
                    setSelectedPackageTier('Standard');
                  }}
                  className="rounded-2xl bg-[#0f131f] border border-slate-800 hover:border-[#1dbf73] flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/30 group cursor-pointer"
                >
                  <div>
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                      <img 
                        src={gig.coverImage} 
                        alt={gig.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        {gig.sellerLevel === 'Pro Verified' ? (
                          <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-[#1dbf73] text-[#1dbf73] text-[10px] font-black uppercase tracking-wider shadow-md">
                            Pro Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-amber-300 text-[10px] font-bold border border-amber-500/30">
                            {gig.sellerLevel}
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(gig.id, e)}
                        className={`absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md transition-colors cursor-pointer ${
                          favoriteGigIds.includes(gig.id) ? 'text-rose-500' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favoriteGigIds.includes(gig.id) ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Seller Row */}
                    <div className="p-4 pb-2 flex items-center gap-2.5">
                      <img 
                        src={gig.sellerAvatar} 
                        alt={gig.sellerName} 
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-[#1dbf73]"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{gig.sellerName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">• {gig.sellerLevel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Gig Title */}
                    <div className="px-4 pb-3">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-[#1dbf73] transition-colors line-clamp-2 leading-snug">
                        {gig.title}
                      </h4>
                    </div>

                    {/* Rating Row */}
                    <div className="px-4 pb-3 flex items-center gap-1.5 text-xs">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-white">{gig.rating}</span>
                      <span className="text-slate-400">({gig.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Footer with Starting Price */}
                  <div className="p-4 pt-3 border-t border-slate-800/80 bg-[#0c101a] flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Starting at
                    </span>
                    <div className="text-right">
                      <div className="text-base font-black text-white">
                        ${gig.priceUSD}
                      </div>
                      <span className="text-[10px] text-slate-400">₦{gig.priceNGN.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. UPWORK / FIVERR PROJECT BRIEFS (JOB BOARD) */}
        {/* ======================================================== */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#1dbf73]" />
                  Active Project Briefs & Job Requests
                </h3>
                <p className="text-xs text-slate-400">Submit proposals with instant AI assistance or post new client briefs</p>
              </div>

              <button
                onClick={() => setPostJobModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Post a Project Request
              </button>
            </div>

            <div className="space-y-4">
              {jobs.map(job => (
                <div 
                  key={job.id}
                  className="rounded-2xl bg-[#0f131f] border border-slate-800 hover:border-slate-700 p-6 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-semibold text-slate-300">{job.clientCompany || job.clientName}</span>
                        <span>•</span>
                        <span>{job.clientLocation}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-medium">{job.postedTime}</span>
                        {job.verifiedPayment && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" /> Verified Payment
                          </span>
                        )}
                      </div>
                      <h4 className="mt-1 text-base sm:text-lg font-bold text-white hover:text-[#1dbf73] transition-colors">
                        {job.title}
                      </h4>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-lg font-black text-white">
                        ${job.budgetUSD}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{job.budgetType} Budget</span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-1.5">
                      {job.skillsRequired.map(skill => (
                        <span key={skill} className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-xs text-slate-300">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-medium">
                        Proposals: <strong className="text-white">{job.proposalsCount}</strong>
                      </span>

                      <button
                        onClick={() => {
                          setProposalModalJob(job);
                          handleGenerateAiProposal(job);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Send Proposal (AI Draft)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. SELLER CREATOR PROFILE & ACTIVITY FEED */}
        {/* ======================================================== */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl bg-[#0f131f] border border-slate-800 p-6 relative overflow-hidden">
                <div className="h-24 -mx-6 -mt-6 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 border-b border-emerald-500/20" />
                
                <div className="relative -mt-12 flex items-end justify-between">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1dbf73] to-teal-500 p-1 shadow-xl">
                    <img 
                      src={simeonJrProfile.avatar} 
                      alt="Creator" 
                      className="w-full h-full object-cover rounded-[12px]"
                    />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-[#1dbf73] text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Available Now
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-black text-white">{brandName}</h3>
                  <p className="text-xs font-semibold text-[#1dbf73] mt-0.5">{simeonJrProfile.title}</p>
                  <p className="text-xs text-slate-300 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {simeonJrProfile.location}
                  </p>
                </div>

                {/* Fiverr Style Stats Matrix */}
                <div className="mt-5 grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
                  <div>
                    <div className="text-sm font-black text-white">{simeonJrProfile.stats.jobsCompleted}</div>
                    <div className="text-[10px] text-slate-400">Orders Shipped</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-emerald-400">{simeonJrProfile.stats.responseTime}</div>
                    <div className="text-[10px] text-slate-400">Response Time</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-amber-400">{simeonJrProfile.stats.rating} ★</div>
                    <div className="text-[10px] text-slate-400">Order Rating</div>
                  </div>
                </div>

                <div className="mt-5 text-xs text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-800 pt-4">
                  {simeonJrProfile.bioOverview}
                </div>

                {/* Verified Skills */}
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-[#1dbf73]" />
                    Verified Skills & Tests
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {simeonJrProfile.skills.map(s => (
                      <span 
                        key={s.name}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-slate-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#1dbf73]" />
                        {s.name}
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-[#1dbf73] font-bold">{s.level}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Activity Feed */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-4">
                {activity.map(post => (
                  <div key={post.id} className="rounded-2xl bg-[#0f131f] border border-slate-800 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1">
                            {brandName}
                            <span className="text-[10px] text-[#1dbf73] font-semibold">• Pro</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{post.timeAgo} • 🌐 Public</div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map(t => (
                        <span key={t} className="text-[11px] text-[#1dbf73] hover:underline cursor-pointer">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <button 
                        onClick={() => {
                          setActivity(activity.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p));
                          confetti({ particleCount: 15, colors: ['#1dbf73'] });
                        }}
                        className="flex items-center gap-1.5 hover:text-white cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{post.likes} Likes</span>
                      </button>

                      <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{post.comments} Comments</span>
                      </div>

                      <div className="flex items-center gap-1.5 hover:text-white cursor-pointer">
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{post.shares} Shares</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. AI SUPERPOWERS SUITE */}
        {/* ======================================================== */}
        {activeTab === 'ai' && (
          <div className="space-y-8">
            <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-[#1dbf73]/30 p-6">
              <div className="max-w-3xl">
                <span className="px-3 py-1 rounded-full bg-[#1dbf73]/20 text-[#1dbf73] text-xs font-bold border border-[#1dbf73]/30 inline-flex items-center gap-1.5 mb-3">
                  <Bot className="w-3.5 h-3.5" /> Powered by Gemini 2.5 Flash SDK
                </span>
                <h3 className="text-2xl font-black text-white">
                  Autonomous Project Estimator & Quote Calculator
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Calculate cost breakdowns, sprint roadmaps, and winning client proposals in seconds.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 rounded-2xl bg-[#0f131f] border border-slate-800 p-6 space-y-5">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#1dbf73]" /> Project Parameters
                </h4>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Project Architecture Type</label>
                  <select
                    value={estimatorType}
                    onChange={(e) => setEstimatorType(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1dbf73]"
                  >
                    <option>Full-Stack Web App with AI</option>
                    <option>Autonomous AI Bot & Multimodal Integration</option>
                    <option>Firebase Real-time Backend & Rules Audit</option>
                    <option>Hybrid Freelance & Service Marketplace</option>
                    <option>Nigerian PropTech / Real Estate Portal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Core Scope & Objectives</label>
                  <textarea
                    rows={3}
                    value={estimatorScope}
                    onChange={(e) => setEstimatorScope(e.target.value)}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium mb-1.5 block">Select Included Deliverables</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Firebase Auth',
                      'Firestore Database',
                      'Gemini AI API',
                      'Responsive UI',
                      'Payment / WhatsApp Direct',
                      'SEO & OpenGraph Schema'
                    ].map(f => {
                      const isSel = selectedFeatures.includes(f);
                      return (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              setSelectedFeatures(selectedFeatures.filter(x => x !== f));
                            } else {
                              setSelectedFeatures([...selectedFeatures, f]);
                            }
                          }}
                          className={`px-3 py-2 rounded-xl text-xs text-left font-medium flex items-center justify-between border transition-all cursor-pointer ${
                            isSel 
                              ? 'bg-emerald-500/20 text-white border-[#1dbf73]' 
                              : 'bg-slate-950/60 text-slate-400 border-slate-800'
                          }`}
                        >
                          <span>{f}</span>
                          {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-[#1dbf73]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-medium">Delivery Urgency</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {['Rush (48 Hours)', 'Standard (4-5 Days)'].map(u => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUrgencyLevel(u)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          urgencyLevel === u 
                            ? 'bg-emerald-500/20 text-[#1dbf73] border-[#1dbf73]' 
                            : 'bg-slate-950/60 text-slate-400 border-slate-800'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={handleRunEstimator}
                  className="w-full py-3 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {aiGenerating ? 'Calculating with Gemini...' : 'Calculate Cost & Sprint Breakdown'}
                </button>
              </div>

              {/* Estimation Results Panel */}
              <div className="lg:col-span-6 rounded-2xl bg-[#0f131f] border border-slate-800 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#1dbf73]" /> Instant Sprint Roadmap
                    </h4>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">AI Verified</span>
                  </div>

                  {estimationResult ? (
                    <div className="mt-5 space-y-5">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Estimated Investment</span>
                          <div className="text-2xl font-black text-white mt-1">
                            ${estimationResult.estimatedCostUSD}
                          </div>
                          <span className="text-xs text-slate-400">₦{estimationResult.estimatedCostNGN?.toLocaleString()}</span>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">Turnaround Window</span>
                          <div className="text-2xl font-black text-emerald-400 mt-1">
                            {estimationResult.turnaroundDays} Days
                          </div>
                          <span className="text-xs text-slate-400">Sprint Guaranteed</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-300 block">Sprint Execution Phases</span>
                        {estimationResult.sprintBreakdown?.map((sp: any, i: number) => (
                          <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                            <div className="flex items-center justify-between font-bold text-[#1dbf73] mb-1">
                              <span>{sp.phase}</span>
                              <span className="text-[10px] text-slate-400">{sp.duration}</span>
                            </div>
                            <p className="text-slate-300 text-[11px]">{sp.deliverables}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                        <strong>ROI Advantage:</strong> {estimationResult.roiVerdict}
                      </div>
                    </div>
                  ) : (
                    <div className="py-16 text-center space-y-3">
                      <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Select your project scope and calculate an AI-backed quote and sprint timeline.
                      </p>
                    </div>
                  )}
                </div>

                {estimationResult && (
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      setInputMsg(`Hi! I generated an estimate for "${estimatorType}" with budget $${estimationResult.estimatedCostUSD}. Let's lock in this 48h sprint!`);
                    }}
                    className="mt-6 w-full py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Lock In This Sprint Now
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. PART 1: VIRAL MARKETING & COLD DMS */}
        {/* ======================================================== */}
        {activeTab === 'marketing-kit' && (
          <div className="space-y-8">
            <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-[#1dbf73]/30 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="px-3 py-1 rounded-full bg-[#1dbf73]/20 text-[#1dbf73] text-xs font-bold border border-[#1dbf73]/30 inline-flex items-center gap-1.5 mb-2">
                    <Flame className="w-3.5 h-3.5" /> Promotional Copy & DM Suite (Part 1)
                  </span>
                  <h3 className="text-2xl font-black text-white">
                    High-Converting Bios, Viral Hooks & Cold DMs
                  </h3>
                  <p className="mt-1 text-xs text-slate-300">
                    Use these battle-tested scripts to attract high-ticket founders, agencies, and diaspora buyers.
                  </p>
                </div>

                {onPromoteWithLazyCEO && (
                  <button
                    onClick={() => onPromoteWithLazyCEO({
                      name: brandName,
                      tagline: 'Why hire a 5-person dev team? 48h Full-Stack & AI builds.',
                      industry: 'AI Engineering & Rapid Full-Stack Development',
                      audience: 'Global Founders, Startup CTOs & Agency Owners',
                      tone: 'Direct, High-Velocity, Proof-Driven',
                      targetGeo: 'Global',
                      valueProp: 'Turnkey 48-hour development using React 19, Firebase, and Gemini AI.',
                      website: 'https://studio.hub',
                      foundedYear: '2026'
                    })}
                    className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-900/40 shrink-0 cursor-pointer"
                  >
                    <Rocket className="w-4 h-4" />
                    Push to LazyCEO (Red 365 Autopilot)
                  </button>
                )}
              </div>
            </div>

            {/* Bios */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#1dbf73]" />
                Twitter/X & LinkedIn Bio Variations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {marketingKit.bios.map((b, idx) => (
                  <div key={idx} className="rounded-2xl bg-[#0f131f] border border-slate-800 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{b.platform}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[#1dbf73] text-[10px] font-bold">{b.badge}</span>
                      </div>
                      <h5 className="text-xs font-bold text-white mb-2">{b.title}</h5>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-xl border border-slate-800">
                        {b.text.replace(/SimeonJr/g, brandName)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(b.text.replace(/SimeonJr/g, brandName), `bio-${idx}`)}
                      className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedKey === `bio-${idx}` ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Bio
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Viral Posts */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Viral Social Media Posts (LinkedIn & Twitter/X)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketingKit.viralPosts.map(post => (
                  <div key={post.id} className="rounded-2xl bg-[#0f131f] border border-slate-800 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          {post.channel}
                        </span>
                        <span className="text-[10px] text-slate-400">Audience: {post.targetAudience}</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-3">{post.title}</h5>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                        {post.content}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => handleCopy(post.content, post.id)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {copiedKey === post.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" /> 1-Click Copy Post
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cold DMs */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                Cold DM Scripts for Direct Outreach
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketingKit.coldDMs.map(dm => (
                  <div key={dm.id} className="rounded-2xl bg-[#0f131f] border border-slate-800 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          Direct Outreach
                        </span>
                        <span className="text-[10px] text-slate-400">Target: {dm.target}</span>
                      </div>
                      <h5 className="text-sm font-bold text-white mb-3">{dm.title}</h5>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                        {dm.text}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(dm.text, dm.id)}
                      className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copiedKey === dm.id ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Copied Script!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" /> 1-Click Copy Script
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. INBOX & DIRECT CHAT */}
        {/* ======================================================== */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto rounded-2xl bg-[#0f131f] border border-slate-800 overflow-hidden flex flex-col h-[650px] shadow-2xl">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={simeonJrProfile.avatar} alt="Seller" className="w-10 h-10 rounded-xl object-cover" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {brandName} Direct Desk
                    <span className="text-[10px] text-emerald-400 font-semibold">(Online in Lagos 🇳🇬)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">Average response time: &lt; 5 minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[#1dbf73] border border-[#1dbf73]/20 text-[10px] font-bold">
                  Real-Time Direct Inbox
                </span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#0a0d14]/70">
              {chatMessages.map(m => {
                const isMe = m.sender === 'Client';
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-md rounded-2xl p-4 text-xs ${
                      isMe 
                        ? 'bg-[#1dbf73] text-white rounded-br-none shadow-lg' 
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                    }`}>
                      <div className="flex items-center justify-between gap-3 mb-1 text-[10px] opacity-75">
                        <span className="font-bold">{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-3">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask about a 48h build, custom offer, or milestone sprint..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1dbf73]"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </form>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* FIVERR 3-TIER PACKAGE ORDER MODAL (BASIC, STANDARD, PREMIUM) */}
      {/* ======================================================== */}
      {orderModalGig && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f131f] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOrderModalGig(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[#1dbf73] text-[11px] font-bold border border-[#1dbf73]/30">
                  {orderModalGig.category}
                </span>
                <span className="text-xs text-slate-400">⚡ Guaranteed {orderModalGig.deliveryDays}d Delivery</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">{orderModalGig.title}</h3>
            </div>

            {/* Fiverr 3-Tier Tabs (Basic, Standard, Premium) */}
            <div className="grid grid-cols-3 border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              {(['Basic', 'Standard', 'Premium'] as const).map(tierKey => {
                const pkg = orderModalGig.packages[tierKey.toLowerCase() as keyof typeof orderModalGig.packages];
                const isSelected = selectedPackageTier === tierKey;
                return (
                  <button
                    key={tierKey}
                    type="button"
                    onClick={() => setSelectedPackageTier(tierKey)}
                    className={`py-3 px-2 text-center transition-all cursor-pointer border-r last:border-r-0 border-slate-800 ${
                      isSelected 
                        ? 'bg-[#1dbf73]/15 text-[#1dbf73] font-bold border-b-2 border-b-[#1dbf73]' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{tierKey}</div>
                    <div className="text-sm font-black text-white mt-0.5">${pkg.priceUSD}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Package Details */}
            {(() => {
              const currentPkg = orderModalGig.packages[selectedPackageTier.toLowerCase() as keyof typeof orderModalGig.packages];
              return (
                <div className="space-y-4 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{currentPkg.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{currentPkg.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#1dbf73]">${currentPkg.priceUSD}</div>
                      <span className="text-[10px] text-slate-400">₦{currentPkg.priceNGN.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-300 py-2 border-y border-slate-800/80">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {currentPkg.deliveryDays} Days Delivery
                    </span>
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                      {currentPkg.revisions}
                    </span>
                  </div>

                  {/* Included features */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 block">Deliverables Included:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentPkg.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className="w-3.5 h-3.5 text-[#1dbf73] shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderModalGig(null)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOrderModalGig(null);
                        setActiveTab('chat');
                        setInputMsg(`Hi! I want to order the "${selectedPackageTier}" package for: "${orderModalGig.title}" ($${currentPkg.priceUSD}). Let's kick off this sprint!`);
                        confetti({ particleCount: 50, colors: ['#1dbf73', '#ffffff'] });
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold shadow-md shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-2"
                    >
                      Continue (${currentPkg.priceUSD})
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BRAND NAME CUSTOMIZATION MODAL */}
      {/* ======================================================== */}
      {isEditingBrand && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f131f] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsEditingBrand(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#1dbf73]" />
              Customize Marketplace Brand Name
            </h3>
            <p className="text-xs text-slate-400">
              You can personalize this freelance platform to match your studio, agency, or brand identity.
            </p>

            <form onSubmit={handleSaveBrandName} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium">Platform / Agency Brand Name</label>
                <input
                  type="text"
                  value={tempBrandName}
                  onChange={(e) => setTempBrandName(e.target.value)}
                  placeholder="e.g. SimeonJr Studio Hub, DevPulse Pro, LaunchPad 48"
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#1dbf73]"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingBrand(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBMIT PROPOSAL MODAL (WITH GEMINI AI WRITER) */}
      {/* ======================================================== */}
      {proposalModalJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f131f] border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setProposalModalJob(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[#1dbf73] text-xs font-bold border border-[#1dbf73]/30">
                Custom Offer / Proposal
              </span>
              <span className="text-xs text-slate-400">Client Budget: ${proposalModalJob.budgetUSD}</span>
            </div>

            <h3 className="text-base font-bold text-white">{proposalModalJob.title}</h3>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-semibold text-slate-200">Gemini AI Winning Proposal Writer</span>
              </div>
              <button
                type="button"
                disabled={aiGenerating}
                onClick={() => handleGenerateAiProposal(proposalModalJob)}
                className="px-3 py-1 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-[11px] font-bold disabled:opacity-50 cursor-pointer"
              >
                {aiGenerating ? 'Drafting...' : 'Regenerate Draft'}
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Your Bid Amount ($ USD)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Estimated Turnaround (Days)</label>
                  <input
                    type="number"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(Number(e.target.value))}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium">Custom Cover Letter (Editable)</label>
                <textarea
                  rows={8}
                  value={generatedProposalText}
                  onChange={(e) => setGeneratedProposalText(e.target.value)}
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#1dbf73] leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setProposalModalJob(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Submit Custom Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* POST PROJECT REQUEST MODAL */}
      {/* ======================================================== */}
      {postJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f131f] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setPostJobModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#1dbf73]" />
              Post a Project Brief
            </h3>
            <p className="text-xs text-slate-400">
              Submit your project details to receive tailored bids and instant 48h turnaround offers.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const newJob: StudioJob = {
                  id: `job-${Date.now()}`,
                  clientName: form.clientName.value || 'Anonymous Client',
                  clientLocation: 'Global & Lagos',
                  clientCompany: form.clientCompany.value || 'Startup Founder',
                  verifiedPayment: true,
                  title: form.title.value,
                  description: form.description.value,
                  budgetUSD: Number(form.budgetUSD.value) || 1200,
                  budgetType: 'fixed',
                  experienceLevel: 'Expert',
                  urgency: 'Rush 48h',
                  skillsRequired: ['React 19', 'Firebase', 'Gemini AI'],
                  proposalsCount: 0,
                  postedTime: 'Just Now',
                  status: 'open'
                };
                setJobs([newJob, ...jobs]);
                if (onSaveJobToFirestore) {
                  onSaveJobToFirestore(newJob);
                }
                setPostJobModalOpen(false);
                confetti({ particleCount: 40, colors: ['#1dbf73', '#ffffff'] });
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-xs text-slate-400 font-medium">Brief Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Build an AI Voice Agent Dashboard with Firebase Auth"
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1dbf73]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium">Your Name / Company</label>
                  <input
                    name="clientName"
                    required
                    placeholder="e.g. Sarah Vance (AuraPay)"
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium">Budget ($ USD)</label>
                  <input
                    name="budgetUSD"
                    type="number"
                    required
                    defaultValue={1200}
                    className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium">Description of Needs</label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  placeholder="Describe your tech requirements, target audience, and desired turnaround..."
                  className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#1dbf73]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPostJobModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Publish Brief
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
