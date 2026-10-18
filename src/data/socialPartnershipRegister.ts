/**
 * Official Social Integration & Partnership Register
 * Documents developer applications, API permissions, OAuth callback URLs,
 * and data deletion compliance across the four platforms:
 * 1. LazyCEO (Autonomous Marketing)
 * 2. KeyDirect (Real Estate Marketplace)
 * 3. TalentDock (Freelance & Services)
 * 4. GIGCONNECT (Careers & Employment)
 */

export interface SocialNetworkIntegration {
  id: string;
  platformName: string;
  provider: 'Meta' | 'TikTok' | 'Google' | 'LinkedIn' | 'Pinterest' | 'X' | 'Meta Threads';
  appId: string;
  developerAccountOwner: string;
  registrationStatus: 'Sandbox Active' | 'Review Submitted' | 'Production Approved' | 'Partner Verified';
  apiProducts: string[];
  permissionsRequested: string[];
  oauthCallbackUrl: string;
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  dataDeletionUrl: string;
  mediaValidationRules: {
    maxCharacters: number;
    supportedMedia: ('image' | 'video' | 'carousel')[];
    videoMaxDurationSeconds?: number;
    recommendedAspectRatio: string;
  };
  supportedProducts: ('lazyceo' | 'keydirect' | 'talentdock' | 'gigconnect')[];
  productUseCases: Record<string, string>;
  rateLimitNote: string;
  ongoingCostNotes: string;
}

export const OFFICIAL_INTEGRATION_REGISTER: SocialNetworkIntegration[] = [
  {
    id: 'meta-fb-ig',
    platformName: 'Meta (Facebook Pages & Instagram Professional)',
    provider: 'Meta',
    appId: 'meta_app_88921049281',
    developerAccountOwner: 'SimeonJr Studios Global LLC',
    registrationStatus: 'Review Submitted',
    apiProducts: ['Facebook Graph API v21.0', 'Instagram Graph API'],
    permissionsRequested: [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'instagram_basic',
      'instagram_content_publish'
    ],
    oauthCallbackUrl: 'https://simeonjrstudios.com/api/oauth/callback/meta',
    privacyPolicyUrl: 'https://simeonjrstudios.com/legal/privacy',
    termsOfServiceUrl: 'https://simeonjrstudios.com/legal/terms',
    dataDeletionUrl: 'https://simeonjrstudios.com/legal/data-deletion',
    mediaValidationRules: {
      maxCharacters: 2200,
      supportedMedia: ['image', 'video', 'carousel'],
      videoMaxDurationSeconds: 60,
      recommendedAspectRatio: '1:1 or 4:5 for feed, 9:16 for Reels'
    },
    supportedProducts: ['lazyceo', 'keydirect', 'talentdock', 'gigconnect'],
    productUseCases: {
      lazyceo: 'Automated 365 brand marketing, daily reels, and viral hooks',
      keydirect: 'Verified property video walkthroughs (strictly non-AI authentic footage)',
      talentdock: 'Freelancer project showcase reels and creator service promos',
      gigconnect: 'Employer company culture spotlights and hiring announcements'
    },
    rateLimitNote: '200 calls per user/page per hour rolling window',
    ongoingCostNotes: 'Standard API access is free of charge under Meta for Developers'
  },
  {
    id: 'tiktok-content',
    platformName: 'TikTok for Business & Content Posting',
    provider: 'TikTok',
    appId: 'tiktok_app_9918237190',
    developerAccountOwner: 'SimeonJr Studios Global LLC',
    registrationStatus: 'Sandbox Active',
    apiProducts: ['Content Posting API v2', 'Commercial Content API'],
    permissionsRequested: ['user.info.basic', 'video.upload', 'video.publish'],
    oauthCallbackUrl: 'https://simeonjrstudios.com/api/oauth/callback/tiktok',
    privacyPolicyUrl: 'https://simeonjrstudios.com/legal/privacy',
    termsOfServiceUrl: 'https://simeonjrstudios.com/legal/terms',
    dataDeletionUrl: 'https://simeonjrstudios.com/legal/data-deletion',
    mediaValidationRules: {
      maxCharacters: 2200,
      supportedMedia: ['video'],
      videoMaxDurationSeconds: 180,
      recommendedAspectRatio: '9:16 vertical MP4/MOV'
    },
    supportedProducts: ['lazyceo', 'keydirect', 'talentdock'],
    productUseCases: {
      lazyceo: 'High-energy viral startup growth stories and contrarian playbooks',
      keydirect: 'Continuous ground-level property and neighbourhood walkthrough videos',
      talentdock: 'Speed-build design timelapses and software demo reels'
    },
    rateLimitNote: 'Tier 1 Developer Sandbox: 5 video posts/day per authenticated creator',
    ongoingCostNotes: 'Free API; subject to TikTok Developer Partner agreement'
  },
  {
    id: 'google-youtube',
    platformName: 'Google (YouTube Data API v3)',
    provider: 'Google',
    appId: 'google_oauth_335003039437.apps.googleusercontent.com',
    developerAccountOwner: 'SimeonJr Studios Global LLC',
    registrationStatus: 'Production Approved',
    apiProducts: ['YouTube Data API v3', 'YouTube Partner Program'],
    permissionsRequested: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly'
    ],
    oauthCallbackUrl: 'https://simeonjrstudios.com/api/oauth/callback/google',
    privacyPolicyUrl: 'https://simeonjrstudios.com/legal/privacy',
    termsOfServiceUrl: 'https://simeonjrstudios.com/legal/terms',
    dataDeletionUrl: 'https://simeonjrstudios.com/legal/data-deletion',
    mediaValidationRules: {
      maxCharacters: 5000,
      supportedMedia: ['video'],
      videoMaxDurationSeconds: 900,
      recommendedAspectRatio: '16:9 for longform, 9:16 for Shorts'
    },
    supportedProducts: ['lazyceo', 'keydirect', 'talentdock', 'gigconnect'],
    productUseCases: {
      lazyceo: 'Monthly video press conferences and YouTube Shorts PR blasts',
      keydirect: '4K continuous property video walkthroughs and virtual tour chapters',
      talentdock: 'In-depth code walk-throughs and portfolio video case studies',
      gigconnect: 'Employer recruitment keynote videos and candidate interview preparation tutorials'
    },
    rateLimitNote: '10,000 units/day default Google Cloud Quota',
    ongoingCostNotes: 'Free tier covers 10,000 quota units/day (~6 video uploads/day)'
  },
  {
    id: 'linkedin-org',
    platformName: 'LinkedIn Share & Community Management',
    provider: 'LinkedIn',
    appId: 'linkedin_app_772619024',
    developerAccountOwner: 'SimeonJr Studios Global LLC',
    registrationStatus: 'Review Submitted',
    apiProducts: ['Share on LinkedIn', 'Sign In with LinkedIn v2'],
    permissionsRequested: ['openid', 'profile', 'email', 'w_member_social', 'w_organization_social'],
    oauthCallbackUrl: 'https://simeonjrstudios.com/api/oauth/callback/linkedin',
    privacyPolicyUrl: 'https://simeonjrstudios.com/legal/privacy',
    termsOfServiceUrl: 'https://simeonjrstudios.com/legal/terms',
    dataDeletionUrl: 'https://simeonjrstudios.com/legal/data-deletion',
    mediaValidationRules: {
      maxCharacters: 3000,
      supportedMedia: ['image', 'video', 'carousel'],
      recommendedAspectRatio: '1.91:1 or 1:1'
    },
    supportedProducts: ['lazyceo', 'keydirect', 'talentdock', 'gigconnect'],
    productUseCases: {
      lazyceo: 'Weekly long-form executive manifestos and B2B growth carousels',
      keydirect: 'Commercial property investments, diaspora yield reports, and land syndicates',
      talentdock: 'Senior engineering case studies and agency team credentials',
      gigconnect: 'Executive job vacancies, career advice, and hiring announcements'
    },
    rateLimitNote: '100 share calls per user per day',
    ongoingCostNotes: 'Free under LinkedIn Developer Portal terms'
  },
  {
    id: 'pinterest-board',
    platformName: 'Pinterest Content & Product Pins',
    provider: 'Pinterest',
    appId: 'pinterest_app_14920491',
    developerAccountOwner: 'SimeonJr Studios Global LLC',
    registrationStatus: 'Sandbox Active',
    apiProducts: ['Pinterest API v5'],
    permissionsRequested: ['boards:read', 'boards:write', 'pins:read', 'pins:write'],
    oauthCallbackUrl: 'https://simeonjrstudios.com/api/oauth/callback/pinterest',
    privacyPolicyUrl: 'https://simeonjrstudios.com/legal/privacy',
    termsOfServiceUrl: 'https://simeonjrstudios.com/legal/terms',
    dataDeletionUrl: 'https://simeonjrstudios.com/legal/data-deletion',
    mediaValidationRules: {
      maxCharacters: 500,
      supportedMedia: ['image', 'video'],
      recommendedAspectRatio: '2:3 (1000 x 1500 px)'
    },
    supportedProducts: ['lazyceo', 'keydirect', 'talentdock'],
    productUseCases: {
      lazyceo: 'Infographics, cheat sheets, and promotional marketing cards',
      keydirect: 'Architectural photography, interior design pins, and luxury home layouts',
      talentdock: 'UI/UX mockups, brand identity vectors, and graphic design portfolios'
    },
    rateLimitNote: '1000 requests per 60 minutes',
    ongoingCostNotes: 'Free API access'
  },
  {
    id: 'x-twitter-v2',
    platformName: 'X (Twitter API v2)',
    provider: 'X',
    appId: 'x_dev_app_33918240',
    developerAccountOwner: 'SimeonJr Studios Global LLC',
    registrationStatus: 'Sandbox Active',
    apiProducts: ['Twitter API v2 Free / Basic'],
    permissionsRequested: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    oauthCallbackUrl: 'https://simeonjrstudios.com/api/oauth/callback/x',
    privacyPolicyUrl: 'https://simeonjrstudios.com/legal/privacy',
    termsOfServiceUrl: 'https://simeonjrstudios.com/legal/terms',
    dataDeletionUrl: 'https://simeonjrstudios.com/legal/data-deletion',
    mediaValidationRules: {
      maxCharacters: 280,
      supportedMedia: ['image', 'video'],
      recommendedAspectRatio: '16:9 or 1:1'
    },
    supportedProducts: ['lazyceo', 'keydirect', 'talentdock', 'gigconnect'],
    productUseCases: {
      lazyceo: 'Daily high-velocity contrarian micro-hooks and viral threads',
      keydirect: 'Flash real estate price drop alerts and newly verified direct owner listings',
      talentdock: 'Open-for-gigs availability pings and project milestones',
      gigconnect: 'Immediate remote job alert threads and urgent employer hiring alerts'
    },
    rateLimitNote: 'Free tier: 1,500 posts/month per app; Basic tier ($100/mo) for 3,000 posts/user',
    ongoingCostNotes: 'Free tier active for prototyping; Basic plan ($100/month) required for high-volume automated dispatch'
  },
  {
    id: 'meta-threads-v1',
    platformName: 'Threads API (Meta)',
    provider: 'Meta Threads',
    appId: 'threads_app_55102914',
    developerAccountOwner: 'SimeonJr Studios Global LLC',
    registrationStatus: 'Review Submitted',
    apiProducts: ['Threads Publishing API'],
    permissionsRequested: ['threads_basic', 'threads_content_publish', 'threads_read_replies'],
    oauthCallbackUrl: 'https://simeonjrstudios.com/api/oauth/callback/threads',
    privacyPolicyUrl: 'https://simeonjrstudios.com/legal/privacy',
    termsOfServiceUrl: 'https://simeonjrstudios.com/legal/terms',
    dataDeletionUrl: 'https://simeonjrstudios.com/legal/data-deletion',
    mediaValidationRules: {
      maxCharacters: 500,
      supportedMedia: ['image', 'video'],
      recommendedAspectRatio: '1:1 or 4:5'
    },
    supportedProducts: ['lazyceo', 'keydirect', 'talentdock', 'gigconnect'],
    productUseCases: {
      lazyceo: 'Casual founder conversations, behind-the-scenes startup growth insights',
      keydirect: 'Community neighborhood insights, power/water condition reviews',
      talentdock: 'Freelancer tips, design critiques, and engineering trade-offs',
      gigconnect: 'Workplace culture commentary and remote work career insights'
    },
    rateLimitNote: '250 published posts per 24 hours per account',
    ongoingCostNotes: 'Free API provided by Meta'
  }
];
