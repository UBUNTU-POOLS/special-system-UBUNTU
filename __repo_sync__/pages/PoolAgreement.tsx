
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SOUTH_AFRICAN_STOKVEL_TEMPLATE, FAMILY_WEALTH_TEMPLATE, SME_BULK_BUYING_TEMPLATE } from '../constitutionTemplate';
import { saveSignedConstitution } from '../services/api';
import { PoolType, ConstitutionCustomization, ConstitutionClause } from '../types';
import UbuntuShieldToggle from '../components/UbuntuShieldToggle';
import ManagedAccountToggle from '../components/ManagedAccountToggle';
import { MOCK_POOLS } from '../constants';

const PoolAgreement: React.FC = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [legalName, setLegalName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const pool = MOCK_POOLS.find(p => p.id === poolId) || MOCK_POOLS[0];

  const getTemplate = () => {
    if (pool.type === PoolType.FAMILY_RESERVE) return FAMILY_WEALTH_TEMPLATE;
    if (pool.type === PoolType.SME_WHOLESALE) return SME_BULK_BUYING_TEMPLATE;
    return SOUTH_AFRICAN_STOKVEL_TEMPLATE;
  };

  const [customization, setCustomization] = useState<ConstitutionCustomization>({
    poolName: pool.name, 
    purpose: '', 
    poolType: pool.type, 
    contributionAmount: pool.contributionAmount.toString(), 
    contributionSchedule: 'Monthly',
    latePaymentPolicy: 'Grace period of 3 days.', 
    disputeResolution: 'Majority vote via AI Mediator.', 
    votingThreshold: '75% Consensus',
    governanceEvents: 'Cryptographically timestamped.', 
    outcomeExecution: 'Auto-executed.', 
    remittanceTerms: 'Institutional providers.',
    popiaConsent: false, 
    authorizedSignatories: '', 
    clauses: getTemplate().clauses.map(c => ({ ...c })),
    shieldEnabled: false, 
    managedEnabled: false
  });

  const handleSignAndActivate = async () => {
    setIsProcessing(true);
    await saveSignedConstitution({ 
      poolId: poolId || 'new-pool', 
      legalName: legalName.toUpperCase(), 
      constitutionText: JSON.stringify(customization) 
    });
    setIsProcessing(false);
    setStep(6);
  };

  const ProgressBar = () => (
    <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto px-4 relative">
      {['Intro', 'Protocol', 'Accord', 'Protection', 'Sign', 'Active'].map((label, i) => {
        const active = step >= i + 1;
        return (
          <div key={label} className="flex flex-col items-center gap-3 relative z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 border-2 ${
              step === i + 1 ? 'bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] border-[#2D302E] scale-110 shadow-xl' : 
              active ? 'bg-[#8CA082] text-white border-[#8CA082]' : 'bg-white dark:bg-[#252826] text-[#D6CFC7] border-[#F1F0EE] dark:border-[#3A3D3B]'
            }`}>
              {i + 1}
            </div>
            <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-[#2D302E] dark:text-[#FDFCFB] opacity-60">{label}</span>
          </div>
        );
      })}
      <div className="absolute top-5 left-0 w-full h-0.5 bg-[#F1F0EE] dark:bg-[#3A3D3B] -z-0">
        <div className="h-full bg-[#8CA082] transition-all duration-700" style={{ width: `${((step - 1) / 5) * 100}%` }} />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-40 px-4">
      <ProgressBar />
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h1 className="text-7xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-[0.85]">Ubuntu <br /> <span className="text-[#D4AF37]">Accord</span></h1>
            <p className="text-xl font-medium text-[#6B706C] dark:text-[#9EA39F]">You are about to bind this circle with the {getTemplate().name}. This is a legally enforceable multi-lateral contract under South African law.</p>
            <button onClick={() => setStep(2)} className="bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] px-16 py-8 rounded-[40px] font-black text-xl uppercase tracking-[0.2em] shadow-2xl">Initialize Accord</button>
          </div>
          <div className="relative group">
            <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200" className="rounded-[60px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000" alt="Community" />
            <div className="absolute inset-0 bg-[#8CA082]/10 rounded-[60px] pointer-events-none" />
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="animate-in slide-in-from-right-12 duration-700 max-w-4xl mx-auto space-y-12">
          <h2 className="text-4xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter italic">Non-Custodial Protocol</h2>
          <div className="bg-[#2D302E] p-12 rounded-[48px] text-white space-y-8">
            <div className="flex items-center gap-4 text-[#8CA082]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em]">Cryptographic hard gate</h4>
            </div>
            <p className="text-lg leading-relaxed font-medium">Ubuntu Pools facilitates the *agreement*, not the *holding*. Members acknowledge that the platform possesses no technical or legal authority to access, transfer, or delay funds without member-voted triggers.</p>
          </div>
          <button onClick={() => setStep(3)} className="w-full bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-8 rounded-[40px] font-black text-xl uppercase tracking-[0.2em] shadow-xl">Accept Governance Logic</button>
        </div>
      )}
      {step === 3 && (
        <div className="animate-in slide-in-from-right-12 duration-700 space-y-20 max-w-4xl mx-auto">
          <h2 className="text-5xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter text-center italic">Reviewing The Accord</h2>
          <div className="bg-white dark:bg-[#252826] p-12 rounded-[60px] border border-[#F1F0EE] dark:border-[#3A3D3B] space-y-12">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.5em]">Template: {getTemplate().name}</p>
              <h3 className="text-2xl font-black uppercase tracking-tighter">{customization.poolName}</h3>
            </div>
            <div className="space-y-10">
              {customization.clauses.map((clause, i) => (
                <div key={clause.id} className="space-y-4 group">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-black uppercase tracking-widest text-[#2D302E] dark:text-[#FDFCFB]">{clause.title}</h4>
                    <span className="text-[8px] font-black text-[#9EA39F] group-hover:text-[#8CA082] transition-colors">Clause {i+1}</span>
                  </div>
                  <p className="text-sm font-medium text-[#6B706C] dark:text-[#9EA39F] leading-relaxed italic border-l-2 border-[#F1F0EE] pl-6 py-2">{clause.content}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(4)} className="w-full bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-8 rounded-[40px] font-black uppercase tracking-widest shadow-xl">Confirm Accord</button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="animate-in slide-in-from-right-12 duration-700 max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter italic">Enhance Circle Protection</h2>
            <p className="text-sm font-medium text-[#9EA39F] uppercase tracking-widest">Select collective security services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <UbuntuShieldToggle 
              contributionAmount={parseFloat(customization.contributionAmount)}
              isEnabled={customization.shieldEnabled}
              onToggle={(enabled) => setCustomization({...customization, shieldEnabled: enabled})}
            />
            <ManagedAccountToggle 
              isEnabled={customization.managedEnabled}
              onToggle={(enabled) => setCustomization({...customization, managedEnabled: enabled})}
            />
          </div>
          <button onClick={() => setStep(5)} className="w-full bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-8 rounded-[40px] font-black text-xl uppercase tracking-widest shadow-xl">Finalize Selections</button>
        </div>
      )}
      {step === 5 && (
        <div className="animate-in slide-in-from-right-12 duration-700 max-w-4xl mx-auto space-y-12">
          <div className="bg-white dark:bg-[#252826] p-16 rounded-[60px] border-2 border-[#D4AF37] shadow-2xl space-y-12 text-center">
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter italic">Execute Signatory</h2>
              <p className="text-[10px] font-black text-[#9EA39F] uppercase tracking-widest">I agree to be bound by the {getTemplate().name}</p>
            </div>
            <div className="space-y-8">
              <input type="text" value={legalName} onChange={e => setLegalName(e.target.value)} placeholder="ENTER FULL LEGAL NAME" className="w-full bg-transparent border-b-4 border-[#F1F0EE] py-6 text-3xl font-black uppercase text-center outline-none focus:border-[#D4AF37] transition-all text-[#2D302E] dark:text-[#FDFCFB]"/>
              <div className="flex items-start gap-4 text-left p-6 bg-[#F9F9F8] dark:bg-[#1A1C1B] rounded-3xl border border-[#F1F0EE]">
                <input type="checkbox" className="mt-1 w-5 h-5 accent-[#8CA082]" checked={customization.popiaConsent} onChange={e => setCustomization({...customization, popiaConsent: e.target.checked})} />
                <label className="text-xs font-medium text-[#6B706C] dark:text-[#9EA39F] leading-relaxed italic">I acknowledge that my personal information will be processed in accordance with the POPIA Policy to maintain the integrity of the Ubuntu Score.</label>
              </div>
            </div>
            <button 
              onClick={handleSignAndActivate} 
              disabled={!legalName.trim() || !customization.popiaConsent || isProcessing} 
              className="w-full bg-[#D4AF37] text-white py-12 rounded-[40px] font-black text-2xl uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(212,175,55,0.4)] hover:bg-[#8CA082] transition-all disabled:opacity-20 disabled:grayscale"
            >
              {isProcessing ? 'Binding Accord...' : 'Sign & Activate Circle'}
            </button>
          </div>
        </div>
      )}
      {step === 6 && (
        <div className="animate-in zoom-in duration-1000 text-center space-y-20 py-20">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#8CA082] blur-[100px] opacity-30 animate-pulse" />
            <div className="w-56 h-56 bg-[#8CA082] text-white rounded-[64px] flex items-center justify-center mx-auto shadow-2xl relative z-10 rotate-6">
              <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-8xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tighter italic leading-none">Circle Active</h2>
            <p className="text-xl text-[#6B706C] dark:text-[#9EA39F] font-medium italic max-w-lg mx-auto leading-relaxed">Your digital accord has been hashed and added to the immutable event log. The trust of the collective is now yours to steward.</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="px-32 py-10 bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] rounded-[60px] font-black text-2xl uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform">Enter Vault</button>
        </div>
      )}
    </div>
  );
};

export default PoolAgreement;
