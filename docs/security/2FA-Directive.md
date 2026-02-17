
# BOARD DIRECTIVE: MANDATORY TWO-FACTOR AUTHENTICATION (2FA)

**Directive ID:** UP-SEC-002  
**Authority:** Board of Directors – Ubuntu Pools  
**Effective Date:** Immediate  

## 1. Mandate
Ubuntu Pools shall implement mandatory multi-factor authentication (MFA) as a core security and governance control. No account with operational, governance, or technical privileges may authenticate using single-factor credentials.

## 2. Privileged Role Enforcement
The following roles must use Passkeys (FIDO2) or Authenticator-based TOTP at all times:
- Compliance Officer
- Technical Custodian
- Governance Secretary
- System Administrators / Developers

## 3. Restricted Action "Step-Up"
Login-level 2FA is insufficient for high-risk actions. A secondary "Step-Up" challenge is required for:
- Modification of governance rules or constitutional hashes.
- Execution of withdrawals or payout triggers.
- Disabling or altering authentication controls.

## 4. Evidentiary Requirement
> "Any action performed without a corresponding authentication log entry is presumed unauthorised."

All auth events (success, failure, challenges) are recorded in the hash-chained `event_log`.
