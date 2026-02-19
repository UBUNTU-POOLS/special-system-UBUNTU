
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SYSTEM_PERIMETER } from '../compliance/operatingModel';

const Prospectus: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'Strategy' | 'Governance' | 'SWOT' | 'Legal'>('Strategy');

  return (
    <div className="max-w-7xl mx-auto space-y-32 animate-in fade-in duration-1000 pb-40">
      {/* Hero Section */}
      <section className="text-center space-y-12 pt-20">
        <div className="inline-block px-6 py-2 rounded-full border border-[#D4AF37] bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-6">
          Board-Level Mandate — {SYSTEM_PERIMETER.version}
        </div>
        <h1 className="text-7xl lg:text-9xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-[0.8] italic">
          The <span className="text-[#8CA082]">Ubuntu</span> <br /> Protocol
        </h1>
        <p className="text-xl font-medium text-[#6B706C] dark:text-[#9EA39F] max-w-3xl mx-auto leading-relaxed">
          Bridging the R50-billion South African Stokvel economy with global capital through non-custodial governance and cryptographic trust.
        </p>
      </section>

      {/* Navigation Tabs */}
      <div className="flex justify-center gap-12 border-b border-[#F1F0EE] dark:border-[#3A3D3B]">
        {['Strategy', 'Governance', 'SWOT', 'Legal'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveView(tab as any)}
            className={`pb-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all border-b-2 ${
              activeView === tab ? 'border-[#8CA082] text-[#2D302E] dark:text-[#FDFCFB]' : 'border-transparent text-[#9EA39F]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeView === 'Strategy' && (
        <div className="space-y-32 animate-in slide-in-from-bottom-8">
          {/* Revenue Architecture */}
          <section className="bg-[#2D302E] rounded-[80px] p-16 lg:p-24 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 grayscale pointer-events-none">
                <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="" />
            </div>
            <div className="relative z-10 space-y-20">
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Monetization Engine</h2>
                <p className="text-white/60 font-medium text-lg leading-relaxed">
                  We monetize the friction of community finance without taking custody of the underlying assets.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8CA082]">Managed Admin Fees</h4>
                    <div className="space-y-2">
                      <p className="text-3xl font-black italic">R 50.00 / Month</p>
                      <p className="text-sm text-white/40 leading-relaxed">SaaS model for circles requiring automated ledgering, WhatsApp mediation, and FICA verification handling.</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Wholesale Spread</h4>
                    <div className="space-y-2">
                      <p className="text-3xl font-black italic">2.5% Success Fee</p>
                      <p className="text-sm text-white/40 leading-relaxed">Commission earned on collective purchase volume negotiated with national retailers (Makro, Tiger Brands, etc.)</p>
                    </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Pillars */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Non-Custodial", desc: "Hard-coded gates prevent the platform from touching member funds, eliminating counterparty risk.", icon: "🛡️" },
              { title: "Ubuntu Score", desc: "A bias-free reputation engine converting social history into a verifiable financial asset.", icon: "📊" },
              { title: "AI-Mediation", desc: "Lindiwe reduces dispute resolution costs by 85% compared to traditional legal channels.", icon: "✨" }
            ].map((pillar, i) => (
              <div key={i} className="bg-white dark:bg-[#252826] p-12 rounded-[60px] border-2 border-[#F1F0EE] dark:border-[#3A3D3B] space-y-6 hover:border-[#8CA082] transition-all">
                <div className="text-4xl">{pillar.icon}</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic text-[#2D302E] dark:text-[#FDFCFB]">{pillar.title}</h3>
                <p className="text-sm font-medium text-[#6B706C] dark:text-[#9EA39F] leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </section>
        </div>
      )}

      {activeView === 'Governance' && (
        <div className="space-y-20 animate-in slide-in-from-bottom-8">
          <section className="bg-white dark:bg-[#252826] rounded-[60px] border-2 border-[#F1F0EE] dark:border-[#3A3D3B] p-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-12">Legal–Technical Mapping</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-[#F1F0EE] dark:border-[#3A3D3B]">
                  <tr>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-[#9EA39F]">Legal Clause (GWA/BRA)</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-[#9EA39F]">Technical Implementation</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-widest text-[#9EA39F]">Audit Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F0EE] dark:divide-[#3A3D3B]">
                  {[
                    { clause: "Succession & Lineage Transfer", tech: "Beneficiary ID binding in Profile metadata", trigger: "PROFILE_UPDATED" },
                    { clause: "Non-Custodial Lock", tech: "Regex scanner on all outbound API payloads", trigger: "SECURITY_GATED_EVENT" },
                    { clause: "Consensus Voting (75%)", tech: "Smart-contract equivalent logic in posting engine", trigger: "GOVERNANCE_VOTE_CAST" },
                    { clause: "Immutable Recordkeeping", tech: "SHA-256 Hash Chaining on Postgres append-only table", trigger: "EVENT_HASHED" },
                    { clause: "Mandatory 2FA (Directive UP-SEC-002)", tech: "Step-Up challenges for RESTRICTED_ACTIONS", trigger: "STEP_UP_VERIFIED" }
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-[#F9F9F8] dark:hover:bg-[#1A1C1B] transition-colors">
                      <td className="py-6 text-sm font-black text-[#2D302E] dark:text-[#FDFCFB] pr-8">{row.clause}</td>
                      <td className="py-6 text-xs font-medium text-[#6B706C] dark:text-[#9EA39F] pr-8">{row.tech}</td>
                      <td className="py-6"><span className="text-[8px] font-black bg-[#8CA082]/10 text-[#8CA082] px-3 py-1 rounded-full uppercase tracking-widest">{row.trigger}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white dark:bg-[#252826] p-16 rounded-[60px] border-2 border-[#D4AF37]/30 space-y-12">
             <div className="space-y-4">
               <h3 className="text-3xl font-black uppercase tracking-tighter italic">Auth Hardening (UP-SEC-002)</h3>
               <p className="text-sm font-medium text-[#6B706C] dark:text-[#9EA39F] max-w-2xl leading-relaxed">
                 Power without logged authentication is invalid. Our zero-trust model enforces Passkey/TOTP for all privileged roles and high-risk state transitions.
               </p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-[#F9F9F8] dark:bg-[#1A1C1B] rounded-[40px] space-y-4 border border-[#F1F0EE]">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8CA082]">Privileged Role Requirement</h4>
                   <p className="text-xs font-medium text-[#6B706C] dark:text-[#9EA39F] italic leading-relaxed">
                     Compliance, Technical, and Governance officers must enroll a hardware security key or biometric passkey. SMS-based 2FA is prohibited for administrative access.
                   </p>
                </div>
                <div className="p-8 bg-[#F9F9F8] dark:bg-[#1A1C1B] rounded-[40px] space-y-4 border border-[#F1F0EE]">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]">Mandatory Step-Up</h4>
                   <p className="text-xs font-medium text-[#6B706C] dark:text-[#9EA39F] italic leading-relaxed">
                     Actions involving fund settlement, constitutional migration, or permission changes trigger an immediate secondary authentication challenge, independently logged.
                   </p>
                </div>
             </div>
          </section>
        </div>
      )}

      {activeView === 'SWOT' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8">
          {[
            { label: "Strengths", items: ["Cultural legitimacy via Ubuntu philosophy", "Non-custodial risk insulation", "Proprietary Trust DNA scoring"], color: "bg-[#5C7A67]" },
            { label: "Weaknesses", items: ["Regulatory literacy burden for members", "Dependency on tier-1 banking APIs", "High user education overhead"], color: "bg-[#D4AF37]" },
            { label: "Opportunities", items: ["Fractional asset ownership in townships", "SME wholesale negotiation block", "Diaspora remittance corridors"], color: "bg-[#8CA082]" },
            { label: "Threats", items: ["Regulatory classification shifts", "Social engineering/identity theft", "Counterparty banking instability"], color: "bg-[#B36A5E]" }
          ].map((box, i) => (
            <div key={i} className="bg-white dark:bg-[#252826] p-12 rounded-[60px] border-2 border-[#F1F0EE] dark:border-[#3A3D3B] space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${box.color}`} />
                <h3 className="text-2xl font-black uppercase tracking-tighter italic text-[#2D302E] dark:text-[#FDFCFB]">{box.label}</h3>
              </div>
              <ul className="space-y-4">
                {box.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4 text-sm font-medium text-[#6B706C] dark:text-[#9EA39F]">
                    <span className="text-[#8CA082]">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeView === 'Legal' && (
        <div className="space-y-20 animate-in slide-in-from-bottom-8 max-w-4xl mx-auto">
          <section className="bg-white dark:bg-[#252826] rounded-[60px] border-2 border-[#8CA082] p-16 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic">Regulatory Perimeter</h2>
              <p className="text-sm font-medium text-[#6B706C] dark:text-[#9EA39F] leading-relaxed">
                Ubuntu Pools maintains a frozen regulatory posture. We define our perimeter to mitigate misclassification risk.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {SYSTEM_PERIMETER.legal_exclusion.map((ex, i) => (
                <div key={i} className="flex items-start gap-6 p-6 bg-[#F9F9F8] dark:bg-[#1A1C1B] rounded-[32px] border border-[#F1F0EE]">
                   <div className="w-10 h-10 bg-[#8CA082]/10 rounded-2xl flex items-center justify-center text-[#8CA082]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                   </div>
                   <div>
                     <p className="text-xs font-black uppercase text-[#2D302E] dark:text-[#FDFCFB]">{ex.split(':')[0]}</p>
                     <p className="text-sm font-medium text-[#6B706C] dark:text-[#9EA39F] italic">{ex.split(':')[1]}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="pt-12 border-t border-[#F1F0EE] space-y-8">
               <h3 className="text-2xl font-black uppercase tracking-tighter italic">Evidence Admissibility & Waiver</h3>
               <div className="p-8 bg-[#2D302E] text-white rounded-[40px] space-y-4 shadow-xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8CA082]">Primary Authoritative Record</p>
                  <p className="text-sm leading-relaxed font-medium">
                    Parties to the Ubuntu Accord explicitly waive reliance on informal communication (WhatsApp/Email) for dispute resolution. 
                    The <strong>hash-chained event log</strong> is the sole authoritative record, admissible as primary evidence under the ECTA (2002).
                  </p>
               </div>
            </div>
          </section>
        </div>
      )}

      <div className="text-center pt-20">
        <button onClick={() => navigate('/dashboard')} className="px-24 py-10 bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] rounded-[60px] font-black text-2xl uppercase tracking-widest shadow-2xl hover:bg-[#8CA082] transition-all">
          Exit Boardroom
        </button>
      </div>
    </div>
  );
};

export default Prospectus;
