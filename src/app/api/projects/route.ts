import { NextRequest, NextResponse } from "next/server";
import db, { ensureSchema, Project } from "@/lib/db";
import { verifySession } from "@/lib/auth";

export async function GET() {
  await ensureSchema();
  const result = await db.execute(
    "SELECT * FROM projects ORDER BY sort_order, id"
  );
  const projects = result.rows as unknown as Project[];
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  await ensureSchema();
  const authed = await verifySession();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.title || !body?.description) {
    return NextResponse.json(
      { error: "title and description are required" },
      { status: 400 }
    );
  }

  const result = await db.execute({
    sql: `INSERT INTO projects (title, description, tags, github_url, demo_url, sort_order)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      body.title,
      body.description,
      body.tags ?? "",
      body.github_url ?? "",
      body.demo_url ?? "",
      body.sort_order ?? 0,
    ],
  });

  const createdResult = await db.execute({
    sql: "SELECT * FROM projects WHERE id = ?",
    args: [result.lastInsertRowid?.toString() ?? ""],
  });
  const created = createdResult.rows[0] as unknown as Project;

  return NextResponse.json(created, { status: 201 });
}