import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Video, 
  RotateCw, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  HelpCircle,
  Building,
  Home,
  MapPin,
  DollarSign,
  ShieldCheck,
  Check
} from 'lucide-react';
import { PropertyListing, PropertyPhoto, PropertyVideo, PanoramaRoom, PropertyCategory, PropertySubtype } from '../data/keyDirectData';
import confetti from 'canvas-confetti';

interface KeyDirectUploadModalProps {
  onClose: () => void;
  onSaveProperty: (property: PropertyListing) => void;
}

export const KeyDirectUploadModal: React.FC<KeyDirectUploadModalProps> = ({
  onClose,
  onSaveProperty
}) => {
  // Step navigation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('Apartments');
  const [subType, setSubType] = useState<PropertySubtype>('Apartment');
  const [city, setCity] = useState('Lagos');
  const [neighborhood, setNeighborhood] = useState('Lekki Phase 1');
  const [priceNaira, setPriceNaira] = useState<number>(15000000);
  const [pricePeriod, setPricePeriod] = useState<'per annum' | 'total' | 'per night' | 'per month'>('per annum');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [advertiserType, setAdvertiserType] = useState<'Owner' | 'Agent' | 'Developer'>('Owner');
  const [directOwner, setDirectOwner] = useState(true);
  const [advertiserName, setAdvertiserName] = useState('Property Owner');
  const [advertiserPhone, setAdvertiserPhone] = useState('+234 800 000 0000');
  const [description, setDescription] = useState('');
  
  // Power & Water details
  const [powerDetails, setPowerDetails] = useState('24/7 dedicated generator sync and inverter backup');
  const [waterDetails, setWaterDetails] = useState('Industrial borehole with reverse-osmosis purification');
  const [securityDetails, setSecurityDetails] = useState('Gated security, biometric code, 24/7 armed patrol');

  // Land specific
  const [landSize, setLandSize] = useState('1,200 SQM (2 Standard Plots)');
  const [plotDimensions, setPlotDimensions] = useState('120ft by 100ft');
  const [terrainType, setTerrainType] = useState<'100% Table Dry Land' | 'Sandy Loam' | 'Partially Waterlogged (Sandfilling Needed)' | 'Elevated Ridge'>('100% Table Dry Land');
  const [titleType, setTitleType] = useState<'Governor’s Consent' | 'Certificate of Occupancy (C of O)' | 'Gazette' | 'Deed of Assignment' | 'Registered Survey Plan'>('Governor’s Consent');
  const [surveyNumber, setSurveyNumber] = useState('LS/EP/2026/0122');

  // Transparent Fees
  const [agencyPercent, setAgencyPercent] = useState<number>(0);
  const [legalPercent, setLegalPercent] = useState<number>(5);
  const [cautionDeposit, setCautionDeposit] = useState<number>(1500000);
  const [serviceCharge, setServiceCharge] = useState<number>(2000000);
  const [inspectionFee, setInspectionFee] = useState<number>(0);

  // Uploaded media collections
  const [photos, setPhotos] = useState<PropertyPhoto[]>([
    {
      id: 'photo-1',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Main Living Room with double volume glass',
      roomType: 'Living Room'
    },
    {
      id: 'photo-2',
      url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Gourmet Kitchen with central island',
      roomType: 'Kitchen'
    }
  ]);

  const [videos, setVideos] = useState<PropertyVideo[]>([
    {
      id: 'video-1',
      title: 'Continuous Walkthrough: Gate to Balcony',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: '2:45',
      category: 'Interior Walkthrough',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    }
  ]);

  const [panoramas, setPanoramas] = useState<PanoramaRoom[]>([
    {
      id: 'pano-up-1',
      roomName: 'Living Room 360°',
      imageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=2048&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80',
      description: '360° panoramic equirectangular photo of the main living area.'
    }
  ]);

  // Upload Progress Simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // New photo input state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoRoom, setNewPhotoRoom] = useState<PropertyPhoto['roomType']>('Living Room');

  // Handle Photo Add
  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;
    const item: PropertyPhoto = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || `${newPhotoRoom} View`,
      roomType: newPhotoRoom
    };
    setPhotos([...photos, item]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  // Simulate File Upload from Local Device
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size exceeds 25MB limit. Please compress image before upload.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          setIsUploading(false);
          // Create local object URL for preview
          const localUrl = URL.createObjectURL(file);
          setPhotos(prevPhotos => [
            ...prevPhotos,
            {
              id: `photo-local-${Date.now()}`,
              url: localUrl,
              caption: file.name.replace(/\.[^/.]+$/, ''),
              roomType: newPhotoRoom
            }
          ]);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  // Submit Listing
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isLand = category === 'Plots / Land';

    const agencyAmount = (priceNaira * (agencyPercent / 100));
    const legalAmount = (priceNaira * (legalPercent / 100));
    const totalMoveIn = priceNaira + cautionDeposit + serviceCharge + agencyAmount + legalAmount + inspectionFee;

    const newListing: PropertyListing = {
      id: `prop-${Date.now()}`,
      title: title || `${subType} in ${neighborhood}, ${city}`,
      category,
      subType,
      city,
      neighborhood,
      priceNaira,
      pricePeriod: isLand ? 'total' : pricePeriod,
      bedrooms: isLand ? 0 : bedrooms,
      bathrooms: isLand ? 0 : bathrooms,
      advertiserType,
      advertiserName,
      advertiserPhone,
      directOwner,
      imageUrl: photos[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      description,
      confirmedAvailable: true,
      lastUpdated: 'Just now (New Listing)',
      isDigitalBillboard: true,
      featuredScore: 95,
      verifiedBadge: true,
      powerSupplyDetails: powerDetails,
      waterSupplyDetails: waterDetails,
      securityArrangement: securityDetails,
      amenities: ['24/7 Power', 'Gated Security', 'Dedicated Parking', 'Treated Water'],
      fees: {
        rentOrAskingNaira: priceNaira,
        isDirectOwner: directOwner,
        agencyFeePercent: directOwner ? 0 : agencyPercent,
        legalFeePercent: legalPercent,
        cautionDepositNaira: cautionDeposit,
        serviceChargeNaira: serviceCharge,
        inspectionFeeNaira: inspectionFee,
        totalMoveInPackageNaira: totalMoveIn
      },
      photos,
      videos,
      virtualTour: {
        has360: panoramas.length > 0,
        hasInteractiveHotspots: panoramas.length > 1,
        hasPhotoTour: photos.length > 0,
        hasVideoTour: videos.length > 0,
        videoWalkthroughUrl: videos[0]?.url,
        panoramas,
        photoTourRooms: photos.map(p => ({
          roomName: p.caption,
          imageUrl: p.url,
          inspectionNotes: `Physical inspection view for ${p.roomType}`
        }))
      },
      landDetails: isLand ? {
        landSize,
        plotDimensions,
        terrainType,
        drainage: 'Constructed concrete perimeter drainage',
        vegetation: 'Cleared & Beaconed',
        roadAccess: 'Asphalt paved road direct to perimeter',
        utilitiesProximity: 'Direct electricity and telecommunications network',
        titleDocumentType: titleType,
        surveyNumber,
        surveyPlanImageUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80',
        boundariesVerified: true,
        approxCoordinates: { lat: 6.5833, lng: 3.9833 },
        legalNotice: 'Legal Reminder: Uploaded survey plans must be verified independently at the state lands registry.'
      } : undefined
    };

    onSaveProperty(newListing);
    confetti({ particleCount: 50, colors: ['#c52222', '#1dbf73', '#ffffff'] });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 text-slate-100 font-sans">
      <div className="bg-slate-950 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
              KeyDirect Property Creator
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              Publish Verified Listing with Video & Virtual Tours
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Help buyers and tenants inspect remotely, reduce wasted transport, and eliminate hidden agent fees.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        <div className="bg-slate-900/60 px-6 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
          {[
            { step: 1, label: '1. Basic Details' },
            { step: 2, label: '2. Photos & 360 Panoramas' },
            { step: 3, label: '3. Video Walkthroughs' },
            { step: 4, label: '4. Transparent Fees & Review' }
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step as any)}
              className={`font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentStep === s.step 
                  ? 'text-red-400 border-b-2 border-red-500 pb-1' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleFinalSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ----------------------------------------------------------------- */}
          {/* STEP 1: BASIC DETAILS */}
          {/* ----------------------------------------------------------------- */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Listing Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Modern 3-Bedroom Penthouse with Lagoon View & Inverter"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Primary Category</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const cat = e.target.value as PropertyCategory;
                      setCategory(cat);
                      if (cat === 'Plots / Land') setSubType('Residential Plot');
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Apartments">Apartments & Flats</option>
                    <option value="Rental">Houses & Duplexes</option>
                    <option value="Rooms">Self-Contain & Rooms</option>
                    <option value="Commercial">Shops & Commercial</option>
                    <option value="Plots / Land">Plots & Land Sites</option>
                    <option value="Shortlet">Hotels & Shortlet</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Property Sub-Type</label>
                  <select
                    value={subType}
                    onChange={(e) => setSubType(e.target.value as PropertySubtype)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Apartment">Apartment / Flat</option>
                    <option value="Duplex / Maisonette">Duplex / Maisonette</option>
                    <option value="Self-Contain Unit">Self-Contained Unit</option>
                    <option value="Room and Parlour">Room and Parlour</option>
                    <option value="Commercial Office">Commercial Office</option>
                    <option value="Shop / Retail">Shop / Retail Store</option>
                    <option value="Warehouse">Warehouse / Storage</option>
                    <option value="Hotel / Party Apartment">Short-Let / Party Suite</option>
                    <option value="Residential Plot">Residential Land Plot</option>
                    <option value="Commercial Land">Commercial Land</option>
                    <option value="Estate Development Site">Development Site</option>
                    <option value="Under Construction">Under Construction</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Enugu', 'Asaba', 'Kano', 'Calabar'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Neighbourhood / District</label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Lekki Phase 1, Ikoyi, Victoria Island, Maitama"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Price (₦ Naira)</label>
                    <input
                      type="number"
                      required
                      value={priceNaira}
                      onChange={(e) => setPriceNaira(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Billing Period</label>
                    <select
                      value={pricePeriod}
                      onChange={(e) => setPricePeriod(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="per annum">per annum</option>
                      <option value="total">total (outright sale)</option>
                      <option value="per month">per month</option>
                      <option value="per night">per night</option>
                    </select>
                  </div>
                </div>
              </div>

              {category !== 'Plots / Land' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Land Specific Fields */}
              {category === 'Plots / Land' && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                  <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">
                    Land & Plot Inspection Metrics
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Stated Land Size</label>
                      <input
                        type="text"
                        value={landSize}
                        onChange={(e) => setLandSize(e.target.value)}
                        placeholder="e.g. 1,200 SQM (2 Plots)"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Plot Dimensions</label>
                      <input
                        type="text"
                        value={plotDimensions}
                        onChange={(e) => setPlotDimensions(e.target.value)}
                        placeholder="e.g. 120ft x 100ft"
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Terrain Type</label>
                      <select
                        value={terrainType}
                        onChange={(e) => setTerrainType(e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        <option value="100% Table Dry Land">100% Table Dry Land</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Partially Waterlogged (Sandfilling Needed)">Partially Waterlogged</option>
                        <option value="Elevated Ridge">Elevated Ridge</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Property Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide honest details regarding compound space, lighting, water filtration, security, and surrounding access roads..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Advertiser Distinction: Owner vs Agent */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-200 block uppercase tracking-wider">
                  Advertiser Designation (Zero Misrepresentation)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAdvertiserType('Owner');
                      setDirectOwner(true);
                      setAgencyPercent(0);
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      directOwner 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Direct Property Owner</span>
                      {directOwner && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Zero agent commission. Direct title holder.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdvertiserType('Agent');
                      setDirectOwner(false);
                      setAgencyPercent(10);
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                      !directOwner 
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>Authorized Agent / Broker</span>
                      {!directOwner && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">Agency fee disclosed transparently upfront.</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={advertiserName}
                      onChange={(e) => setAdvertiserName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Direct Phone / WhatsApp Number</label>
                    <input
                      type="text"
                      value={advertiserPhone}
                      onChange={(e) => setAdvertiserPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Continue to Media Uploads →
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* STEP 2: PHOTOS & 360 PANORAMAS */}
          {/* ----------------------------------------------------------------- */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Local File Upload Drag-and-Drop Area */}
              <div className="border-2 border-dashed border-slate-700 hover:border-red-500 rounded-2xl p-6 text-center space-y-3 bg-slate-900/40 transition-all">
                <Upload className="w-8 h-8 text-red-500 mx-auto" />
                <div>
                  <h4 className="text-xs font-bold text-white">Upload Photos from Device (Phone, Tablet or PC)</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Supports JPG, PNG, WebP up to 25MB each. High resolution recommended.</p>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer border border-slate-700">
                  <Camera className="w-3.5 h-3.5 text-red-400" />
                  Select Files from Device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>

                {isUploading && (
                  <div className="max-w-xs mx-auto space-y-1 pt-2">
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Uploading... {uploadProgress}%</span>
                  </div>
                )}

                {uploadError && (
                  <div className="text-xs text-rose-400 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {uploadError}
                  </div>
                )}
              </div>

              {/* Add Photo by URL or Room categorization */}
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3">
                <span className="text-xs font-bold text-slate-200 block uppercase">
                  Add Photo by Web URL & Room Assignment
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-6">
                    <input
                      type="url"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Paste Image URL (https://...)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <select
                      value={newPhotoRoom}
                      onChange={(e) => setNewPhotoRoom(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    >
                      {['Entrance', 'Living Room', 'Bedroom', 'Master Suite', 'Kitchen', 'Bathroom', 'Balcony', 'Compound', 'Parking', 'Street View', 'Land Perimeter', 'Survey Plan'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="button"
                      onClick={handleAddPhoto}
                      className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Photos Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase mb-3">
                  Organized Photographs ({photos.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {photos.map((p, idx) => (
                    <div key={p.id} className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative group">
                      <div className="aspect-video w-full overflow-hidden">
                        <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2 flex items-center justify-between text-[10px]">
                        <span className="font-bold text-red-400 truncate">{p.roomType}</span>
                        <button
                          type="button"
                          onClick={() => setPhotos(photos.filter(x => x.id !== p.id))}
                          className="text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 360 Panorama Section */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase">
                      <RotateCw className="w-4 h-4 text-emerald-400" />
                      360° Equirectangular Panorama Uploads
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Genuine 2:1 aspect ratio panoramic photos for the Three.js spherical viewer.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {panoramas.length} Panoramas
                  </span>
                </div>

                <div className="space-y-2">
                  {panoramas.map((pano, i) => (
                    <div key={pano.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img src={pano.thumbnailUrl} alt={pano.roomName} className="w-8 h-8 rounded object-cover" />
                        <span className="font-bold text-white">{pano.roomName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPanoramas(panoramas.filter(x => x.id !== pano.id))}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  ← Back to Details
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Continue to Video Walkthroughs →
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* STEP 3: VIDEO WALKTHROUGHS */}
          {/* ----------------------------------------------------------------- */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-red-500" />
                  Add Video Walkthrough Footage
                </h4>
                <p className="text-[11px] text-slate-400">
                  Upload MP4 walkthroughs showing street entrance, electrical panels, water supply, room dimensions, or land boundary pegs.
                </p>

                <div className="space-y-3 pt-2">
                  {videos.map(v => (
                    <div key={v.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-red-400 font-bold uppercase">{v.category}</span>
                        <h5 className="font-bold text-white mt-0.5">{v.title}</h5>
                        <span className="text-[10px] text-slate-500 font-mono">Duration: {v.duration}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVideos(videos.filter(x => x.id !== v.id))}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  ← Back to Photos
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Continue to Fee Breakdown & Review →
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* STEP 4: TRANSPARENT FEES & FINAL PUBLICATION */}
          {/* ----------------------------------------------------------------- */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  Itemize Transparent Fees (Zero Hidden Surprise Costs)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Agency Commission (%)</label>
                    <input
                      type="number"
                      disabled={directOwner}
                      value={directOwner ? 0 : agencyPercent}
                      onChange={(e) => setAgencyPercent(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white disabled:opacity-50"
                    />
                    {directOwner && <span className="text-[10px] text-emerald-400">0% for Direct Owner listings</span>}
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Legal & Agreement Fee (%)</label>
                    <input
                      type="number"
                      value={legalPercent}
                      onChange={(e) => setLegalPercent(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Refundable Caution Deposit (₦)</label>
                    <input
                      type="number"
                      value={cautionDeposit}
                      onChange={(e) => setCautionDeposit(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Annual Service Charge (₦)</label>
                    <input
                      type="number"
                      value={serviceCharge}
                      onChange={(e) => setServiceCharge(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Inspection / Viewing Charge (₦)</label>
                    <input
                      type="number"
                      value={inspectionFee}
                      onChange={(e) => setInspectionFee(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <span className="text-[10px] text-slate-500">KeyDirect recommends ₦0 viewing charges.</span>
                  </div>
                </div>

                {/* Total Calculated Cost */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-bold">Estimated Total Move-in Package:</span>
                    <span className="text-[10px] text-slate-500">Rent + Legal + Caution + Service Charge</span>
                  </div>
                  <div className="text-xl font-black text-emerald-400">
                    ₦{(priceNaira + cautionDeposit + serviceCharge + (priceNaira * (legalPercent/100)) + (priceNaira * ((directOwner ? 0 : agencyPercent)/100)) + inspectionFee).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Publication button */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  ← Back to Videos
                </button>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-xl shadow-red-900/40 cursor-pointer"
                >
                  🚀 Publish Verified Listing Now
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};
