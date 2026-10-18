import React from 'react';
import { 
  X, 
  Check, 
  Minus, 
  Video, 
  RotateCw, 
  Camera, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { PropertyListing } from '../data/keyDirectData';

interface KeyDirectCompareModalProps {
  properties: PropertyListing[];
  onClose: () => void;
  onRemoveFromCompare: (id: string) => void;
  onSelectProperty: (property: PropertyListing) => void;
  onOpenVirtualTour: (property: PropertyListing) => void;
}

export const KeyDirectCompareModal: React.FC<KeyDirectCompareModalProps> = ({
  properties,
  onClose,
  onRemoveFromCompare,
  onSelectProperty,
  onOpenVirtualTour
}) => {
  if (properties.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Properties in Comparison</h3>
          <p className="text-xs text-slate-400">
            Click the "Compare" checkbox on any listing card to compare up to 4 properties side-by-side before arranging inspections.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 text-slate-100 font-sans">
      <div className="bg-slate-950 border border-slate-700 rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
              Remote Inspection Assistant
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              Side-by-Side Property Comparison ({properties.length} / 4)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare transparent costs, owner direct status, and remote media before committing to travel expenses.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table Grid */}
        <div className="flex-1 overflow-x-auto p-4 sm:p-6">
          <div className="min-w-[650px] space-y-4">
            
            {/* 1. Header Cards (Image + Title + Price) */}
            <div className="grid grid-cols-5 gap-4 items-end pb-4 border-b border-slate-800">
              <div className="col-span-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Property Overview
              </div>
              {properties.map(p => (
                <div key={p.id} className="col-span-1 rounded-xl bg-slate-900 border border-slate-800 p-3 relative flex flex-col justify-between">
                  <button
                    onClick={() => onRemoveFromCompare(p.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center text-xs shadow-md cursor-pointer border border-slate-700"
                    title="Remove from comparison"
                  >
                    ✕
                  </button>

                  <div className="aspect-video w-full rounded-lg overflow-hidden mb-2 bg-black">
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  </div>

                  <span className="text-[10px] text-red-400 font-bold uppercase">{p.neighborhood}, {p.city}</span>
                  <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{p.title}</h4>
                  
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <div className="text-sm font-black text-white">₦{p.priceNaira.toLocaleString()}</div>
                    <span className="text-[10px] text-slate-400 font-mono">≈ ${(p.priceNaira / 1650).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD</span>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onSelectProperty(p);
                    }}
                    className="mt-3 w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold shadow-md cursor-pointer"
                  >
                    View Full Details
                  </button>
                </div>
              ))}
            </div>

            {/* 2. Direct Owner vs Agent & Commission */}
            <div className="grid grid-cols-5 gap-4 py-3 border-b border-slate-800/80 text-xs items-center">
              <div className="col-span-1 font-bold text-slate-300">
                Advertiser & Agency Fee
              </div>
              {properties.map(p => (
                <div key={p.id} className="col-span-1">
                  {p.directOwner ? (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[11px] block text-center">
                      Direct Owner (0% Commission)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold text-[11px] block text-center">
                      Verified Agent ({p.fees?.agencyFeePercent || 10}%)
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* 3. Total Move-In Package Cost */}
            <div className="grid grid-cols-5 gap-4 py-3 border-b border-slate-800/80 text-xs items-center bg-slate-900/40 rounded-xl px-2">
              <div className="col-span-1 font-bold text-slate-300">
                Estimated Total Move-In Cost
                <span className="text-[10px] text-slate-500 block font-normal">Rent + Caution + Legal + Agency + Service</span>
              </div>
              {properties.map(p => (
                <div key={p.id} className="col-span-1 text-center">
                  <div className="text-sm font-black text-amber-400">
                    ₦{p.fees?.totalMoveInPackageNaira ? p.fees.totalMoveInPackageNaira.toLocaleString() : (p.priceNaira * 1.2).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">No hidden surprises</span>
                </div>
              ))}
            </div>

            {/* 4. Remote Inspection Media Availability */}
            <div className="grid grid-cols-5 gap-4 py-3 border-b border-slate-800/80 text-xs items-center">
              <div className="col-span-1 font-bold text-slate-300">
                Virtual Tour & Video Walkthrough
              </div>
              {properties.map(p => (
                <div key={p.id} className="col-span-1 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-1.5">
                    {p.virtualTour?.has360 ? (
                      <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold flex items-center gap-1">
                        <RotateCw className="w-3 h-3" /> 360° Tour
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">No 360°</span>
                    )}

                    {p.videos && p.videos.length > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Video className="w-3 h-3" /> {p.videos.length} Videos
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">No Video</span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenVirtualTour(p);
                    }}
                    className="w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Launch Tour
                  </button>
                </div>
              ))}
            </div>

            {/* 5. Location Details & Infrastructure */}
            <div className="grid grid-cols-5 gap-4 py-3 border-b border-slate-800/80 text-xs items-center bg-slate-900/20 px-2 rounded-xl">
              <div className="col-span-1 font-bold text-slate-300">
                Location & Accessibility
                <span className="text-[10px] text-slate-500 block font-normal">Neighborhood, City & Access</span>
              </div>
              {properties.map(p => (
                <div key={p.id} className="col-span-1 text-center space-y-1">
                  <div className="font-bold text-slate-100">{p.neighborhood}</div>
                  <div className="text-[11px] text-slate-400">{p.city}</div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                    {p.category === 'Plots / Land' && p.landDetails?.roadAccess ? p.landDetails.roadAccess : 'Tarred Access Road'}
                  </span>
                </div>
              ))}
            </div>

            {/* 6. Bedrooms, Bathrooms / Land Dimensions */}
            <div className="grid grid-cols-5 gap-4 py-3 border-b border-slate-800/80 text-xs items-center">
              <div className="col-span-1 font-bold text-slate-300">
                Accommodation / Land Size
              </div>
              {properties.map(p => (
                <div key={p.id} className="col-span-1 text-center font-medium text-slate-200">
                  {p.category === 'Plots / Land' ? (
                    <div className="space-y-0.5">
                      <span className="font-black text-amber-400 text-sm">{p.landDetails?.landSize || '1,200 SQM'}</span>
                      <div className="text-[10px] text-slate-400">{p.landDetails?.terrainType || 'Dry Solid Ground'}</div>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-sm text-slate-100">{p.bedrooms} Beds • {p.bathrooms} Baths</span>
                      <div className="text-[10px] text-slate-400">{p.subType}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 7. Key Amenities Comparison Matrix */}
            <div className="py-2 border-b border-slate-800/80">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 px-2 text-slate-400">
                Verified Amenities & Facilities
              </div>
              
              {/* Power Supply */}
              <div className="grid grid-cols-5 gap-4 py-2 text-xs items-center px-2 hover:bg-slate-900/30 rounded-lg">
                <div className="col-span-1 text-slate-400 font-medium">Electricity & Backup</div>
                {properties.map(p => (
                  <div key={p.id} className="col-span-1 text-center text-slate-200 text-[11px]">
                    {p.powerSupplyDetails ? (
                      <span className="text-emerald-400 font-medium flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5 shrink-0" /> {p.powerSupplyDetails}
                      </span>
                    ) : (
                      <span className="text-slate-500">Standard Grid</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Water Supply */}
              <div className="grid grid-cols-5 gap-4 py-2 text-xs items-center px-2 hover:bg-slate-900/30 rounded-lg">
                <div className="col-span-1 text-slate-400 font-medium">Clean Water Supply</div>
                {properties.map(p => (
                  <div key={p.id} className="col-span-1 text-center text-slate-200 text-[11px]">
                    {p.waterSupplyDetails ? (
                      <span className="text-emerald-400 font-medium flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5 shrink-0" /> {p.waterSupplyDetails}
                      </span>
                    ) : (
                      <span className="text-slate-500">Borehole</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Common Amenities Checks */}
              {['24/7 Security Guard / CCTV', 'Swimming Pool', 'High Speed Fiber WiFi', 'Ample Parking'].map(amenity => (
                <div key={amenity} className="grid grid-cols-5 gap-4 py-2 text-xs items-center px-2 hover:bg-slate-900/30 rounded-lg">
                  <div className="col-span-1 text-slate-400 font-medium">{amenity}</div>
                  {properties.map(p => {
                    const hasAmenity = p.amenities.some(a => 
                      a.toLowerCase().includes(amenity.toLowerCase().split(' ')[0]) ||
                      a.toLowerCase().includes('pool') && amenity.includes('Pool') ||
                      a.toLowerCase().includes('security') && amenity.includes('Security') ||
                      a.toLowerCase().includes('parking') && amenity.includes('Parking') ||
                      a.toLowerCase().includes('wifi') && amenity.includes('Fiber')
                    );
                    return (
                      <div key={p.id} className="col-span-1 text-center">
                        {hasAmenity ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-800 text-slate-600">
                            <Minus className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* 8. Inspection & Legal Fees Breakdown */}
            <div className="grid grid-cols-5 gap-4 py-3 border-b border-slate-800/80 text-xs items-center bg-slate-900/30 px-2 rounded-xl">
              <div className="col-span-1 font-bold text-slate-300">
                Inspection & Legal Fees
                <span className="text-[10px] text-slate-500 block font-normal">Remote video saves transport!</span>
              </div>
              {properties.map(p => (
                <div key={p.id} className="col-span-1 text-center space-y-1">
                  <div className="text-[11px]">
                    <span className="text-slate-400">Physical Inspection: </span>
                    <span className="font-bold text-slate-100">
                      {p.directOwner ? '₦0 Free' : `₦${(p.fees?.inspectionFeeNaira || 5000).toLocaleString()}`}
                    </span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-slate-400">Legal/Agreement: </span>
                    <span className="font-bold text-slate-100">{p.fees?.legalFeePercent || 10}%</span>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-slate-400">Refundable Caution: </span>
                    <span className="font-bold text-slate-100">
                      {p.fees?.cautionDepositNaira ? `₦${p.fees.cautionDepositNaira.toLocaleString()}` : '10%'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* 9. Direct Action Row */}
            <div className="grid grid-cols-5 gap-4 pt-4 items-center">
              <div className="col-span-1 font-bold text-slate-300">
                Direct Contact & Schedule
              </div>
              {properties.map(p => (
                <div key={p.id} className="col-span-1 space-y-1.5">
                  <a
                    href={`https://wa.me/${p.advertiserPhone.replace(/[^0-9]/g, '')}?text=Hello, I am comparing listings on KeyDirect and want to inquire about: "${encodeURIComponent(p.title)}".`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp {p.directOwner ? 'Owner' : 'Agent'}
                  </a>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectProperty(p);
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold text-center cursor-pointer"
                  >
                    Open Inspection Sheet
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
