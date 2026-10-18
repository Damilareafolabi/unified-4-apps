import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  CheckCircle2, 
  Send, 
  Share2, 
  Globe, 
  Newspaper, 
  Building2, 
  DollarSign,
  TrendingUp,
  Cpu,
  Bot
} from 'lucide-react';
import { MonthlyPR, BusinessProfile, CampaignMatrix } from '../types';
import confetti from 'canvas-confetti';

interface PRModalProps {
  pr: MonthlyPR | null;
  onClose: () => void;
}

export const PressReleaseModal: React.FC<PRModalProps> = ({ pr, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!pr) return null;

  const fullText = `FOR IMMEDIATE RELEASE

${pr.headline.toUpperCase()}

${pr.dateline} — ${pr.leadParagraph}

${pr.quote}

About the Company:
The organization operates an autonomous infrastructure designed to deliver 365-day market presence and institutional publicity worldwide with zero operational friction.

Media Contact:
LazyCEO Global Press Wire Desk
press@lazyceo.ai
https://lazyceo.ai
Distribution: ${pr.targetWires.join(', ')}
###`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-red-950/80 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-red-950/30 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-red-500" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              AP Standard Wire Press Release
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
          <div className="text-[11px] font-mono text-red-400 uppercase tracking-widest font-bold">
            FOR IMMEDIATE RELEASE • {pr.month}
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-white leading-snug">
            {pr.headline}
          </h1>

          <div className="pt-2 text-slate-300">
            <span className="font-bold text-slate-100">{pr.dateline} — </span>
            {pr.leadParagraph}
          </div>

          <div className="p-4 bg-slate-950/80 rounded-xl border-l-4 border-red-500 text-slate-200 italic">
            {pr.quote}
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="font-bold text-slate-300">Syndication Targets:</div>
            <div className="flex flex-wrap gap-1.5">
              {pr.targetWires.map((wire, idx) => (
                <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-[11px] text-red-300 font-mono">
                  {wire}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-950/60 text-xs">
          <span className="text-slate-400">Indexed on Bloomberg & Google News</span>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-red-600/30"
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Full Press Release'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  onSaveAndGenerate: (profile: BusinessProfile, newCampaign: CampaignMatrix) => void;
}

export const BusinessProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveAndGenerate
}) => {
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setStatusMessage('Querying Gemini 3.8 Flash for 365 Autopilot Matrix...');

    try {
      const res = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: formData.name,
          industry: formData.industry,
          audience: formData.audience,
          tone: formData.tone,
          targetGeo: formData.targetGeo,
          uniqueValueProp: formData.valueProp
        })
      });

      const data = await res.json();
      if (data.success && data.campaign) {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#dc2626', '#f87171', '#ffffff']
        });
        onSaveAndGenerate(formData, data.campaign);
        onClose();
      } else {
        setStatusMessage('Failed to generate. Please check parameters.');
      }
    } catch (err) {
      console.error('Error generating AI campaign:', err);
      setStatusMessage('Network error. Check server logs.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-red-950/80 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl shadow-red-950/30 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-red-500" />
            <span className="text-base font-bold text-white">
              Configure Business & Generate 365 AI Matrix
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
              placeholder="e.g. NovaScale Logistics"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tagline / One-Liner
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
              placeholder="e.g. Next-Gen Supply Chain Intelligence Platform"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Industry / Niche *
              </label>
              <input
                type="text"
                required
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                placeholder="e.g. B2B SaaS, FinTech, E-Commerce"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Brand Tone
              </label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
              >
                <option value="Bold & Visionary">Bold & Visionary</option>
                <option value="Institutional & Authoritative">Institutional & Authoritative</option>
                <option value="Sharp & Contrarian">Sharp & Contrarian</option>
                <option value="Witty & Tech Maverick">Witty & Tech Maverick</option>
                <option value="Luxury & Minimalist">Luxury & Minimalist</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Audience & Decision Makers *
            </label>
            <input
              type="text"
              required
              value={formData.audience}
              onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
              placeholder="e.g. CTOs, Growth Marketing Directors, Founders"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Geography
            </label>
            <input
              type="text"
              value={formData.targetGeo}
              onChange={(e) => setFormData({ ...formData, targetGeo: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
              placeholder="e.g. Global, North America, EMEA, APAC"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Core Value Proposition / Offer
            </label>
            <textarea
              rows={2}
              value={formData.valueProp}
              onChange={(e) => setFormData({ ...formData, valueProp: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
              placeholder="What makes your product 10x better than existing alternatives?"
            />
          </div>

          {statusMessage && (
            <div className="text-xs text-red-400 p-2 bg-red-500/10 border border-red-500/20 rounded">
              {statusMessage}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-all shadow-md shadow-red-600/30 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Pulling 365 Cadence...' : 'Deploy AI Autopilot Matrix'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
