import { NextRequest, NextResponse } from "next/server";
import db, { Profile } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get() as Profile;
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  db.prepare(
    `UPDATE profile SET name = ?, tagline = ?, bio = ?, github_url = ?,
     linkedin_url = ?, email = ?, resume_url = ? WHERE id = 1`
  ).run(
    body.name,
    body.tagline ?? "",
    body.bio ?? "",
    body.github_url ?? "",
    body.linkedin_url ?? "",
    body.email ?? "",
    body.resume_url ?? ""
  );

  const updated = db.prepare("SELECT * FROM profile WHERE id = 1").get() as Profile;
  return NextResponse.json(updated);
}
