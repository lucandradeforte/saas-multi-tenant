import { cookies } from "next/headers";
import { apiBaseUrl } from "./env";
import { ACCESS_TOKEN_COOKIE } from "./auth-cookies";
import { decodeJwtPayload } from "./jwt";
import { SessionUser } from "./types";

export async function getAccessTokenFromCookies() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export async function getSessionFromCookies(): Promise<SessionUser | null> {
  const accessToken = await getAccessTokenFromCookies();
  return decodeJwtPayload<SessionUser>(accessToken);
}

export async function fetchBackend<T>(
  path: string,
  init: RequestInit = {},
  accessToken?: string | null
): Promise<T> {
  const headers = new Headers(init.headers);

  if (!headers.has("content-type") && init.body) {
    headers.set("content-type", "application/json");
  }

  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload.message ?? payload.error ?? "Request failed.";

    throw new Error(message);
  }

  return payload as T;
}
