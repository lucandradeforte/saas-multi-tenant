import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  applyAuthCookies,
  clearAuthCookies
} from "./lib/auth-cookies";
import { apiBaseUrl } from "./lib/env";
import { isJwtExpired } from "./lib/jwt";
import { AuthResponse } from "./lib/types";

const protectedPrefixes = ["/dashboard", "/customers", "/api/proxy"];
const authPages = ["/login", "/register"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function isAuthPage(pathname: string) {
  return authPages.includes(pathname);
}

function unauthorizedResponse(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

async function refreshTokens(refreshToken: string) {
  const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store"
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as AuthResponse;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const protectedPath = isProtectedPath(pathname);
  const authPage = isAuthPage(pathname);
  const accessTokenValid = !!accessToken && !isJwtExpired(accessToken);

  if (accessTokenValid) {
    if (authPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (refreshToken) {
    const refreshed = await refreshTokens(refreshToken);

    if (refreshed?.tokens) {
      const response = authPage
        ? NextResponse.redirect(new URL("/dashboard", request.url))
        : NextResponse.next();

      applyAuthCookies(response, refreshed.tokens);
      return response;
    }
  }

  if (protectedPath) {
    const response = unauthorizedResponse(request);
    clearAuthCookies(response);
    return response;
  }

  if (authPage) {
    const response = NextResponse.next();
    clearAuthCookies(response);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/customers/:path*", "/login", "/register", "/api/proxy/:path*"]
};
