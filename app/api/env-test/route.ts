import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const hasKey = Boolean(process.env.OPENAI_API_KEY);
  return NextResponse.json({ hasKey });
}
