import { NextRequest, NextResponse } from "next/server";
import { fetchBackend, getAccessTokenFromCookies } from "@/lib/api";
import { Customer } from "@/lib/types";

async function getId(context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return params.id;
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const accessToken = await getAccessTokenFromCookies();
  const id = await getId(context);

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await fetchBackend<Customer>(`/customers/${id}`, {}, accessToken);
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load customer." },
      { status: 400 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const accessToken = await getAccessTokenFromCookies();
  const id = await getId(context);

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = await fetchBackend<Customer>(
      `/customers/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(body)
      },
      accessToken
    );

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update customer." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const accessToken = await getAccessTokenFromCookies();
  const id = await getId(context);

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await fetchBackend<{ success: boolean }>(
      `/customers/${id}`,
      {
        method: "DELETE"
      },
      accessToken
    );

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete customer." },
      { status: 400 }
    );
  }
}
