// Fixed: Removed missing export ALLOW_VALUE_MOVEMENT from operatingModel import
import { PROHIBITED_ACTIONS, OPERATING_MODEL } from "./operatingModel";

/**
 * Production-grade compliance guard.
 * Ensures all actions align with the non-custodial operating model.
 */
export function assertNonCustodial(action: string, context?: Record<string, unknown>) {
  const normalized = action.toUpperCase().trim();

  // In Model B, certain settlement actions are permitted if facilitated by banking partners
  const isModelB = OPERATING_MODEL === "MODEL_B_SETTLEMENT_LAYER";
  const permittedModelBActions = ["SETTLEMENT_INITIATED", "PAYOUT_TRIGGERED"];

  if (isModelB && permittedModelBActions.includes(normalized)) {
    // Further validation could occur here (e.g. multi-sig check)
    return;
  }

  // Check against prohibited explicit actions
  if ((PROHIBITED_ACTIONS as readonly string[]).includes(normalized)) {
    throw new Error(`SECURITY_VIOLATION: "${normalized}" prohibited in current operating model. Context=${safeJson(context)}`);
  }

  // Keyword tripwires
  const forbiddenKeywords = [
    "DIRECT_CUSTODY", "BYPASS_KYC", "UNLINKED_TRANSFER"
  ];

  for (const k of forbiddenKeywords) {
    if (normalized.includes(k)) {
      throw new Error(`COMPLIANCE_ALARM: keyword "${k}" detected in action "${normalized}". Context=${safeJson(context)}`);
    }
  }
}

function safeJson(v: unknown) {
  try { return JSON.stringify(v ?? {}); } catch { return "{}"; }
}