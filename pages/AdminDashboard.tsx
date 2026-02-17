
import React, { useState } from 'react';
import { MOCK_MEMBERS, MOCK_POOLS } from '../constants';
import { MemberTier, Pool, AdvanceRequest } from '../types';
import { generateWholesaleProposal, generateMediationAdvice, AiResponse } from '../services/ai';
import { appendAudit } from '../audit/auditStore';
import { enforceStepUp, CURRENT_ADMIN_SESSION } from '../auth/securityManager';

const MOCK_ADVANCES: AdvanceRequest[] = [
  { id: 'adv-1', userId: 'm1', userName: 'Lindiwe M.', poolId: 'p1', amount: 15000, status: 'Pending', tier: 'Tier 1 (Exceptional)', requestedAt: '2025-10-10' },
  { id: 'adv-2', userId: 'm2', userName: 'Sipho K.', poolId: 'p1', amount: 5000, status: 'Approved', tier: 'Tier 2 (Good)', requestedAt: '2025-10-11' }
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedPoolId, setSelectedPoolId] = useState(MOCK_POOLS[0].id);
  const [proposalPartner, setProposalPartner] = useState('');
  const [proposalOutput, setProposalOutput] = useState<AiResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSecurityVerified, setIsSecurityVerified] = useState(false);

  // Mediation state
  const [isMediating, setIsMediating] = useState(false);
  const [mediationAdvice, setMediationAdvice] = useState<AiResponse | null>(null);
  const [isSent, setIsSent] = useState(false);

  const selectedPool = MOCK_POOLS.find(p => p.id === selectedPoolId) || MOCK_POOLS[0];

  const handleGenerateProposal = async () => {
    if (!proposalPartner || !selectedPool) return;
    
    // Board Directive Enforcement: Step-up for Partnership creation
    const verified = await enforceStepUp(CURRENT_ADMIN_SESSION, "PARTNERSHIP_PROPOSAL");
    if (!verified) return;

    setIsGenerating(true);
    await appendAudit({
      actor_user_id: CURRENT_ADMIN_SESSION.userId,
      action: "ADMIN_ACTION",
      target_type: "PARTNERSHIP_PROPOSAL",
      target_id: proposalPartner,
      metadata: { pool_id: selectedPool.id, type: "WHOLESALE_NEGOTIATION", security: "MFA_VERIFIED" }
    });

    const result = await generateWholesaleProposal(selectedPool.name, selectedPool.totalPoolValue, selectedPool.totalMembers, proposalPartner);
    setProposalOutput(result);
    setIsGenerating(false);
  };

  const handleReviewAdvance = async (adv: AdvanceRequest) => {
    // Enforce Step-Up for Financial Reviews
    const verified = await enforceStepUp(CURRENT_ADMIN_SESSION, `ADVANCE_REVIEW:${adv.id}`);
    if (!verified) return;

    await appendAudit({
      actor_user_id: CURRENT_ADMIN_SESSION.userId,
      action: "ADMIN_ACTION",
      target_type: "ADVANCE_REVIEW",
      target_id: adv.id,
      metadata: { member: adv.userName, amount: adv.amount, security: "STEP_UP_PASS" }
    });
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <h1 className="text-6xl lg:text-7xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-[0.85]">
            Admin <br /> <span className="text-[#D6CFC7] dark:text-[#6B706C]">Console</span>
          </h1>
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-[#8CA082] animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8CA082]">Privileged Session (2FA Active)</p>
          </div>
        </div>
      </div>

      <div className="flex gap-12 border-b border-[#F1F0EE] dark:border-[#3A3D3B] overflow-x-auto no-scrollbar scroll-smooth">
        {['Overview', 'Partnerships', 'Advances', 'Violations', 'Security'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab 
                ? 'border-[#8CA082] text-[#2D302E] dark:text-[#FDFCFB]' 
                : 'border-transparent text-[#9EA39F] dark:text-[#6B706C] hover:text-[#2D302E]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Total Pool Funds', value: 'R 56,700', trend: '+12.5%' },
            { label: 'Platform Fees', value: 'R 3,200', trend: '+5.2%' },
            { label: 'Active Circles', value: '8', trend: 'Stable' },
            { label: 'Auth Health', value: '98%', trend: 'FIDO2' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-[#252826] p-10 rounded-[40px] border border-[#F1F0EE] dark:border-[#3A3D3B]">
              <p className="text-[10px] font-black text-[#9EA39F] uppercase mb-4">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-[#2D302E] dark:text-[#FDFCFB] italic">{stat.value}</h3>
                <span className="text-[10px] font-black text-[#7C9082] bg-[#FDFCFB] dark:bg-[#1A1C1B] px-3 py-1.5 rounded-full">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in slide-in-from-bottom-4">
           <div className="bg-white dark:bg-[#252826] p-12 rounded-[60px] border-2 border-[#8CA082]/20 space-y-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Security Directive UP-SEC-002</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Mandatory 2FA', status: 'Enforced', method: 'Passkeys' },
                   { label: 'Step-Up Challenges', status: 'Active', method: 'RESTRICTED_ACTIONS' },
                   { label: 'Auth Logs (Hashed)', status: 'Syncing', method: 'ECTA Compliant' },
                   { label: 'Credential Policy', status: 'Hardened', method: 'Zero-Password' }
                 ].map((item, idx) => (
                   <li key={idx} className="flex justify-between items-center border-b border-[#F1F0EE] dark:border-[#3A3D3B] pb-4 list-none">
                      <div>
                        <p className="text-xs font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase">{item.label}</p>
                        <p className="text-[9px] font-bold text-[#9EA39F] uppercase tracking-widest">{item.method}</p>
                      </div>
                      <span className="text-[9px] font-black uppercase text-[#8CA082] bg-[#8CA082]/10 px-3 py-1 rounded-full">{item.status}</span>
                   </li>
                 ))}
              </div>
           </div>
           <div className="bg-[#2D302E] p-12 rounded-[60px] space-y-8 text-white relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-[0.9]">Audit <br /> Credentials</h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed">Validate your current session cryptographic signature and enrolled devices.</p>
                <button 
                  onClick={() => enforceStepUp(CURRENT_ADMIN_SESSION, "IDENTITY_AUDIT")}
                  className="w-full bg-[#8CA082] text-white py-6 rounded-[32px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#D4AF37] transition-all"
                >
                  Verify MFA Token
                </button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'Advances' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-4">
           <div className="bg-white dark:bg-[#252826] p-12 rounded-[60px] border border-[#F1F0EE] dark:border-[#3A3D3B] space-y-10">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Managed Advances Dashboard</h3>
              <div className="space-y-6">
                {MOCK_ADVANCES.map((adv) => (
                  <div key={adv.id} className="bg-[#F9F9F8] dark:bg-[#1A1C1B] p-8 rounded-[32px] border border-[#F1F0EE] dark:border-[#3A3D3B] flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-6 items-center">
                       <div className="w-12 h-12 bg-[#8CA082] rounded-2xl flex items-center justify-center text-white font-black shadow-lg">{adv.userName.charAt(0)}</div>
                       <div>
                         <p className="text-sm font-black dark:text-white uppercase leading-none mb-1">{adv.userName}</p>
                         <p className="text-[10px] font-bold text-[#8CA082] uppercase tracking-widest">{adv.tier} • R {adv.amount.toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex-1 text-center ${
                        adv.status === 'Approved' ? 'bg-[#8CA082]/10 text-[#8CA082]' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                      }`}>
                        {adv.status}
                      </span>
                      <button 
                        onClick={() => handleReviewAdvance(adv)}
                        className="bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#8CA082] transition-all flex-1"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
