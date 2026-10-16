import type { Metadata } from "next";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Gallery from "@/components/site/Gallery";
import { getGallery, getSettings } from "@/lib/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Photo gallery",
  description: "Photos of campus life, events, sports and celebrations at Daffodils Public School, Janakpurdham.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const [settings, photos] = await Promise.all([getSettings(), getGallery()]);

  return (
    <>
      <Header phone1={settings.phone1} phone2={settings.phone2} email={settings.email} address={settings.address} />
      <main>
        <section className="page-head">
          <div className="wrap">
            <a href="/#gallery" className="back">
              ← Back to home
            </a>
            <h1>Photo gallery</h1>
            <p>Campus, events, sports and celebrations at Daffodils.</p>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 24 }}>
          <div className="wrap">
            {photos.length === 0 ? <p className="empty">Photos are coming soon.</p> : <Gallery photos={photos} filter />}
          </div>
        </section>
      </main>
      <Footer settings={settings} />
    </>
  );
}
