/** Fixed facts and lists. Anything staff may change lives in the database (see lib/content.ts). */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SCHOOL_NAME = "Daffodils Public School";
export const ESTABLISHED = "2049 B.S.";

export const GRADES = [
  "Nursery",
  "LKG",
  "UKG",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
] as const;

export const FACILITIES = [
  "Certified teachers",
  "Air-conditioned classrooms",
  "Computer lab",
  "Wi-Fi and a computer in each class",
  "Science laboratory",
  "Audio and video room",
  "Big, green playground",
  "Transportation",
  "Medical and first aid",
  "Reliable caretakers",
  "Reliable electricity",
] as const;

export const HIGHLIGHT_CATEGORIES = ["Academics", "Sports", "Arts", "Beyond school"] as const;
export const GALLERY_CATEGORIES = ["Campus", "Events", "Sports", "Celebrations", "Classroom"] as const;
export const INQUIRY_STATUSES = ["new", "contacted", "visited", "admitted", "closed"] as const;

export const MAX_HIGHLIGHTS = 10;
export const BATCH_TOP_COUNT = 15;

export type Settings = {
  heroTitle: string;
  heroText: string;
  admissionText: string;
  aboutText: string;
  aboutPhotoUrl: string;
  aboutPhotoId: string;
  studentCount: string;
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  sportsCentre: string;
  facebookUrl: string;
};

export const DEFAULT_SETTINGS: Settings = {
  heroTitle: "Visit us once. Then decide your child's future.",
  heroText:
    "Quality education, well qualified teachers, great facilities and strong discipline, in the heart of Janakpurdham.",
  admissionText: "Admissions open",
  aboutText:
    "Daffodils Public School has served Janakpurdham since 2049 B.S. We are known for quality education, a well qualified teaching team, good infrastructure and, above all, discipline.",
  aboutPhotoUrl: "/campus.jpg",
  aboutPhotoId: "",
  studentCount: "1,000+",
  phone1: "041-425701",
  phone2: "9844039877",
  email: "dpsjnk4@gmail.com",
  address: "Murli Chowk, Janakpurdham-4, Nepal",
  sportsCentre: "Bindhi, Janakpurdham-23",
  facebookUrl: "https://www.facebook.com/p/Daffodils-Public-School-100083228476122/",
};

export const DEFAULT_SPORTS = ["Table tennis", "Basketball", "Football", "Boating", "Billiards", "Volleyball"];

export function getWhatsAppUrl(phone: string, text?: string): string {
  const digits = phone.replace(/\D/g, "");
  const formatted =
    digits.length === 10 && (digits.startsWith("98") || digits.startsWith("97")) ? `977${digits}` : digits;
  const message = text || "Namaste, I would like to inquire about admissions at Daffodils Public School.";
  return `https://wa.me/${formatted}?text=${encodeURIComponent(message)}`;
}
