import { NextRequest, NextResponse } from "next/server";
import { applyAuthCookies } from "@/lib/auth-cookies";
import { fetchBackend } from "@/lib/api";
import { AuthResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = await fetchBackend<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body)
    });

    const response = NextResponse.json({ user: payload.user, company: payload.company });
    applyAuthCookies(response, payload.tokens);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed." },
      { status: 400 }
    );
  }
}
