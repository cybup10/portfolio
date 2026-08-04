import { NextRequest, NextResponse } from "next/server";
import db, { ensureSchema, Skill } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  await ensureSchema();
  const result = await db.execute(
    "SELECT * FROM skills ORDER BY category, sort_order, id"
  );
  const skills = result.rows as unknown as Skill[];
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.category) {
    return NextResponse.json({ error: "name and category are required" }, { status: 400 });
  }

  const result = await db.execute({
    sql: "INSERT INTO skills (category, name, level, sort_order) VALUES (?, ?, ?, ?)",
    args: [body.category, body.name, body.level ?? 3, body.sort_order ?? 0],
  });

  const createdResult = await db.execute({
    sql: "SELECT * FROM skills WHERE id = ?",
    args: [result.lastInsertRowid?.toString() ?? ""],
  });
  const created = createdResult.rows[0] as unknown as Skill;

  return NextResponse.json(created, { status: 201 });
}