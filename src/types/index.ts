export type CadenceType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface BusinessProfile {
  name: string;
  tagline: string;
  industry: string;
  audience: string;
  tone: string;
  targetGeo: string;
  valueProp: string;
  website: string;
  foundedYear: string;
}

export interface DailyPost {
  id: string;
  platform: 'x' | 'linkedin' | 'threads' | 'instagram';
  cadence: 'daily';
  dayNumber: number;
  headline: string;
  hook: string;
  content: string;
  hashtags: string[];
  scheduledTime: string;
  projectedReach: number;
  status: 'queued' | 'published' | 'draft';
  impressions?: number;
  likes?: number;
  reposts?: number;
}

export interface WeeklyDrop {
  id: string;
  platform: 'linkedin' | 'pr_wire' | 'substack';
  cadence: 'weekly';
  weekNumber: number;
  title: string;
  summary: string;
  keyTakeaway: string;
  channels: string[];
  projectedReach: number;
  status: 'scheduled' | 'published' | 'draft';
}

export interface MonthlyPR {
  id: string;
  cadence: 'monthly';
  month: string;
  headline: string;
  dateline: string;
  leadParagraph: string;
  quote: string;
  targetWires: string[];
  status: 'ready' | 'syndicated' | 'draft';
  syndicatedOutlets?: number;
}

export interface YearlyCampaign {
  id: string;
  quarter: string;
  title: string;
  description: string;
  expectedImpressions: string;
  status?: 'active' | 'planning' | 'completed';
}

export interface CampaignMatrix {
  overview: string;
  strategyCadence: {
    daily: string;
    weekly: string;
    monthly: string;
    yearly: string;
  };
  dailyPosts: DailyPost[];
  weeklyDrops: WeeklyDrop[];
  monthlyPR: MonthlyPR[];
  yearlyCampaigns: YearlyCampaign[];
  metricsEstimate: {
    estimatedAnnualReach: string;
    estimatedPressMentions: number;
    estimatedSavedHours: number;
    estimatedSavedAgencyFees: string;
  };
}

export interface SocialChannel {
  id: string;
  name: string;
  type: 'x' | 'linkedin' | 'threads' | 'pr_wire' | 'youtube' | 'substack';
  handle: string;
  connected: boolean;
  automated: boolean;
  lastSync: string;
  followersCount: string;
  monthlyReach: string;
  frequency: string;
}

export interface AnalyticsSummary {
  totalImpressions: number;
  totalEngagements: number;
  pressMentions: number;
  inboundLeads: number;
  hoursSaved: number;
  agencyCostAvoided: string;
}

export interface ChannelPerformance {
  name: string;
  share: number;
  impressions: number;
  growth: string;
}

export interface GeographicMetric {
  country: string;
  percentage: number;
  flag: string;
}

export interface AutopilotLog {
  id: string;
  timestamp: string;
  title: string;
  channel: string;
  cadence: CadenceType;
  reach: number;
  status: 'SUCCESS' | 'DISTRIBUTED' | 'SYNDICATED';
}
