import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getVisibleBatchYears } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const years = await getVisibleBatchYears().catch(() => [] as number[]);
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/gallery`, changeFrequency: "weekly", priority: 0.6 },
    ...years.map((y) => ({ url: `${SITE_URL}/batches/${y}`, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
