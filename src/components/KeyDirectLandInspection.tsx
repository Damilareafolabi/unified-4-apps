import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Video, 
  Camera, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Maximize2, 
  Share2, 
  Phone, 
  MessageCircle,
  Eye,
  Info
} from 'lucide-react';
import { PropertyListing } from '../data/keyDirectData';

interface KeyDirectLandInspectionProps {
  property: PropertyListing;
  onOpenVirtualTour: (mode: '360' | 'video' | 'photo') => void;
  onRequestViewing: () => void;
}

export const KeyDirectLandInspection: React.FC<KeyDirectLandInspectionProps> = ({
  property,
  onOpenVirtualTour,
  onRequestViewing
}) => {
  const land = property.landDetails;
  const [activeTab, setActiveTab] = useState<'overview' | 'terrain' | 'documents' | 'media'>('overview');
  const [surveyDocModal, setSurveyDocModal] = useState(false);

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* ===================================================================== */}
      {/* TOP LAND BANNER WITH SIZE & TITLE SPECIFICATION */}
      {/* ===================================================================== */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-500/30 p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Dedicated Land & Plot Remote Inspection Layout
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                {land?.terrainType || 'Table Dry Land'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono">
                {property.city} • {property.neighborhood}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">{property.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              {property.description}
            </p>
          </div>

          <div className="text-left lg:text-right shrink-0 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Total Asking Price</span>
            <div className="text-2xl font-black text-red-500">
              ₦{property.priceNaira.toLocaleString()}
            </div>
            <span className="text-xs text-slate-400 font-mono">≈ ${(property.priceNaira / 1650).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 4 CORE LAND SPECIFICATION CARDS */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Stated Land Size</span>
          <div className="text-base sm:text-lg font-black text-white mt-1">
            {land?.landSize || '1,200 SQM'}
          </div>
          <span className="text-[11px] text-amber-400 font-medium">Stated by Title Holder</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Plot Dimensions</span>
          <div className="text-base sm:text-lg font-black text-emerald-400 mt-1">
            {land?.plotDimensions || '120ft x 100ft'}
          </div>
          <span className="text-[11px] text-slate-400">Perimeter Beacons Marked</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Title Document Type</span>
          <div className="text-base sm:text-lg font-black text-blue-400 mt-1 truncate">
            {land?.titleDocumentType || 'Governor’s Consent'}
          </div>
          <span className="text-[11px] text-slate-400">Survey: {land?.surveyNumber || 'Registered'}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400">Terrain & Drainage</span>
          <div className="text-base sm:text-lg font-black text-white mt-1 truncate">
            {land?.terrainType || '100% Dry Land'}
          </div>
          <span className="text-[11px] text-emerald-400">Zero sandfilling needed</span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* REMOTE INSPECTION SUBTABS */}
      {/* ===================================================================== */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Perimeter & Approach Media' },
          { id: 'terrain', label: 'Topography & Utilities' },
          { id: 'documents', label: 'Title Documents & Survey Plan' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === t.id 
                ? 'bg-red-600 text-white shadow-md' 
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: PERIMETER & APPROACH FOOTAGE */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Perimeter Video Walkaround */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-500" />
                  Boundary & Perimeter Video Walkaround
                </h4>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Continuous Footage</span>
              </div>
              <p className="text-xs text-slate-400">
                Shows the camera walking along the physical beacon pegs and perimeter boundaries.
              </p>

              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative group">
                <video 
                  src={property.videos[0]?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'} 
                  controls 
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={() => onOpenVirtualTour('video')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Launch Fullscreen Video Walkthrough
              </button>
            </div>

            {/* Road Access and Approach Video */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  Road Access & Approach Video
                </h4>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Driveway Approach</span>
              </div>
              <p className="text-xs text-slate-400">
                Shows how vehicles navigate from the main expressway to this specific land plot.
              </p>

              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative">
                <video 
                  src={property.videos[1]?.url || property.videos[0]?.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} 
                  controls 
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={() => onOpenVirtualTour('photo')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                Browse Ground Inspection Photographs ({property.photos.length})
              </button>
            </div>
          </div>

          {/* Photo Gallery of Land Perimeter */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-400" />
              Ground-Level Photography
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {property.photos.map((photo, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                  <div className="aspect-video w-full overflow-hidden">
                    <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-3">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">{photo.roomType}</span>
                    <p className="text-xs text-slate-200 mt-0.5">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: TOPOGRAPHY & UTILITIES */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'terrain' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Soil & Terrain Analysis
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Terrain Elevation</span>
                <p className="text-slate-200 font-bold mt-0.5">{land?.terrainType || '100% Table Dry Land'}</p>
                <p className="text-slate-400 text-[11px] mt-1">High ground level. Zero standing puddles observed after rain.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Drainage System</span>
                <p className="text-slate-200 font-bold mt-0.5">{land?.drainage || 'Constructed concrete street gutters'}</p>
                <p className="text-slate-400 text-[11px] mt-1">Proper runoff gradient directed towards regional canal network.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Vegetation State</span>
                <p className="text-slate-200 font-bold mt-0.5">{land?.vegetation || 'Cleared & Beaconed'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              Roads & Infrastructure Proximity
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Road Access</span>
                <p className="text-slate-200 font-bold mt-0.5">{land?.roadAccess || 'Asphalt access road directly in front of plot'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Electricity & Water Proximity</span>
                <p className="text-slate-200 font-bold mt-0.5">{land?.utilitiesProximity || 'National grid transmission poles erected along corridor'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Approximate Coordinates</span>
                <p className="text-slate-200 font-mono mt-0.5">
                  Lat: {land?.approxCoordinates?.lat || 6.5833}° N, Lng: {land?.approxCoordinates?.lng || 3.9833}° E
                </p>
                <span className="text-[10px] text-amber-400 font-semibold block mt-1">
                  ⚠️ Note: Coordinates indicate approximate neighbourhood location, not legally certified boundaries.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: DOCUMENTS & TITLE VERIFICATION */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Title Document Disclosure: {land?.titleDocumentType}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Survey Record Reference: <strong className="text-white">{land?.surveyNumber || 'Registered in State Archive'}</strong>
                </p>
              </div>

              <button
                onClick={() => setSurveyDocModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Eye className="w-3.5 h-3.5" />
                Inspect Survey Plan Blueprint
              </button>
            </div>

            {/* Critical Legal Disclaimer Required by Section 4 */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed space-y-1.5">
              <div className="flex items-center gap-2 font-black text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                CRITICAL LEGAL DISCLAIMER FOR BUYERS & INVESTORS
              </div>
              <p>
                {land?.legalNotice || 'Do not assume a property has a legally confirmed title or boundary solely because documents or survey plans have been uploaded to KeyDirect. In accordance with professional Nigerian conveyance laws, prospective buyers must conduct independent physical search at the State Bureau of Lands (e.g. Alausa Lands Registry, Lagos or AGIS, Abuja) through a licensed real estate solicitor before committing funds.'}
              </p>
            </div>
          </div>

          {/* Survey Plan Preview Modal */}
          {surveyDocModal && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-slate-950 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
                <button
                  onClick={() => setSurveyDocModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Survey Plan Blueprint Inspection
                </h3>
                <div className="aspect-[4/3] w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
                  <img 
                    src={land?.surveyPlanImageUrl || 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80'} 
                    alt="Survey Plan" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  Beacons: 4 coordinate pillars marked with Surveyor General verification registration.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* DIRECT ACTION BAR */}
      {/* ===================================================================== */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Ready for Independent Physical Inspection?
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Avoid wasted transport: complete your remote video inspection first, then book a physical site visit with our verified coordinator.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRequestViewing}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/30 cursor-pointer"
          >
            Request On-Site Inspection
          </button>
          <a
            href={`https://wa.me/${property.advertiserPhone.replace(/[^0-9]/g, '')}?text=Hello, I inspected your land listing on KeyDirect: "${encodeURIComponent(property.title)}". I would like to verify documents.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Owner
          </a>
        </div>
      </div>
    </div>
  );
};
