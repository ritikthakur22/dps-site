import type { RankedStudent } from "@/lib/content";
import { imageUrl, initials } from "@/lib/images";

export default function GradCard({ s }: { s: RankedStudent }) {
  const src = imageUrl(s.photoUrl, "student");
  const isRank1 = s.rank === 1;
  const isRank2 = s.rank === 2;
  const isRank3 = s.rank === 3;
  const isTop3 = isRank1 || isRank2 || isRank3;

  // Compute SEE Grade label
  const gradeLabel =
    s.gpa >= 3.6
      ? "Distinction (A+)"
      : s.gpa >= 3.2
      ? "First Division (A)"
      : s.gpa >= 2.8
      ? "Very Good (B+)"
      : "Passed";

  const rankBadgeClass = isRank1
    ? "rank-ribbon rank-gold"
    : isRank2
    ? "rank-ribbon rank-silver"
    : isRank3
    ? "rank-ribbon rank-bronze"
    : "rank-ribbon rank-slate";

  const rankLabel = isRank1
    ? "★ Rank 1"
    : isRank2
    ? "★ Rank 2"
    : isRank3
    ? "★ Rank 3"
    : `Rank ${s.rank}`;

  return (
    <article className={`grad-card ${isRank1 ? "top-rank" : isTop3 ? "podium-rank" : ""}`}>
      <div className="grad-header">
        <span className={rankBadgeClass} aria-label={`Rank ${s.rank} in Class 10 SEE Examination`}>
          {rankLabel}
        </span>
        <span className="gpa-pill" title={`SEE Board GPA: ${s.gpa.toFixed(2)}`}>
          <b>{s.gpa.toFixed(2)}</b> GPA
        </span>
      </div>

      <div className="grad-photo-wrap">
        {src ? (
          <img src={src} alt={s.name} width={480} height={600} loading="lazy" decoding="async" />
        ) : (
          <div className="grad-avatar" aria-hidden="true">
            {initials(s.name)}
          </div>
        )}
      </div>

      <div className="grad-details">
        <h3 className="grad-name">{s.name}</h3>
        <div className="grad-division">{gradeLabel}</div>

        {s.nowDoing ? (
          <div className="grad-pursuit">
            <span className="pursuit-label">🎓 Current Pursuit</span>
            <p className="pursuit-text">{s.nowDoing}</p>
          </div>
        ) : (
          <div className="grad-pursuit empty">
            <span className="pursuit-label">SEE Scholar</span>
            <p className="pursuit-text">Daffodils Public School Alum</p>
          </div>
        )}
      </div>
    </article>
  );
}
