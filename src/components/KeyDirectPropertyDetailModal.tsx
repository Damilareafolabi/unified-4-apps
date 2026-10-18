import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Share2, 
  Heart, 
  Layers, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  RotateCw, 
  Video, 
  Camera, 
  Bed, 
  Bath, 
  Compass, 
  FileText, 
  AlertTriangle, 
  Check, 
  Calendar, 
  Clock, 
  Sparkles,
  Zap,
  DollarSign,
  Info,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { PropertyListing } from '../data/keyDirectData';
import { KeyDirectVideoGallery } from './KeyDirectVideoGallery';
import { KeyDirectLandInspection } from './KeyDirectLandInspection';

interface KeyDirectPropertyDetailModalProps {
  property: PropertyListing;
  onClose: () => void;
  onOpenVirtualTour: (property: PropertyListing, mode?: '360' | 'video' | 'photo') => void;
  onToggleFavourite: (id: string) => void;
  isFavourite: boolean;
  onToggleCompare: (id: string) => void;
  isCompared: boolean;
  onPromoteWithLazyCEO?: (property: PropertyListing) => void;
  allProperties: PropertyListing[];
  onSelectProperty: (property: PropertyListing) => void;
}

export const KeyDirectPropertyDetailModal: React.FC<KeyDirectPropertyDetailModalProps> = ({
  property,
  onClose,
  onOpenVirtualTour,
  onToggleFavourite,
  isFavourite,
  onToggleCompare,
  isCompared,
  onPromoteWithLazyCEO,
  allProperties,
  onSelectProperty
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'videos' | 'land'>('photos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Inspection Request Form State
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [inspectionDate, setInspectionDate] = useState('Tomorrow');
  const [inspectionTime, setInspectionTime] = useState('Morning (10:00 AM)');
  const [inspectionName, setInspectionName] = useState('');
  const [inspectionPhone, setInspectionPhone] = useState('');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [inspectionSubmitted, setInspectionSubmitted] = useState(false);

  // Report Listing Form State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Misleading Price / Fee');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Similar properties in same city or category
  const similarProperties = allProperties
    .filter(p => p.id !== property.id && (p.city === property.city || p.category === property.category))
    .slice(0, 3);

  const isLand = property.category === 'Plots / Land';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 text-slate-100 font-sans">
      <div className="bg-slate-950 border border-slate-700 rounded-2xl max-w-6xl w-full max-h-[96vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Sticky Header with Controls */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
              KeyDirect Property Sheet
            </span>
            <span className="text-xs text-slate-400 truncate hidden sm:inline">
              Ref: {property.id} • Last confirmed available: {property.lastUpdated}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Take a Virtual Tour Button (Prominent) */}
            <button
              onClick={() => onOpenVirtualTour(property)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-900/40 cursor-pointer animate-pulse"
            >
              <RotateCw className="w-4 h-4 text-white" />
              Take a Virtual Tour
            </button>

            {/* Favourites */}
            <button
              onClick={() => onToggleFavourite(property.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFavourite ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Save to favourites"
            >
              <Heart className={`w-4 h-4 ${isFavourite ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Compare Toggle */}
            <button
              onClick={() => onToggleCompare(property.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isCompared ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Add to comparison"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">

          {/* ================================================================= */}
          {/* 1. MEDIA SHOWCASE (PHOTOS, VIDEO GALLERY, OR DEDICATED LAND VIEW) */}
          {/* ================================================================= */}
          <div>
            {/* Media Navigation Tabs */}
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeMediaTab === 'photos' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" /> Photos ({property.photos.length})
              </button>

              <button
                onClick={() => setActiveMediaTab('videos')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeMediaTab === 'videos' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" /> Video Gallery ({property.videos.length})
              </button>

              {isLand && (
                <button
                  onClick={() => setActiveMediaTab('land')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    activeMediaTab === 'land' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" /> Land Inspection Layout
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeMediaTab === 'photos' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Main Selected Photo */}
                <div className="lg:col-span-8 rounded-2xl bg-black border border-slate-800 overflow-hidden relative aspect-video shadow-2xl">
                  <img
                    src={property.photos[selectedPhotoIndex]?.url || property.imageUrl}
                    alt={property.photos[selectedPhotoIndex]?.caption || property.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                    <span className="text-[10px] uppercase font-bold text-red-400 block">
                      {property.photos[selectedPhotoIndex]?.roomType || 'Living Area'}
                    </span>
                    <span className="text-white font-medium">{property.photos[selectedPhotoIndex]?.caption}</span>
                  </div>
                </div>

                {/* Thumbnail Strip Column */}
                <div className="lg:col-span-4 flex flex-col justify-between">
                  <div className="grid grid-cols-3 lg:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {property.photos.map((photo, i) => (
                      <button
                        key={photo.id || i}
                        onClick={() => setSelectedPhotoIndex(i)}
                        className={`aspect-video rounded-xl overflow-hidden border-2 transition-all cursor-pointer relative ${
                          selectedPhotoIndex === i ? 'border-red-500 scale-95 shadow-md' : 'border-slate-800 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.2 rounded text-[9px] text-white">
                          {photo.roomType}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenVirtualTour(property, '360')}
                    className="mt-3 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-red-500" />
                    Enter 360° Panoramic Sphere
                  </button>
                </div>
              </div>
            )}

            {activeMediaTab === 'videos' && (
              <KeyDirectVideoGallery 
                videos={property.videos} 
                propertyTitle={property.title} 
                onLaunchVirtualTour={() => onOpenVirtualTour(property, 'video')}
              />
            )}

            {activeMediaTab === 'land' && (
              <KeyDirectLandInspection
                property={property}
                onOpenVirtualTour={(mode) => onOpenVirtualTour(property, mode)}
                onRequestViewing={() => setInspectionModalOpen(true)}
              />
            )}
          </div>

          {/* ================================================================= */}
          {/* 2. PROPERTY HEADLINE, PRICE & DIRECT OWNER PROFILE */}
          {/* ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                    {property.subType}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" /> {property.neighborhood}, {property.city}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Confirmed Available
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white">{property.title}</h1>
                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Bedrooms, Bathrooms, Amenities Metrics */}
              {!isLand && (
                <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Bedrooms</span>
                    <div className="text-lg font-black text-white flex items-center justify-center gap-1.5 mt-0.5">
                      <Bed className="w-4 h-4 text-red-500" /> {property.bedrooms} Beds
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Bathrooms</span>
                    <div className="text-lg font-black text-white flex items-center justify-center gap-1.5 mt-0.5">
                      <Bath className="w-4 h-4 text-blue-400" /> {property.bathrooms} Baths
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Power Supply</span>
                    <div className="text-sm font-black text-amber-400 mt-1 truncate">
                      {property.powerSupplyDetails.slice(0, 20)}...
                    </div>
                  </div>
                </div>
              )}

              {/* Amenities Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Verified Property Amenities
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {property.amenities.map((amenity, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Power, Water & Security Disclosures */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Utility Disclosures
                </span>
                <p className="text-slate-300">
                  ⚡ <strong>Power:</strong> {property.powerSupplyDetails}
                </p>
                <p className="text-slate-300">
                  🚰 <strong>Water:</strong> {property.waterSupplyDetails}
                </p>
                <p className="text-slate-300">
                  🛡️ <strong>Security:</strong> {property.securityArrangement}
                </p>
              </div>
            </div>

            {/* Right Column: Pricing & Direct Contact Desk */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pricing Card */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {property.pricePeriod === 'total' ? 'Outright Asking Price' : 'Annual Rent'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    ₦{property.priceNaira.toLocaleString()}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    ≈ ${(property.priceNaira / 1650).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                  </span>
                </div>

                {/* Direct Owner vs Agent Commission Breakdown */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span>Advertiser Status:</span>
                    {property.directOwner ? (
                      <span className="text-emerald-400 font-bold">Direct Title Owner</span>
                    ) : (
                      <span className="text-blue-400 font-bold">Licensed Agent</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Agency Commission:</span>
                    <span className="font-bold text-white">
                      {property.fees.agencyFeePercent === 0 ? '₦0 (0% Commission)' : `${property.fees.agencyFeePercent}%`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Legal / Agreement Fee:</span>
                    <span className="font-bold text-white">{property.fees.legalFeePercent}%</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Caution Deposit:</span>
                    <span className="font-bold text-white">₦{property.fees.cautionDepositNaira.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Inspection Logistics:</span>
                    <span className="font-bold text-emerald-400">₦{property.fees.inspectionFeeNaira.toLocaleString()} (Free)</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-black text-sm">
                    <span className="text-slate-200">Total Move-In Package:</span>
                    <span className="text-emerald-400">
                      ₦{property.fees.totalMoveInPackageNaira ? property.fees.totalMoveInPackageNaira.toLocaleString() : (property.priceNaira * 1.15).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Direct Contact Buttons */}
                <div className="space-y-2">
                  <a
                    href={`https://wa.me/${property.advertiserPhone.replace(/[^0-9]/g, '')}?text=Hello, I inspected your listing on KeyDirect: "${encodeURIComponent(property.title)}". I would like to arrange an inspection.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {property.directOwner ? 'Contact Owner Directly on WhatsApp' : 'Contact Managing Agent on WhatsApp'}
                  </a>

                  <a
                    href={`tel:${property.advertiserPhone}`}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call {property.advertiserPhone}
                  </a>

                  <button
                    onClick={() => setInspectionModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Book Physical Inspection
                  </button>
                </div>

                {/* Report link */}
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="text-[11px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
                  >
                    Report suspicious listing or inaccurate fee
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* 3. SIMILAR PROPERTIES IN SAME CITY */}
          {/* ================================================================= */}
          {similarProperties.length > 0 && (
            <div className="pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
                Similar Properties in {property.city}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {similarProperties.map(sim => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectProperty(sim)}
                    className="rounded-xl bg-slate-900 border border-slate-800 p-3 hover:border-red-500/50 transition-all cursor-pointer group"
                  >
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black mb-2">
                      <img src={sim.imageUrl} alt={sim.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-[10px] text-red-400 font-bold uppercase">{sim.neighborhood}</span>
                    <h5 className="text-xs font-bold text-white truncate mt-0.5">{sim.title}</h5>
                    <div className="text-sm font-black text-white mt-1">₦{sim.priceNaira.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ===================================================================== */}
      {/* IN-PERSON VIEWING REQUEST MODAL */}
      {/* ===================================================================== */}
      {inspectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                setInspectionModalOpen(false);
                setInspectionSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {inspectionSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <Check className="w-12 h-12 text-emerald-400 bg-emerald-500/20 rounded-full p-2 mx-auto" />
                <h3 className="text-base font-bold text-white">Inspection Scheduled!</h3>
                <p className="text-xs text-slate-300">
                  Your viewing request for <strong>{property.title}</strong> has been transmitted directly to {property.advertiserName}. They will confirm your {inspectionDate} {inspectionTime} slot via WhatsApp / SMS.
                </p>
                <button
                  onClick={() => setInspectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setInspectionSubmitted(true);
                }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <h3 className="text-base font-bold text-white">Request Physical Inspection</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Book a zero-commitment physical viewing with direct title owner or verified manager.
                </p>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={inspectionName}
                    onChange={(e) => setInspectionName(e.target.value)}
                    placeholder="e.g. David Alabi"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={inspectionPhone}
                    onChange={(e) => setInspectionPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Preferred Day</label>
                    <select
                      value={inspectionDate}
                      onChange={(e) => setInspectionDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>This Weekend</option>
                      <option>Next Week</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Time Window</label>
                    <select
                      value={inspectionTime}
                      onChange={(e) => setInspectionTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option>Morning (10:00 AM)</option>
                      <option>Afternoon (02:00 PM)</option>
                      <option>Evening (05:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Questions about Utilities / Access (Optional)</label>
                  <textarea
                    rows={2}
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    placeholder="e.g. What is the generator schedule? Is the road prone to flooding?"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Send Inspection Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* REPORT LISTING MODAL */}
      {/* ===================================================================== */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => {
                setReportModalOpen(false);
                setReportSubmitted(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {reportSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <Check className="w-12 h-12 text-emerald-400 bg-emerald-500/20 rounded-full p-2 mx-auto" />
                <h3 className="text-base font-bold text-white">Report Received</h3>
                <p className="text-xs text-slate-300">
                  Thank you for keeping KeyDirect transparent. Our audit team will verify this listing within 2 hours.
                </p>
                <button
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setReportSubmitted(true);
                }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Report Suspicious Listing</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Help prevent fraud, inflated agency commissions, or misleading property conditions.
                </p>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Reason for Report</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option>Misleading Price / Hidden Agency Fees</option>
                    <option>Property Already Leased / Sold</option>
                    <option>Agent Pretending to be Direct Owner</option>
                    <option>Incorrect Location or Fake Photos</option>
                    <option>Unreachable Contact Details</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Additional Details</label>
                  <textarea
                    rows={3}
                    placeholder="Provide context regarding your experience..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md cursor-pointer"
                >
                  Submit Flag to KeyDirect Audit
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
