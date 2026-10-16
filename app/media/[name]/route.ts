import { readFile } from "node:fs/promises";
import path from "node:path";
import { LOCAL_UPLOAD_DIR } from "@/lib/storage";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

/** Serves photos saved with STORAGE=local (local testing only). */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  if (process.env.STORAGE !== "local") return new Response("Not found", { status: 404 });
  const { name } = await params;
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const buf = await readFile(path.join(LOCAL_UPLOAD_DIR, name));
    return new Response(new Uint8Array(buf), {
      headers: {
        "Content-Type": TYPES[name.split(".").pop() ?? ""] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
