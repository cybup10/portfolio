import { NextRequest, NextResponse } from "next/server";
import db, { Skill } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  const skills = db
    .prepare("SELECT * FROM skills ORDER BY category, sort_order, id")
    .all() as Skill[];
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.category) {
    return NextResponse.json({ error: "name and category are required" }, { status: 400 });
  }

  const stmt = db.prepare(
    "INSERT INTO skills (category, name, level, sort_order) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(
    body.category,
    body.name,
    body.level ?? 3,
    body.sort_order ?? 0
  );

  const created = db
    .prepare("SELECT * FROM skills WHERE id = ?")
    .get(result.lastInsertRowid) as Skill;
  return NextResponse.json(created, { status: 201 });
}
