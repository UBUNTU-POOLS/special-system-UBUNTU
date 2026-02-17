
import React from 'react';
import { OPERATING_MODEL } from '../compliance/operatingModel';

export default function ComplianceBanner() {
  const isModelB = OPERATING_MODEL === "MODEL_B_SETTLEMENT_LAYER";

  return (
    <div className={`border-b py-2.5 px-6 flex justify-between items-center z-[100] relative transition-colors duration-500 ${isModelB ? 'bg-[#5C7A67] border-[#7C9082]' : 'bg-[#111] border-[#222]'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full animate-pulse ${isModelB ? 'bg-white' : 'bg-[#D4AF37]'}`} />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
          <span className="opacity-70">{isModelB ? 'Live Protocol —' : 'Sandbox Mode —'}</span> {isModelB ? 'Model B (Settlement Layer)' : 'Model A (Non-Custodial)'}
        </p>
      </div>
      <p className="text-[9px] font-medium text-white/60 uppercase tracking-widest hidden md:block">
        {isModelB 
          ? 'Cryptographically verified clearing via PayShap & PayJustNow rails.' 
          : 'Records governance & intent only. No payment processing exists in this build.'}
      </p>
    </div>
  );
}
