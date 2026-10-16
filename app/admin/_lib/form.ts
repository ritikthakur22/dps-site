import "server-only";
import { z } from "zod";
import { unstable_rethrow } from "next/navigation";
import { UploadError } from "@/lib/storage";
import { publish } from "@/lib/publish";
import { GALLERY_CATEGORIES, HIGHLIGHT_CATEGORIES, INQUIRY_STATUSES } from "@/lib/site";

export type Result = { ok: boolean; message: string };

export const LIVE = "Saved. It is live on the website now.";

export const text = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
};

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} can be at most ${max} characters.`)
    .transform((v) => (v === "" ? null : v));

const nameField = (label = "Name") =>
  z.string().trim().min(2, `${label} must be at least 2 characters.`).max(80, `${label} can be at most 80 characters.`);

export const yearSchema = z.coerce
  .number({ invalid_type_error: "Enter the batch year, for example 2081." })
  .int("Enter the batch year as a whole number, for example 2081.")
  .min(2060, "Enter a year between 2060 and 2150 (B.S.).")
  .max(2150, "Enter a year between 2060 and 2150 (B.S.).");

export const studentSchema = z.object({
  name: nameField("Student name"),
  gpa: z
    .string()
    .trim()
    .regex(/^[0-4](\.\d{1,2})?$/, "Enter the GPA like 3.85 (between 0 and 4).")
    .transform(Number)
    .refine((n) => n >= 0 && n <= 4, "GPA must be between 0 and 4."),
  nowDoing: optionalText(80, "Now studying / working"),
});

export const highlightSchema = z.object({
  name: nameField("Student name"),
  grade: z.string().trim().min(1, "Enter the class, for example Grade 8.").max(30, "Class is too long."),
  achievement: z
    .string()
    .trim()
    .min(2, "Describe the achievement.")
    .max(240, "Achievement can be at most 240 characters."),
  category: z.enum(HIGHLIGHT_CATEGORIES, { errorMap: () => ({ message: "Choose a category." }) }),
});

export const sportSchema = z.object({
  name: z.string().trim().min(2, "Enter the sport name.").max(40, "Sport name is too long."),
});

export const gallerySchema = z.object({
  caption: optionalText(120, "Caption"),
  category: z.enum(GALLERY_CATEGORIES, { errorMap: () => ({ message: "Choose a category." }) }),
});

export const newsSchema = z.object({
  title: z.string().trim().min(3, "Enter a headline.").max(140, "Headline can be at most 140 characters."),
  summary: z.string().trim().min(3, "Write a short summary.").max(400, "Summary can be at most 400 characters."),
  published: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date."),
});

export const statusSchema = z.enum(INQUIRY_STATUSES);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9._-]{3,32}$/, "Username: 3 to 32 letters or numbers (no spaces).");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(100, "Password is too long.");

export function parse<T extends z.ZodTypeAny>(schema: T, input: unknown): z.infer<T> {
  return schema.parse(input);
}

/** An error whose message is written for staff and is safe to show as-is. */
export class UserError extends Error {}

function friendly(err: unknown): string {
  if (err instanceof UploadError || err instanceof UserError) return err.message;
  if (err instanceof z.ZodError) return err.issues[0]?.message ?? "Please check the form.";
  const e = err as { code?: string; message?: string };
  if (e?.message?.includes("MAX_HIGHLIGHTS")) {
    return "Only 10 featured students can be shown. Hide or delete one first.";
  }
  if (e?.code === "23505") return "This already exists.";
  console.error(err);
  return "Something went wrong. Please try again.";
}

/** Runs a change, refreshes the public site, and turns errors into plain messages. */
export async function run(fn: () => Promise<string | void>): Promise<Result> {
  try {
    const msg = await fn();
    publish();
    return { ok: true, message: msg || LIVE };
  } catch (err) {
    unstable_rethrow(err);
    return { ok: false, message: friendly(err) };
  }
}
