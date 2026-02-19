
# Risk Management and Compliance Program (RMCP)

## Operating Model
- **Phase 1**: Model A (Non-Custodial)
- **Status**: Sandbox / No real funds movement via platform

## Risk Assessment
- **Financial Crime Risk**: LOW (No value movement supported in Phase 1)
- **Data Privacy Risk**: MEDIUM (PII collected for FICA)
- **Operational Risk**: MEDIUM (Platform availability)

## Key Technical Controls
1. **Non-Custodial Hard Gate**: Regex and keyword scanners on all API transactions to prevent custodial activity drift.
2. **Hash-Chained Audit Trail**: All events are SHA-256 chained to ensure data integrity.
3. **Immutable Ledger**: Double-entry simulation ledger with SQL triggers preventing record updates.

## Compliance Officer
- Name: [TBD]
- Contact: [TBD]

## Review Frequency
- Quarterly risk assessment.
- Annual RMCP review.
