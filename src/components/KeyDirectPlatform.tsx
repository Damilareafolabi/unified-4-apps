import React, { useState } from 'react';
import { 
  Key, 
  Search, 
  MapPin, 
  Mic, 
  Map, 
  Building, 
  Home, 
  Briefcase, 
  Hotel, 
  Coins, 
  Compass, 
  ChevronDown, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  Megaphone, 
  Plus, 
  SlidersHorizontal, 
  Share2, 
  X,
  ExternalLink,
  ShieldCheck,
  Send,
  Zap,
  Bed,
  Bath,
  RotateCw,
  Video,
  Camera,
  Heart,
  Layers,
  Check,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { PropertyListing, initialKeyDirectProperties, NIGERIAN_CITIES, PropertyCategory } from '../data/keyDirectData';
import { KeyDirectVirtualTourModal } from './KeyDirectVirtualTourModal';
import { KeyDirectCompareModal } from './KeyDirectCompareModal';
import { KeyDirectUploadModal } from './KeyDirectUploadModal';
import { KeyDirectPropertyDetailModal } from './KeyDirectPropertyDetailModal';
import confetti from 'canvas-confetti';

interface KeyDirectPlatformProps {
  onPromoteWithLazyCEO: (property: PropertyListing) => void;
  onSavePropertyToFirestore: (property: PropertyListing) => void;
  comparedIds?: string[];
  onToggleCompare?: (id: string) => void;
  onOpenCompareModal?: () => void;
  onClearCompare?: () => void;
}

export const KeyDirectPlatform: React.FC<KeyDirectPlatformProps> = ({
  onPromoteWithLazyCEO,
  onSavePropertyToFirestore,
  comparedIds: externalComparedIds,
  onToggleCompare: externalToggleCompare,
  onOpenCompareModal: externalOpenCompareModal,
  onClearCompare: externalClearCompare
}) => {
  // Navigation & Category Tab state
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedBedrooms, setSelectedBedrooms] = useState('Any');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [advertiserFilter, setAdvertiserFilter] = useState('Owners and agents');
  const [filterOnly360, setFilterOnly360] = useState(false);
  const [filterOnlyVideo, setFilterOnlyVideo] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Data state
  const [properties, setProperties] = useState<PropertyListing[]>(initialKeyDirectProperties);
  const [billboardModalOpen, setBillboardModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  
  // Interactive Modals
  const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState<PropertyListing | null>(null);
  const [virtualTourProperty, setVirtualTourProperty] = useState<PropertyListing | null>(null);
  const [virtualTourMode, setVirtualTourMode] = useState<'360' | 'video' | 'photo' | 'interactive'>('360');
  const [localCompareModalOpen, setLocalCompareModalOpen] = useState(false);

  // Favourites & Comparison lists
  const [favouriteIds, setFavouriteIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('keydirect_favourites') || '[]');
    } catch {
      return [];
    }
  });

  const [localComparedIds, setLocalComparedIds] = useState<string[]>([]);
  const comparedIds = externalComparedIds !== undefined ? externalComparedIds : localComparedIds;

  // Toggle Favourite
  const handleToggleFavourite = (id: string) => {
    let updated: string[];
    if (favouriteIds.includes(id)) {
      updated = favouriteIds.filter(f => f !== id);
    } else {
      updated = [...favouriteIds, id];
      confetti({ particleCount: 20, colors: ['#e11d48', '#ffffff'] });
    }
    setFavouriteIds(updated);
    localStorage.setItem('keydirect_favourites', JSON.stringify(updated));
  };

  // Toggle Compare
  const handleToggleCompare = (id: string) => {
    if (externalToggleCompare) {
      externalToggleCompare(id);
      return;
    }
    if (localComparedIds.includes(id)) {
      setLocalComparedIds(localComparedIds.filter(c => c !== id));
    } else {
      if (localComparedIds.length >= 4) {
        alert('You can compare up to 4 properties simultaneously.');
        return;
      }
      setLocalComparedIds([...localComparedIds, id]);
      confetti({ particleCount: 25, colors: ['#2563eb', '#ffffff'] });
    }
  };

  const setCompareModalOpen = (open: boolean) => {
    if (open && externalOpenCompareModal) {
      externalOpenCompareModal();
    } else {
      setLocalCompareModalOpen(open);
    }
  };
  const compareModalOpen = localCompareModalOpen;

  // Launch Virtual Tour Helper
  const handleLaunchVirtualTour = (prop: PropertyListing, mode: '360' | 'video' | 'photo' = '360') => {
    setVirtualTourMode(mode);
    setVirtualTourProperty(prop);
  };

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    // City filter
    if (selectedCity !== 'All Cities' && p.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }
    // Category tab filter
    if (activeCategory !== 'All' && p.category !== activeCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = p.title.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    // Bedrooms filter
    if (selectedBedrooms !== 'Any') {
      const beds = parseInt(selectedBedrooms);
      if (p.bedrooms !== beds) return false;
    }
    // Budget range
    if (minBudget && p.priceNaira < parseInt(minBudget.replace(/[^0-9]/g, '') || '0')) {
      return false;
    }
    if (maxBudget && p.priceNaira > parseInt(maxBudget.replace(/[^0-9]/g, '') || '9999999999')) {
      return false;
    }
    // Advertiser type
    if (advertiserFilter === 'Direct Owners Only' && !p.directOwner) {
      return false;
    }
    if (advertiserFilter === 'Verified Agents' && p.advertiserType !== 'Agent') {
      return false;
    }
    if (advertiserFilter === 'Developers' && p.advertiserType !== 'Developer') {
      return false;
    }
    // Media filters
    if (filterOnly360 && !p.virtualTour?.has360) {
      return false;
    }
    if (filterOnlyVideo && (!p.videos || p.videos.length === 0)) {
      return false;
    }
    return true;
  });

  // Voice Search Handler
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser. Please type your city or neighbourhood.');
      return;
    }
    setIsVoiceListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-NG';
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsVoiceListening(false);
    };

    recognition.onerror = () => {
      setIsVoiceListening(false);
    };

    recognition.onend = () => {
      setIsVoiceListening(false);
    };
  };

  // Add new property handler from Upload Modal
  const handleSaveUploadedProperty = (created: PropertyListing) => {
    setProperties([created, ...properties]);
    onSavePropertyToFirestore(created);
  };

  const comparedProperties = properties.filter(p => comparedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-24">
      
      {/* KEYDIRECT TOP NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-14 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Left: KeyDirect Red Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer" 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            >
              <div className="w-8 h-8 rounded-xl bg-[#c52222] flex items-center justify-center shadow-md shadow-red-700/20">
                <Key className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-base font-black tracking-tight text-slate-900 leading-none">
                  KEYDIRECT
                </div>
                <div className="text-[9px] font-extrabold tracking-widest text-[#c52222] uppercase mt-0.5">
                  REAL ESTATE • DIRECT INSPECT
                </div>
              </div>
            </div>

            {/* Center: Category Links */}
            <div className="hidden lg:flex items-center space-x-5 text-xs font-semibold text-slate-700">
              {[
                { id: 'All', label: 'All Listings' },
                { id: 'Apartments', label: 'Apartments' },
                { id: 'Rental', label: 'Houses & Duplexes' },
                { id: 'Rooms', label: 'Self-Contain & Rooms' },
                { id: 'Commercial', label: 'Offices & Shops' },
                { id: 'Plots / Land', label: 'Plots / Land Inspection' },
                { id: 'Shortlet', label: 'Shortlet Suites' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`hover:text-[#c52222] transition-colors cursor-pointer ${
                    activeCategory === cat.id ? 'text-[#c52222] font-black border-b-2 border-[#c52222] pb-1' : ''
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Right: Compare count, Billboard & Upload */}
            <div className="flex items-center space-x-2">
              {comparedIds.length > 0 && (
                <button
                  onClick={() => setCompareModalOpen(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer animate-bounce"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Compare ({comparedIds.length})</span>
                </button>
              )}

              <button
                onClick={() => setBillboardModalOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Megaphone className="w-3.5 h-3.5 text-[#c52222]" />
                <span>Digital Billboard</span>
              </button>

              <button
                onClick={() => setUploadModalOpen(true)}
                className="flex items-center space-x-1.5 bg-[#c52222] hover:bg-[#a81c1c] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-red-700/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>List Property</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* HERO SECTION MATCHING SCREENSHOT */}
      <div className="relative bg-slate-950 text-white min-h-[480px] flex flex-col justify-center overflow-hidden">
        
        {/* Background Architectural Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/keydirect_hero_bg_1792161285411.jpg"
            alt="KeyDirect Luxury Real Estate"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-28">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold mb-3 backdrop-blur-sm">
            <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
            360° Virtual Tours • Walkthrough Videos • Zero Agent Friction
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight font-serif text-white">
            REAL PEOPLE. REAL PLACES. DIRECT CONNECTIONS.
          </h1>

          <p className="mt-4 text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto font-normal">
            Inspect Nigerian properties remotely with genuine 360° panoramas, walkthrough videos, and transparent fee disclosures. Eliminate wasted transport and connect directly with verified title owners.
          </p>

          {/* Action Links Row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <button
              onClick={() => { setAdvertiserFilter('Direct Owners Only'); setActiveCategory('All'); }}
              className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1 backdrop-blur-sm cursor-pointer ${
                advertiserFilter === 'Direct Owners Only' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
            >
              <span>Direct Owners (0% Commission)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setFilterOnly360(!filterOnly360)}
              className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1 backdrop-blur-sm cursor-pointer ${
                filterOnly360 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Has 360° Tour</span>
            </button>

            <button
              onClick={() => setFilterOnlyVideo(!filterOnlyVideo)}
              className={`px-4 py-2 rounded-full transition-all flex items-center space-x-1 backdrop-blur-sm cursor-pointer ${
                filterOnlyVideo 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Has Walkthrough Video</span>
            </button>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="underline hover:text-red-400 text-white px-3 py-2 transition-colors cursor-pointer"
            >
              List your property
            </button>
          </div>
        </div>

      </div>

      {/* FLOATING SEARCH & FILTER CONSOLE */}
      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-5 sm:p-6 text-slate-800">
          
          {/* Main Search Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Input with Mic */}
            <div className="relative flex-1 w-full">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, neighbourhood or street (e.g. Lekki, Ikoyi, Maitama, Epe)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#c52222]"
              />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full cursor-pointer ${
                  isVoiceListening ? 'text-red-600 animate-pulse' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* City Selector */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full sm:w-44 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#c52222]"
            >
              {NIGERIAN_CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Red Search Button */}
            <button
              type="button"
              onClick={() => {}}
              className="w-full sm:w-auto bg-[#c52222] hover:bg-[#a81c1c] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-red-700/20 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Secondary Inspection Filters */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            
            {/* Bedrooms dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <span className="text-slate-400">Bedrooms:</span>
              <select
                value={selectedBedrooms}
                onChange={(e) => setSelectedBedrooms(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none"
              >
                <option value="Any">Any</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4 Beds</option>
                <option value="5">5+ Beds</option>
              </select>
            </div>

            {/* Advertiser Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <span className="text-slate-400">Advertiser:</span>
              <select
                value={advertiserFilter}
                onChange={(e) => setAdvertiserFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none"
              >
                <option value="Owners and agents">Owners and agents</option>
                <option value="Direct Owners Only">Direct Owners Only (0% Fee)</option>
                <option value="Verified Agents">Verified Agents</option>
                <option value="Developers">Developers</option>
              </select>
            </div>

            {/* Media Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOnly360(!filterOnly360)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterOnly360 
                    ? 'bg-red-50 text-red-600 border-red-300 font-bold' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <RotateCw className="w-3 h-3" />
                <span>360° Tours</span>
              </button>

              <button
                onClick={() => setFilterOnlyVideo(!filterOnlyVideo)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  filterOnlyVideo 
                    ? 'bg-red-50 text-red-600 border-red-300 font-bold' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Video className="w-3 h-3" />
                <span>Walkthrough Videos</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* FILTERABLE PROPERTY LISTINGS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              Verified Properties for Remote Inspection ({filteredProperties.length})
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse with full photo galleries, walkthrough videos, and 360° panoramic virtual tours.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-bold">Category:</span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
              {activeCategory}
            </span>
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => {
            const isFav = favouriteIds.includes(prop.id);
            const isComp = comparedIds.includes(prop.id);
            const has360 = prop.virtualTour?.has360;
            const videoCount = prop.videos?.length || 0;
            const photoCount = prop.photos?.length || 1;
            const isLand = prop.category === 'Plots / Land';

            return (
              <div
                key={prop.id}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group cursor-pointer relative ${
                  isComp
                    ? 'border-2 border-blue-500 ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10'
                    : 'border border-slate-200 shadow-sm hover:shadow-xl'
                }`}
                onClick={() => setSelectedPropertyForDetails(prop)}
              >
                <div>
                  {/* Image Cover */}
                  <div className="relative h-56 overflow-hidden bg-slate-950">
                    <img
                      src={prop.imageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                      <span className="bg-[#c52222] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-md">
                        {prop.subType}
                      </span>
                      {prop.directOwner ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase shadow-md flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Direct Owner</span>
                        </span>
                      ) : (
                        <span className="bg-slate-900/80 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm border border-blue-400/30">
                          Verified Agent
                        </span>
                      )}
                    </div>

                    {/* Top Right: Floating Compare & Favourite Quick Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                      {/* Floating Compare Icon Button with distinct visual feedback */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCompare(prop.id);
                        }}
                        className={`group/compare flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer border shadow-md active:scale-95 ${
                          isComp 
                            ? 'bg-blue-600 border-blue-400 text-white shadow-blue-500/40 ring-2 ring-blue-300/60 scale-105' 
                            : 'bg-black/65 hover:bg-black/85 border-white/20 text-slate-200 hover:text-white hover:border-white/40'
                        }`}
                        title={isComp ? 'Selected for comparison • Click to remove' : 'Add to side-by-side comparison'}
                        aria-pressed={isComp}
                        aria-label={isComp ? 'Remove from comparison' : 'Add to comparison'}
                      >
                        {isComp ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white animate-pulse" />
                            <span className="text-[10px] font-black tracking-wider uppercase">Comparing</span>
                          </>
                        ) : (
                          <>
                            <Layers className="w-3.5 h-3.5 transition-transform group-hover/compare:scale-110" />
                            <span className="text-[10px] font-bold tracking-wider">Compare</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavourite(prop.id);
                        }}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer border shadow-md active:scale-95 ${
                          isFav 
                            ? 'bg-rose-600 border-rose-400 text-white shadow-rose-600/40' 
                            : 'bg-black/65 hover:bg-black/85 border-white/20 text-slate-200 hover:text-white'
                        }`}
                        title={isFav ? 'Remove from favourites' : 'Save to favourites'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom Media Availability Badges */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-bold z-10">
                      <div className="flex items-center gap-1.5">
                        {has360 && (
                          <span className="bg-slate-950/85 text-emerald-400 px-2 py-0.5 rounded backdrop-blur-sm border border-emerald-500/40 flex items-center gap-1">
                            <RotateCw className="w-3 h-3" /> 360° Tour
                          </span>
                        )}
                        {videoCount > 0 && (
                          <span className="bg-slate-950/85 text-red-400 px-2 py-0.5 rounded backdrop-blur-sm border border-red-500/40 flex items-center gap-1">
                            <Video className="w-3 h-3" /> {videoCount} Videos
                          </span>
                        )}
                      </div>

                      <span className="bg-black/70 text-slate-300 px-2 py-0.5 rounded backdrop-blur-sm font-mono">
                        📷 {photoCount} Photos
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center text-xs text-slate-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#c52222] mr-1 shrink-0" />
                      <span className="font-semibold text-slate-700">{prop.neighborhood}, {prop.city}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 mt-1 group-hover:text-red-600 transition-colors">
                      {prop.title}
                    </h4>

                    {/* Pricing */}
                    <div className="mt-3 flex items-baseline justify-between">
                      <div className="text-xl font-black text-[#c52222] font-mono">
                        ₦{prop.priceNaira.toLocaleString()}{' '}
                        <span className="text-xs font-normal text-slate-500">/{prop.pricePeriod}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ≈ ${(prop.priceNaira / 1650).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>

                    {/* Bed / Bath Stats OR Land Size */}
                    <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      {isLand ? (
                        <div className="flex items-center space-x-1 font-bold text-slate-800">
                          <Compass className="w-4 h-4 text-amber-500" />
                          <span>{prop.landDetails?.landSize || '1,200 SQM'}</span>
                        </div>
                      ) : (
                        <>
                          {prop.bedrooms > 0 && (
                            <div className="flex items-center space-x-1">
                              <Bed className="w-4 h-4 text-slate-400" />
                              <span>{prop.bedrooms} Beds</span>
                            </div>
                          )}
                          {prop.bathrooms > 0 && (
                            <div className="flex items-center space-x-1">
                              <Bath className="w-4 h-4 text-slate-400" />
                              <span>{prop.bathrooms} Baths</span>
                            </div>
                          )}
                        </>
                      )}
                      <span className="text-[11px] text-slate-400">• {prop.advertiserName.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer with Virtual Tour Trigger */}
                <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-2 bg-slate-50/50">
                  {/* Take a Virtual Tour Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchVirtualTour(prop, has360 ? '360' : 'video');
                    }}
                    className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Virtual Tour</span>
                  </button>

                  {/* Direct WhatsApp Call */}
                  <a
                    href={`https://wa.me/${prop.advertiserPhone.replace(/[^0-9]/g, '')}?text=Hello, I saw your listing on KeyDirect: "${encodeURIComponent(prop.title)}". I would like to inquire.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                    title="Direct WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {/* Auto-Market with LazyCEO */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPromoteWithLazyCEO(prop);
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-red-400 transition-colors cursor-pointer"
                    title="Promote with LazyCEO 365 Autopilot"
                  >
                    <Zap className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* FLOATING COMPARISON BAR (WHEN 1 OR MORE PROPERTIES SHORTLISTED) */}
      {comparedIds.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-40 bg-slate-950/95 border border-slate-700 text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-2 truncate">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {comparedIds.length}
            </span>
            <span className="text-xs font-semibold truncate">
              {comparedIds.length === 1 ? '1 property ready for comparison' : `${comparedIds.length} properties shortlisted for side-by-side inspection`}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (externalClearCompare) {
                  externalClearCompare();
                } else {
                  setLocalComparedIds([]);
                }
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare Now</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: VIRTUAL TOUR MODAL (360, INTERACTIVE, PHOTO, VIDEO) */}
      {/* ===================================================================== */}
      {virtualTourProperty && (
        <KeyDirectVirtualTourModal
          property={virtualTourProperty}
          initialMode={virtualTourMode}
          onClose={() => setVirtualTourProperty(null)}
          onScheduleInspection={(prop) => {
            setVirtualTourProperty(null);
            setSelectedPropertyForDetails(prop);
          }}
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: SIDE-BY-SIDE PROPERTY COMPARISON */}
      {/* ===================================================================== */}
      {compareModalOpen && (
        <KeyDirectCompareModal
          properties={comparedProperties}
          onClose={() => setCompareModalOpen(false)}
          onRemoveFromCompare={(id) => handleToggleCompare(id)}
          onSelectProperty={(prop) => setSelectedPropertyForDetails(prop)}
          onOpenVirtualTour={(prop) => handleLaunchVirtualTour(prop, '360')}
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: PROPERTY DETAIL INSPECTION SHEET */}
      {/* ===================================================================== */}
      {selectedPropertyForDetails && (
        <KeyDirectPropertyDetailModal
          property={selectedPropertyForDetails}
          onClose={() => setSelectedPropertyForDetails(null)}
          onOpenVirtualTour={(prop, mode) => handleLaunchVirtualTour(prop, mode || '360')}
          onToggleFavourite={(id) => handleToggleFavourite(id)}
          isFavourite={favouriteIds.includes(selectedPropertyForDetails.id)}
          onToggleCompare={(id) => handleToggleCompare(id)}
          isCompared={comparedIds.includes(selectedPropertyForDetails.id)}
          onPromoteWithLazyCEO={onPromoteWithLazyCEO}
          allProperties={properties}
          onSelectProperty={(prop) => setSelectedPropertyForDetails(prop)}
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: OWNER PROPERTY UPLOADER (PHOTOS, VIDEOS, 360, LAND DETAILS) */}
      {/* ===================================================================== */}
      {uploadModalOpen && (
        <KeyDirectUploadModal
          onClose={() => setUploadModalOpen(false)}
          onSaveProperty={handleSaveUploadedProperty}
        />
      )}

      {/* ===================================================================== */}
      {/* MODAL 5: DIGITAL BILLBOARD MODAL */}
      {/* ===================================================================== */}
      {billboardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-[#c52222]" />
                <h3 className="text-lg font-black text-slate-900">KeyDirect Digital Billboard Network</h3>
              </div>
              <button onClick={() => setBillboardModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Properties featured on the <strong>KeyDirect Digital Billboard</strong> receive 10x higher buyer visibility, syndicated across social media networks, diaspora investor channels, and partner property portals in Lagos, London, and New York powered by LazyCEO.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {properties.filter(p => p.isDigitalBillboard).slice(0, 4).map(p => (
                <div 
                  key={p.id} 
                  onClick={() => {
                    setBillboardModalOpen(false);
                    setSelectedPropertyForDetails(p);
                  }}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs hover:border-red-500 cursor-pointer transition-all"
                >
                  <div className="font-bold text-slate-900 truncate">{p.title}</div>
                  <div className="text-[#c52222] font-black font-mono mt-1">₦{p.priceNaira.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{p.neighborhood}, {p.city}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setBillboardModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
