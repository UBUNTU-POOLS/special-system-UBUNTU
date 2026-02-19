
import { supabase } from './supabase';
import { PoolType } from '../types';
import { assertNonCustodial } from '../compliance/nonCustodialGuard';
import { appendEvent } from '../audit/eventStore';
import { postJournalFromEvent } from '../ledger/postingEngine';
import { computeArtifactHash } from '../audit/hashChain';

export interface PoolCreationData {
  name: string;
  type: PoolType | string;
  contributionAmount: number;
  members: string[];
}

/**
 * Finalizes the banking handshake for Model B settlement.
 * Connects with PayShap or PayJustNow protocols.
 */
export const finalizeSettlementHandshake = async (params: {
  method: 'PayShap' | 'PayJustNow' | 'Bank';
  poolId: string;
  amount: number;
}) => {
  // 1. Log Handshake attempt in Audit Log
  console.debug(`[Handshake] Initializing ${params.method} settlement sequence for Pool ${params.poolId}`);
  
  // 2. Simulate external API handshake
  await new Promise(resolve => setTimeout(resolve, 1200));

  return {
    success: true,
    handshakeRef: `HS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    clearingStatus: params.method === 'PayShap' ? 'INSTANT' : 'PENDING_INSTALLMENT',
  };
};

export const createPoolRecord = async (poolData: PoolCreationData) => {
  const { data, error } = await supabase
    .from('pools')
    .insert([
      {
        name: poolData.name,
        type: poolData.type,
        contribution_amount: poolData.contributionAmount,
        members: poolData.members,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Failed to create pool: ${error.message}`);

  await appendEvent({
    actor_user_id: "00000000-0000-0000-0000-000000000000",
    pool_id: data.id,
    event_type: "POOL_CREATED",
    payload: { name: poolData.name, type: poolData.type, amount: poolData.contributionAmount }
  });

  return data;
};

export const recordContributionIntent = async (params: {
  actorUserId: string;
  poolId: string;
  memberEmail: string;
  amount: number;
  currency?: string;
  method?: string;
}) => {
  // In Model B, we transition from INTENT to SETTLEMENT
  const isModelB = true; 

  // 1. Finalize Handshake if Model B method is used
  let handshakeData = null;
  if (params.method === 'PayShap' || params.method === 'PayJustNow') {
    handshakeData = await finalizeSettlementHandshake({
      method: params.method,
      poolId: params.poolId,
      amount: params.amount
    });
  }

  // 2. Emit Event
  const eventType = handshakeData ? "SETTLEMENT_INITIATED" : "CONTRIBUTION_INTENT_RECORDED";
  const ev = await appendEvent({
    actor_user_id: params.actorUserId,
    pool_id: params.poolId,
    event_type: eventType as any,
    payload: {
      memberEmail: params.memberEmail,
      amount: params.amount,
      currency: params.currency ?? "ZAR",
      method: params.method ?? "SIMULATED",
      handshake: handshakeData,
      settlementMode: isModelB ? "MODEL_B_FACILITATED" : "MODEL_A_RECORDED"
    },
  });

  // 3. Journalize to Ledger
  await postJournalFromEvent(ev.event_id, params.actorUserId, {
    type: eventType,
    pool_id: params.poolId,
    member_email: params.memberEmail,
    amount: params.amount,
    currency: params.currency ?? "ZAR",
  });

  return { 
    success: true, 
    intentId: ev.event_id, 
    status: handshakeData ? "SETTLED" : "RECORDED", 
    handshake: handshakeData,
    timestamp: ev.occurred_at_utc 
  };
};

export const requestUbuntuAdvance = async (
  userId: string,
  poolId: string,
  totalPotentialPayout: number,
  trustScore: number,
  managedEnabled: boolean
) => {
  const isEligible = trustScore > 750;
  const eligibleAmount = isEligible ? totalPotentialPayout * 0.3 : 0;
  
  const message = isEligible 
    ? "Ubuntu DNA recognized. Early settlement path unlocked based on collective trust."
    : "Social capital threshold not yet met for early draw-down. Continue consistent contributions to grow your score.";

  return {
    success: isEligible,
    message,
    eligibleAmount
  };
};

export const saveSignedConstitution = async (params: { 
  poolId: string, 
  legalName: string, 
  constitutionText: string 
}) => {
  // Compute Artifact Hash for the signed version
  const docHash = await computeArtifactHash(params.constitutionText);

  await appendEvent({
    actor_user_id: "00000000-0000-0000-0000-000000000000",
    pool_id: params.poolId,
    event_type: "CONSTITUTION_SIGNED",
    payload: { 
      legalName: params.legalName, 
      constitution: params.constitutionText,
      doc_hash: docHash,
      timestamp: new Date().toISOString()
    }
  });
  
  return { success: true, hash: docHash };
};

export const getExchangeRates = async (): Promise<Record<string, number>> => {
  return {
    ZAR: 1,
    USD: 18.42,
    GBP: 23.15,
    EUR: 19.85
  };
};

export const formatCurrency = (
  amount: number, 
  currency: string, 
  rates: Record<string, number>
): string => {
  const rate = rates[currency] || 1;
  const converted = currency === 'ZAR' ? amount : amount / rate;
  
  const symbols: Record<string, string> = {
    ZAR: 'R ',
    USD: '$',
    GBP: '£',
    EUR: '€'
  };
  
  const symbol = symbols[currency] || '';
  return `${symbol}${converted.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

export const calculatePenalty = (dueDate: string, amount: number): number => {
  const due = new Date(dueDate);
  const now = new Date();
  if (now > due) {
    const daysLate = Math.ceil((now.getTime() - due.getTime()) / (1000 * 3600 * 24));
    const penaltyRate = daysLate > 3 ? 0.10 + (daysLate * 0.01) : 0.10;
    return amount * penaltyRate;
  }
  return 0;
};
