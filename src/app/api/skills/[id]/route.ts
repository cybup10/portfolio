import { NextRequest, NextResponse } from "next/server";
import db, { ensureSchema, Skill } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSchema();
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await db.execute({
    sql: "UPDATE skills SET category = ?, name = ?, level = ?, sort_order = ? WHERE id = ?",
    args: [body.category, body.name, body.level ?? 3, body.sort_order ?? 0, id],
  });

  const updatedResult = await db.execute({
    sql: "SELECT * FROM skills WHERE id = ?",
    args: [id],
  });
  const updated = updatedResult.rows[0] as unknown as Skill;

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSchema();
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.execute({
    sql: "DELETE FROM skills WHERE id = ?",
    args: [id],
  });

  return NextResponse.json({ ok: true });
}