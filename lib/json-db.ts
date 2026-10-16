import "server-only";
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_SETTINGS, DEFAULT_SPORTS, type Settings } from "./site";

export interface BatchItem {
  year: number;
  visible: boolean;
  created_at: string;
}

export interface BatchStudentItem {
  id: number;
  year: number;
  name: string;
  gpa: number;
  now_doing: string | null;
  photo_url: string | null;
  photo_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface HighlightItem {
  id: number;
  name: string;
  grade: string;
  achievement: string;
  category: string;
  photo_url: string | null;
  photo_id: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface SportItem {
  id: number;
  name: string;
  photo_url: string | null;
  photo_id: string | null;
  sort_order: number;
  created_at: string;
}

export interface GalleryPhotoItem {
  id: number;
  caption: string | null;
  category: string;
  photo_url: string;
  photo_id: string | null;
  created_at: string;
}

export interface NewsItemRecord {
  id: number;
  title: string;
  summary: string;
  published: string;
  visible: boolean;
}

export interface InquiryItem {
  id: number;
  parent_name: string;
  phone: string;
  grade: string;
  message: string;
  status: string;
  ip_hash: string;
  created_at: string;
}

export interface AdminUserItem {
  id: number;
  username: string;
  display_name: string;
  password_hash: string;
  role: "owner" | "editor";
  active: boolean;
  session_version: number;
  last_login_at: string | null;
  created_at: string;
}

export interface ActivityLogItem {
  id: number;
  user_id: number | null;
  who: string;
  action: string;
  at: string;
}

export interface DatabaseSchema {
  site_settings: Settings;
  batches: BatchItem[];
  batch_students: BatchStudentItem[];
  highlights: HighlightItem[];
  sports: SportItem[];
  gallery_photos: GalleryPhotoItem[];
  news: NewsItemRecord[];
  inquiries: InquiryItem[];
  admin_users: AdminUserItem[];
  activity_log: ActivityLogItem[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "db.json");

// Default initial data seeded if .data/db.json does not exist
function createSeedData(): DatabaseSchema {
  const now = new Date().toISOString();
  return {
    site_settings: { ...DEFAULT_SETTINGS },
    batches: [
      { year: 2081, visible: true, created_at: now },
      { year: 2080, visible: true, created_at: now },
      { year: 2079, visible: true, created_at: now },
    ],
    batch_students: [
      { id: 1, year: 2081, name: "Aarav Sharma", gpa: 4.0, now_doing: "Science at St. Xavier's", photo_url: null, photo_id: null, created_at: now, updated_at: now },
      { id: 2, year: 2081, name: "Pooja Yadav", gpa: 4.0, now_doing: "Pre-Med at KMC", photo_url: null, photo_id: null, created_at: now, updated_at: now },
      { id: 3, year: 2081, name: "Bibek Sah", gpa: 3.95, now_doing: "Computer Engineering", photo_url: null, photo_id: null, created_at: now, updated_at: now },
      { id: 4, year: 2081, name: "Sneha Thakur", gpa: 3.9, now_doing: "Science at Trinity", photo_url: null, photo_id: null, created_at: now, updated_at: now },
      { id: 5, year: 2081, name: "Rohan Mishra", gpa: 3.85, now_doing: "Management at NCC", photo_url: null, photo_id: null, created_at: now, updated_at: now },
      { id: 6, year: 2080, name: "Anjali Karn", gpa: 4.0, now_doing: "MBBS at Dharan (BPKIHS)", photo_url: null, photo_id: null, created_at: now, updated_at: now },
      { id: 7, year: 2080, name: "Deepak Raut", gpa: 3.95, now_doing: "Pulchowk Campus (IOE)", photo_url: null, photo_id: null, created_at: now, updated_at: now },
      { id: 8, year: 2080, name: "Kriti Chaudhary", gpa: 3.9, now_doing: "Science at Prasadi", photo_url: null, photo_id: null, created_at: now, updated_at: now },
    ],
    highlights: [
      { id: 1, name: "Aarav Sharma", grade: "Grade 10", achievement: "SEE Board Top Scorer with 4.0 GPA", category: "Academics", photo_url: null, photo_id: null, sort_order: 0, active: true, created_at: now },
      { id: 2, name: "Ritik Sah", grade: "Grade 9", achievement: "District Table Tennis Champion 2081", category: "Sports", photo_url: null, photo_id: null, sort_order: 1, active: true, created_at: now },
      { id: 3, name: "Shreya Jha", grade: "Grade 8", achievement: "First prize in Inter-School Art & Cultural Competition", category: "Arts", photo_url: null, photo_id: null, sort_order: 2, active: true, created_at: now },
      { id: 4, name: "Manoj Kumar", grade: "Grade 10", achievement: "Lead organiser of Community Blood Donation Camp", category: "Beyond school", photo_url: null, photo_id: null, sort_order: 3, active: true, created_at: now },
    ],
    sports: DEFAULT_SPORTS.map((name, i) => ({
      id: i + 1,
      name,
      photo_url: null,
      photo_id: null,
      sort_order: i,
      created_at: now,
    })),
    gallery_photos: [
      { id: 1, caption: "Daffodils Public School Campus", category: "Campus", photo_url: "/campus.jpg", photo_id: null, created_at: now },
      { id: 2, caption: "Morning Assembly and Prayer", category: "Campus", photo_url: "/campus.jpg", photo_id: null, created_at: now },
      { id: 3, caption: "Annual Sports Day Tournament", category: "Sports", photo_url: "/campus.jpg", photo_id: null, created_at: now },
      { id: 4, caption: "Interactive Science Laboratory Session", category: "Classroom", photo_url: "/campus.jpg", photo_id: null, created_at: now },
    ],
    news: [
      { id: 1, title: "Admissions Open for Session 2082/83", summary: "Admissions are now open from Nursery to Grade 9. Parents can visit the school office Sunday to Friday, 9:00 AM to 3:30 PM.", published: "2026-10-10", visible: true },
      { id: 2, title: "Annual Sports Meet 2081 Successfully Concluded", summary: "Students participated with great enthusiasm across football, table tennis, athletics and basketball competitions.", published: "2026-09-25", visible: true },
      { id: 3, title: "Class 10 SEE Batch Felicitation Ceremony", summary: "Congratulations to our outstanding Class 10 graduates for achieving 100% first division and distinction results.", published: "2026-08-15", visible: true },
    ],
    inquiries: [
      { id: 1, parent_name: "Ramesh Kumar Jha", phone: "9844123456", grade: "Grade 1", message: "Inquiring about bus route to Ramanand Chowk and fee structure.", status: "new", ip_hash: "dev", created_at: now },
      { id: 2, parent_name: "Sunita Mandal", phone: "9812987654", grade: "Nursery", message: "Want to book a campus visit this Friday.", status: "contacted", ip_hash: "dev", created_at: now },
    ],
    admin_users: [
      {
        id: 1,
        username: "admin",
        display_name: "School Admin",
        // bcrypt hash for password "admin123"
        password_hash: "$2b$10$FPYjy5k1Enya2pwMsQ4FneMZyubhszayC3ZJ45uowyHAvGN.7LJo2",
        role: "owner",
        active: true,
        session_version: 1,
        last_login_at: null,
        created_at: now,
      },
    ],
    activity_log: [
      { id: 1, user_id: 1, who: "System", action: "Initialized local JSON database", at: now },
    ],
  };
}

let cachedData: DatabaseSchema | null = null;

export function loadData(): DatabaseSchema {
  if (cachedData) return cachedData;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const seed = createSeedData();
    saveData(seed);
    cachedData = seed;
    return seed;
  }
  try {
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    cachedData = JSON.parse(content) as DatabaseSchema;
    return cachedData;
  } catch {
    const seed = createSeedData();
    saveData(seed);
    cachedData = seed;
    return seed;
  }
}

export function saveData(data?: DatabaseSchema): void {
  const toSave = data ?? cachedData;
  if (!toSave) return;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(toSave, null, 2), "utf-8");
  fs.renameSync(tempFile, DATA_FILE);
  cachedData = toSave;
}

function normalizeSql(strings: TemplateStringsArray, values: unknown[]): { text: string; values: unknown[] } {
  let text = strings[0] || "";
  for (let i = 0; i < values.length; i++) {
    text += `$${i + 1}` + (strings[i + 1] || "");
  }
  return {
    text: text.trim().replace(/\s+/g, " "),
    values,
  };
}

export function executeJsonQuery(strings: TemplateStringsArray, values: unknown[]): any[] {
  const { text: q, values: v } = normalizeSql(strings, values);
  const data = loadData();

  // 1. site_settings
  if (q.includes("from site_settings where id = 1")) {
    return [{ data: data.site_settings }];
  }
  if (q.startsWith("update site_settings set data =")) {
    const next = (v[0] as any)?.__json ?? v[0];
    if (next && typeof next === "object") {
      data.site_settings = { ...data.site_settings, ...next };
      saveData();
    }
    return [{ id: 1 }];
  }

  // 2. batches
  if (q === "select year from batches where visible order by year desc") {
    return data.batches
      .filter((b) => b.visible)
      .sort((a, b) => b.year - a.year)
      .map((b) => ({ year: b.year }));
  }
  if (q.startsWith("select 1 from batches where year =") && q.includes("and visible")) {
    const year = Number(v[0]);
    const found = data.batches.some((b) => b.year === year && b.visible);
    return found ? [{ "?column?": 1 }] : [];
  }
  if (q.startsWith("select 1 from batches where year =")) {
    const year = Number(v[0]);
    const found = data.batches.some((b) => b.year === year);
    return found ? [{ "?column?": 1 }] : [];
  }
  if (q.includes("from batches b where b.visible") && q.includes("exists (select 1 from batch_students")) {
    return data.batches
      .filter((b) => b.visible && data.batch_students.some((s) => s.year === b.year))
      .sort((a, b) => b.year - a.year)
      .map((b) => ({ year: b.year }));
  }
  if (q.includes("from batches b") && q.includes("left join batch_students s on s.year = b.year")) {
    return data.batches
      .slice()
      .sort((a, b) => b.year - a.year)
      .map((b) => {
        const students = data.batch_students.filter((s) => s.year === b.year);
        return {
          year: b.year,
          visible: b.visible,
          students: students.length,
          photos: students.filter((s) => Boolean(s.photo_url)).length,
        };
      });
  }
  if (q.startsWith("select visible from batches where year =")) {
    const b = data.batches.find((x) => x.year === Number(v[0]));
    return b ? [{ visible: b.visible }] : [];
  }
  if (q.startsWith("insert into batches (year) values")) {
    const year = Number(v[0]);
    if (data.batches.some((b) => b.year === year)) return [];
    data.batches.push({ year, visible: true, created_at: new Date().toISOString() });
    saveData();
    return [{ year }];
  }
  if (q.startsWith("update batches set visible =") && q.includes("where year =")) {
    const visible = Boolean(v[0]);
    const year = Number(v[1]);
    const b = data.batches.find((x) => x.year === year);
    if (b) b.visible = visible;
    saveData();
    return [{ year }];
  }
  if (q.startsWith("delete from batches where year =")) {
    const year = Number(v[0]);
    data.batches = data.batches.filter((b) => b.year !== year);
    data.batch_students = data.batch_students.filter((s) => s.year !== year);
    saveData();
    return [];
  }

  // 3. batch_students
  if (q.startsWith("select id, year, name, gpa, now_doing, photo_url from batch_students where year in")) {
    const rawVal = v[0] as any;
    const yearList: number[] = rawVal?.__array ?? (Array.isArray(rawVal) ? rawVal : [rawVal]);
    const years = yearList.map(Number);
    return data.batch_students
      .filter((s) => years.includes(s.year))
      .sort((a, b) => b.year - a.year || b.gpa - a.gpa || a.name.localeCompare(b.name))
      .map((s) => ({
        id: String(s.id),
        year: s.year,
        name: s.name,
        gpa: Number(s.gpa),
        now_doing: s.now_doing,
        photo_url: s.photo_url,
      }));
  }
  if (q.startsWith("select id, year, name, gpa, now_doing, photo_url from batch_students where year =") ||
      q.startsWith("select id, name, gpa, now_doing, photo_url from batch_students where year =")) {
    const year = Number(v[0]);
    return data.batch_students
      .filter((s) => s.year === year)
      .sort((a, b) => b.gpa - a.gpa || a.name.localeCompare(b.name))
      .map((s) => ({
        id: String(s.id),
        year: s.year,
        name: s.name,
        gpa: Number(s.gpa),
        now_doing: s.now_doing,
        photo_url: s.photo_url,
      }));
  }
  if (q.startsWith("select id, year, name, gpa, now_doing, photo_url from batch_students where id =")) {
    const s = data.batch_students.find((x) => x.id === Number(v[0]));
    return s
      ? [
          {
            id: String(s.id),
            year: s.year,
            name: s.name,
            gpa: Number(s.gpa),
            now_doing: s.now_doing,
            photo_url: s.photo_url,
          },
        ]
      : [];
  }
  if (q.startsWith("select photo_url, photo_id, year from batch_students where id =")) {
    const s = data.batch_students.find((x) => x.id === Number(v[0]));
    return s ? [{ photo_url: s.photo_url, photo_id: s.photo_id, year: s.year }] : [];
  }
  if (q.startsWith("select photo_id from batch_students where year =")) {
    const year = Number(v[0]);
    return data.batch_students.filter((s) => s.year === year).map((s) => ({ photo_id: s.photo_id }));
  }
  if (q.startsWith("insert into batch_students (year, name, gpa, now_doing, photo_url, photo_id)")) {
    const [year, name, gpa, now_doing, photo_url, photo_id] = v;
    const id = (data.batch_students.reduce((max, s) => Math.max(max, s.id), 0) || 0) + 1;
    const now = new Date().toISOString();
    data.batch_students.push({
      id,
      year: Number(year),
      name: String(name),
      gpa: Number(gpa),
      now_doing: now_doing ? String(now_doing) : null,
      photo_url: photo_url ? String(photo_url) : null,
      photo_id: photo_id ? String(photo_id) : null,
      created_at: now,
      updated_at: now,
    });
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("update batch_students set name =") && q.includes("where id =")) {
    const [name, gpa, now_doing, photo_url, photo_id, id] = v;
    const s = data.batch_students.find((x) => x.id === Number(id));
    if (s) {
      s.name = String(name);
      s.gpa = Number(gpa);
      s.now_doing = now_doing ? String(now_doing) : null;
      s.photo_url = photo_url ? String(photo_url) : null;
      s.photo_id = photo_id ? String(photo_id) : null;
      s.updated_at = new Date().toISOString();
    }
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("delete from batch_students where id =")) {
    const id = Number(v[0]);
    const idx = data.batch_students.findIndex((x) => x.id === id);
    if (idx === -1) return [];
    const [removed] = data.batch_students.splice(idx, 1);
    saveData();
    return [{ name: removed.name, year: removed.year, photo_id: removed.photo_id }];
  }

  // 4. highlights
  if (q.includes("from highlights where active") && q.includes("limit 10")) {
    return data.highlights
      .filter((h) => h.active)
      .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
      .slice(0, 10)
      .map((h) => ({
        id: String(h.id),
        name: h.name,
        grade: h.grade,
        achievement: h.achievement,
        category: h.category,
        photo_url: h.photo_url,
      }));
  }
  if (q.includes("select count(*)::int as n from highlights where active")) {
    return [{ n: data.highlights.filter((h) => h.active).length }];
  }
  if (q.includes("from highlights") && q.includes("order by sort_order, id")) {
    return data.highlights
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
      .map((h) => ({
        id: String(h.id),
        name: h.name,
        grade: h.grade,
        achievement: h.achievement,
        category: h.category,
        photo_url: h.photo_url,
        photo_id: h.photo_id,
        sort_order: h.sort_order,
        active: h.active,
      }));
  }
  if (q.startsWith("select id, name, grade, achievement, category, photo_url from highlights where id =") ||
      q.startsWith("select id, name, grade, achievement, category, photo_url, photo_id from highlights where id =")) {
    const h = data.highlights.find((x) => x.id === Number(v[0]));
    return h
      ? [
          {
            id: String(h.id),
            name: h.name,
            grade: h.grade,
            achievement: h.achievement,
            category: h.category,
            photo_url: h.photo_url,
            photo_id: h.photo_id,
          },
        ]
      : [];
  }
  if (q.startsWith("select photo_url, photo_id from highlights where id =")) {
    const h = data.highlights.find((x) => x.id === Number(v[0]));
    return h ? [{ photo_url: h.photo_url, photo_id: h.photo_id }] : [];
  }
  if (q.startsWith("insert into highlights (name, grade, achievement, category, photo_url, photo_id, sort_order)")) {
    const [name, grade, achievement, category, photo_url, photo_id, sort_order] = v;
    const id = (data.highlights.reduce((max, h) => Math.max(max, h.id), 0) || 0) + 1;
    data.highlights.push({
      id,
      name: String(name),
      grade: String(grade),
      achievement: String(achievement),
      category: String(category),
      photo_url: photo_url ? String(photo_url) : null,
      photo_id: photo_id ? String(photo_id) : null,
      sort_order: Number(sort_order ?? 0),
      active: true,
      created_at: new Date().toISOString(),
    });
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("update highlights set name =") && q.includes("where id =")) {
    const [name, grade, achievement, category, photo_url, photo_id, id] = v;
    const h = data.highlights.find((x) => x.id === Number(id));
    if (h) {
      h.name = String(name);
      h.grade = String(grade);
      h.achievement = String(achievement);
      h.category = String(category);
      h.photo_url = photo_url ? String(photo_url) : null;
      h.photo_id = photo_id ? String(photo_id) : null;
    }
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("update highlights set active =") && q.includes("where id =")) {
    const [active, id] = v;
    const h = data.highlights.find((x) => x.id === Number(id));
    if (h) h.active = Boolean(active);
    saveData();
    return h ? [{ name: h.name }] : [];
  }
  if (q.startsWith("delete from highlights where id =")) {
    const id = Number(v[0]);
    const idx = data.highlights.findIndex((x) => x.id === id);
    if (idx === -1) return [];
    const [removed] = data.highlights.splice(idx, 1);
    saveData();
    return [{ name: removed.name, photo_id: removed.photo_id }];
  }
  if (q.startsWith("update highlights set sort_order =") && q.includes("where id =")) {
    const [order, id] = v;
    const h = data.highlights.find((x) => x.id === Number(id));
    if (h) h.sort_order = Number(order);
    saveData();
    return [];
  }

  // 5. sports
  if (q.includes("select count(*)::int as count from sports")) {
    return [{ count: data.sports.length }];
  }
  if (q.includes("from sports order by sort_order, id")) {
    return data.sports
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
      .map((s) => ({
        id: String(s.id),
        name: s.name,
        photo_url: s.photo_url,
        photo_id: s.photo_id,
      }));
  }
  if (q.startsWith("select id, name, photo_url from sports where id =") ||
      q.startsWith("select id, name, photo_url, photo_id from sports where id =") ||
      q.startsWith("select photo_url, photo_id from sports where id =")) {
    const s = data.sports.find((x) => x.id === Number(v[0]));
    return s ? [{ id: String(s.id), name: s.name, photo_url: s.photo_url, photo_id: s.photo_id }] : [];
  }
  if (q.startsWith("insert into sports (name, photo_url, photo_id, sort_order)")) {
    const [name, photo_url, photo_id, sort_order] = v;
    const id = (data.sports.reduce((max, s) => Math.max(max, s.id), 0) || 0) + 1;
    data.sports.push({
      id,
      name: String(name),
      photo_url: photo_url ? String(photo_url) : null,
      photo_id: photo_id ? String(photo_id) : null,
      sort_order: Number(sort_order ?? 0),
      created_at: new Date().toISOString(),
    });
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("update sports set name =") && q.includes("where id =")) {
    const [name, photo_url, photo_id, id] = v;
    const s = data.sports.find((x) => x.id === Number(id));
    if (s) {
      s.name = String(name);
      s.photo_url = photo_url ? String(photo_url) : null;
      s.photo_id = photo_id ? String(photo_id) : null;
    }
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("delete from sports where id =")) {
    const id = Number(v[0]);
    const idx = data.sports.findIndex((x) => x.id === id);
    if (idx === -1) return [];
    const [removed] = data.sports.splice(idx, 1);
    saveData();
    return [{ name: removed.name, photo_id: removed.photo_id }];
  }
  if (q.startsWith("update sports set sort_order =") && q.includes("where id =")) {
    const [order, id] = v;
    const s = data.sports.find((x) => x.id === Number(id));
    if (s) s.sort_order = Number(order);
    saveData();
    return [];
  }

  // 6. gallery_photos
  if (q.includes("from gallery_photos") && q.includes("order by created_at desc, id desc")) {
    let list = data.gallery_photos
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime() || b.id - a.id);
    let limit: number | undefined;
    const limitMatch = q.match(/limit\s+(\$?(\d+))/i);
    if (limitMatch) {
      limit = limitMatch[1].startsWith("$")
        ? Number(v[Number(limitMatch[1].slice(1)) - 1])
        : Number(limitMatch[2]);
    }
    for (const item of v as any[]) {
      if (item && item.__fragment && item.text?.startsWith("limit")) {
        limit = Number(item.values?.[0]);
      }
    }
    if (limit && limit > 0) list = list.slice(0, limit);
    return list.map((p) => ({
      id: String(p.id),
      caption: p.caption,
      category: p.category,
      photo_url: p.photo_url,
    }));
  }
  if (q.startsWith("select id, caption, category, photo_url from gallery_photos where id =") ||
      q.startsWith("select id, caption, category, photo_url, photo_id from gallery_photos where id =")) {
    const p = data.gallery_photos.find((x) => x.id === Number(v[0]));
    return p
      ? [
          {
            id: String(p.id),
            caption: p.caption,
            category: p.category,
            photo_url: p.photo_url,
            photo_id: p.photo_id,
          },
        ]
      : [];
  }
  if (q.startsWith("insert into gallery_photos (caption, category, photo_url, photo_id)")) {
    const [caption, category, photo_url, photo_id] = v;
    const id = (data.gallery_photos.reduce((max, p) => Math.max(max, p.id), 0) || 0) + 1;
    data.gallery_photos.push({
      id,
      caption: caption ? String(caption) : null,
      category: String(category),
      photo_url: String(photo_url),
      photo_id: photo_id ? String(photo_id) : null,
      created_at: new Date().toISOString(),
    });
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("update gallery_photos set caption =") && q.includes("where id =")) {
    const [caption, category, id] = v;
    const p = data.gallery_photos.find((x) => x.id === Number(id));
    if (p) {
      p.caption = caption ? String(caption) : null;
      p.category = String(category);
    }
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("delete from gallery_photos where id =")) {
    const id = Number(v[0]);
    const idx = data.gallery_photos.findIndex((x) => x.id === id);
    if (idx === -1) return [];
    const [removed] = data.gallery_photos.splice(idx, 1);
    saveData();
    return [{ photo_id: removed.photo_id }];
  }

  // 7. news
  if (q.includes("from news where visible order by published desc, id desc limit 6")) {
    return data.news
      .filter((n) => n.visible)
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime() || b.id - a.id)
      .slice(0, 6)
      .map((n) => ({
        id: String(n.id),
        title: n.title,
        summary: n.summary,
        published: new Date(n.published),
      }));
  }
  if (q.includes("from news order by published desc, id desc")) {
    return data.news
      .slice()
      .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime() || b.id - a.id)
      .map((n) => ({
        id: String(n.id),
        title: n.title,
        summary: n.summary,
        published: new Date(n.published),
        visible: n.visible,
      }));
  }
  if (q.startsWith("select id, title, summary, published from news where id =")) {
    const n = data.news.find((x) => x.id === Number(v[0]));
    return n
      ? [
          {
            id: String(n.id),
            title: n.title,
            summary: n.summary,
            published: new Date(n.published),
          },
        ]
      : [];
  }
  if (q.startsWith("insert into news (title, summary, published)")) {
    const [title, summary, published] = v;
    const id = (data.news.reduce((max, n) => Math.max(max, n.id), 0) || 0) + 1;
    data.news.push({
      id,
      title: String(title),
      summary: String(summary),
      published: String(published || new Date().toISOString().slice(0, 10)),
      visible: true,
    });
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("update news set title =") && q.includes("where id =")) {
    const [title, summary, published, id] = v;
    const n = data.news.find((x) => x.id === Number(id));
    if (n) {
      n.title = String(title);
      n.summary = String(summary);
      n.published = String(published);
    }
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("update news set visible =") && q.includes("where id =")) {
    const [visible, id] = v;
    const n = data.news.find((x) => x.id === Number(id));
    if (n) n.visible = Boolean(visible);
    saveData();
    return n ? [{ title: n.title }] : [];
  }
  if (q.startsWith("delete from news where id =")) {
    const id = Number(v[0]);
    const idx = data.news.findIndex((x) => x.id === id);
    if (idx === -1) return [];
    const [removed] = data.news.splice(idx, 1);
    saveData();
    return [{ title: removed.title }];
  }

  // 8. inquiries
  if (q.includes("select count(*)::int as n from inquiries where ip_hash =")) {
    return [{ n: 0 }];
  }
  if (q.includes("select count(*)::int as n from inquiries where status = 'new'")) {
    return [{ n: data.inquiries.filter((i) => i.status === "new").length }];
  }
  if (q.includes("from inquiries") && q.includes("order by created_at desc")) {
    return data.inquiries
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime() || b.id - a.id)
      .map((i) => ({
        id: String(i.id),
        parent_name: i.parent_name,
        phone: i.phone,
        grade: i.grade,
        message: i.message,
        status: i.status,
        created_at: new Date(i.created_at),
      }));
  }
  if (q.startsWith("insert into inquiries (parent_name, phone, grade, message, ip_hash)")) {
    const [parent_name, phone, grade, message, ip_hash] = v;
    const id = (data.inquiries.reduce((max, i) => Math.max(max, i.id), 0) || 0) + 1;
    data.inquiries.push({
      id,
      parent_name: String(parent_name),
      phone: String(phone),
      grade: String(grade),
      message: String(message ?? ""),
      status: "new",
      ip_hash: String(ip_hash ?? "dev"),
      created_at: new Date().toISOString(),
    });
    saveData();
    return [{ id: String(id) }];
  }
  if (q.startsWith("update inquiries set status =") && q.includes("where id =")) {
    const [status, id] = v;
    const i = data.inquiries.find((x) => x.id === Number(id));
    if (i) i.status = String(status);
    saveData();
    return i ? [{ parent_name: i.parent_name }] : [];
  }
  if (q.startsWith("delete from inquiries where id =")) {
    const id = Number(v[0]);
    const idx = data.inquiries.findIndex((x) => x.id === id);
    if (idx === -1) return [];
    const [removed] = data.inquiries.splice(idx, 1);
    saveData();
    return [{ parent_name: removed.parent_name }];
  }

  // 9. admin_users
  if (q.startsWith("select id, username, display_name, role, session_version, active, password_hash from admin_users where lower(username) =")) {
    const username = String(v[0]).toLowerCase();
    const u = data.admin_users.find((x) => x.username.toLowerCase() === username);
    return u
      ? [
          {
            id: String(u.id),
            username: u.username,
            display_name: u.display_name,
            role: u.role,
            session_version: u.session_version,
            active: u.active,
            password_hash: u.password_hash,
          },
        ]
      : [];
  }
  if (q.startsWith("select id, username, display_name, role, session_version, active, password_hash from admin_users where id =")) {
    const u = data.admin_users.find((x) => x.id === Number(v[0]));
    return u
      ? [
          {
            id: String(u.id),
            username: u.username,
            display_name: u.display_name,
            role: u.role,
            session_version: u.session_version,
            active: u.active,
            password_hash: u.password_hash,
          },
        ]
      : [];
  }
  if (q.startsWith("select password_hash from admin_users where id =")) {
    const u = data.admin_users.find((x) => x.id === Number(v[0]));
    return u ? [{ password_hash: u.password_hash }] : [];
  }
  if (q.startsWith("select session_version from admin_users where id =")) {
    const u = data.admin_users.find((x) => x.id === Number(v[0]));
    return u ? [{ session_version: u.session_version }] : [];
  }
  if (q.startsWith("update admin_users set last_login_at = now() where id =")) {
    const u = data.admin_users.find((x) => x.id === Number(v[0]));
    if (u) u.last_login_at = new Date().toISOString();
    saveData();
    return [];
  }
  if (q.startsWith("update admin_users set password_hash =") && q.includes("where id =")) {
    const [hash, id] = v;
    const u = data.admin_users.find((x) => x.id === Number(id));
    if (u) {
      u.password_hash = String(hash);
      u.session_version = (u.session_version || 1) + 1;
    }
    saveData();
    return u ? [{ session_version: u.session_version, username: u.username }] : [];
  }
  if (q.startsWith("update admin_users set active =") && q.includes("where id =")) {
    const [active, id] = v;
    const u = data.admin_users.find((x) => x.id === Number(id));
    if (u) {
      u.active = Boolean(active);
      u.session_version = (u.session_version || 1) + 1;
    }
    saveData();
    return u ? [{ username: u.username }] : [];
  }
  if (q.startsWith("insert into admin_users (username, display_name, password_hash, role)")) {
    const [username, display_name, password_hash, role] = v;
    const existing = data.admin_users.find((x) => x.username.toLowerCase() === String(username).toLowerCase());
    if (existing) {
      const err: any = new Error("Unique constraint violation");
      err.code = "23505";
      throw err;
    }
    const id = (data.admin_users.reduce((max, u) => Math.max(max, u.id), 0) || 0) + 1;
    data.admin_users.push({
      id,
      username: String(username),
      display_name: String(display_name),
      password_hash: String(password_hash),
      role: role === "owner" ? "owner" : "editor",
      active: true,
      session_version: 1,
      last_login_at: null,
      created_at: new Date().toISOString(),
    });
    saveData();
    return [{ id: String(id) }];
  }
  if (q.includes("from admin_users order by")) {
    return data.admin_users
      .slice()
      .sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0) || a.display_name.localeCompare(b.display_name))
      .map((u) => ({
        id: String(u.id),
        username: u.username,
        display_name: u.display_name,
        role: u.role,
        active: u.active,
        last_login_at: u.last_login_at ? new Date(u.last_login_at) : null,
        created_at: new Date(u.created_at),
      }));
  }

  // 10. login_attempts
  if (q.startsWith("delete from login_attempts")) {
    return [];
  }
  if (q.includes("from login_attempts where at > now() - interval '15 minutes'")) {
    return [{ u: 0, ip: 0 }];
  }
  if (q.startsWith("insert into login_attempts")) {
    return [];
  }

  // 11. activity_log
  if (q.includes("from activity_log order by at desc limit 12")) {
    return data.activity_log.slice(0, 12).map((l) => ({
      who: l.who,
      action: l.action,
      at: new Date(l.at),
    }));
  }
  if (q.startsWith("insert into activity_log (user_id, who, action)")) {
    const [user_id, who, action] = v;
    const id = (data.activity_log.reduce((max, a) => Math.max(max, a.id), 0) || 0) + 1;
    data.activity_log.unshift({
      id,
      user_id: user_id ? Number(user_id) : null,
      who: String(who),
      action: String(action),
      at: new Date().toISOString(),
    });
    saveData();
    return [{ id: String(id) }];
  }

  // 12. Dashboard summary counts
  if (q.includes("(select count(*) from batches)::int as batches")) {
    return [
      {
        batches: data.batches.length,
        students: data.batch_students.length,
        featured: data.highlights.filter((h) => h.active).length,
        sports: data.sports.length,
        photos: data.gallery_photos.length,
        news: data.news.filter((n) => n.visible).length,
        newInquiries: data.inquiries.filter((i) => i.status === "new").length,
      },
    ];
  }

  // Fallback
  console.warn("[Local JSON DB] Unhandled query:", q);
  return [];
}

export function getJsonDb() {
  const sql = function (strings: any, ...values: any[]) {
    if (Array.isArray(strings) && !("raw" in strings)) {
      return { __array: strings };
    }
    if (strings && "raw" in strings) {
      const trimmed = (strings[0] ?? "").trim();
      if (trimmed === "" && values.length === 0) {
        return { __fragment: true, text: "", values: [] };
      }
      if (trimmed.startsWith("limit")) {
        return { __fragment: true, text: trimmed, values };
      }
    }
    return Promise.resolve(executeJsonQuery(strings, values));
  };
  sql.json = (val: any) => ({ __json: val });
  sql.unsafe = () => Promise.resolve([]);
  sql.end = () => Promise.resolve();
  return sql;
}
