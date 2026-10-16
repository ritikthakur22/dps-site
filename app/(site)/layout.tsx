import type { Metadata } from "next";
import "./site.css";
import { SCHOOL_NAME, SITE_URL } from "@/lib/site";

const description =
  "Daffodils Public School, Murli Chowk, Janakpurdham. Quality education from Nursery to Grade 10 with qualified teachers, modern facilities, a sports centre and strong discipline.";

export const metadata: Metadata = {
  title: {
    default: `${SCHOOL_NAME} | Janakpurdham, Nepal`,
    template: `%s | ${SCHOOL_NAME}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SCHOOL_NAME,
    title: `${SCHOOL_NAME} | Janakpurdham, Nepal`,
    description,
    locale: "en_NP",
    url: SITE_URL,
    images: [{ url: "/campus.jpg", width: 1170, height: 654, alt: "Daffodils Public School building" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
