import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const { password } = await req.json().catch(() => ({ password: "" }));
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!hash) {
    return NextResponse.json(
      { error: "Server misconfigured: ADMIN_PASSWORD_HASH not set." },
      { status: 500 }
    );
  }

  if (!password || typeof password !== "string") {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, hash);

  if (!valid) {
    recordFailedAttempt(ip);
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  clearAttempts(ip);
  await createSession();
  return NextResponse.json({ ok: true });
}
