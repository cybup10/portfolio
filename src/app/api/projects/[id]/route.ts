import { NextRequest, NextResponse } from "next/server";
import db, { ensureSchema, Project } from "@/lib/db";
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
    sql: `UPDATE projects SET title = ?, description = ?, tags = ?, github_url = ?,
          demo_url = ?, sort_order = ? WHERE id = ?`,
    args: [
      body.title,
      body.description,
      body.tags ?? "",
      body.github_url ?? "",
      body.demo_url ?? "",
      body.sort_order ?? 0,
      id,
    ],
  });

  const updatedResult = await db.execute({
    sql: "SELECT * FROM projects WHERE id = ?",
    args: [id],
  });
  const updated = updatedResult.rows[0] as unknown as Project;

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
    sql: "DELETE FROM projects WHERE id = ?",
    args: [id],
  });

  return NextResponse.json({ ok: true });
}