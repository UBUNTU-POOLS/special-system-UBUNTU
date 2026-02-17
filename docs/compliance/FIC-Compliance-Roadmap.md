
# FIC Compliance Roadmap (South Africa)

## Status: Planning Phase (May/June Production)

Ubuntu Pools operates in a high-trust community environment. Even in **Model A (Non-Custodial)**, compliance with the Financial Intelligence Centre Act (FICA) is essential for future transition to Model B.

## 1. Registration as an Accountable Institution
Upon moving to production in June, the legal entity must register on the **FIC goAML portal**.
- **Category**: Likely "Reporting Institution" or "Accountable Institution" depending on the final custodial structure.
- **Requirement**: Appointment of a Compliance Officer.

## 2. Know Your Customer (KYC / FICA)
Every member must be verified before being allowed to "Record Intent".
- **ID Verification**: Automated DHA (Department of Home Affairs) lookup via Smile ID.
- **Biometric Liveness**: Facial recognition match against ID photo.
- **Sanctions Screening**: Daily screening against UN and OFAC lists.

## 3. Reporting Obligations
- **STR (Suspicious Transaction Reports)**: If intent patterns suggest structuring or money laundering.
- **TPR (Terrorist Property Reports)**: Mandatory if any kinsman matches high-risk sanction lists.
- **IFTR (International Funds Transfer Reports)**: Critical for the Diaspora Remittance corridor when real value moves in Phase 2.

## 4. Record Keeping
- All signed `pool_constitutions` and `member_signatures` must be stored for **7 years** post-circle termination.
- Our **Hash-Chained Event Store** serves as the primary technical evidence for record integrity.

## 5. Risk Management and Compliance Program (RMCP)
The draft in `docs/compliance/RMCP.md` must be finalized and signed off by the board before June 1st launch.
