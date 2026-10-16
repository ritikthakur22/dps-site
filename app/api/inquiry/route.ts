import { NextResponse } from "next/server";
import { z } from "zod";
import { createHash } from "node:crypto";
import { GRADES } from "@/lib/site";
import { db, hasDatabase } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  parentName: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\-\s()]{7,18}$/),
  grade: z.enum(GRADES),
  message: z.string().trim().max(500).optional().default(""),
  website: z.string().optional(), // honeypot: real people leave it empty
});

const MAX_PER_IP_PER_10_MIN = 3;

export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > 4000) return NextResponse.json({ error: "Request too large." }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your name, phone number and class." }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ ok: true }); // bot

  if (!hasDatabase()) {
    return NextResponse.json({ error: "Inquiries are temporarily unavailable. Please call the school." }, { status: 503 });
  }

  const ip =
    req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = createHash("sha256")
    .update(`${process.env.AUTH_SECRET ?? "dev"}:${ip}`)
    .digest("hex")
    .slice(0, 32);

  try {
    const sql = db();
    const [{ n }] = await sql<{ n: number }[]>`
      select count(*)::int as n from inquiries where ip_hash = ${ipHash} and created_at > now() - interval '10 minutes'`;
    if (n >= MAX_PER_IP_PER_10_MIN) {
      return NextResponse.json({ error: "Too many inquiries. Please try again later or call the school." }, { status: 429 });
    }
    const { parentName, phone, grade, message } = parsed.data;
    await sql`insert into inquiries (parent_name, phone, grade, message, ip_hash)
      values (${parentName}, ${phone}, ${grade}, ${message}, ${ipHash})`;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "We could not send your inquiry. Please call the school." }, { status: 500 });
  }
}
