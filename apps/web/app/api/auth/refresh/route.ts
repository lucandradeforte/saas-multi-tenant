import { NextRequest, NextResponse } from "next/server";
import { applyAuthCookies, REFRESH_TOKEN_COOKIE } from "@/lib/auth-cookies";
import { fetchBackend } from "@/lib/api";
import { AuthResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  const cookieRefreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const body = await request.json().catch(() => ({}));
  const refreshToken = body.refreshToken ?? cookieRefreshToken;

  if (!refreshToken) {
    return NextResponse.json({ error: "Refresh token not found." }, { status: 401 });
  }

  try {
    const payload = await fetchBackend<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken })
    });

    const response = NextResponse.json({ user: payload.user });
    applyAuthCookies(response, payload.tokens);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Refresh failed." },
      { status: 401 }
    );
  }
}
