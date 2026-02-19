
import { supabase } from "../services/supabase";
import { computeChainedHash, computeArtifactHash } from "../audit/hashChain";
import { SYSTEM_PERIMETER } from "../compliance/operatingModel";
import { FAMILY_WEALTH_TEMPLATE, SME_BULK_BUYING_TEMPLATE, SOUTH_AFRICAN_STOKVEL_TEMPLATE } from "../constitutionTemplate";

export async function exportAuditPack(pool_id: string, includeVerification: boolean = true) {
  const [events, audits, ledger] = await Promise.all([
    supabase.from("event_log").select("*").eq("pool_id", pool_id).order("occurred_at", { ascending: true }),
    supabase.from("audit_log").select("*").order("occurred_at", { ascending: true }),
    supabase.from("ledger_entries").select("*").eq("pool_id", pool_id).order("occurred_at", { ascending: true }),
  ]);

  const eventData = events.data ?? [];
  let verificationStatus = "NOT_PERFORMED";
  let chainError = null;

  // Compute Canonical Artifact Hashes for this export
  const artifactHashes = {
    gwa: await computeArtifactHash(FAMILY_WEALTH_TEMPLATE),
    bra: await computeArtifactHash(SME_BULK_BUYING_TEMPLATE),
    stokvel: await computeArtifactHash(SOUTH_AFRICAN_STOKVEL_TEMPLATE),
    system_perimeter: await computeArtifactHash(SYSTEM_PERIMETER)
  };

  if (includeVerification && eventData.length > 0) {
    try {
      verificationStatus = "VALIDATED";
      let runningHash: string | null = null;
      
      for (const event of eventData) {
        // Re-construct the envelope for hashing
        const envelopeForHash = {
          event_id: event.event_id,
          occurred_at_utc: event.occurred_at,
          actor_user_id: event.actor_user_id,
          pool_id: event.pool_id,
          event_type: event.event_type,
          schema_version: event.schema_version,
          payload: event.payload,
          prev_hash: event.prev_hash,
          event_hash: "", // Reset hash for calculation
        };

        const computed = await computeChainedHash(runningHash, envelopeForHash);
        
        if (computed !== event.event_hash) {
          verificationStatus = "INTEGRITY_VIOLATION_DETECTED";
          chainError = `Hash mismatch at Event ${event.event_id}. Expected ${event.event_hash}, Computed ${computed}`;
          break;
        }
        runningHash = computed;
      }
    } catch (e: any) {
      verificationStatus = "VERIFICATION_FAILED";
      chainError = e.message;
    }
  }

  const pack = {
    export_metadata: {
      timestamp: new Date().toISOString(),
      pool_id,
      operating_model: "MODEL_B_SETTLEMENT_TRANSITION",
      compliance_engine_v: "3.0.0-LEGAL-GRADE",
      system_perimeter: SYSTEM_PERIMETER
    },
    canonical_artifacts: {
      hashes: artifactHashes,
      legal_mapping_standard: "ECTA-RECORDS-SUPREMACY"
    },
    verification_report: {
      status: verificationStatus,
      chain_error: chainError,
      events_count: eventData.length,
    },
    data_sets: {
      event_log: eventData,
      audit_log: audits.data ?? [],
      ledger_entries: ledger.data ?? [],
    }
  };

  return pack;
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
