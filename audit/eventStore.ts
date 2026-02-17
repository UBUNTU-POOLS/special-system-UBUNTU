
import { supabase } from "../services/supabase";
import { computeChainedHash } from "./hashChain";
import type { EventEnvelope, EventType } from "./eventSchemas";
import { safeRandomUUID } from "../services/uuid";

export async function appendEvent(params: {
  actor_user_id: string;
  pool_id: string;
  event_type: EventType;
  payload: Record<string, unknown>;
  schema_version?: number;
}): Promise<EventEnvelope> {
  const occurred_at_utc = new Date().toISOString();
  const schema_version = params.schema_version ?? 1;

  // 1. Get previous hash for this pool context
  const { data: last, error: lastErr } = await supabase
    .from("event_log")
    .select("event_hash")
    .eq("pool_id", params.pool_id)
    .order("occurred_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastErr) throw new Error(`EVENT_LOG_READ_FAILED: ${lastErr.message}`);

  const base = {
    event_id: safeRandomUUID(),
    occurred_at_utc,
    actor_user_id: params.actor_user_id,
    pool_id: params.pool_id,
    event_type: params.event_type,
    schema_version,
    payload: params.payload,
    prev_hash: last?.event_hash ?? null,
    event_hash: "",
  };

  // 2. Compute chained hash
  base.event_hash = await computeChainedHash(base.prev_hash, base);

  // 3. Persist
  const { error: insertErr } = await supabase.from("event_log").insert({
    event_id: base.event_id,
    occurred_at: base.occurred_at_utc,
    actor_user_id: base.actor_user_id,
    pool_id: base.pool_id,
    event_type: base.event_type,
    schema_version: base.schema_version,
    payload: base.payload,
    prev_hash: base.prev_hash,
    event_hash: base.event_hash,
  });

  if (insertErr) throw new Error(`EVENT_LOG_INSERT_FAILED: ${insertErr.message}`);

  return base as EventEnvelope;
}
