import { NextRequest, NextResponse } from "next/server";
import db, { Certification } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  const certs = db
    .prepare("SELECT * FROM certifications ORDER BY sort_order, id")
    .all() as Certification[];
  return NextResponse.json(certs);
}

export async function POST(req: NextRequest) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.issuer) {
    return NextResponse.json(
      { error: "name and issuer are required" },
      { status: 400 }
    );
  }

  const stmt = db.prepare(
    `INSERT INTO certifications (name, issuer, date_earned, verify_url, sort_order)
     VALUES (?, ?, ?, ?, ?)`
  );
  const result = stmt.run(
    body.name,
    body.issuer,
    body.date_earned ?? "",
    body.verify_url ?? "",
    body.sort_order ?? 0
  );

  const created = db
    .prepare("SELECT * FROM certifications WHERE id = ?")
    .get(result.lastInsertRowid) as Certification;
  return NextResponse.json(created, { status: 201 });
}
