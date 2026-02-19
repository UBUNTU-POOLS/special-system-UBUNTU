
/**
 * Operating Model: Institutional Hardening
 * Model B: Settlement Layer (Facilitated value movement via banking partners)
 */
export const OPERATING_MODEL = "MODEL_B_SETTLEMENT_LAYER" as const;

/**
 * System Perimeter & Regulatory Posture (Canonical Version)
 * This defines the legal boundaries of the platform to mitigate misclassification risk.
 * Any update to this object must be versioned and hashed.
 */
export const SYSTEM_PERIMETER = {
  version: "2025.1.0-LEGALLY-FROZEN",
  classification: "Non-Custodial Community Governance Facilitator",
  statutory_alignment: "South African Stokvel Act (1990), ECTA (2002)",
  legal_exclusion: [
    "NOT_A_BANK: No deposit-taking or credit-extension from own balance sheet.",
    "NOT_A_CIS: No collective investment scheme; beneficial ownership is individual.",
    "NOT_A_FINANCIAL_INTERMEDIARY: Platform does not act as an agent of funds.",
    "NOT_A_CUSTODIAN: Zero beneficial ownership of member assets."
  ],
  governance_supremacy: "CODE_AS_RULEBOOK: Operational logic is strictly governed by the hash-chained event store.",
  primary_evidence_standard: "ECTA_COMPLIANT: Event log is the authoritative record for all disputes. Informal comms (WhatsApp) are waived as secondary.",
  mitigation_logic: {
    custody_risk: "Multi-party computation and non-custodial API rails.",
    liquidity_risk: "Facilitated through tier-1 banking settlement only.",
    fraud_risk: "Trust DNA scoring + Biometric liveness + Immutable Audit Trail."
  }
} as const;

export const RESTRICTED_ACTIONS = [
  "SETTLEMENT_INITIATED",
  "PAYOUT_TRIGGERED",
  "WITHDRAWAL_FINALIZED",
] as const;

export const PROHIBITED_ACTIONS = [
  "DIRECT_CUSTODY_HOLD",
  "UNAUTHORIZED_FX_SWAP",
  "BYPASS_AML_CHECK",
] as const;
