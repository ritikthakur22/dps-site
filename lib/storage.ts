import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Photo storage.
 * - Cloudinary (free plan) when CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET are set.
 * - STORAGE=local saves into ./.data/uploads and serves via /media (local testing only, not for serverless hosts).
 * To move to Cloudflare R2 later, add a third branch here; nothing else needs to change.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const LOCAL_UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");

export type StoredImage = { url: string; id: string };

export class UploadError extends Error {}

function sniffType(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.length > 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

function cloudinary() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  return cloud && key && secret ? { cloud, key, secret } : null;
}

function sign(params: Record<string, string | number>, secret: string) {
  const base = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(base + secret).digest("hex");
}

export function storageReady(): boolean {
  return Boolean(cloudinary()) || process.env.STORAGE === "local";
}

/** Returns null when no file was chosen. Throws UploadError with a staff-friendly message. */
export async function saveImage(file: FormDataEntryValue | null, folder: string): Promise<StoredImage | null> {
  if (!file || typeof file === "string" || file.size === 0) return null;
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError("The photo is too large. Please choose a photo under 5 MB.");
  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniffType(buf);
  if (!type) throw new UploadError("Please choose a JPG, PNG or WebP photo.");

  const c = cloudinary();
  if (c) {
    const timestamp = Math.floor(Date.now() / 1000);
    const params = { folder: `daffodils/${folder}`, timestamp };
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buf)]), `upload.${type}`);
    form.append("api_key", c.key);
    form.append("timestamp", String(timestamp));
    form.append("folder", params.folder);
    form.append("signature", sign(params, c.secret));
    const res = await fetch(`https://api.cloudinary.com/v1_1/${c.cloud}/image/upload`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) throw new UploadError("The photo could not be uploaded. Please try again.");
    const json = (await res.json()) as { secure_url?: string; public_id?: string };
    if (!json.secure_url || !json.public_id) throw new UploadError("The photo could not be uploaded. Please try again.");
    return { url: json.secure_url, id: json.public_id };
  }

  if (process.env.STORAGE === "local") {
    await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
    const name = `${randomUUID()}.${type}`;
    await writeFile(path.join(LOCAL_UPLOAD_DIR, name), buf);
    return { url: `/media/${name}`, id: `local:${name}` };
  }

  throw new UploadError("Photo storage is not set up yet. Ask the website engineer to add the Cloudinary keys.");
}

/** Best effort: a failed delete never blocks the staff member. */
export async function deleteImage(id: string | null | undefined): Promise<void> {
  if (!id) return;
  try {
    if (id.startsWith("local:")) {
      const name = path.basename(id.slice(6));
      await unlink(path.join(LOCAL_UPLOAD_DIR, name));
      return;
    }
    const c = cloudinary();
    if (!c) return;
    const timestamp = Math.floor(Date.now() / 1000);
    const params = { public_id: id, timestamp };
    const form = new FormData();
    form.append("public_id", id);
    form.append("api_key", c.key);
    form.append("timestamp", String(timestamp));
    form.append("signature", sign(params, c.secret));
    await fetch(`https://api.cloudinary.com/v1_1/${c.cloud}/image/destroy`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    /* ignore */
  }
}
