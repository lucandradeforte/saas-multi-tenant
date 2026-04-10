import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth-cookies";
import { fetchBackend, getAccessTokenFromCookies } from "@/lib/api";

export async function POST() {
  const accessToken = await getAccessTokenFromCookies();

  if (accessToken) {
    await fetchBackend<{ success: boolean }>("/auth/logout", { method: "POST" }, accessToken).catch(
      () => null
    );
  }

  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}
