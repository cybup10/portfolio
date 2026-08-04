import { NextRequest, NextResponse } from "next/server";
import db, { ensureSchema, Certification } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  await ensureSchema();
  const result = await db.execute(
    "SELECT * FROM certifications ORDER BY sort_order, id"
  );
  const certs = result.rows as unknown as Certification[];
  return NextResponse.json(certs);
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.issuer) {
    return NextResponse.json(
      { error: "name and issuer are required" },
      { status: 400 }
    );
  }

  const result = await db.execute({
    sql: `INSERT INTO certifications (name, issuer, date_earned, verify_url, sort_order)
          VALUES (?, ?, ?, ?, ?)`,
    args: [
      body.name,
      body.issuer,
      body.date_earned ?? "",
      body.verify_url ?? "",
      body.sort_order ?? 0,
    ],
  });

  const createdResult = await db.execute({
    sql: "SELECT * FROM certifications WHERE id = ?",
    args: [result.lastInsertRowid?.toString() ?? ""],
  });
  const created = createdResult.rows[0] as unknown as Certification;

  return NextResponse.json(created, { status: 201 });
}