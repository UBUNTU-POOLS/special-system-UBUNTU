
import { canonicalJson } from "./canonicalJson";

/**
 * Computes a SHA-256 hash using the Web Crypto API.
 * This function strictly enforces a secure context (HTTPS/localhost).
 */
export async function sha256Hex(input: string): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error("CRYPTO_ERROR: Window context required for cryptographic operations.");
  }

  if (!window.isSecureContext) {
    throw new Error(
      "SECURITY_EXCEPTION: Cryptographic operations are restricted to secure contexts (HTTPS). " +
      "Production-grade auditing cannot proceed in an insecure environment."
    );
  }

  if (!crypto.subtle) {
    throw new Error("CRYPTO_UNAVAILABLE: The Web Crypto API is not supported or available in this browser environment.");
  }

  try {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("Cryptographic computation failed:", error);
    throw new Error("INTERNAL_CRYPTO_FAILURE: Failed to compute immutable event hash.");
  }
}

/**
 * Computes the chained hash for an event envelope.
 * Formula: SHA256(prev_hash | canonical_json(envelope))
 */
export async function computeChainedHash(prevHash: string | null, envelope: unknown): Promise<string> {
  const prev = prevHash ?? "";
  const payload = canonicalJson(envelope);
  return sha256Hex(prev + "|" + payload);
}

/**
 * Computes the authoritative hash for a governance artifact.
 */
export async function computeArtifactHash(artifact: unknown): Promise<string> {
  const canonical = canonicalJson(artifact);
  return sha256Hex(canonical);
}
