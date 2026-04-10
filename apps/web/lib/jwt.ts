function decodeSegment(segment: string) {
  const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof atob !== "function") {
    throw new Error("Base64 decoding is unavailable in this runtime.");
  }

  return atob(padded);
}

export function decodeJwtPayload<T>(token?: string | null): T | null {
  if (!token) {
    return null;
  }

  const segments = token.split(".");
  if (segments.length < 2) {
    return null;
  }

  try {
    return JSON.parse(decodeSegment(segments[1])) as T;
  } catch {
    return null;
  }
}

export function isJwtExpired(token?: string | null, skewSeconds = 30) {
  const payload = decodeJwtPayload<{ exp?: number }>(token);
  if (!payload?.exp) {
    return true;
  }

  return payload.exp <= Math.floor(Date.now() / 1000) + skewSeconds;
}
