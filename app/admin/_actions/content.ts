"use server";

import { db } from "@/lib/db";
import { logActivity, requireUser } from "@/lib/auth";
import { deleteImage, saveImage } from "@/lib/storage";
import { getSettings } from "@/lib/content";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/site";
import {
  gallerySchema,
  highlightSchema,
  newsSchema,
  run,
  sportSchema,
  statusSchema,
  studentSchema,
  text,
  UserError,
  yearSchema,
  type Result,
} from "../_lib/form";

const removeRequested = (fd: FormData) => fd.get("removePhoto") === "on";

/* ---------------- Website text ---------------- */

const SETTING_LIMITS: Partial<Record<keyof Settings, [label: string, max: number, required: boolean]>> = {
  heroTitle: ["Main headline", 90, true],
  heroText: ["Text under the headline", 260, true],
  admissionText: ["Admissions label", 40, true],
  aboutText: ["About text", 900, true],
  studentCount: ["Number of students", 12, true],
  phone1: ["Main phone", 20, true],
  phone2: ["Second phone", 20, false],
  email: ["Email", 80, true],
  address: ["Address", 120, true],
  sportsCentre: ["Sports centre address", 120, true],
  facebookUrl: ["Facebook link", 200, false],
};

export async function saveSettingsAction(fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const current = await getSettings();
    const next: Settings = { ...current };
    for (const [key, [label, max, required]] of Object.entries(SETTING_LIMITS) as [
      keyof Settings,
      [string, number, boolean],
    ][]) {
      const v = text(fd, key);
      if (required && !v) throw new UserError(`${label} cannot be empty.`);
      if (v.length > max) throw new UserError(`${label} can be at most ${max} characters.`);
      next[key] = v;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) throw new UserError("Enter a valid email address.");
    if (next.facebookUrl && !/^https:\/\/(www\.|m\.)?facebook\.com\//.test(next.facebookUrl)) {
      throw new UserError("The Facebook link must start with https://www.facebook.com/");
    }
    for (const key of ["phone1", "phone2"] as const) {
      if (next[key] && !/^[0-9+\-\s()]{7,20}$/.test(next[key])) throw new UserError("Phone numbers can only have digits, spaces, + and -.");
    }

    const photo = await saveImage(fd.get("aboutPhoto"), "site");
    if (photo || removeRequested(fd)) {
      await deleteImage(current.aboutPhotoId);
      next.aboutPhotoUrl = photo?.url ?? DEFAULT_SETTINGS.aboutPhotoUrl;
      next.aboutPhotoId = photo?.id ?? "";
    }

    await db()`update site_settings set data = ${db().json(next)}, updated_at = now() where id = 1`;
    await logActivity(user, "Updated website text and contact details");
  });
}

/* ---------------- Class 10 batches ---------------- */

export async function addBatchAction(fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const year = yearSchema.parse(text(fd, "year"));
    const res = await db()`insert into batches (year) values (${year}) on conflict do nothing returning year`;
    if (res.length === 0) throw new UserError(`Batch ${year} already exists. Open it from the list below.`);
    await logActivity(user, `Added batch ${year}`);
    return `Batch ${year} added. Open it to add students.`;
  });
}

export async function setBatchVisibleAction(year: number, visible: boolean): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    await db()`update batches set visible = ${visible} where year = ${year}`;
    await logActivity(user, `${visible ? "Showed" : "Hid"} batch ${year}`);
    return visible ? `Batch ${year} is now shown on the website.` : `Batch ${year} is now hidden from the website.`;
  });
}

export async function deleteBatchAction(year: number): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const photos = await db()<{ photo_id: string | null }[]>`select photo_id from batch_students where year = ${year}`;
    await db()`delete from batches where year = ${year}`;
    await Promise.all(photos.map((p) => deleteImage(p.photo_id)));
    await logActivity(user, `Deleted batch ${year} (${photos.length} students)`);
    return `Batch ${year} deleted.`;
  });
}

export async function addStudentAction(year: number, fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const data = studentSchema.parse({ name: text(fd, "name"), gpa: text(fd, "gpa"), nowDoing: text(fd, "nowDoing") });
    const exists = await db()`select 1 from batches where year = ${year}`;
    if (exists.length === 0) throw new UserError("This batch no longer exists.");
    const photo = await saveImage(fd.get("photo"), `batch-${year}`);
    await db()`insert into batch_students (year, name, gpa, now_doing, photo_url, photo_id)
      values (${year}, ${data.name}, ${data.gpa}, ${data.nowDoing}, ${photo?.url ?? null}, ${photo?.id ?? null})`;
    await logActivity(user, `Added ${data.name} to batch ${year}`);
    return `${data.name} added. It is live on the website now. You can add the next student.`;
  });
}

export async function updateStudentAction(id: number, fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const data = studentSchema.parse({ name: text(fd, "name"), gpa: text(fd, "gpa"), nowDoing: text(fd, "nowDoing") });
    const [cur] = await db()<{ photo_url: string | null; photo_id: string | null; year: number }[]>`
      select photo_url, photo_id, year from batch_students where id = ${id}`;
    if (!cur) throw new UserError("This student no longer exists.");
    let { photo_url, photo_id } = cur;
    const photo = await saveImage(fd.get("photo"), `batch-${cur.year}`);
    if (photo || removeRequested(fd)) {
      await deleteImage(photo_id);
      photo_url = photo?.url ?? null;
      photo_id = photo?.id ?? null;
    }
    await db()`update batch_students set name = ${data.name}, gpa = ${data.gpa}, now_doing = ${data.nowDoing},
      photo_url = ${photo_url}, photo_id = ${photo_id}, updated_at = now() where id = ${id}`;
    await logActivity(user, `Edited ${data.name} (batch ${cur.year})`);
  });
}

export async function deleteStudentAction(id: number): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const [row] = await db()<{ name: string; year: number; photo_id: string | null }[]>`
      delete from batch_students where id = ${id} returning name, year, photo_id`;
    if (!row) throw new UserError("This student was already deleted.");
    await deleteImage(row.photo_id);
    await logActivity(user, `Deleted ${row.name} from batch ${row.year}`);
    return `${row.name} deleted.`;
  });
}

/* ---------------- Featured students ---------------- */

function highlightInput(fd: FormData) {
  return highlightSchema.parse({
    name: text(fd, "name"),
    grade: text(fd, "grade"),
    achievement: text(fd, "achievement"),
    category: text(fd, "category"),
  });
}

export async function addHighlightAction(fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const d = highlightInput(fd);
    const [{ n }] = await db()<{ n: number }[]>`select count(*)::int as n from highlights where active`;
    if (n >= 10) throw new UserError("Only 10 featured students can be shown. Hide or delete one first.");
    const photo = await saveImage(fd.get("photo"), "featured");
    await db()`insert into highlights (name, grade, achievement, category, photo_url, photo_id, sort_order)
      values (${d.name}, ${d.grade}, ${d.achievement}, ${d.category}, ${photo?.url ?? null}, ${photo?.id ?? null},
        (select coalesce(max(sort_order), 0) + 1 from highlights))`;
    await logActivity(user, `Added featured student ${d.name}`);
  });
}

export async function updateHighlightAction(id: number, fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const d = highlightInput(fd);
    const [cur] = await db()<{ photo_url: string | null; photo_id: string | null }[]>`
      select photo_url, photo_id from highlights where id = ${id}`;
    if (!cur) throw new UserError("This item no longer exists.");
    let { photo_url, photo_id } = cur;
    const photo = await saveImage(fd.get("photo"), "featured");
    if (photo || removeRequested(fd)) {
      await deleteImage(photo_id);
      photo_url = photo?.url ?? null;
      photo_id = photo?.id ?? null;
    }
    await db()`update highlights set name = ${d.name}, grade = ${d.grade}, achievement = ${d.achievement},
      category = ${d.category}, photo_url = ${photo_url}, photo_id = ${photo_id} where id = ${id}`;
    await logActivity(user, `Edited featured student ${d.name}`);
  });
}

export async function setHighlightActiveAction(id: number, active: boolean): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const [row] = await db()<{ name: string }[]>`update highlights set active = ${active} where id = ${id} returning name`;
    if (!row) throw new UserError("This item no longer exists.");
    await logActivity(user, `${active ? "Showed" : "Hid"} featured student ${row.name}`);
    return active ? `${row.name} is shown on the website.` : `${row.name} is hidden from the website.`;
  });
}

export async function deleteHighlightAction(id: number): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const [row] = await db()<{ name: string; photo_id: string | null }[]>`
      delete from highlights where id = ${id} returning name, photo_id`;
    if (!row) throw new UserError("This item was already deleted.");
    await deleteImage(row.photo_id);
    await logActivity(user, `Deleted featured student ${row.name}`);
    return `${row.name} deleted.`;
  });
}

/** Swaps an item with its neighbour above or below. */
async function move(table: "highlights" | "sports", id: number, dir: "up" | "down") {
  const sql = db();
  await sql.begin(async (tx) => {
    const rows = await tx<{ id: string; sort_order: number }[]>`
      select id, sort_order from ${tx(table)} order by sort_order, id for update`;
    const ids = rows.map((r) => Number(r.id));
    const i = ids.indexOf(id);
    const j = dir === "up" ? i - 1 : i + 1;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    for (const [pos, rid] of ids.entries()) {
      await tx`update ${tx(table)} set sort_order = ${pos} where id = ${rid}`;
    }
  });
}

export async function moveHighlightAction(id: number, dir: "up" | "down"): Promise<Result> {
  await requireUser();
  return run(async () => {
    await move("highlights", id, dir === "up" ? "up" : "down");
    return "Order saved.";
  });
}

/* ---------------- Sports ---------------- */

export async function addSportAction(fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const d = sportSchema.parse({ name: text(fd, "name") });
    const photo = await saveImage(fd.get("photo"), "sports");
    await db()`insert into sports (name, photo_url, photo_id, sort_order)
      values (${d.name}, ${photo?.url ?? null}, ${photo?.id ?? null}, (select coalesce(max(sort_order), 0) + 1 from sports))`;
    await logActivity(user, `Added sport ${d.name}`);
  });
}

export async function updateSportAction(id: number, fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const d = sportSchema.parse({ name: text(fd, "name") });
    const [cur] = await db()<{ photo_url: string | null; photo_id: string | null }[]>`
      select photo_url, photo_id from sports where id = ${id}`;
    if (!cur) throw new UserError("This sport no longer exists.");
    let { photo_url, photo_id } = cur;
    const photo = await saveImage(fd.get("photo"), "sports");
    if (photo || removeRequested(fd)) {
      await deleteImage(photo_id);
      photo_url = photo?.url ?? null;
      photo_id = photo?.id ?? null;
    }
    await db()`update sports set name = ${d.name}, photo_url = ${photo_url}, photo_id = ${photo_id} where id = ${id}`;
    await logActivity(user, `Edited sport ${d.name}`);
  });
}

export async function deleteSportAction(id: number): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const [row] = await db()<{ name: string; photo_id: string | null }[]>`
      delete from sports where id = ${id} returning name, photo_id`;
    if (!row) throw new UserError("This sport was already deleted.");
    await deleteImage(row.photo_id);
    await logActivity(user, `Deleted sport ${row.name}`);
    return `${row.name} deleted.`;
  });
}

export async function moveSportAction(id: number, dir: "up" | "down"): Promise<Result> {
  await requireUser();
  return run(async () => {
    await move("sports", id, dir === "up" ? "up" : "down");
    return "Order saved.";
  });
}

/* ---------------- Gallery ---------------- */

export async function addGalleryPhotoAction(fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const d = gallerySchema.parse({ caption: text(fd, "caption"), category: text(fd, "category") });
    const photo = await saveImage(fd.get("photo"), "gallery");
    if (!photo) throw new UserError("Choose a photo to upload.");
    await db()`insert into gallery_photos (caption, category, photo_url, photo_id)
      values (${d.caption}, ${d.category}, ${photo.url}, ${photo.id})`;
    await logActivity(user, `Added a ${d.category.toLowerCase()} photo to the gallery`);
  });
}

export async function updateGalleryPhotoAction(id: number, fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const d = gallerySchema.parse({ caption: text(fd, "caption"), category: text(fd, "category") });
    const res = await db()`update gallery_photos set caption = ${d.caption}, category = ${d.category} where id = ${id} returning id`;
    if (res.length === 0) throw new UserError("This photo no longer exists.");
    await logActivity(user, "Edited a gallery photo");
  });
}

export async function deleteGalleryPhotoAction(id: number): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const [row] = await db()<{ photo_id: string | null }[]>`delete from gallery_photos where id = ${id} returning photo_id`;
    if (!row) throw new UserError("This photo was already deleted.");
    await deleteImage(row.photo_id);
    await logActivity(user, "Deleted a gallery photo");
    return "Photo deleted.";
  });
}

/* ---------------- News ---------------- */

function newsInput(fd: FormData) {
  return newsSchema.parse({ title: text(fd, "title"), summary: text(fd, "summary"), published: text(fd, "published") });
}

export async function addNewsAction(fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const d = newsInput(fd);
    await db()`insert into news (title, summary, published) values (${d.title}, ${d.summary}, ${d.published})`;
    await logActivity(user, `Posted news: ${d.title}`);
  });
}

export async function updateNewsAction(id: number, fd: FormData): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const d = newsInput(fd);
    const res = await db()`update news set title = ${d.title}, summary = ${d.summary}, published = ${d.published}
      where id = ${id} returning id`;
    if (res.length === 0) throw new UserError("This news item no longer exists.");
    await logActivity(user, `Edited news: ${d.title}`);
  });
}

export async function setNewsVisibleAction(id: number, visible: boolean): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const [row] = await db()<{ title: string }[]>`update news set visible = ${visible} where id = ${id} returning title`;
    if (!row) throw new UserError("This news item no longer exists.");
    await logActivity(user, `${visible ? "Showed" : "Hid"} news: ${row.title}`);
    return visible ? "Shown on the website." : "Hidden from the website.";
  });
}

export async function deleteNewsAction(id: number): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const [row] = await db()<{ title: string }[]>`delete from news where id = ${id} returning title`;
    if (!row) throw new UserError("This news item was already deleted.");
    await logActivity(user, `Deleted news: ${row.title}`);
    return "News deleted.";
  });
}

/* ---------------- Inquiries ---------------- */

export async function setInquiryStatusAction(id: number, status: string): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const s = statusSchema.parse(status);
    const [row] = await db()<{ parent_name: string }[]>`
      update inquiries set status = ${s} where id = ${id} returning parent_name`;
    if (!row) throw new UserError("This inquiry no longer exists.");
    await logActivity(user, `Marked inquiry from ${row.parent_name} as ${s}`);
    return "Status saved.";
  });
}

export async function deleteInquiryAction(id: number): Promise<Result> {
  const user = await requireUser();
  return run(async () => {
    const [row] = await db()<{ parent_name: string }[]>`delete from inquiries where id = ${id} returning parent_name`;
    if (!row) throw new UserError("This inquiry was already deleted.");
    await logActivity(user, `Deleted inquiry from ${row.parent_name}`);
    return "Inquiry deleted.";
  });
}
