import { BusinessProfile, CampaignMatrix, SocialChannel, AutopilotLog } from '../types';

export const initialBusinessProfile: BusinessProfile = {
  name: 'OmniPulse Global',
  tagline: 'Autonomous AI Infrastructure for High-Velocity Modern Enterprises',
  industry: 'Enterprise SaaS & Autonomous AI Agents',
  audience: 'Venture-backed Founders, Chief Technology Officers, & Enterprise Growth Leaders',
  tone: 'Bold & Visionary',
  targetGeo: 'Global (North America, UK/EMEA, APAC)',
  valueProp: 'Replaces an entire $180k/yr marketing & PR agency with a self-learning autonomous distribution flywheel.',
  website: 'https://omnipulse.global',
  foundedYear: '2025'
};

export const initialCampaignMatrix: CampaignMatrix = {
  overview: 'OmniPulse 365-Day Perpetual Publicity Flywheel. Engineered to saturate executive feeds, generate organic journalist inquiries, and syndicate wire releases across 4 continents without human operational overhead.',
  strategyCadence: {
    daily: '3x daily hyper-targeted contrarian insight posts across X and Threads hitting peak engagement timezones in NY, London, and Tokyo.',
    weekly: '1x weekly high-authority deep dive essay syndicated across LinkedIn Newsletter and Tech Publication Networks.',
    monthly: 'Global PR wire release distributed through 450+ newsrooms, indexing on Bloomberg Terminals, Google News, and Yahoo Finance.',
    yearly: '4x tentpole global industry benchmarks, virtual summit keynotes, and comprehensive annual retrospective reports.'
  },
  dailyPosts: [
    {
      id: 'dp-1',
      platform: 'x',
      cadence: 'daily',
      dayNumber: 1,
      headline: 'The Death of the 20-Person Marketing Agency',
      hook: 'If you are paying an agency $15k/month to write 8 generic tweets and an overdue blog post, you are subsidizing their company retreat.',
      content: 'Here is what modern software companies do in 2026 instead:\n\n1. Feed their core product velocity into an autonomous distribution model\n2. Automate daily micro-hooks to capture high-intent buyers\n3. Syndicate global wire press releases when real milestones happen\n\nConsistency beats manual effort every time.',
      hashtags: ['#B2BMarketing', '#AIAutomation', '#StartupGrowth', '#LazyCEO'],
      scheduledTime: '08:30 AM EST',
      projectedReach: 24500,
      status: 'published',
      impressions: 28400,
      likes: 642,
      reposts: 129
    },
    {
      id: 'dp-2',
      platform: 'linkedin',
      cadence: 'daily',
      dayNumber: 2,
      headline: 'How we generated 1.4M impressions with 0 marketing staff',
      hook: 'Most founders treat marketing like a chore they do when sales slow down. That is why their pipeline looks like a rollercoaster.',
      content: 'When you automate marketing into a 365-day perpetual background process, your brand is constantly top-of-mind.\n\nKey takeaways from our first 90 days running autonomous publicity:\n- Our cost per qualified demo dropped 71%\n- 4 tier-one journalists reached out directly for quotes\n- Zero executive context switching\n\nMarketing is no longer an event. It is an infrastructure.',
      hashtags: ['#Leadership', '#SaaS', '#Automation', '#Productivity'],
      scheduledTime: '11:15 AM EST',
      projectedReach: 38000,
      status: 'queued',
      impressions: 0,
      likes: 0,
      reposts: 0
    },
    {
      id: 'dp-3',
      platform: 'threads',
      cadence: 'daily',
      dayNumber: 3,
      headline: 'Unpopular truth about PR in 2026',
      hook: 'You don’t need to know someone who went to Harvard to get into Bloomberg or TechCrunch.',
      content: 'Journalists are starving for hard telemetry, counter-intuitive data, and companies with bold viewpoints.\n\nStop sending PDF press releases to generic info@ inboxes. Let autonomous syndication put your data where editorial desks actually search.',
      hashtags: ['#PRHacks', '#Founders', '#TechNews'],
      scheduledTime: '03:00 PM EST',
      projectedReach: 16200,
      status: 'queued',
      impressions: 0,
      likes: 0,
      reposts: 0
    },
    {
      id: 'dp-4',
      platform: 'x',
      cadence: 'daily',
      dayNumber: 4,
      headline: 'The 365 Autopilot Equation',
      hook: 'Daily presence + Weekly authority + Monthly PR Wire + Yearly Benchmark = Unstoppable Category Moat.',
      content: 'Most competitors quit after 3 weeks of sporadic posting.\n\nWhen your system executes 365 days a year without taking weekends or sick leave, market leadership is simply mathematical inevitability.',
      hashtags: ['#SaaSGrowth', '#Autopilot', '#LazyCEO'],
      scheduledTime: '06:45 PM EST',
      projectedReach: 21000,
      status: 'queued',
      impressions: 0,
      likes: 0,
      reposts: 0
    }
  ],
  weeklyDrops: [
    {
      id: 'wd-1',
      platform: 'linkedin',
      cadence: 'weekly',
      weekNumber: 1,
      title: 'The 2026 Autonomous Enterprise Manifesto: Why Manual Marketing is obsolete',
      summary: 'A 1,400-word comprehensive deep-dive breaking down why high-performing companies are eliminating traditional ad agency retainers in favor of algorithmic multi-channel distribution.',
      keyTakeaway: 'Companies with autonomous distribution achieve 3.4x higher organic organic customer retention.',
      channels: ['LinkedIn Newsletter', 'Substack Syndication', 'Medium Editorial'],
      projectedReach: 92000,
      status: 'published'
    },
    {
      id: 'wd-2',
      platform: 'pr_wire',
      cadence: 'weekly',
      weekNumber: 2,
      title: 'Global Efficiency Audit: 10,000 Founders on Marketing Fatigue & Burnout',
      summary: 'Proprietary research spotlight uncovering that the average CEO wastes 14 hours per week trying to come up with social content and press angles.',
      keyTakeaway: '91% of executives admit their social media is inconsistent due to product firefighting.',
      channels: ['Tech Wire', 'Ecosystem Digest', 'HackerNews Syndicate'],
      projectedReach: 114000,
      status: 'scheduled'
    },
    {
      id: 'wd-3',
      platform: 'substack',
      cadence: 'weekly',
      weekNumber: 3,
      title: 'Reverse Engineering 50 Viral Product Launches: The 365 Protocol',
      summary: 'Step-by-step breakdown of how zero-budget brands weaponized automated narrative staging to generate over $10M in inbound pipeline.',
      keyTakeaway: 'Narrative compounding yields exponentially higher valuation multiples.',
      channels: ['Substack Weekly', 'LinkedIn Pulse'],
      projectedReach: 78000,
      status: 'scheduled'
    }
  ],
  monthlyPR: [
    {
      id: 'mpr-1',
      cadence: 'monthly',
      month: 'Month 1: Global Launch & Category Creation',
      headline: 'OmniPulse Global Deploys Autonomous 365 Publicity Engine to Democratize Institutional PR for Next-Gen Enterprises',
      dateline: 'SAN FRANCISCO & LONDON, Oct 16, 2026',
      leadParagraph: 'OmniPulse Global, the high-velocity autonomous marketing and intelligence infrastructure, today announced the worldwide rollout of its 365 Autopilot Publicity Engine. The platform automates multi-channel social distribution, PR wire syndication, and performance telemetry for companies worldwide.',
      quote: '"For too long, fast-growing companies were forced to choose between wasting hundreds of executive hours on social media or paying exorbitant agency retainers that produce negligible pipeline," stated the CEO. "LazyCEO transforms publicity into an always-on utility that runs 24/7/365."',
      targetWires: ['PR Newswire', 'Business Wire', 'Bloomberg Terminal', 'Yahoo Finance', 'MarketWatch', 'TechCrunch Syndicate'],
      status: 'syndicated',
      syndicatedOutlets: 462
    },
    {
      id: 'mpr-2',
      cadence: 'monthly',
      month: 'Month 2: Global Benchmark & Expansion Milestone',
      headline: 'OmniPulse Global Surpasses 100 Million Autonomous Organic Impressions Across 4 Continents',
      dateline: 'NEW YORK & SINGAPORE, Nov 12, 2026',
      leadParagraph: 'Following unprecedented adoption across high-growth technology enterprises, OmniPulse Global today announced that its automated marketing infrastructure has processed over 100 million verified organic brand impressions across North America, Europe, and Asia Pacific.',
      quote: '"The mathematical compounding effect of 365-day non-stop presence is extraordinary. When your business never sleeps, your market authority never pauses."',
      targetWires: ['AP News Wire', 'Reuters Syndicate', 'Benzinga Global', 'Morningstar Tech'],
      status: 'ready',
      syndicatedOutlets: 0
    },
    {
      id: 'mpr-3',
      cadence: 'monthly',
      month: 'Month 3: Global Partnership & Strategic Integration',
      headline: 'OmniPulse Global Announces Cross-Platform Syndication with Major Global Financial News Networks',
      dateline: 'ZURICH & TOKYO, Dec 08, 2026',
      leadParagraph: 'OmniPulse Global today finalized automated newsroom endpoints enabling one-click enterprise distribution into institutional investor portals and regional media houses across Europe and Asia.',
      quote: '"Democratizing institutional-grade global publicity gives bootstrapped and venture-backed founders the exact same reach as Fortune 500 incumbents."',
      targetWires: ['Dow Jones Newswires', 'Financial Times Syndication', 'Nikkei Asia Feed'],
      status: 'ready',
      syndicatedOutlets: 0
    }
  ],
  yearlyCampaigns: [
    {
      id: 'yc-1',
      quarter: 'Q1',
      title: 'The Annual Global Enterprise AI & Automation Benchmark Report',
      description: 'Comprehensive 40-page whitepaper distributed to 85,000 global C-level subscribers, accompanied by high-velocity press releases and interactive web calculators.',
      expectedImpressions: '2.5M - 4.2M',
      status: 'active'
    },
    {
      id: 'yc-2',
      quarter: 'Q2',
      title: 'Mid-Year Global Disruptor Keynote & Virtual Demo Day',
      description: 'Global virtual summit featuring fireside sessions, customer case studies, and real-time live distribution to 150+ tech journalists and influencers.',
      expectedImpressions: '1.8M - 3.1M',
      status: 'planning'
    },
    {
      id: 'yc-3',
      quarter: 'Q3',
      title: 'International Business & Innovation Award Blitz',
      description: 'Automated nomination submissions to 30 premier international accolades including Fast Company Most Innovative, Inc. 5000, and SaaS Awards.',
      expectedImpressions: '950K - 1.6M',
      status: 'planning'
    },
    {
      id: 'yc-4',
      quarter: 'Q4',
      title: 'Year-in-Review Viral Autopilot Retrospective & 365 Gala',
      description: 'Interactive year-end recap experience highlighting category milestones, founder wins, and the 2027 Macro Trends Forecast.',
      expectedImpressions: '3.8M - 6.5M',
      status: 'planning'
    }
  ],
  metricsEstimate: {
    estimatedAnnualReach: '9,450,000+',
    estimatedPressMentions: 64,
    estimatedSavedHours: 1560,
    estimatedSavedAgencyFees: '$168,000'
  }
};

export const initialSocialChannels: SocialChannel[] = [
  {
    id: 'ch-x',
    name: 'X (Formerly Twitter)',
    type: 'x',
    handle: '@omnipulse_ai',
    connected: true,
    automated: true,
    lastSync: '2 minutes ago',
    followersCount: '48.2K',
    monthlyReach: '520K',
    frequency: '3x daily'
  },
  {
    id: 'ch-linkedin',
    name: 'LinkedIn Company & CEO',
    type: 'linkedin',
    handle: 'linkedin.com/company/omnipulse',
    connected: true,
    automated: true,
    lastSync: '14 minutes ago',
    followersCount: '34.9K',
    monthlyReach: '610K',
    frequency: '1x daily + 1x weekly'
  },
  {
    id: 'ch-threads',
    name: 'Threads / Meta Syndicate',
    type: 'threads',
    handle: '@omnipulse.global',
    connected: true,
    automated: true,
    lastSync: '1 hour ago',
    followersCount: '19.4K',
    monthlyReach: '185K',
    frequency: '2x daily'
  },
  {
    id: 'ch-prwire',
    name: 'Global PR Newswire & Syndicate',
    type: 'pr_wire',
    handle: 'Newswire Network Feed #882',
    connected: true,
    automated: true,
    lastSync: '3 hours ago',
    followersCount: '450+ Newsrooms',
    monthlyReach: '1.2M',
    frequency: '1x monthly'
  },
  {
    id: 'ch-substack',
    name: 'Substack & Newsletter Wire',
    type: 'substack',
    handle: 'omnipulse.substack.com',
    connected: true,
    automated: true,
    lastSync: 'Yesterday',
    followersCount: '12.8K readers',
    monthlyReach: '95K',
    frequency: '1x weekly'
  },
  {
    id: 'ch-youtube',
    name: 'YouTube Shorts & Pod Clips',
    type: 'youtube',
    handle: '@OmniPulseOfficial',
    connected: false,
    automated: false,
    lastSync: 'Never',
    followersCount: '2.1K',
    monthlyReach: '18K',
    frequency: 'Paused'
  }
];

export const initialAutopilotLogs: AutopilotLog[] = [
  {
    id: 'log-1',
    timestamp: '10:45 AM Today',
    title: 'Dispatched: The Death of the 20-Person Marketing Agency',
    channel: 'X / Twitter',
    cadence: 'daily',
    reach: 28400,
    status: 'DISTRIBUTED'
  },
  {
    id: 'log-2',
    timestamp: '09:12 AM Today',
    title: 'Syndicated: Global PR Wire Release #104 (462 Newsrooms)',
    channel: 'PR Newswire / Bloomberg',
    cadence: 'monthly',
    reach: 480000,
    status: 'SYNDICATED'
  },
  {
    id: 'log-3',
    timestamp: 'Yesterday 04:30 PM',
    title: 'Published: The 2026 Autonomous Enterprise Manifesto',
    channel: 'LinkedIn Newsletter',
    cadence: 'weekly',
    reach: 92000,
    status: 'SUCCESS'
  },
  {
    id: 'log-4',
    timestamp: 'Yesterday 01:15 PM',
    title: 'Dispatched: Unpopular truth about PR in 2026',
    channel: 'Threads / Meta',
    cadence: 'daily',
    reach: 16200,
    status: 'DISTRIBUTED'
  }
];
