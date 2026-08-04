import { NextRequest, NextResponse } from "next/server";
import db, { Project } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  const projects = db
    .prepare("SELECT * FROM projects ORDER BY sort_order, id")
    .all() as Project[];
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.description) {
    return NextResponse.json(
      { error: "title and description are required" },
      { status: 400 }
    );
  }

  const stmt = db.prepare(
    `INSERT INTO projects (title, description, tags, github_url, demo_url, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const result = stmt.run(
    body.title,
    body.description,
    body.tags ?? "",
    body.github_url ?? "",
    body.demo_url ?? "",
    body.sort_order ?? 0
  );

  const created = db
    .prepare("SELECT * FROM projects WHERE id = ?")
    .get(result.lastInsertRowid) as Project;
  return NextResponse.json(created, { status: 201 });
}
