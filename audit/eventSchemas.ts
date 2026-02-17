
export type EventType =
  | "POOL_CREATED"
  | "CONSTITUTION_SIGNED"
  | "CONTRIBUTION_INTENT_RECORDED"
  | "WITHDRAWAL_INTENT_RECORDED"
  | "PROPOSAL_CREATED"
  | "VOTE_CAST"
  | "APPROVAL_GRANTED"
  | "ADMIN_ACTION"
  | "AUTH_ATTEMPT"
  | "AUTH_VERIFIED"
  | "AUTH_CHALLENGE_ISSUED"
  | "STEP_UP_VERIFIED"
  | "MFA_ENROLLED";

export interface EventEnvelope {
  event_id: string;
  occurred_at_utc: string;
  actor_user_id: string;
  pool_id: string;
  event_type: EventType;
  schema_version: number;
  payload: Record<string, unknown>;
  prev_hash: string | null;
  event_hash: string;
}

export interface AuditEnvelope {
  audit_id: string;
  occurred_at_utc: string;
  actor_user_id: string;
  action: string;
  target_type?: string | null;
  target_id?: string | null;
  metadata?: Record<string, unknown> | null;
  prev_hash: string | null;
  audit_hash: string;
}
