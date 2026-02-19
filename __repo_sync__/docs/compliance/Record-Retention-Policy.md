
# Record Retention Policy

## Compliance Standard
In accordance with the South African Financial Intelligence Centre Act (FICA), Ubuntu Pools maintains a strict record retention schedule.

## Data Categories & Duration

| Data Type | Retention Period | Storage Location |
|-----------|------------------|------------------|
| KYC Documents | 7 Years post-account closure | Encrypted Vault |
| Event Logs (Chained) | Indefinite (Immutable) | Append-Only Event Store |
| Ledger Entries | 7 Years | Double-Entry SQL Store |
| Admin Audit Trails | 7 Years | Immutable Audit Log |

## Disposal Protocol
Upon expiry of the retention period, non-immutable PII data is securely purged using cryptographic erasure. Chained event hashes remain to preserve the integrity of the audit chain, but associated metadata is redacted.
