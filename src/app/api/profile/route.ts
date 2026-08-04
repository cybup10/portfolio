import { NextRequest, NextResponse } from "next/server";
import db, { ensureSchema, Profile } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  await ensureSchema();
  const result = await db.execute("SELECT * FROM profile WHERE id = 1");
  const profile = result.rows[0] as unknown as Profile;
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  await ensureSchema();
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  await db.execute({
    sql: `UPDATE profile SET name = ?, tagline = ?, bio = ?, github_url = ?,
          linkedin_url = ?, email = ?, resume_url = ? WHERE id = 1`,
    args: [
      body.name,
      body.tagline ?? "",
      body.bio ?? "",
      body.github_url ?? "",
      body.linkedin_url ?? "",
      body.email ?? "",
      body.resume_url ?? "",
    ],
  });

  const updatedResult = await db.execute("SELECT * FROM profile WHERE id = 1");
  const updated = updatedResult.rows[0] as unknown as Profile;

  return NextResponse.json(updated);
}