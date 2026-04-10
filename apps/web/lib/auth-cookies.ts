import { NextResponse } from "next/server";
import { AuthTokens } from "./types";

export const ACCESS_TOKEN_COOKIE = "tf_access_token";
export const REFRESH_TOKEN_COOKIE = "tf_refresh_token";

function durationToSeconds(value: string) {
  const match = value.match(/^(\d+)([smhd])$/i);
  if (!match) {
    return 60 * 15;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return amount;
    case "m":
      return amount * 60;
    case "h":
      return amount * 60 * 60;
    case "d":
      return amount * 60 * 60 * 24;
    default:
      return amount;
  }
}

function baseCookie(maxAge: number) {
  const domain = process.env.COOKIE_DOMAIN;

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
    ...(domain && domain !== "localhost" ? { domain } : {})
  };
}

export function applyAuthCookies(response: NextResponse, tokens: AuthTokens) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    tokens.accessToken,
    baseCookie(durationToSeconds(tokens.accessTokenExpiresIn))
  );
  response.cookies.set(
    REFRESH_TOKEN_COOKIE,
    tokens.refreshToken,
    baseCookie(durationToSeconds(tokens.refreshTokenExpiresIn))
  );
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", baseCookie(0));
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", baseCookie(0));
}
