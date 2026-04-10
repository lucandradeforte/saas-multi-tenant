import { NextRequest, NextResponse } from "next/server";
import { fetchBackend, getAccessTokenFromCookies } from "@/lib/api";
import { Customer } from "@/lib/types";

export async function GET() {
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await fetchBackend<Customer[]>("/customers", {}, accessToken);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load customers." },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  const accessToken = await getAccessTokenFromCookies();

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = await fetchBackend<Customer>(
      "/customers",
      {
        method: "POST",
        body: JSON.stringify(body)
      },
      accessToken
    );

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create customer." },
      { status: 400 }
    );
  }
}
