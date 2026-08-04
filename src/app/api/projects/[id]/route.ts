import { NextRequest, NextResponse } from "next/server";
import db, { Project } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  db.prepare(
    `UPDATE projects SET title = ?, description = ?, tags = ?, github_url = ?,
     demo_url = ?, sort_order = ? WHERE id = ?`
  ).run(
    body.title,
    body.description,
    body.tags ?? "",
    body.github_url ?? "",
    body.demo_url ?? "",
    body.sort_order ?? 0,
    id
  );

  const updated = db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as Project;
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  db.prepare("DELETE FROM projects WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
