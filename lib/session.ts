/** Session token helpers. Edge-safe (used by middleware and by the server). */
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "dps_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionClaims = { uid: number; sv: number };

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be set (at least 32 characters).");
    }
    return new TextEncoder().encode("dev-only-secret-change-me-dev-only-secret");
  }
  return new TextEncoder().encode(s);
}

export async function signSession(claims: SessionClaims): Promise<string> {
  return new SignJWT({ uid: claims.uid, sv: claims.sv })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setAudience("dps-admin")
    .sign(secret());
}

export async function verifySession(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { audience: "dps-admin", algorithms: ["HS256"] });
    const uid = Number(payload.uid);
    const sv = Number(payload.sv);
    if (!Number.isInteger(uid) || !Number.isInteger(sv)) return null;
    return { uid, sv };
  } catch {
    return null;
  }
}
