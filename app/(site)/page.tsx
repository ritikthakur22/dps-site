import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { About, Academics, Facilities, Hero, News } from "@/components/site/Sections";
import Batches from "@/components/site/Batches";
import Showcase from "@/components/site/Showcase";
import Gallery from "@/components/site/Gallery";
import Admissions from "@/components/site/Admissions";
import { getBatches, getGallery, getHighlights, getNews, getSettings, getSports } from "@/lib/content";
import { BATCH_TOP_COUNT, SCHOOL_NAME, SITE_URL } from "@/lib/site";

// Static page. Saving in the admin panel refreshes it at once; this is only a safety net.
export const revalidate = 3600;

const GALLERY_PREVIEW = 8;

export default async function HomePage() {
  const [settings, batches, highlights, sports, gallery, news] = await Promise.all([
    getSettings(),
    getBatches(BATCH_TOP_COUNT),
    getHighlights(),
    getSports(),
    getGallery(GALLERY_PREVIEW + 1),
    getNews(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    name: SCHOOL_NAME,
    url: SITE_URL,
    telephone: [settings.phone1, settings.phone2].filter(Boolean),
    email: settings.email,
    address: { "@type": "PostalAddress", streetAddress: settings.address, addressLocality: "Janakpurdham", addressCountry: "NP" },
    ...(settings.facebookUrl ? { sameAs: [settings.facebookUrl] } : {}),
  };

  return (
    <>
      <Header phone1={settings.phone1} phone2={settings.phone2} email={settings.email} address={settings.address} />
      <main>
        <Hero settings={settings} batchCount={batches.length} />
        <About settings={settings} />
        <Academics />
        <Facilities sports={sports} sportsCentre={settings.sportsCentre} />
        <Batches batches={batches} />
        <Showcase items={highlights} />
        {gallery.length > 0 && (
          <section id="gallery" className="section soft">
            <div className="wrap">
              <div className="eyebrow">Gallery</div>
              <h2 className="h2">Life at Daffodils.</h2>
              <Gallery photos={gallery.slice(0, GALLERY_PREVIEW)} />
              {gallery.length > GALLERY_PREVIEW && (
                <div className="more-row">
                  <a href="/gallery" className="btn btn-ink">
                    View all photos
                  </a>
                </div>
              )}
            </div>
          </section>
        )}
        <News items={news} />
        <Admissions phone1={settings.phone1} phone2={settings.phone2} email={settings.email} />
      </main>
      <Footer settings={settings} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
