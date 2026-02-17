
import { supabase } from "../services/supabase";
import { computeChainedHash } from "./hashChain";
import type { AuditEnvelope } from "./eventSchemas";
import { safeRandomUUID } from "../services/uuid";

export async function appendAudit(params: {
  actor_user_id: string;
  action: string;
  target_type?: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
}): Promise<AuditEnvelope> {
  const occurred_at_utc = new Date().toISOString();

  const { data: last, error: lastErr } = await supabase
    .from("audit_log")
    .select("audit_hash")
    .order("occurred_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastErr) throw new Error(`AUDIT_LOG_READ_FAILED: ${lastErr.message}`);

  const base = {
    audit_id: safeRandomUUID(),
    occurred_at_utc,
    actor_user_id: params.actor_user_id,
    action: params.action,
    target_type: params.target_type ?? null,
    target_id: params.target_id ?? null,
    metadata: params.metadata ?? null,
    prev_hash: last?.audit_hash ?? null,
    audit_hash: "",
  };

  base.audit_hash = await computeChainedHash(base.prev_hash, base);

  const { error: insertErr } = await supabase.from("audit_log").insert({
    audit_id: base.audit_id,
    occurred_at: base.occurred_at_utc,
    actor_user_id: base.actor_user_id,
    action: base.action,
    target_type: base.target_type,
    target_id: base.target_id,
    metadata: base.metadata,
    prev_hash: base.prev_hash,
    audit_hash: base.audit_hash,
  });

  if (insertErr) throw new Error(`AUDIT_LOG_INSERT_FAILED: ${insertErr.message}`);

  return base as AuditEnvelope;
}
