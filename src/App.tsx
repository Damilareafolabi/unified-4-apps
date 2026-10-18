/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MarketingSite } from './components/MarketingSite';
import { AutopilotEngine } from './components/AutopilotEngine';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SocialIntegrationHub } from './components/SocialIntegrationHub';
import { MediaStudio } from './components/MediaStudio';
import { RedRobotChatVoice } from './components/RedRobotChatVoice';
import { SearchMapsRadar } from './components/SearchMapsRadar';
import { KeyDirectPlatform } from './components/KeyDirectPlatform';
import { SimeonJrStudioHub } from './components/SimeonJrStudioHub';
import { GigConnectPlatform } from './components/GigConnectPlatform';
import { FounderDashboard } from './components/FounderDashboard';
import { SharedSocialIntegrationHub } from './components/SharedSocialIntegrationHub';
import { ConsentBanner } from './components/ConsentBanner';
import { PressReleaseModal, BusinessProfileModal } from './components/Modals';
import { 
  initialBusinessProfile, 
  initialCampaignMatrix, 
  initialSocialChannels, 
  initialAutopilotLogs 
} from './data/initialData';
import { PropertyListing } from './data/keyDirectData';
import { BusinessProfile, CampaignMatrix, SocialChannel, AutopilotLog, DailyPost, MonthlyPR } from './types';
import { 
  auth, 
  db, 
  testFirestoreConnection, 
  ensureAuthenticatedUser, 
  signInWithGoogle, 
  signOutUser,
  isPlaceholderConfig
} from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import confetti from 'canvas-confetti';

export default function App() {
  // Multi-Platform Ecosystem: LazyCEO + SimeonJr Studio Hub + KeyDirect + GIGCONNECT
  const [activePlatform, setActivePlatform] = useState<'lazyceo' | 'studio' | 'keydirect' | 'gigconnect'>('lazyceo');
  const [studioBrandName, setStudioBrandName] = useState<string>(() => {
    return localStorage.getItem('studio_custom_brand_name') || 'SimeonJr Studio Hub';
  });

  // Universal Modals
  const [founderDashboardOpen, setFounderDashboardOpen] = useState<boolean>(false);
  const [socialHubOpen, setSocialHubOpen] = useState<boolean>(false);

  // LazyCEO Navigation
  const [currentTab, setCurrentTab] = useState<'marketing' | 'engine' | 'analytics' | 'channels' | 'media' | 'chat' | 'radar'>('marketing');
  const [autopilotActive, setAutopilotActive] = useState<boolean>(true);
  const [isPulsing, setIsPulsing] = useState<boolean>(false);
  const [firebaseSynced, setFirebaseSynced] = useState<boolean>(false);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userUid, setUserUid] = useState<string>('demo-user');

  // Core App State
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(initialBusinessProfile);
  const [campaign, setCampaign] = useState<CampaignMatrix>(initialCampaignMatrix);
  const [channels, setChannels] = useState<SocialChannel[]>(initialSocialChannels);
  const [logs, setLogs] = useState<AutopilotLog[]>(initialAutopilotLogs);

  // Modals
  const [selectedPR, setSelectedPR] = useState<MonthlyPR | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);

  // PropertyComparison State Management System
  const [comparedPropertyIds, setComparedPropertyIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('keydirect_compared_ids') || '[]');
    } catch {
      return [];
    }
  });

  const handleToggleCompare = (id: string) => {
    let updated: string[];
    if (comparedPropertyIds.includes(id)) {
      updated = comparedPropertyIds.filter(item => item !== id);
    } else {
      if (comparedPropertyIds.length >= 4) {
        alert('You can compare up to 4 properties simultaneously on KeyDirect.');
        return;
      }
      updated = [...comparedPropertyIds, id];
      confetti({ particleCount: 25, colors: ['#2563eb', '#ffffff'] });
    }
    setComparedPropertyIds(updated);
    localStorage.setItem('keydirect_compared_ids', JSON.stringify(updated));
  };

  const handleClearCompare = () => {
    setComparedPropertyIds([]);
    localStorage.removeItem('keydirect_compared_ids');
  };

  // Initialize Firebase Auth & Real-Time Sync
  useEffect(() => {
    // Graceful handling for local VS Code testing with placeholder credentials
    if (isPlaceholderConfig) {
      testFirestoreConnection();
      try {
        const savedProf = localStorage.getItem('local_business_profile');
        if (savedProf) setBusinessProfile(JSON.parse(savedProf));
        const savedCamp = localStorage.getItem('local_campaign_data');
        if (savedCamp) setCampaign(JSON.parse(savedCamp));
      } catch (err) {
        console.warn('Local storage load notice:', err);
      }
      setUserUid('demo-vscode-user');
      setFirebaseSynced(false);
      return;
    }

    let unsubscribeCampaign: (() => void) | null = null;

    testFirestoreConnection();

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserUid(user.uid);
        setFirebaseSynced(true);

        try {
          // Sync or load business profile
          const businessRef = doc(db, 'businesses', user.uid);
          const bSnap = await getDoc(businessRef);
          if (bSnap.exists()) {
            setBusinessProfile(bSnap.data() as BusinessProfile);
          } else {
            await setDoc(businessRef, { ...initialBusinessProfile, ownerUid: user.uid, updatedAt: new Date().toISOString() });
          }

          // Sync or load campaign
          const campaignRef = doc(db, 'campaigns', user.uid);
          const cSnap = await getDoc(campaignRef);
          if (cSnap.exists()) {
            setCampaign(cSnap.data() as CampaignMatrix);
          } else {
            await setDoc(campaignRef, { ...initialCampaignMatrix, ownerUid: user.uid, updatedAt: new Date().toISOString() });
          }

          // Real-time listener
          if (unsubscribeCampaign) unsubscribeCampaign();
          unsubscribeCampaign = onSnapshot(campaignRef, (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              if (data.dailyPosts) {
                setCampaign(data as CampaignMatrix);
              }
            }
          });
        } catch (err) {
          console.warn('Firestore user sync notice:', err);
        }
      } else {
        const anonUser = await ensureAuthenticatedUser();
        if (anonUser) {
          setCurrentUser(anonUser);
          setUserUid(anonUser.uid);
          setFirebaseSynced(true);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeCampaign) unsubscribeCampaign();
    };
  }, []);

  const persistCampaignToFirestore = async (newCampaign: CampaignMatrix) => {
    setCampaign(newCampaign);
    localStorage.setItem('local_campaign_data', JSON.stringify(newCampaign));
    if (isPlaceholderConfig) return;
    try {
      if (userUid) {
        const campaignRef = doc(db, 'campaigns', userUid);
        await setDoc(campaignRef, { ...newCampaign, ownerUid: userUid, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (err) {
      console.warn('Could not persist to Firestore:', err);
    }
  };

  const persistProfileToFirestore = async (newProfile: BusinessProfile) => {
    setBusinessProfile(newProfile);
    localStorage.setItem('local_business_profile', JSON.stringify(newProfile));
    if (isPlaceholderConfig) return;
    try {
      if (userUid) {
        const businessRef = doc(db, 'businesses', userUid);
        await setDoc(businessRef, { ...newProfile, ownerUid: userUid, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (err) {
      console.warn('Could not persist profile to Firestore:', err);
    }
  };

  const persistLogToFirestore = async (newLog: AutopilotLog) => {
    setLogs((prev) => [newLog, ...prev]);
    if (isPlaceholderConfig) return;
    try {
      if (userUid) {
        const logRef = doc(db, 'logs', newLog.id);
        await setDoc(logRef, { ...newLog, ownerUid: userUid, createdAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Could not persist log to Firestore:', err);
    }
  };

  const handleSaveToMedia = async (asset: any) => {
    if (isPlaceholderConfig) return;
    try {
      if (userUid) {
        const mediaRef = doc(db, 'media', asset.id);
        await setDoc(mediaRef, { ...asset, ownerUid: userUid });
      }
    } catch (err) {
      console.warn('Could not persist media asset to Firestore:', err);
    }
  };

  const handleSaveChatMessage = async (msg: any) => {
    if (isPlaceholderConfig) return;
    try {
      if (userUid) {
        const chatRef = doc(db, 'chats', msg.id);
        await setDoc(chatRef, { ...msg, ownerUid: userUid, createdAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Could not persist chat message to Firestore:', err);
    }
  };

  // Save new KeyDirect property listing to Firestore
  const handleSavePropertyToFirestore = async (property: PropertyListing) => {
    if (isPlaceholderConfig) return;
    try {
      if (userUid) {
        const propRef = doc(db, 'properties', property.id);
        await setDoc(propRef, { ...property, ownerUid: userUid, createdAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Could not persist property to Firestore:', err);
    }
  };

  // Cross-Platform Integration: Promote KeyDirect property with LazyCEO Autopilot!
  const handlePromotePropertyWithLazyCEO = (property: PropertyListing) => {
    // Reconfigure BusinessProfile for this property
    const realEstateProfile: BusinessProfile = {
      name: property.title,
      tagline: `Direct verified Nigerian real estate in ${property.neighborhood}, ${property.city}`,
      industry: `Nigerian Real Estate & Property Development (${property.category})`,
      audience: 'High-Net-Worth Diaspora Investors, Executives & Discerning Home Seekers',
      tone: 'Institutional & Authoritative',
      targetGeo: 'Nigeria (Lagos/Abuja), United Kingdom, United States, Global Diaspora',
      valueProp: `₦${property.priceNaira.toLocaleString()} - Direct owner connection with zero broker hassle. Verified title and premium infrastructure.`,
      website: 'https://keydirect.ng',
      foundedYear: '2026'
    };

    setBusinessProfile(realEstateProfile);
    setActivePlatform('lazyceo');
    setCurrentTab('engine');
    setProfileModalOpen(true);

    confetti({ particleCount: 40, colors: ['#c52222', '#dc2626', '#ffffff'] });
  };

  // Cross-Platform Integration: Market SimeonJr Studio Hub with LazyCEO Autopilot!
  const handlePromoteStudioWithLazyCEO = (serviceOrStudio: any) => {
    const studioProfile: BusinessProfile = {
      name: serviceOrStudio.name || 'SimeonJr Studio Hub',
      tagline: serviceOrStudio.tagline || 'Lagos-based Creative Full-Stack Dev & AI Fanatic. End-to-end apps in 48 hours.',
      industry: serviceOrStudio.industry || 'AI Engineering & Rapid Full-Stack Development',
      audience: serviceOrStudio.audience || 'Founders, Startup CTOs & Agency Owners Worldwide',
      tone: serviceOrStudio.tone || 'Bold, High-Velocity & Direct',
      targetGeo: serviceOrStudio.targetGeo || 'United States, United Kingdom, Nigeria, Europe, Global',
      valueProp: serviceOrStudio.valueProp || 'Why hire a 5-person agency when you can hire one developer with an AI-cloned workflow? 48h turnaround, Firebase backend, React UI.',
      website: serviceOrStudio.website || 'https://simeonjr.studio',
      foundedYear: '2026'
    };

    setBusinessProfile(studioProfile);
    setActivePlatform('lazyceo');
    setCurrentTab('engine');
    setProfileModalOpen(true);

    confetti({ particleCount: 50, colors: ['#f59e0b', '#ef4444', '#ffffff'] });
  };

  const handleSaveStudioJobToFirestore = async (job: any) => {
    try {
      if (userUid) {
        const jobRef = doc(db, 'jobs', job.id);
        await setDoc(jobRef, { ...job, ownerUid: userUid, createdAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Could not persist studio job to Firestore:', err);
    }
  };

  const handleSaveStudioProposalToFirestore = async (prop: any) => {
    try {
      if (userUid) {
        const propRef = doc(db, 'proposals', prop.id);
        await setDoc(propRef, { ...prop, ownerUid: userUid, createdAt: new Date().toISOString() });
      }
    } catch (err) {
      console.warn('Could not persist studio proposal to Firestore:', err);
    }
  };

  // Trigger Daily Pulse Handler
  const handleTriggerPulse = async () => {
    setIsPulsing(true);
    try {
      const queuedPost = campaign.dailyPosts.find(p => p.status === 'queued') || campaign.dailyPosts[0];
      
      const res = await fetch('/api/dispatch-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: queuedPost,
          channels: ['x', 'linkedin', 'threads']
        })
      });
      const data = await res.json();

      if (data.success) {
        const updatedPosts = campaign.dailyPosts.map(p => 
          p.id === queuedPost.id 
            ? { ...p, status: 'published' as const, impressions: (p.impressions || 0) + 18500 }
            : p
        );

        const updatedCampaign = {
          ...campaign,
          dailyPosts: updatedPosts
        };

        await persistCampaignToFirestore(updatedCampaign);

        const newLogEntry: AutopilotLog = {
          id: `log-${Date.now()}`,
          timestamp: 'Just Now',
          title: `Daily Pulse: "${queuedPost.headline}"`,
          channel: 'Omnichannel (X, LinkedIn, Threads)',
          cadence: 'daily',
          reach: 24500,
          status: 'DISTRIBUTED'
        };

        await persistLogToFirestore(newLogEntry);

        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#ef4444', '#dc2626', '#f87171', '#ffffff']
        });
      }
    } catch (err) {
      console.error('Pulse trigger error:', err);
    } finally {
      setTimeout(() => {
        setIsPulsing(false);
      }, 800);
    }
  };

  const handleDispatchPost = async (post: DailyPost) => {
    const updated = campaign.dailyPosts.map(p => 
      p.id === post.id 
        ? { ...p, status: 'published' as const, impressions: (p.impressions || 0) + 14200 } 
        : p
    );
    await persistCampaignToFirestore({ ...campaign, dailyPosts: updated });

    const newLog: AutopilotLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Just Now',
      title: `Dispatched: ${post.headline}`,
      channel: post.platform.toUpperCase(),
      cadence: 'daily',
      reach: post.projectedReach,
      status: 'DISTRIBUTED'
    };
    await persistLogToFirestore(newLog);
  };

  const handleToggleConnect = (channelId: string) => {
    setChannels(channels.map(c => 
      c.id === channelId ? { ...c, connected: !c.connected, automated: !c.connected ? true : false } : c
    ));
  };

  const handleToggleAutomation = (channelId: string) => {
    setChannels(channels.map(c => 
      c.id === channelId ? { ...c, automated: !c.automated } : c
    ));
  };

  const handleNewLog = async (newLog: AutopilotLog) => {
    await persistLogToFirestore(newLog);
  };

  const handleSaveAndGenerate = async (newProfile: BusinessProfile, newCampaign: CampaignMatrix) => {
    await persistProfileToFirestore(newProfile);
    await persistCampaignToFirestore(newCampaign);
  };

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        setCurrentUser(user);
        setUserUid(user.uid);
        confetti({ particleCount: 40, colors: ['#ef4444', '#ffffff'] });
      }
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      
      {/* Universal Two-in-One Dual-Platform Navbar */}
      <Navbar
        activePlatform={activePlatform}
        setActivePlatform={setActivePlatform}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        autopilotActive={autopilotActive}
        setAutopilotActive={setAutopilotActive}
        onTriggerPulse={handleTriggerPulse}
        isPulsing={isPulsing}
        firebaseSynced={firebaseSynced}
        currentUser={currentUser}
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
        studioBrandName={studioBrandName}
        onOpenFounderDashboard={() => setFounderDashboardOpen(true)}
        onOpenSocialHub={() => setSocialHubOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* PLATFORM 4: GIGCONNECT GLOBAL CAREER PILOT */}
        {activePlatform === 'gigconnect' && (
          <GigConnectPlatform />
        )}

        {/* PLATFORM 3: VERIFIED FREELANCE & SERVICE MARKETPLACE */}
        {activePlatform === 'studio' && (
          <SimeonJrStudioHub
            onPromoteWithLazyCEO={handlePromoteStudioWithLazyCEO}
            onSaveJobToFirestore={handleSaveStudioJobToFirestore}
            onSaveProposalToFirestore={handleSaveStudioProposalToFirestore}
            onSendMessageToFirestore={handleSaveChatMessage}
            userUid={userUid}
            brandName={studioBrandName}
            onUpdateBrandName={(newName) => {
              setStudioBrandName(newName);
              localStorage.setItem('studio_custom_brand_name', newName);
            }}
          />
        )}

        {/* PLATFORM 2: KEYDIRECT REAL ESTATE */}
        {activePlatform === 'keydirect' && (
          <KeyDirectPlatform
            onPromoteWithLazyCEO={handlePromotePropertyWithLazyCEO}
            onSavePropertyToFirestore={handleSavePropertyToFirestore}
            comparedIds={comparedPropertyIds}
            onToggleCompare={handleToggleCompare}
            onClearCompare={handleClearCompare}
          />
        )}

        {/* PLATFORM 1: LAZYCEO AUTONOMOUS CMO */}
        {activePlatform === 'lazyceo' && currentTab === 'marketing' && (
          <MarketingSite
            onLaunchDashboard={() => setCurrentTab('engine')}
            onOpenPitch={(name) => {
              persistProfileToFirestore({ ...businessProfile, name });
              setCurrentTab('engine');
            }}
          />
        )}

        {activePlatform === 'lazyceo' && currentTab === 'engine' && (
          <AutopilotEngine
            campaign={campaign}
            businessProfile={businessProfile}
            onOpenProfileModal={() => setProfileModalOpen(true)}
            onOpenPRModal={(pr) => setSelectedPR(pr)}
            onDispatchPost={handleDispatchPost}
            onUpdateCampaign={persistCampaignToFirestore}
          />
        )}

        {activePlatform === 'lazyceo' && currentTab === 'media' && (
          <MediaStudio
            onSaveToMedia={handleSaveToMedia}
            userUid={userUid}
          />
        )}

        {activePlatform === 'lazyceo' && currentTab === 'chat' && (
          <RedRobotChatVoice
            onSaveMessage={handleSaveChatMessage}
            userUid={userUid}
          />
        )}

        {activePlatform === 'lazyceo' && currentTab === 'radar' && (
          <SearchMapsRadar />
        )}

        {activePlatform === 'lazyceo' && currentTab === 'analytics' && (
          <AnalyticsDashboard logs={logs} />
        )}

        {activePlatform === 'lazyceo' && currentTab === 'channels' && (
          <SocialIntegrationHub
            channels={channels}
            onToggleConnect={handleToggleConnect}
            onToggleAutomation={handleToggleAutomation}
            onNewLog={handleNewLog}
          />
        )}
      </main>

      {/* Universal Cookie & Marketing Consent Banner */}
      <ConsentBanner />

      {/* Founder Control Console Modal */}
      {founderDashboardOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md">
          <FounderDashboard onClose={() => setFounderDashboardOpen(false)} />
        </div>
      )}

      {/* Universal Social Integration Hub Modal */}
      {socialHubOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md">
          <SharedSocialIntegrationHub onClose={() => setSocialHubOpen(false)} />
        </div>
      )}

      {/* Modals */}
      <PressReleaseModal
        pr={selectedPR}
        onClose={() => setSelectedPR(null)}
      />

      <BusinessProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={businessProfile}
        onSaveAndGenerate={handleSaveAndGenerate}
      />

    </div>
  );
}
