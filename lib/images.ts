/** Size presets. Cloudinary resizes and converts on the fly (free tier), so pages stay light. */
const PRESETS = {
  student: "c_fill,g_face,w_480,h_600,f_auto,q_auto",
  thumb: "c_fill,g_face,w_160,h_160,f_auto,q_auto",
  card: "c_fill,w_640,h_480,f_auto,q_auto",
  large: "c_limit,w_1600,h_1600,f_auto,q_auto",
  about: "c_fill,w_1200,h_750,f_auto,q_auto",
} as const;

export type ImagePreset = keyof typeof PRESETS;

export function imageUrl(url: string | null | undefined, preset: ImagePreset): string | null {
  if (!url) return null;
  const marker = "/image/upload/";
  if (url.startsWith("https://res.cloudinary.com/") && url.includes(marker)) {
    return url.replace(marker, `${marker}${PRESETS[preset]}/`);
  }
  return url;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?").slice(0, 2);
  return letters.toUpperCase();
}
