
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_POOLS } from '../constants';
import { calculatePenalty, recordContributionIntent } from '../services/api';
import { assertNonCustodial } from '../compliance/nonCustodialGuard';

type PaymentMethod = 'Bank' | 'PayShap' | 'PayJustNow' | 'Cash';

const Contribute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pool = MOCK_POOLS.find(p => p.id === id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [penalty, setPenalty] = useState(0);
  const [txnResult, setTxnResult] = useState<any>(null);

  useEffect(() => {
    if (pool) {
      setPenalty(calculatePenalty(pool.nextDueDate, pool.contributionAmount));
    }
  }, [pool]);

  if (!pool) return <div className="p-24 text-center text-[#2D302E] font-black uppercase tracking-widest">Circle not found</div>;

  const totalDue = pool.contributionAmount + penalty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hard gate check
    assertNonCustodial("CONTRIBUTION_INTENT_RECORDED", { poolId: pool.id, amount: totalDue });

    const result = await recordContributionIntent({
      actorUserId: "00000000-0000-0000-0000-000000000000",
      poolId: pool.id,
      memberEmail: "sandbox@user.local",
      amount: totalDue,
      currency: "ZAR",
      method: paymentMethod
    });

    setTxnResult(result);
    setIsSubmitted(true);
    setTimeout(() => navigate('/dashboard'), 5000);
  };

  if (isSubmitted && txnResult) {
    return (
      <div className="max-w-xl mx-auto py-32 text-center animate-in zoom-in duration-1000">
        <div className="w-32 h-32 text-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-3 bg-[#8CA082]">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-4xl font-black text-[#2D302E] dark:text-[#FDFCFB] mb-4 uppercase tracking-tighter">Intent Recorded</h2>
        <div className="space-y-6">
          <p className="text-[#6B706C] dark:text-[#9EA39F] font-medium leading-relaxed max-w-sm mx-auto italic">
            Your contribution intent has been logged in the tamper-evident event store. No funds were handled by the platform.
          </p>
          <div className="bg-[#F9F9F8] dark:bg-[#252826] p-8 rounded-[40px] border border-[#F1F0EE] text-left space-y-4">
            <div className="flex justify-between items-center text-xs font-bold">
               <span className="text-[#9EA39F]">Event Reference</span>
               <span className="text-[#2D302E] dark:text-[#FDFCFB] tabular-nums text-[10px]">{txnResult.intentId}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold">
               <span className="text-[#9EA39F]">Compliance Status</span>
               <span className="uppercase tracking-widest text-[#8CA082]">Model A - Recorded</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-24 animate-in fade-in duration-1000 pb-40">
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="text-[11px] font-black uppercase tracking-[0.4em] text-[#9EA39F] hover:text-[#2D302E] transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" strokeWidth={2}/></svg> Back
        </button>
        <h1 className="text-7xl font-black text-[#2D302E] dark:text-[#FDFCFB] tracking-tighter uppercase leading-[0.85]">
          Log <br /> <span className="text-[#D6CFC7]">Intent</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-white dark:bg-[#252826] p-12 rounded-[48px] border-2 border-[#F1F0EE] space-y-10">
              <h2 className="text-3xl font-black text-[#2D302E] dark:text-[#FDFCFB] uppercase tracking-tight">{pool.name}</h2>
              <div className="space-y-6 pt-10 border-t border-[#F1F0EE]">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-black uppercase tracking-tighter">Total Intent</span>
                  <span className="text-4xl font-black text-[#8CA082] tracking-tighter italic">R {totalDue.toLocaleString()}</span>
                </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-7 space-y-12">
          <section className="space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] border-b border-[#F1F0EE] pb-4">Simulated Method</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Bank', 'PayShap', 'PayJustNow', 'Cash'].map((m) => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m as any)}
                  className={`p-6 rounded-[32px] border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                    paymentMethod === m ? 'bg-[#2D302E] text-white' : 'border-[#F1F0EE] text-[#9EA39F]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </section>
          <button onClick={handleSubmit} className="w-full bg-[#2D302E] dark:bg-[#FDFCFB] text-white dark:text-[#2D302E] py-8 rounded-[40px] font-black text-xl uppercase tracking-widest shadow-2xl">
            Confirm Contribution Intent
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
