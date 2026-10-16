import { SITE_URL } from "@/lib/site";

/** Tells staff exactly where a change appears on the public website, with a link to that spot. */
export default function Where({ place, href }: { place: string; href: string }) {
  return (
    <div className="a-where">
      <span>
        Where this shows: <b>{place}</b>
      </span>
      <a className="a-btn small ghost" href={`${SITE_URL}${href}`} target="_blank" rel="noopener noreferrer">
        Open on website ↗
      </a>
    </div>
  );
}
