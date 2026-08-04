import { NextRequest, NextResponse } from "next/server";
import db, { ensureSchema, Education } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  await ensureSchema();
  const result = await db.execute(
    "SELECT * FROM education ORDER BY sort_order, id"
  );
  const items = result.rows as unknown as Education[];
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.institution) {
    return NextResponse.json({ error: "institution is required" }, { status: 400 });
  }

  const result = await db.execute({
    sql: `INSERT INTO education (institution, detail, years, status, sort_order)
          VALUES (?, ?, ?, ?, ?)`,
    args: [
      body.institution,
      body.detail ?? "",
      body.years ?? "",
      body.status ?? "",
      body.sort_order ?? 0,
    ],
  });

  const createdResult = await db.execute({
    sql: "SELECT * FROM education WHERE id = ?",
    args: [result.lastInsertRowid?.toString() ?? ""],
  });
  const created = createdResult.rows[0] as unknown as Education;

  return NextResponse.json(created, { status: 201 });
}