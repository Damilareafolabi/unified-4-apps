export interface GigPackageTier {
  name: 'Basic' | 'Standard' | 'Premium';
  title: string;
  description: string;
  priceUSD: number;
  priceNGN: number;
  deliveryDays: number;
  revisions: string;
  features: string[];
}

export interface StudioGig {
  id: string;
  title: string;
  category: 'Programming & Tech' | 'AI Services & Agents' | 'Firebase Backend' | 'UI/UX & SaaS' | 'Digital Marketing';
  sellerName: string;
  sellerLevel: 'Top Rated Seller' | 'Level 2 Seller' | 'Pro Verified';
  sellerAvatar: string;
  coverImage: string;
  priceUSD: number;
  priceNGN: number;
  deliveryDays: number;
  revisions: string;
  description: string;
  features: string[];
  techStack: string[];
  rating: number;
  reviewsCount: number;
  badge?: string;
  popular?: boolean;
  packages: {
    basic: GigPackageTier;
    standard: GigPackageTier;
    premium: GigPackageTier;
  };
}

export interface StudioJob {
  id: string;
  clientName: string;
  clientLocation: string;
  clientCompany?: string;
  verifiedPayment: boolean;
  title: string;
  description: string;
  budgetUSD: number;
  budgetType: 'fixed' | 'hourly';
  experienceLevel: 'Intermediate' | 'Expert';
  urgency: string;
  skillsRequired: string[];
  proposalsCount: number;
  postedTime: string;
  status: 'open' | 'in_progress' | 'completed';
}

export interface StudioProposal {
  id: string;
  jobId: string;
  freelancerName: string;
  bidAmountUSD: number;
  estimatedDays: number;
  coverLetter: string;
  aiGenerated: boolean;
  milestones: { title: string; amountUSD: number; deliveryDays: number }[];
  status: 'submitted' | 'accepted' | 'under_review';
  createdAt: string;
}

export interface StudioActivityPost {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  hasLiked?: boolean;
}

export const initialStudioGigs: StudioGig[] = [
  {
    id: 'gig-1',
    title: 'I will build a production full-stack web app in 48 hours with React 19 and Firebase',
    category: 'Programming & Tech',
    sellerName: 'SimeonJr',
    sellerLevel: 'Pro Verified',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    priceUSD: 950,
    priceNGN: 1567500,
    deliveryDays: 2,
    revisions: 'Unlimited during sprint',
    description: 'Turn your idea into a production-ready, fully responsive web application in 48 hours. Powered by an AI-cloned rapid engineering workflow, Firebase real-time database, Google authentication, and bespoke Tailwind styling.',
    features: [
      'Complete React 19 + TypeScript frontend',
      'Google Firebase Auth (Google & Email)',
      'Firestore real-time database schema & security rules',
      'Production-ready Express / Cloud Run API setup',
      'Mobile responsive dark/light mode UI',
      '14-day post-launch hypercare'
    ],
    techStack: ['React 19', 'TypeScript', 'Firebase', 'Tailwind CSS', 'Node.js'],
    rating: 5.0,
    reviewsCount: 48,
    badge: '⚡ 48H Rapid Turnaround',
    popular: true,
    packages: {
      basic: {
        name: 'Basic',
        title: 'Starter MVP Prototype',
        description: 'Single-page responsive React web app with Firebase Auth and 1 core feature loop.',
        priceUSD: 450,
        priceNGN: 742500,
        deliveryDays: 1,
        revisions: '2 Revisions',
        features: ['1 Page Responsive App', 'Firebase Auth', 'Basic Firestore Setup', 'Source Code Included']
      },
      standard: {
        name: 'Standard',
        title: 'Complete 48-Hour Full-Stack Web App',
        description: 'Full multi-view application with Firebase Auth, Firestore real-time DB, API routes, and Tailwind UI.',
        priceUSD: 950,
        priceNGN: 1567500,
        deliveryDays: 2,
        revisions: 'Unlimited during sprint',
        features: ['Multi-page Dashboard', 'Google & Email Auth', 'Firestore Schema & Security Rules', 'Express API Routes', 'Mobile Optimized UI', '7-Day Support']
      },
      premium: {
        name: 'Premium',
        title: 'Pro SaaS + AI Agent Flywheel',
        description: 'Complete scalable platform with integrated Gemini AI SDK, payment/checkout integration, and custom domain launch.',
        priceUSD: 1650,
        priceNGN: 2722500,
        deliveryDays: 3,
        revisions: 'Unlimited',
        features: ['Full SaaS Platform', 'Gemini AI Integration', 'Stripe / Paystack Gateway', 'Real-Time Database Sync', 'SEO & Analytics Setup', '30-Day Priority Support']
      }
    }
  },
  {
    id: 'gig-2',
    title: 'I will integrate autonomous AI multimodal bots and real-time voice with Gemini 2.5',
    category: 'AI Services & Agents',
    sellerName: 'SimeonJr',
    sellerLevel: 'Top Rated Seller',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    priceUSD: 650,
    priceNGN: 1072500,
    deliveryDays: 2,
    revisions: '3 rounds',
    description: 'Integrate cutting-edge AI features into your web app: conversational voice synthesis, live microphone streaming, document analysis, and autonomous customer triage using Google Gemini 2.5.',
    features: [
      'Bidirectional conversational AI chatbot',
      'Real-time voice input & high-fidelity TTS speech',
      'Multimodal image analysis & OCR capability',
      'Secure server-side proxy route protection',
      'Custom company persona & tone grounding'
    ],
    techStack: ['Gemini 2.5 Flash', 'Web Audio API', 'Node/Express', 'TypeScript'],
    rating: 4.9,
    reviewsCount: 32,
    badge: '🤖 Cutting-Edge AI',
    popular: true,
    packages: {
      basic: {
        name: 'Basic',
        title: 'Text-Based Gemini Bot',
        description: 'Embedded AI chatbot with system prompt persona and streaming response.',
        priceUSD: 350,
        priceNGN: 577500,
        deliveryDays: 1,
        revisions: '2 Revisions',
        features: ['Chat Widget Integration', 'Custom System Prompt', 'Server-side API Key Security']
      },
      standard: {
        name: 'Standard',
        title: 'Multimodal Voice & Vision Bot',
        description: 'Voice chat with audio transcription, TTS speech output, and image analysis.',
        priceUSD: 650,
        priceNGN: 1072500,
        deliveryDays: 2,
        revisions: '3 Revisions',
        features: ['Bidirectional Voice Chat', 'Vision / OCR Image Analysis', 'Real-time Audio Waveform', 'Conversation History Persistence']
      },
      premium: {
        name: 'Premium',
        title: 'Autonomous Multi-Agent System',
        description: 'Autonomous AI workflow cloner with tool-calling, database queries, and custom memory bank.',
        priceUSD: 1250,
        priceNGN: 2062500,
        deliveryDays: 3,
        revisions: 'Unlimited',
        features: ['Autonomous Tool Use', 'Database Query Agent', 'Document RAG / Grounding', 'Full Production Deployment']
      }
    }
  },
  {
    id: 'gig-3',
    title: 'I will architect and secure your Firebase Firestore database with custom rules',
    category: 'Firebase Backend',
    sellerName: 'SimeonJr',
    sellerLevel: 'Top Rated Seller',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    priceUSD: 450,
    priceNGN: 742500,
    deliveryDays: 1,
    revisions: '2 rounds',
    description: 'Architect, optimize, and lock down your Firebase backend. Includes Firestore indexing, composite query rules, role-based access control (RBAC), and automated blueprint JSON generation.',
    features: [
      'Complete security audit against data leaks',
      'Role-based access control (RBAC) rules',
      'Optimized Firestore read/write pricing indexes',
      'Production deployment via Firebase CLI / RPC',
      'Automated seed script & migration schema'
    ],
    techStack: ['Firebase Firestore', 'Firebase Auth', 'Firestore Rules', 'Cloud Storage'],
    rating: 5.0,
    reviewsCount: 26,
    badge: '🛡️ Enterprise Security',
    packages: {
      basic: {
        name: 'Basic',
        title: 'Rules Security Audit',
        description: 'Audit existing firestore.rules and fix open read/write permission vulnerabilities.',
        priceUSD: 200,
        priceNGN: 330000,
        deliveryDays: 1,
        revisions: '1 Revision',
        features: ['Vulnerability Inspection', 'Rule Hardening', 'Test Suite Verification']
      },
      standard: {
        name: 'Standard',
        title: 'Complete Schema & RBAC Rules',
        description: 'Full database schema architecture, multi-role access control, and indexing.',
        priceUSD: 450,
        priceNGN: 742500,
        deliveryDays: 1,
        revisions: '2 Revisions',
        features: ['Full Schema Blueprint', 'Owner & Role-Based Rules', 'Composite Indexes', 'Production Deployment']
      },
      premium: {
        name: 'Premium',
        title: 'Full Firebase Enterprise Backend',
        description: 'Complete backend setup including Auth, Firestore, Storage, Cloud Functions, and seed script.',
        priceUSD: 850,
        priceNGN: 1402500,
        deliveryDays: 2,
        revisions: 'Unlimited',
        features: ['Auth + Firestore + Storage', 'Cloud Function Triggers', 'Full Automated Seed Data', 'Live Migration Support']
      }
    }
  },
  {
    id: 'gig-4',
    title: 'I will build a high-converting SaaS landing page with 365 autopilot publicity engine',
    category: 'UI/UX & SaaS',
    sellerName: 'SimeonJr',
    sellerLevel: 'Pro Verified',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    priceUSD: 850,
    priceNGN: 1402500,
    deliveryDays: 3,
    revisions: 'Unlimited',
    description: 'A magnetic landing page that converts visitors, paired with a full-stack marketing dashboard that automates your daily, weekly, and monthly publicity across global social networks.',
    features: [
      'Sleek modern dark-mode aesthetic with custom animations',
      'Performance analytics dashboard with SVG metric charts',
      'Automated multi-channel social syndication console',
      'AI instant pitch & PR wire press release generator',
      'SEO metadata, OpenGraph tags, and JSON-LD schema'
    ],
    techStack: ['React', 'Tailwind CSS', 'Canvas Confetti', 'Vite', 'Gemini AI'],
    rating: 5.0,
    reviewsCount: 54,
    badge: '🚀 Best Seller',
    popular: true,
    packages: {
      basic: {
        name: 'Basic',
        title: 'Landing Page Only',
        description: 'High-converting responsive landing page with hero, social proof, and CTA.',
        priceUSD: 400,
        priceNGN: 660000,
        deliveryDays: 2,
        revisions: '3 Revisions',
        features: ['1 Landing Page', 'Mobile Responsive', 'SEO Meta Tags', 'Speed Optimized']
      },
      standard: {
        name: 'Standard',
        title: 'Landing Page + Autopilot Marketing',
        description: 'Landing page + LazyCEO marketing dashboard with daily social syndication matrix.',
        priceUSD: 850,
        priceNGN: 1402500,
        deliveryDays: 3,
        revisions: 'Unlimited',
        features: ['Landing Page', '365 Autopilot Engine', 'Social Media Dispatcher', 'Analytics Dashboard']
      },
      premium: {
        name: 'Premium',
        title: 'Complete SaaS Growth Machine',
        description: 'Landing page, Autopilot engine, AI Media Studio, and CRM lead capture.',
        priceUSD: 1450,
        priceNGN: 2392500,
        deliveryDays: 4,
        revisions: 'Unlimited',
        features: ['Complete Growth Suite', 'AI Image & Music Generator', 'Stripe Checkout', 'Global Search & Maps Radar']
      }
    }
  },
  {
    id: 'gig-5',
    title: 'I will develop the ultimate turnkey freelance and service marketplace platform',
    category: 'Programming & Tech',
    sellerName: 'SimeonJr',
    sellerLevel: 'Pro Verified',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    priceUSD: 1850,
    priceNGN: 3052500,
    deliveryDays: 5,
    revisions: 'Unlimited during sprint',
    description: 'Complete hybrid platform featuring pre-packaged gig orders, client project board with proposal submissions, creator profile feeds, and integrated AI proposal writing superpower.',
    features: [
      'Turnkey gig catalog with instant 3-tier ordering',
      'Client project board with custom proposal submissions',
      'Creator feed & verified skills endorsement badges',
      'Gemini AI Proposal Writer & Project Brief Estimator',
      'Full Firestore real-time persistence & live inbox'
    ],
    techStack: ['React 19', 'Firebase', 'Gemini AI', 'Tailwind', 'Express'],
    rating: 5.0,
    reviewsCount: 19,
    badge: '👑 Flagship Solution',
    packages: {
      basic: {
        name: 'Basic',
        title: 'Gig Catalog Shell',
        description: 'Turnkey service directory with filters, order modals, and static database.',
        priceUSD: 750,
        priceNGN: 1237500,
        deliveryDays: 2,
        revisions: '2 Revisions',
        features: ['Gig Catalog', 'Category Filters', 'Basic Order Modal']
      },
      standard: {
        name: 'Standard',
        title: 'Complete Marketplace & Client Board',
        description: 'Gigs catalog + client job board + proposal submission modal with Firebase DB.',
        priceUSD: 1400,
        priceNGN: 2310000,
        deliveryDays: 4,
        revisions: 'Unlimited',
        features: ['Turnkey Gigs', 'Project Board', 'Firestore Real-time Sync', 'Proposal System']
      },
      premium: {
        name: 'Premium',
        title: 'Full Ecosystem with AI Superpowers',
        description: 'Gigs Catalog + Client Job Board + Network Feed + Gemini AI Proposal Writer + Live Chat.',
        priceUSD: 1850,
        priceNGN: 3052500,
        deliveryDays: 5,
        revisions: 'Unlimited',
        features: ['Full Marketplace Ecosystem', 'Gemini AI Proposal Generator', 'Real-time Chat Drawer', 'Deploy Ready']
      }
    }
  },
  {
    id: 'gig-6',
    title: 'I will clone and deploy a Nigerian direct real estate portal like KeyDirect',
    category: 'Programming & Tech',
    sellerName: 'SimeonJr',
    sellerLevel: 'Level 2 Seller',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    priceUSD: 1400,
    priceNGN: 2310000,
    deliveryDays: 4,
    revisions: '3 rounds',
    description: 'Launch a direct property discovery marketplace covering Lagos, Abuja, and Port Harcourt. Direct WhatsApp contact, digital billboard promotion, and verified diaspora investor targeting.',
    features: [
      'Multi-city neighborhood filtration & search',
      'Naira currency formatting & direct owner tagging',
      'Automated LazyCEO publicity cross-promotion',
      'Interactive listing submission modal with image upload',
      'Live property metrics & lead tracking'
    ],
    techStack: ['React', 'Firebase Firestore', 'Tailwind', 'TypeScript'],
    rating: 4.9,
    reviewsCount: 15,
    badge: '🇳🇬 African PropTech',
    packages: {
      basic: {
        name: 'Basic',
        title: 'Direct Listing Portal',
        description: 'Listing board for 1 city with filter by price, beds, and direct contact.',
        priceUSD: 600,
        priceNGN: 990000,
        deliveryDays: 2,
        revisions: '2 Revisions',
        features: ['Property Grid', 'WhatsApp Direct Connect', 'Naira Formatting']
      },
      standard: {
        name: 'Standard',
        title: 'Multi-City PropTech Marketplace',
        description: 'Lagos, Abuja & Port Harcourt directory with Digital Billboard promo and Firestore DB.',
        priceUSD: 1100,
        priceNGN: 1815000,
        deliveryDays: 3,
        revisions: '3 Revisions',
        features: ['Multi-City Filters', 'Digital Billboard Showcase', 'Interactive Listing Submission', 'Firestore Persistence']
      },
      premium: {
        name: 'Premium',
        title: 'PropTech + Autonomous Marketing Suite',
        description: 'Full KeyDirect portal integrated with LazyCEO Autopilot for continuous diaspora buyer syndication.',
        priceUSD: 1400,
        priceNGN: 2310000,
        deliveryDays: 4,
        revisions: 'Unlimited',
        features: ['Full Portal Architecture', 'LazyCEO Cross-Promotion Engine', 'Diaspora Investor Targeting', 'Complete Deployment']
      }
    }
  }
];

export const initialStudioJobs: StudioJob[] = [
  {
    id: 'job-1',
    clientName: 'Alexander Vance',
    clientLocation: 'San Francisco, CA (USA)',
    clientCompany: 'AuraScale AI',
    verifiedPayment: true,
    title: 'Need Full-Stack Developer to Build AI Agent Dashboard in 72 Hours',
    description: 'We need an experienced developer who can move fast. We have the designs in Figma and need an end-to-end web app built with React, Firebase Auth/Firestore, and integrated with Gemini API. Must have rapid prototyping skills and deliver clean code.',
    budgetUSD: 1500,
    budgetType: 'fixed',
    experienceLevel: 'Expert',
    urgency: 'Immediate (Starts Today)',
    skillsRequired: ['React', 'Firebase', 'TypeScript', 'Gemini AI', 'Tailwind CSS'],
    proposalsCount: 6,
    postedTime: '1 hour ago',
    status: 'open'
  },
  {
    id: 'job-2',
    clientName: 'Funke Adebayo',
    clientLocation: 'Lagos, Nigeria & London, UK',
    clientCompany: 'DiasporaBridge Capital',
    verifiedPayment: true,
    title: 'Build Nigerian Marketplace Portal with Direct WhatsApp & Escrow Inquiries',
    description: 'Looking for a Lagos-based or global talent to build a hybrid real-estate and service marketplace. Needs smooth mobile UI, clean Firestore data models, and zero broker friction for diaspora buyers.',
    budgetUSD: 2200,
    budgetType: 'fixed',
    experienceLevel: 'Expert',
    urgency: 'Within 5 Days',
    skillsRequired: ['Full-Stack Dev', 'Nigerian Market Mastery', 'Firebase', 'React 19'],
    proposalsCount: 9,
    postedTime: '3 hours ago',
    status: 'open'
  },
  {
    id: 'job-3',
    clientName: 'Marcus Sterling',
    clientLocation: 'Austin, TX (USA)',
    clientCompany: 'Velocity Media Lab',
    verifiedPayment: true,
    title: 'Automate Our Social Media Publicity Engine & 365 Content Syndication',
    description: 'We publish high volumes of B2B content. Looking to connect our content hub to social channels and PR syndicates using AI workflows. We need an automated scheduler and performance analytics.',
    budgetUSD: 1200,
    budgetType: 'fixed',
    experienceLevel: 'Intermediate',
    urgency: 'Urgent',
    skillsRequired: ['Social Automation', 'Express/Node', 'API Integration', 'Marketing Tech'],
    proposalsCount: 4,
    postedTime: '5 hours ago',
    status: 'open'
  }
];

export const initialStudioProposals: StudioProposal[] = [
  {
    id: 'prop-1',
    jobId: 'job-1',
    freelancerName: 'SimeonJr (Lead AI & Full-Stack Engineer)',
    bidAmountUSD: 1450,
    estimatedDays: 3,
    coverLetter: 'Hi Alexander, rather than waiting 6 weeks for a bloated dev agency, I will architect and deploy your AI Agent Dashboard in under 72 hours. With my AI-cloned development workflow and battle-tested React 19 + Firebase stack, you will test an interactive live demo on Day 1.',
    aiGenerated: true,
    milestones: [
      { title: 'Phase 1: DB Schema, Firebase Auth & Architecture', amountUSD: 500, deliveryDays: 1 },
      { title: 'Phase 2: Core Feature Implementation & Gemini AI Endpoints', amountUSD: 650, deliveryDays: 1 },
      { title: 'Phase 3: QA, Stress Testing & Production Launch', amountUSD: 300, deliveryDays: 1 }
    ],
    status: 'submitted',
    createdAt: 'Just Now'
  }
];

export const simeonJrProfile = {
  name: 'SimeonJr',
  title: 'Principal Full-Stack Developer & Lead AI Workflow Engineer',
  tagline: 'Lagos-based Creative Full-Stack Dev, Social Media Manager & AI Fanatic. Delivering End-to-End Apps at Lightning Speed ⚡',
  location: 'Lagos, Nigeria 🇳🇬 (Collaborating Globally)',
  availabilityStatus: 'Online / Taking Projects (48h Turnaround)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  heroHeadline: 'Find the right freelance service, right now',
  stats: {
    jobsCompleted: 64,
    onTimeDelivery: '100%',
    repeatClients: '88%',
    totalEarned: '$78,400+',
    rating: 5.0,
    responseTime: '1 Hour'
  },
  skills: [
    { name: 'React 19 & TypeScript', verified: true, level: 'Top 1%' },
    { name: 'Firebase & Firestore', verified: true, level: 'Expert' },
    { name: 'Google Gemini 2.5 AI SDK', verified: true, level: 'Pioneer' },
    { name: 'Tailwind CSS & High-End UI', verified: true, level: 'Expert' },
    { name: 'Node.js & Express Backends', verified: true, level: 'Expert' },
    { name: 'AI Workflow Cloning', verified: true, level: 'Specialist' },
    { name: 'Social Media Growth & PR', verified: true, level: 'Strategist' },
    { name: 'Rapid 48h MVP Delivery', verified: true, level: 'Master' }
  ],
  bioOverview: `I am a Lagos-based Creative Full-Stack Developer, Social Media Manager, and AI Fanatic. I have built an online digital agency structure (cloning my workflows using autonomous AI agents) to deliver end-to-end full-stack web applications, AI-powered tools, backend systems, frontend UI, and media/creative support at lighting speed.

While traditional software agencies charge $20k-$50k and take 3 months of bureaucratic meetings, I leverage agentic automation to ship production-ready, beautifully designed apps in 48 to 72 hours.`
};

export const initialStudioActivity: StudioActivityPost[] = [
  {
    id: 'act-1',
    author: 'SimeonJr',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    timeAgo: '2 hours ago',
    content: 'Just deployed a full-stack real-time application with Firebase Auth, Firestore real-time streams, and Gemini 2.5 multimodal integration in exactly 38 hours. Traditional agencies said it would take 6 weeks. The secret is an agentic workflow that eliminates 90% of boilerplate. Speed is the new moat!',
    tags: ['#FullStack', '#Firebase', '#AIWorkflow', '#LagosTech', '#ShipFast'],
    likes: 142,
    comments: 29,
    shares: 18
  },
  {
    id: 'act-2',
    author: 'SimeonJr',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    timeAgo: 'Yesterday',
    content: 'Unpopular opinion: If your MVP takes more than 5 days to get into users\' hands, you are over-engineering. Build the core loop, hook up real Firebase persistence, add AI superpowers, and ship it. What is everyone building this week?',
    tags: ['#BuildInPublic', '#React19', '#StartupSpeed'],
    likes: 98,
    comments: 41,
    shares: 12
  }
];

// ==========================================
// PART 1: HIGH-CONVERTING SOCIAL MARKETING & COLD DM TEMPLATES
// ==========================================
export const marketingKit = {
  bios: [
    {
      platform: 'Microblog Profile',
      title: 'The High-Impact Solo Dev',
      badge: 'Punchy & Bold',
      text: 'Lagos-based Creative Full-Stack Dev & AI Fanatic ⚡ I clone dev workflows using AI agents to build full-stack web apps in 48 hours. React • Firebase • Node • Gemini AI. Let\'s build 🚀 DMs open.'
    },
    {
      platform: 'Executive Profile',
      title: 'The Agency Slayer',
      badge: 'Executive & Authoritative',
      text: 'Why hire a 5-person dev agency when you can hire one developer with an AI-cloned workflow? Delivering end-to-end web apps, AI tools & high-converting UI at lightning speed. 📍 Lagos to the World 🌍'
    },
    {
      platform: 'Growth Network',
      title: 'The ROI-First Growth Engineer',
      badge: 'Client-Centric',
      text: 'Turning startup ideas into live, scalable web applications in under 72h. Full-Stack Engineer + Social Growth Strategist. 30+ shipped apps | Firebase | React 19 | AI Automations.'
    }
  ],
  viralPosts: [
    {
      id: 'post-hook',
      title: 'Post 1 (The Hook): Why Hire a 5-Person Dev Team?',
      channel: 'Executive Network & Social Feeds',
      targetAudience: 'Founders, CTOs, Angel Investors & Agency Owners',
      content: `Why hire a 5-person dev team when you can hire one developer with an AI-cloned workflow?

Here is what traditional agencies quote you:
❌ 1 Project Manager ($6k/mo)
❌ 2 Frontend Devs ($12k/mo)
❌ 1 Backend Engineer ($8k/mo)
❌ 1 UI/UX Designer ($5k/mo)
⏱ Timeline: 8 to 12 weeks of endless Zoom status meetings.

Here is my workflow as a solo AI-empowered engineer in Lagos:
✅ Autonomous AI agents handle boilerplate & test coverage in minutes
✅ Production Firebase architecture (Auth + Firestore + Security Rules) in hours
✅ Clean, custom React 19 + Tailwind UI built for conversions
✅ Integrated Gemini AI superpowers (instant chat, voice, multimodal)
⏱ Timeline: Fully working prototype in 48 hours. Production launch in days.

Speed is the ultimate competitive advantage in 2026.
Drop a comment or DM me "BUILD" and let's turn your idea into a working product this week.`
    },
    {
      id: 'post-showcase',
      title: 'Post 2 (The Showcase): Custom AI App Development & Web Cloning',
      channel: 'Executive Network & Social Feeds',
      targetAudience: 'Entrepreneurs, Product Managers & Founders',
      content: `Just shipped another end-to-end AI platform in 48 hours using Firebase, React 19, and Gemini AI.

What we built:
🔹 Real-time Firestore database with multi-tenant access control
🔹 Instant Google Auth & guest onboarding
🔹 Autonomous AI proposal generator & project brief estimator
🔹 Zero-lag dark-mode interface with live audio & visual telemetry

The secret isn't working 24 hours a day—it's building with an agentic flywheel where every repetitive dev task is automated.

If you have a website, SaaS MVP, or AI tool idea collecting dust on your Notion board, you don't need a $30k agency quote.

Send me a DM with your concept. I'll prototype the live working shell in 48h.`
    }
  ],
  coldDMs: [
    {
      id: 'dm-48h',
      title: 'DM Template 1: Direct 48-Hour Pitch for Founders & Startups',
      target: 'Founders, Tech Leaders & Solopreneurs',
      text: `Hey [Founder Name], love what you're doing with [Company Name]! Quick question—are you guys currently looking to prototype or ship [specific AI feature / web MVP] this quarter?

I'm a Lagos-based Creative Full-Stack Dev and AI engineer. I run an AI-cloned development workflow that allows me to build and launch production-ready web apps with Firebase and React in under 48 hours—at a fraction of typical agency rates.

I actually put together a 2-minute interactive breakdown of how your frontend and backend architecture could look. Mind if I send the preview link over? No pitch, just wanted to share the idea!`
    },
    {
      id: 'dm-relief',
      title: 'DM Template 2: Reaching Busy Business Owners & Agencies',
      target: 'Busy Business Owners, Marketing Directors & Agency Leads',
      text: `Hi [First Name], noticed you've been ramping up output at [Company]. Most agency owners and founders I speak with are bottlenecked by slow development cycles or astronomical freelancer costs.

I help businesses ship end-to-end full-stack web systems, AI bots, and custom automated social media engines without the overhead of hiring full-time staff. Everything is handled: frontend UI, Firebase backend, AI APIs, and social distribution.

Would you be open to an asynchronous 5-minute chat, or should I drop a quick demo link of recent 48h builds we shipped this month?`
    }
  ]
};
