import React, { useState } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Home, 
  Award, 
  AlertTriangle, 
  FileCheck, 
  Download, 
  Filter, 
  Calendar, 
  Check, 
  X, 
  RefreshCw, 
  Eye, 
  SlidersHorizontal,
  Lock,
  Globe,
  Radio,
  BarChart3,
  CreditCard,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getRecordedAnalyticsEvents } from '../lib/analytics';

export interface VerificationApplication {
  id: string;
  type: 'blue_tick_identity' | 'blue_tick_business' | 'red_tick_property';
  subjectName: string;
  propertyTitle?: string;
  documentsSubmitted: string[];
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface MediaReportCase {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reportedBy: string;
  reason: 'Suspected AI-Generated Media' | 'Misleading Layout' | 'Stolen / Reused Photos' | 'Defect Concealment';
  evidenceUrl?: string;
  timestamp: string;
  status: 'under_review' | 'action_taken' | 'dismissed';
}

const initialVerifications: VerificationApplication[] = [
  {
    id: 'ver-101',
    type: 'red_tick_property',
    subjectName: 'Barrister Chinedu Okafor (Authorized Solicitor)',
    propertyTitle: 'Luxury 4-Bedroom Waterfront Maisonette with Private Jetty',
    documentsSubmitted: ["Governor's Consent Deed", "Survey Plan Seal #LA/2024/991", "Direct Power of Attorney"],
    submittedDate: 'Oct 16, 2026',
    status: 'pending',
    reviewNotes: 'Awaiting surveyor coordinate verification on Lagos Lands Bureau'
  },
  {
    id: 'ver-102',
    type: 'blue_tick_business',
    subjectName: 'Apex Prime Realty Ltd (CAC RC 1882941)',
    documentsSubmitted: ['CAC Certificate of Incorporation', 'SCUML Anti-Money Laundering Clearance', 'Managing Director Tax ID'],
    submittedDate: 'Oct 15, 2026',
    status: 'approved',
    reviewedBy: 'Founder (SimeonJr)',
    reviewNotes: 'Corporate registration & tax certificates verified with CAC portal'
  },
  {
    id: 'ver-103',
    type: 'red_tick_property',
    subjectName: 'Victoria Island Development Partners',
    propertyTitle: 'Direct Table Dry Commercial Plot — 1,200 SQM',
    documentsSubmitted: ['Federal C of O Ref #8812/VI', 'Survey Plan #LA/ISL/442'],
    submittedDate: 'Oct 17, 2026',
    status: 'pending',
    reviewNotes: 'Beacon inspection confirmed on dry table terrain'
  }
];

const initialReports: MediaReportCase[] = [
  {
    id: 'rep-01',
    propertyId: 'prop-flagged-09',
    propertyTitle: 'Alleged 3-Bedroom Penthouse in Ikoyi',
    reportedBy: 'inspection_seeker@gmail.com',
    reason: 'Suspected AI-Generated Media',
    evidenceUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
    timestamp: '2 hours ago',
    status: 'under_review'
  }
];

export const FounderDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'income' | 'verification' | 'moderation' | 'analytics' | 'adsense'>('income');
  const [verifications, setVerifications] = useState<VerificationApplication[]>(initialVerifications);
  const [reports, setReports] = useState<MediaReportCase[]>(initialReports);
  const [currencyFilter, setCurrencyFilter] = useState<'ALL' | 'USD' | 'NGN'>('ALL');

  // Income Zone breakdown
  const financialRecords = [
    { id: 'tx-1', category: 'Paid Subscriptions (LazyCEO 365)', grossUSD: 1990, processorFeeUSD: 59, refundUSD: 0, netUSD: 1931, date: 'Oct 2026' },
    { id: 'tx-2', category: 'Featured Property Listings (KeyDirect)', grossUSD: 1250, processorFeeUSD: 37, refundUSD: 0, netUSD: 1213, date: 'Oct 2026' },
    { id: 'tx-3', category: 'Professional Agent & Agency Plans', grossUSD: 850, processorFeeUSD: 25, refundUSD: 0, netUSD: 825, date: 'Oct 2026' },
    { id: 'tx-4', category: 'TalentDock Service Order Commissions', grossUSD: 1640, processorFeeUSD: 49, refundUSD: 0, netUSD: 1591, date: 'Oct 2026' },
    { id: 'tx-5', category: 'Digital Billboard Direct Placements', grossUSD: 2400, processorFeeUSD: 72, refundUSD: 0, netUSD: 2328, date: 'Oct 2026' },
    { id: 'tx-6', category: 'Google AdSense Finalized Earnings', grossUSD: 412, processorFeeUSD: 0, refundUSD: 0, netUSD: 412, date: 'Oct 2026' },
  ];

  const totalGross = financialRecords.reduce((acc, r) => acc + r.grossUSD, 0);
  const totalFees = financialRecords.reduce((acc, r) => acc + r.processorFeeUSD, 0);
  const totalNet = financialRecords.reduce((acc, r) => acc + r.netUSD, 0);

  // Verification review actions
  const handleApproveBadge = (verId: string) => {
    setVerifications(prev => prev.map(v => v.id === verId ? {
      ...v,
      status: 'approved',
      reviewedBy: 'Founder Audit Protocol',
      reviewNotes: 'Identity & ownership documentation passed full due-diligence review.'
    } : v));
    confetti({ particleCount: 30, colors: ['#3b82f6', '#ef4444', '#10b981'] });
  };

  const handleRejectBadge = (verId: string) => {
    setVerifications(prev => prev.map(v => v.id === verId ? {
      ...v,
      status: 'rejected',
      reviewedBy: 'Founder Audit Protocol',
      reviewNotes: 'Insufficient chain of title documents provided.'
    } : v));
  };

  // Moderation action
  const handleTakeActionOnReport = (repId: string) => {
    setReports(prev => prev.map(r => r.id === repId ? { ...r, status: 'action_taken' } : r));
    alert('Listing suspended pending physical site inspection per KeyDirect Strict Media Policy.');
  };

  // Export Financial CSV
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Category,Gross USD,Processor Fees USD,Net Income USD,Date\n" +
      financialRecords.map(r => `"${r.category}",${r.grossUSD},${r.processorFeeUSD},${r.netUSD},"${r.date}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `simeonjr_studios_income_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const analyticsEvents = getRecordedAnalyticsEvents();

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 text-slate-100 font-sans">
      <div className="bg-slate-950 border border-red-950/80 rounded-3xl max-w-7xl w-full max-h-[96vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Top Founder Navigation */}
        <div className="p-4 sm:px-6 border-b border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center p-0.5 shadow-lg shadow-red-900/40">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white">Private Founder Control Centre</h2>
                <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                SimeonJr Studios Ecosystem Owner • LazyCEO, KeyDirect, TalentDock & GIGCONNECT
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/40 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('income')}
            className={`px-4 py-2 font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'income' ? 'border-red-500 text-white bg-slate-900' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Income Zone (Revenue Control)</span>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'verification' ? 'border-red-500 text-white bg-slate-900' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4 text-blue-400" />
            <span>Blue & Red Ticks Verification Queue ({verifications.filter(v => v.status === 'pending').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'moderation' ? 'border-red-500 text-white bg-slate-900' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Media Integrity & Fake AI Reports ({reports.filter(r => r.status === 'under_review').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-bold rounded-t-xl transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
              activeTab === 'analytics' ? 'border-red-500 text-white bg-slate-900' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>GMP & Conversion Log ({analyticsEvents.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* =================================================================== */}
          {/* TAB 1: INCOME ZONE — REVENUE CONTROL CENTRE */}
          {/* =================================================================== */}
          {activeTab === 'income' && (
            <div className="space-y-6">
              
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gross Transaction Value</span>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                    ${totalGross.toLocaleString()} USD
                  </div>
                  <span className="text-[11px] text-slate-500">Total processed across all 4 platforms</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estimated Net Platform Income</span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                    ${totalNet.toLocaleString()} USD
                  </div>
                  <span className="text-[11px] text-emerald-500/80 font-mono">After processor fees ($ {totalFees})</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reconciliation & Export</span>
                    <div className="text-sm font-bold text-slate-200 mt-1">Verified Audit Trail Active</div>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Financial CSV</span>
                  </button>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Itemized Revenue Categories</h3>
                  <span className="text-xs text-slate-400">Preserves original currencies without mixing</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">Platform Revenue Stream</th>
                        <th className="p-3.5">Gross (USD)</th>
                        <th className="p-3.5">Processor Fees</th>
                        <th className="p-3.5">Refunds</th>
                        <th className="p-3.5">Net Realized</th>
                        <th className="p-3.5">Period</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-200">
                      {financialRecords.map(r => (
                        <tr key={r.id} className="hover:bg-slate-900/40">
                          <td className="p-3.5 font-bold text-white">{r.category}</td>
                          <td className="p-3.5 font-mono">${r.grossUSD.toLocaleString()}</td>
                          <td className="p-3.5 text-slate-400 font-mono">-${r.processorFeeUSD}</td>
                          <td className="p-3.5 text-slate-400 font-mono">${r.refundUSD}</td>
                          <td className="p-3.5 font-bold text-emerald-400 font-mono">${r.netUSD.toLocaleString()}</td>
                          <td className="p-3.5 text-slate-400">{r.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: BLUE TICKS & RED TICKS VERIFICATION QUEUE */}
          {/* =================================================================== */}
          {activeTab === 'verification' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-400" />
                  <span>KeyDirect & Ecosystem Verification Standards</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  <strong>Blue Tick (Verified Identity/Business):</strong> Confirms legal identity via CAC or passport. <br />
                  <strong>Red Tick (Verified Property/Ownership Authority):</strong> Confirms "Property documents reviewed" (Governor's Consent, C of O, survey seal). Badges must never be granted automatically for payment.
                </p>
              </div>

              <div className="space-y-3">
                {verifications.map(ver => (
                  <div key={ver.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        {ver.type === 'red_tick_property' ? (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Red Tick • Property Authority
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Blue Tick • Business Identity
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ver.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {ver.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{ver.subjectName}</h4>
                      {ver.propertyTitle && (
                        <div className="text-xs text-slate-400">Property: {ver.propertyTitle}</div>
                      )}

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ver.documentsSubmitted.map((doc, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-mono">
                            📄 {doc}
                          </span>
                        ))}
                      </div>

                      {ver.reviewNotes && (
                        <p className="text-[11px] text-slate-400 italic mt-1">Audit Note: {ver.reviewNotes}</p>
                      )}
                    </div>

                    {ver.status === 'pending' && (
                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => handleRejectBadge(ver.id)}
                          className="px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-red-950/40 text-red-400 border border-red-900/40 text-xs font-bold cursor-pointer"
                        >
                          Reject / Request Docs
                        </button>
                        <button
                          onClick={() => handleApproveBadge(ver.id)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Grant Badge</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 3: MEDIA INTEGRITY & FAKE AI COMPLAINTS */}
          {/* =================================================================== */}
          {activeTab === 'moderation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Strict Real Property Media Policy Enforcement</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  AI-generated property videos or synthetic photos presented as genuine real estate walkthroughs are strictly prohibited on KeyDirect. All reports are logged with review timestamps.
                </p>
              </div>

              <div className="space-y-3">
                {reports.map(rep => (
                  <div key={rep.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {rep.reason}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">Report #{rep.id} • {rep.timestamp}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{rep.propertyTitle}</h4>
                      <p className="text-xs text-slate-400">Reported by: {rep.reportedBy}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {rep.status === 'under_review' ? (
                        <button
                          onClick={() => handleTakeActionOnReport(rep.id)}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer"
                        >
                          Suspend Listing & Demand Physical Proof
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 text-xs font-mono">
                          Action Resolved
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 4: GMP & CONVERSION EVENT AUDIT LOG */}
          {/* =================================================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Google Marketing Platform Live Event Stream</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time log of sanitized conversion events dispatched across all 4 platforms.</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Privacy Sanitization Active
                </span>
              </div>

              <div className="space-y-2">
                {analyticsEvents.length === 0 ? (
                  <div className="text-center py-10 text-xs text-slate-500">
                    No analytics events recorded in this session yet. Events trigger as users publish properties, order gigs, or dispatch campaigns.
                  </div>
                ) : (
                  analyticsEvents.map(evt => (
                    <div key={evt.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          evt.isConversion ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {evt.isConversion ? '★ Conversion' : 'Event'}
                        </span>
                        <div>
                          <span className="font-bold text-white font-mono">{evt.eventName}</span>
                          <span className="text-slate-500 text-[11px] ml-2 font-mono">[{evt.platform}]</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {evt.timestamp}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
