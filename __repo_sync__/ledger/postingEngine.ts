
import { supabase } from "../services/supabase";
import { ACCOUNT_CHART } from "./accountChart";
import { safeRandomUUID } from "../services/uuid";

export async function postJournalFromEvent(
  event_id: string,
  actor_user_id: string,
  context: { type: string; pool_id: string; member_email?: string; amount: number; currency: string }
) {
  const journal_id = safeRandomUUID();
  const occurred_at = new Date().toISOString();
  
  let entries: Array<{ account: string; debit: number; credit: number }> = [];

  if (context.type === "CONTRIBUTION_INTENT_RECORDED") {
    entries = [
      { account: ACCOUNT_CHART.POOL_BALANCE, debit: context.amount, credit: 0 },
      { account: ACCOUNT_CHART.MEMBER_CONTRIBUTION, debit: 0, credit: context.amount },
    ];
  } else if (context.type === "WITHDRAWAL_INTENT_RECORDED") {
    entries = [
      { account: ACCOUNT_CHART.MEMBER_WITHDRAWAL, debit: context.amount, credit: 0 },
      { account: ACCOUNT_CHART.POOL_BALANCE, debit: 0, credit: context.amount },
    ];
  }

  for (const e of entries) {
    await supabase.from("ledger_entries").insert({
      entry_id: safeRandomUUID(),
      journal_id,
      event_id,
      occurred_at,
      pool_id: context.pool_id,
      account_code: e.account,
      debit_amount: e.debit,
      credit_amount: e.credit,
      currency: context.currency,
      metadata: { member_email: context.member_email },
    });
  }
}
