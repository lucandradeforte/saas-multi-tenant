import { NextResponse } from "next/server";
import { fetchBackend, getAccessTokenFromCookies } from "@/lib/api";
import { DashboardMetrics } from "@/lib/types";

export async function GET() {
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await fetchBackend<DashboardMetrics>("/dashboard/metrics", {}, accessToken);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load dashboard." },
      { status: 400 }
    );
  }
}
