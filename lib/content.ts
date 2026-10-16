import "server-only";
import { db, hasDatabase } from "./db";
import { DEFAULT_SETTINGS, DEFAULT_SPORTS, type Settings } from "./site";

export type BatchStudent = {
  id: number;
  year: number;
  name: string;
  gpa: number;
  nowDoing: string | null;
  photoUrl: string | null;
};

export type RankedStudent = BatchStudent & { rank: number };

export type Batch = { year: number; total: number; top: RankedStudent[] };

export type Highlight = {
  id: number;
  name: string;
  grade: string;
  achievement: string;
  category: string;
  photoUrl: string | null;
};

export type Sport = { id: number; name: string; photoUrl: string | null };
export type GalleryPhoto = { id: number; caption: string | null; category: string; photoUrl: string };
export type NewsItem = { id: number; title: string; summary: string; published: string };

/**
 * Public read functions.
 * Without DATABASE_URL (first local run) they return defaults so the page still renders.
 * With a database, errors are thrown on purpose: Next.js then keeps serving the last good page
 * instead of caching an empty one.
 */

export async function getSettings(): Promise<Settings> {
  if (!hasDatabase()) return DEFAULT_SETTINGS;
  const rows = await db()<{ data: Partial<Settings> }[]>`select data from site_settings where id = 1`;
  const saved = rows[0]?.data ?? {};
  const merged: Settings = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
    const v = saved[key];
    if (typeof v === "string" && (v.trim() !== "" || key === "aboutPhotoId" || key === "facebookUrl" || key === "phone2")) {
      merged[key] = v;
    }
  }
  if (!merged.aboutPhotoUrl) merged.aboutPhotoUrl = DEFAULT_SETTINGS.aboutPhotoUrl;
  return merged;
}

/** Competition ranking: equal GPAs share a rank (1, 2, 2, 4). Input must be sorted by GPA desc. */
export function rankStudents(students: BatchStudent[]): RankedStudent[] {
  let rank = 0;
  let prev: number | null = null;
  return students.map((s, i) => {
    if (prev === null || s.gpa !== prev) rank = i + 1;
    prev = s.gpa;
    return { ...s, rank };
  });
}

type StudentRow = { id: string; year: number; name: string; gpa: number; now_doing: string | null; photo_url: string | null };
const toStudent = (r: StudentRow): BatchStudent => ({
  id: Number(r.id),
  year: r.year,
  name: r.name,
  gpa: Number(r.gpa),
  nowDoing: r.now_doing,
  photoUrl: r.photo_url,
});

export async function getBatches(topCount: number): Promise<Batch[]> {
  if (!hasDatabase()) return [];
  const sql = db();
  const years = await sql<{ year: number }[]>`select year from batches where visible order by year desc`;
  if (years.length === 0) return [];
  const rows = await sql<StudentRow[]>`
    select id, year, name, gpa, now_doing, photo_url from batch_students
    where year in ${sql(years.map((y) => y.year))}
    order by year desc, gpa desc, name asc`;
  return years
    .map(({ year }) => {
      const all = rankStudents(rows.filter((r) => r.year === year).map(toStudent));
      return { year, total: all.length, top: all.slice(0, topCount) };
    })
    .filter((b) => b.total > 0);
}

export async function getBatch(year: number): Promise<RankedStudent[] | null> {
  if (!hasDatabase()) return null;
  const sql = db();
  const exists = await sql`select 1 from batches where year = ${year} and visible`;
  if (exists.length === 0) return null;
  const rows = await sql<StudentRow[]>`
    select id, year, name, gpa, now_doing, photo_url from batch_students
    where year = ${year} order by gpa desc, name asc`;
  return rankStudents(rows.map(toStudent));
}

export async function getVisibleBatchYears(): Promise<number[]> {
  if (!hasDatabase()) return [];
  const rows = await db()<{ year: number }[]>`
    select b.year from batches b where b.visible
      and exists (select 1 from batch_students s where s.year = b.year)
    order by b.year desc`;
  return rows.map((r) => r.year);
}

export async function getHighlights(): Promise<Highlight[]> {
  if (!hasDatabase()) return [];
  const rows = await db()<
    { id: string; name: string; grade: string; achievement: string; category: string; photo_url: string | null }[]
  >`select id, name, grade, achievement, category, photo_url from highlights where active order by sort_order, id limit 10`;
  return rows.map((r) => ({
    id: Number(r.id),
    name: r.name,
    grade: r.grade,
    achievement: r.achievement,
    category: r.category,
    photoUrl: r.photo_url,
  }));
}

export async function getSports(): Promise<Sport[]> {
  if (!hasDatabase()) return DEFAULT_SPORTS.map((name, i) => ({ id: i + 1, name, photoUrl: null }));
  const rows = await db()<{ id: string; name: string; photo_url: string | null }[]>`
    select id, name, photo_url from sports order by sort_order, id`;
  return rows.map((r) => ({ id: Number(r.id), name: r.name, photoUrl: r.photo_url }));
}

export async function getGallery(limit?: number): Promise<GalleryPhoto[]> {
  if (!hasDatabase()) return [];
  const sql = db();
  const rows = await sql<{ id: string; caption: string | null; category: string; photo_url: string }[]>`
    select id, caption, category, photo_url from gallery_photos
    order by created_at desc, id desc ${limit ? sql`limit ${limit}` : sql``}`;
  return rows.map((r) => ({ id: Number(r.id), caption: r.caption, category: r.category, photoUrl: r.photo_url }));
}

export async function getNews(): Promise<NewsItem[]> {
  if (!hasDatabase()) return [];
  const rows = await db()<{ id: string; title: string; summary: string; published: Date }[]>`
    select id, title, summary, published from news where visible order by published desc, id desc limit 6`;
  return rows.map((r) => ({
    id: Number(r.id),
    title: r.title,
    summary: r.summary,
    published: new Date(r.published).toISOString().slice(0, 10),
  }));
}
