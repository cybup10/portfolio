import { NextRequest, NextResponse } from "next/server";
import db, { Education } from "@/lib/db";
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
    `UPDATE education SET institution = ?, detail = ?, years = ?,
     status = ?, sort_order = ? WHERE id = ?`
  ).run(
    body.institution,
    body.detail ?? "",
    body.years ?? "",
    body.status ?? "",
    body.sort_order ?? 0,
    id
  );

  const updated = db
    .prepare("SELECT * FROM education WHERE id = ?")
    .get(id) as Education;
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  db.prepare("DELETE FROM education WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
