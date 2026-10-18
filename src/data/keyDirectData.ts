export type PropertyCategory = 
  | 'Apartments' 
  | 'Rooms' 
  | 'Commercial' 
  | 'Hotels' 
  | 'Rental' 
  | 'Plots / Land'
  | 'Shortlet';

export type PropertySubtype =
  | 'Apartment'
  | 'Duplex / Maisonette'
  | 'Self-Contain Unit'
  | 'Room and Parlour'
  | 'Commercial Office'
  | 'Shop / Retail'
  | 'Warehouse'
  | 'Hotel / Party Apartment'
  | 'Residential Plot'
  | 'Commercial Land'
  | 'Estate Development Site'
  | 'Under Construction';

export interface PropertyPhoto {
  id: string;
  url: string;
  caption: string;
  roomType: 'Entrance' | 'Living Room' | 'Bedroom' | 'Master Suite' | 'Kitchen' | 'Bathroom' | 'Balcony' | 'Compound' | 'Parking' | 'Street View' | 'Land Perimeter' | 'Survey Plan' | 'Office Interior';
}

export interface PropertyVideo {
  id: string;
  title: string;
  url: string;
  duration: string;
  category: 'Entrance & Street' | 'Compound & Exterior' | 'Interior Walkthrough' | 'Bedrooms & Bathrooms' | 'Utilities & Power' | 'Balconies & Views' | 'Boundaries & Road Access';
  thumbnailUrl: string;
}

export interface Hotspot {
  id: string;
  targetRoom: string;
  pitch: number;
  yaw: number;
  label: string;
}

export interface PanoramaRoom {
  id: string;
  roomName: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  hotspots?: Hotspot[];
}

export interface VirtualTourData {
  has360: boolean;
  hasInteractiveHotspots: boolean;
  hasPhotoTour: boolean;
  hasVideoTour: boolean;
  videoWalkthroughUrl?: string;
  videoChapters?: { title: string; timestamp: number }[];
  panoramas?: PanoramaRoom[];
  photoTourRooms?: { roomName: string; imageUrl: string; inspectionNotes: string }[];
}

export interface LandDetails {
  landSize: string; // e.g. "1,200 SQM (2 Standard Plots)"
  plotDimensions: string; // e.g. "60ft x 120ft each"
  terrainType: '100% Table Dry Land' | 'Sandy Loam' | 'Partially Waterlogged (Sandfilling Needed)' | 'Elevated Ridge';
  drainage: string;
  vegetation: 'Cleared & Beaconed' | 'Light Bush' | 'Fenced Perimeter';
  roadAccess: string;
  utilitiesProximity: string;
  titleDocumentType: 'Governor’s Consent' | 'Certificate of Occupancy (C of O)' | 'Gazette' | 'Deed of Assignment' | 'Registered Survey Plan';
  surveyNumber?: string;
  surveyPlanImageUrl?: string;
  boundariesVerified: boolean;
  approxCoordinates?: { lat: number; lng: number };
  legalNotice: string;
}

export interface FeeBreakdown {
  rentOrAskingNaira: number;
  isDirectOwner: boolean;
  agencyFeePercent: number; // 0 for Direct Owner, 10% for Agent
  legalFeePercent: number; // 5 - 10%
  cautionDepositNaira: number;
  serviceChargeNaira: number;
  inspectionFeeNaira: number; // Disclosed transparently, often ₦0
  totalMoveInPackageNaira: number;
}

export interface PropertyListing {
  id: string;
  title: string;
  category: PropertyCategory;
  subType: PropertySubtype;
  city: string;
  neighborhood: string;
  priceNaira: number;
  pricePeriod: 'per annum' | 'total' | 'per night' | 'per month';
  bedrooms: number;
  bathrooms: number;
  advertiserType: 'Owner' | 'Agent' | 'Developer';
  advertiserName: string;
  advertiserPhone: string;
  directOwner: boolean;
  imageUrl: string;
  description: string;
  
  // Media Collections
  photos: PropertyPhoto[];
  videos: PropertyVideo[];
  virtualTour?: VirtualTourData;

  // Land Inspection Details (Only for Land / Plots)
  landDetails?: LandDetails;

  // Transparent Fees
  fees: FeeBreakdown;

  // Amenities & Status
  amenities: string[];
  powerSupplyDetails: string;
  waterSupplyDetails: string;
  securityArrangement: string;
  isDigitalBillboard?: boolean;
  featuredScore?: number;
  verifiedBadge?: boolean;
  confirmedAvailable: boolean;
  lastUpdated: string;
}

export const initialKeyDirectProperties: PropertyListing[] = [
  {
    id: 'prop-1',
    title: 'Luxury 4-Bedroom Waterfront Maisonette with Private Pool',
    category: 'Apartments',
    subType: 'Duplex / Maisonette',
    city: 'Lagos',
    neighborhood: 'Ikoyi (Banana Island View)',
    priceNaira: 35000000,
    pricePeriod: 'per annum',
    bedrooms: 4,
    bathrooms: 5,
    advertiserType: 'Owner',
    advertiserName: 'Chief T. Balogun (Direct Property Owner)',
    advertiserPhone: '+234 803 892 4110',
    directOwner: true,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Direct from the title owner. Zero agency commission and zero agent inspection charges. Fully automated waterfront penthouse maisonette with floor-to-ceiling glass balconies overlooking the Five Cowries creek. Features 24/7 uninterrupted private power, automated smart access, infinity pool, and private boat jetty.',
    confirmedAvailable: true,
    lastUpdated: 'Today at 09:15 AM',
    isDigitalBillboard: true,
    featuredScore: 99,
    verifiedBadge: true,
    powerSupplyDetails: '24/7 dedicated generator sync + 15kVA Solar Inverter backup',
    waterSupplyDetails: 'Industrial grade reverse-osmosis borehole water treatment plant',
    securityArrangement: 'Biometric smart locks, 24/7 armed estate guard gate, CCTV perimeter',
    amenities: ['Private Pool', '24/7 Power', 'Waterfront Jetty', 'Smart Home Automation', 'Fitted Italian Kitchen', 'Elevator', 'Basement Parking'],
    fees: {
      rentOrAskingNaira: 35000000,
      isDirectOwner: true,
      agencyFeePercent: 0,
      legalFeePercent: 5,
      cautionDepositNaira: 3000000,
      serviceChargeNaira: 4500000,
      inspectionFeeNaira: 0,
      totalMoveInPackageNaira: 44250000
    },
    photos: [
      {
        id: 'p1-1',
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Waterfront Living Room with panoramic balcony views',
        roomType: 'Living Room'
      },
      {
        id: 'p1-2',
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
        caption: 'Chef Kitchen with granite island and built-in Miele appliances',
        roomType: 'Kitchen'
      },
      {
        id: 'p1-3',
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        caption: 'Master Suite with oak wood flooring and direct terrace',
        roomType: 'Master Suite'
      },
      {
        id: 'p1-4',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
        caption: 'En-suite master bath with freestanding jacuzzi soak tub',
        roomType: 'Bathroom'
      },
      {
        id: 'p1-5',
        url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
        caption: 'Private infinity pool overlooking the lagoon',
        roomType: 'Balcony'
      },
      {
        id: 'p1-6',
        url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
        caption: 'Gated compound entrance and covered double parking bay',
        roomType: 'Entrance'
      }
    ],
    videos: [
      {
        id: 'v1-1',
        title: 'Full Continuous Walkthrough: Entrance to Waterfront Terrace',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '3:45',
        category: 'Interior Walkthrough',
        thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'v1-2',
        title: 'Street Approach, Gate Security & Compound Perimeter',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '1:50',
        category: 'Entrance & Street',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'v1-3',
        title: 'Dedicated Generator Plant & Water Treatment Facility',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '1:15',
        category: 'Utilities & Power',
        thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
      }
    ],
    virtualTour: {
      has360: true,
      hasInteractiveHotspots: true,
      hasPhotoTour: true,
      hasVideoTour: true,
      videoWalkthroughUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      videoChapters: [
        { title: 'Street & Gate Approach', timestamp: 0 },
        { title: 'Grand Foyer Entrance', timestamp: 35 },
        { title: 'Double Volume Living Room', timestamp: 80 },
        { title: 'Italian Gourmet Kitchen', timestamp: 140 },
        { title: 'Master Bedroom Suite', timestamp: 195 },
        { title: 'Lagoon Terrace & Pool', timestamp: 245 }
      ],
      panoramas: [
        {
          id: 'pano-1',
          roomName: 'Grand Living Room & Waterfront Vista',
          imageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=2048&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80',
          description: 'Experience 360° panoramic immersion into the double-height ceiling living room. Notice the natural daylight and marble tiles.',
          hotspots: [
            { id: 'h1', targetRoom: 'Gourmet Kitchen', pitch: -5, yaw: 85, label: '👉 Step into Gourmet Kitchen' },
            { id: 'h2', targetRoom: 'Waterfront Terrace & Pool', pitch: 0, yaw: 180, label: '🌊 Walk out to Pool Deck' }
          ]
        },
        {
          id: 'pano-2',
          roomName: 'Gourmet Kitchen',
          imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=2048&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=300&q=80',
          description: '360° view of fully fitted kitchen with pantry access and dual sinks.',
          hotspots: [
            { id: 'h3', targetRoom: 'Grand Living Room & Waterfront Vista', pitch: 0, yaw: -90, label: '👈 Return to Living Room' },
            { id: 'h4', targetRoom: 'Master Bedroom Suite', pitch: 10, yaw: 45, label: '🛏️ Upstairs to Master Suite' }
          ]
        },
        {
          id: 'pano-3',
          roomName: 'Master Bedroom Suite',
          imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=2048&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80',
          description: 'King-size master suite with acoustic double glazing and direct walk-in wardrobe.',
          hotspots: [
            { id: 'h5', targetRoom: 'Grand Living Room & Waterfront Vista', pitch: -15, yaw: 120, label: '👇 Down to Living Room' }
          ]
        },
        {
          id: 'pano-4',
          roomName: 'Waterfront Terrace & Pool',
          imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2048&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=300&q=80',
          description: 'Private infinity swimming pool deck with unhindered breeze and creek views.',
          hotspots: [
            { id: 'h6', targetRoom: 'Grand Living Room & Waterfront Vista', pitch: 0, yaw: 0, label: '🏡 Enter Living Room' }
          ]
        }
      ],
      photoTourRooms: [
        { roomName: '1. Private Compound Gate', imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Controlled gated access with intercom and 2 covered parking slots.' },
        { roomName: '2. Grand Foyer & Staircase', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Double ceiling clearance with ambient chandelier and guest cloakroom.' },
        { roomName: '3. Main Living Room', imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Open-plan design connected to water view terrace.' },
        { roomName: '4. Fully Fitted Kitchen', imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Fitted smoke extractor, gas & induction cooktop, double door fridge space.' },
        { roomName: '5. Master Bedroom', imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Polished hardwood finish with balcony facing sunset.' },
        { roomName: '6. Jacuzzi Bath', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Pressure shower system, heated towel rack, and ventilation.' }
      ]
    }
  },
  {
    id: 'prop-2',
    title: 'Modern 3-Bedroom Penthouse in Serviced Gated Estate',
    category: 'Apartments',
    subType: 'Apartment',
    city: 'Lagos',
    neighborhood: 'Lekki Phase 1 (Admiralty Way Axis)',
    priceNaira: 14000000,
    pricePeriod: 'per annum',
    bedrooms: 3,
    bathrooms: 4,
    advertiserType: 'Owner',
    advertiserName: 'Dr. (Mrs.) Folake Adeleke (Owner)',
    advertiserPhone: '+234 812 550 9942',
    directOwner: true,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    description: 'Direct owner contact. No agent middleman fees. Serviced penthouse with 20 hours guaranteed daily estate light, swimming pool, gymnasium, and dedicated rooftop lounge area.',
    confirmedAvailable: true,
    lastUpdated: 'Yesterday at 04:30 PM',
    isDigitalBillboard: true,
    featuredScore: 95,
    verifiedBadge: true,
    powerSupplyDetails: 'Estate central power grid with dual Caterpillar generators (20h daily minimum)',
    waterSupplyDetails: 'Estate central treated water facility with automatic pressure pumps',
    securityArrangement: 'Uniformed estate patrol guards, biometric visitor pass code',
    amenities: ['Gym', 'Swimming Pool', 'Rooftop Terrace', 'Children Play Area', 'Elevator', '2 Car Slots'],
    fees: {
      rentOrAskingNaira: 14000000,
      isDirectOwner: true,
      agencyFeePercent: 0,
      legalFeePercent: 5,
      cautionDepositNaira: 1000000,
      serviceChargeNaira: 2200000,
      inspectionFeeNaira: 0,
      totalMoveInPackageNaira: 17900000
    },
    photos: [
      {
        id: 'p2-1',
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        caption: 'Penthouse Living Room with wrap-around glass windows',
        roomType: 'Living Room'
      },
      {
        id: 'p2-2',
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        caption: 'Spacious bedrooms with custom wardrobe cabinetry',
        roomType: 'Bedroom'
      },
      {
        id: 'p2-3',
        url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
        caption: 'Modern bathroom with walk-in glass shower cubicle',
        roomType: 'Bathroom'
      }
    ],
    videos: [
      {
        id: 'v2-1',
        title: 'Penthouse Video Walkthrough: Rooms, Balcony & Gym',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '2:15',
        category: 'Interior Walkthrough',
        thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
      }
    ],
    virtualTour: {
      has360: true,
      hasInteractiveHotspots: true,
      hasPhotoTour: true,
      hasVideoTour: true,
      videoWalkthroughUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      panoramas: [
        {
          id: 'pano-2-1',
          roomName: 'Penthouse Living Room',
          imageUrl: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=2048&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=300&q=80',
          description: 'Spacious high-rise living area with uninterrupted Lekki breeze.',
          hotspots: [
            { id: 'hp-2-1', targetRoom: 'Rooftop Balcony', pitch: -2, yaw: 110, label: '👉 Step out to Rooftop' }
          ]
        },
        {
          id: 'pano-2-2',
          roomName: 'Rooftop Balcony',
          imageUrl: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=2048&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80',
          description: 'Private terrace overlooking Lekki skyline.',
          hotspots: [
            { id: 'hp-2-2', targetRoom: 'Penthouse Living Room', pitch: 0, yaw: -70, label: '👈 Back Inside' }
          ]
        }
      ],
      photoTourRooms: [
        { roomName: 'Living Room', imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Double-glazed soundproof glass facing Admiralty Way.' },
        { roomName: 'Fitted Kitchen', imageUrl: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Includes integrated microwave and oven.' },
        { roomName: 'Master Bedroom', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Ensuite with built-in wardrobe and split AC.' }
      ]
    }
  },
  {
    id: 'prop-3',
    title: '1,200 SQM Dry Residential Land with Governor’s Consent',
    category: 'Plots / Land',
    subType: 'Residential Plot',
    city: 'Lagos',
    neighborhood: 'Epe Expressway / Alaro City Corridor',
    priceNaira: 65000000,
    pricePeriod: 'total',
    bedrooms: 0,
    bathrooms: 0,
    advertiserType: 'Developer',
    advertiserName: 'Heritage Crest Developers Ltd (Authorized Rep)',
    advertiserPhone: '+234 818 900 3341',
    directOwner: true,
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    description: '100% Table Dry Land directly along the expanding Epe Expressway growth axis. Perfect for immediate residential duplex development or high-yield land banking. Completely free from government acquisition and family (omo-onile) interference.',
    confirmedAvailable: true,
    lastUpdated: 'Today at 11:00 AM',
    isDigitalBillboard: true,
    featuredScore: 94,
    verifiedBadge: true,
    powerSupplyDetails: 'Adjacent to newly energized 33kVA district transmission line',
    waterSupplyDetails: 'Natural sweet fresh aquifer at 35 meters depth',
    securityArrangement: 'Fenced development estate perimeter with 24/7 security station',
    amenities: ['100% Dry Land', 'Governor’s Consent', 'Paved Access Road', 'Registered Survey', 'Immediate Allocation', 'No Omo-Onile Harassment'],
    fees: {
      rentOrAskingNaira: 65000000,
      isDirectOwner: true,
      agencyFeePercent: 0,
      legalFeePercent: 5,
      cautionDepositNaira: 0,
      serviceChargeNaira: 500000,
      inspectionFeeNaira: 0,
      totalMoveInPackageNaira: 68750000
    },
    landDetails: {
      landSize: '1,200 SQM (2 Standard Corner Plots)',
      plotDimensions: '120ft by 100ft Total Perimeter',
      terrainType: '100% Table Dry Land',
      drainage: 'Paved street gutter with standard runoff outfall into highway culvert',
      vegetation: 'Cleared & Beaconed',
      roadAccess: 'Asphalt dual-carriage expressway turning into paved 9m estate access road',
      utilitiesProximity: 'Power poles already installed on-street; telecommunications 5G cell tower nearby',
      titleDocumentType: 'Governor’s Consent',
      surveyNumber: 'LS/EP/2024/0998',
      surveyPlanImageUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80',
      boundariesVerified: true,
      approxCoordinates: { lat: 6.5833, lng: 3.9833 },
      legalNotice: 'Important Notice: Uploaded survey plan and title documents have been pre-screened for authenticity. However, in accordance with best real estate legal practice, independent physical land search at the Lagos State Land Registry (Alausa, Ikeja) is advised prior to final execution.'
    },
    photos: [
      {
        id: 'p3-1',
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        caption: 'Ground view of cleared 1,200 SQM plot with corner boundary beacons',
        roomType: 'Land Perimeter'
      },
      {
        id: 'p3-2',
        url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
        caption: 'Paved 9-meter estate approach road leading directly to plot',
        roomType: 'Street View'
      },
      {
        id: 'p3-3',
        url: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80',
        caption: 'Registered Survey Plan diagram with coordinate beacons',
        roomType: 'Survey Plan'
      }
    ],
    videos: [
      {
        id: 'v3-1',
        title: '360° Walkaround Perimeter Footage & Concrete Beacons',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '2:30',
        category: 'Boundaries & Road Access',
        thumbnailUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'v3-2',
        title: 'Road Access & Approach from Lekki-Epe Expressway',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '1:45',
        category: 'Entrance & Street',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80'
      }
    ],
    virtualTour: {
      has360: false,
      hasInteractiveHotspots: false,
      hasPhotoTour: true,
      hasVideoTour: true,
      videoWalkthroughUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      photoTourRooms: [
        { roomName: 'Front Road Boundary', imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Direct tarred road frontage of 100 feet.' },
        { roomName: 'Center Table Elevation', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Completely dry red sand terrain, zero flood water collection.' },
        { roomName: 'Back Perimeter Beacon', imageUrl: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Clear concrete beacon peg with surveyor stamp.' }
      ]
    }
  },
  {
    id: 'prop-4',
    title: 'Grade-A Commercial Office Tower & Tech Studio Floors',
    category: 'Commercial',
    subType: 'Commercial Office',
    city: 'Lagos',
    neighborhood: 'Victoria Island (Adeola Odeku Axis)',
    priceNaira: 48000000,
    pricePeriod: 'per annum',
    bedrooms: 0,
    bathrooms: 8,
    advertiserType: 'Developer',
    advertiserName: 'Covenant Commercial Holdings (Managing Agent)',
    advertiserPhone: '+234 901 223 8819',
    directOwner: false,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    description: 'Managed by licensed commercial brokerage. High-spec open plan office floors with plug-and-play fiber internet, central VRV air conditioning, automated access turnstiles, and 45 dedicated basement parking spaces.',
    confirmedAvailable: true,
    lastUpdated: '2 days ago',
    isDigitalBillboard: true,
    featuredScore: 91,
    verifiedBadge: true,
    powerSupplyDetails: '3 x 500kVA synchronous generators ensuring 100% zero-downtime corporate power',
    waterSupplyDetails: 'Automated municipal filtration with dedicated pressurized reserve tanks',
    securityArrangement: 'Manned reception turnstiles, biometric badge access, metal detector scanning',
    amenities: ['Central AC', 'Turnstile Access', '45 Basement Parking', 'High-Speed Fiber', 'Dual Elevators', 'Boardrooms', 'CCTV System'],
    fees: {
      rentOrAskingNaira: 48000000,
      isDirectOwner: false,
      agencyFeePercent: 10,
      legalFeePercent: 5,
      cautionDepositNaira: 5000000,
      serviceChargeNaira: 6500000,
      inspectionFeeNaira: 0,
      totalMoveInPackageNaira: 66700000
    },
    photos: [
      {
        id: 'p4-1',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        caption: 'Main open-floor workroom with floor-to-ceiling glass',
        roomType: 'Office Interior'
      },
      {
        id: 'p4-2',
        url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
        caption: 'Executive boardroom fitted with video conferencing screen',
        roomType: 'Office Interior'
      }
    ],
    videos: [
      {
        id: 'v4-1',
        title: 'Commercial Floor Tour: Reception, Open Plan & Boardroom',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        duration: '2:50',
        category: 'Interior Walkthrough',
        thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
      }
    ],
    virtualTour: {
      has360: true,
      hasInteractiveHotspots: true,
      hasPhotoTour: true,
      hasVideoTour: true,
      videoWalkthroughUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      panoramas: [
        {
          id: 'pano-4-1',
          roomName: 'Commercial Open Floor',
          imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2048&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
          description: '500 SQM column-free floor plate ready for tech team partitioning.'
        }
      ],
      photoTourRooms: [
        { roomName: 'Ground Floor Reception', imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Marble reception counter with visitor waiting lounge.' },
        { roomName: 'Open Floor Plate', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', inspectionNotes: 'Installed acoustic ceiling tiles and floor cable ducts.' }
      ]
    }
  },
  {
    id: 'prop-5',
    title: 'Exquisite 5-Bedroom Diplomatic Villa with 2 BQs',
    category: 'Rental',
    subType: 'Duplex / Maisonette',
    city: 'Abuja',
    neighborhood: 'Maitama Diplomatic Zone',
    priceNaira: 50000000,
    pricePeriod: 'per annum',
    bedrooms: 5,
    bathrooms: 6,
    advertiserType: 'Owner',
    advertiserName: 'Ambassador K. Danjuma (Direct Title Holder)',
    advertiserPhone: '+234 809 111 2345',
    directOwner: true,
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    description: 'Direct owner transaction. Diplomatic-grade security specs, bulletproof external doors, marble finishings, Olympic-sized lap pool, manicured lawns, and 2-room self-contained domestic staff quarters.',
    confirmedAvailable: true,
    lastUpdated: '3 days ago',
    isDigitalBillboard: false,
    featuredScore: 90,
    verifiedBadge: true,
    powerSupplyDetails: 'Maitama priority grid line + 80kVA Perkins silent generator',
    waterSupplyDetails: 'FCT municipal water board connection + borehole with purification plant',
    securityArrangement: 'Armed police guard post, electric fence, automated vehicular gate',
    amenities: ['Swimming Pool', '2 BQ Units', 'Bulletproof Doors', 'Huge Lawn Garden', 'CCTV System', '6 Car Garage'],
    fees: {
      rentOrAskingNaira: 50000000,
      isDirectOwner: true,
      agencyFeePercent: 0,
      legalFeePercent: 5,
      cautionDepositNaira: 4000000,
      serviceChargeNaira: 3500000,
      inspectionFeeNaira: 0,
      totalMoveInPackageNaira: 60000000
    },
    photos: [
      {
        id: 'p5-1',
        url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        caption: 'Front facade and grand pillared driveway',
        roomType: 'Compound'
      }
    ],
    videos: [
      {
        id: 'v5-1',
        title: 'Maitama Villa Full Walkthrough & Compound Security',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        duration: '3:10',
        category: 'Interior Walkthrough',
        thumbnailUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
      }
    ],
    virtualTour: {
      has360: true,
      hasInteractiveHotspots: false,
      hasPhotoTour: true,
      hasVideoTour: true,
      videoWalkthroughUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    }
  },
  {
    id: 'prop-6',
    title: '2-Bedroom Cozy Furnished Executive Shortlet Suite',
    category: 'Shortlet',
    subType: 'Hotel / Party Apartment',
    city: 'Lagos',
    neighborhood: 'Ikeja GRA (Near Airport)',
    priceNaira: 120000,
    pricePeriod: 'per night',
    bedrooms: 2,
    bathrooms: 2,
    advertiserType: 'Owner',
    advertiserName: 'Captain David Briggs (Owner)',
    advertiserPhone: '+234 703 449 8812',
    directOwner: true,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    description: 'Direct owner booking with zero middleman markups. Located 8 minutes from Murtala Muhammed International Airport. 24/7 power, high-speed Starlink WiFi, Netflix, daily housekeeping, and private car pickup on request.',
    confirmedAvailable: true,
    lastUpdated: '1 hour ago',
    isDigitalBillboard: false,
    featuredScore: 88,
    verifiedBadge: true,
    powerSupplyDetails: '24/7 solar hybrid inverter + silent estate generator',
    waterSupplyDetails: 'Treated industrial water system',
    securityArrangement: 'Smart lock keypad entry, intercom, 24/7 compound security guard',
    amenities: ['Starlink WiFi', 'Smart Lock Keypad', '24/7 Power', 'Daily Cleaning', 'Air Conditioning', 'Airport Pickup'],
    fees: {
      rentOrAskingNaira: 120000,
      isDirectOwner: true,
      agencyFeePercent: 0,
      legalFeePercent: 0,
      cautionDepositNaira: 30000,
      serviceChargeNaira: 0,
      inspectionFeeNaira: 0,
      totalMoveInPackageNaira: 150000
    },
    photos: [
      {
        id: 'p6-1',
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        caption: 'Furnished living room with 65-inch 4K Smart TV',
        roomType: 'Living Room'
      }
    ],
    videos: [
      {
        id: 'v6-1',
        title: 'Shortlet Suite Tour & Living Room Tech Amenities',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        duration: '1:10',
        category: 'Interior Walkthrough',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
      }
    ],
    virtualTour: {
      has360: false,
      hasInteractiveHotspots: false,
      hasPhotoTour: true,
      hasVideoTour: true,
      videoWalkthroughUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    }
  }
];

export const NIGERIAN_CITIES = [
  'All Cities',
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Ibadan',
  'Enugu',
  'Asaba',
  'Kano',
  'Calabar'
];
