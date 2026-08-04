import { NextRequest, NextResponse } from "next/server";
import db, { Education } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  const items = db
    .prepare("SELECT * FROM education ORDER BY sort_order, id")
    .all() as Education[];
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.institution) {
    return NextResponse.json({ error: "institution is required" }, { status: 400 });
  }

  const stmt = db.prepare(
    `INSERT INTO education (institution, detail, years, status, sort_order)
     VALUES (?, ?, ?, ?, ?)`
  );
  const result = stmt.run(
    body.institution,
    body.detail ?? "",
    body.years ?? "",
    body.status ?? "",
    body.sort_order ?? 0
  );

  const created = db
    .prepare("SELECT * FROM education WHERE id = ?")
    .get(result.lastInsertRowid) as Education;
  return NextResponse.json(created, { status: 201 });
}
