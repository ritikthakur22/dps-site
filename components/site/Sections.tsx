import { ESTABLISHED, FACILITIES, getWhatsAppUrl, type Settings } from "@/lib/site";
import type { NewsItem, Sport } from "@/lib/content";
import { imageUrl } from "@/lib/images";

export function Hero({ settings, batchCount }: { settings: Settings; batchCount: number }) {
  const waUrl = getWhatsAppUrl(
    settings.phone2 || settings.phone1,
    "Namaste Daffodils School, I would like to inquire about admissions."
  );

  return (
    <>
      <section id="top" className="hero">
        <div className="wrap">
          <div className="hero-copy">
            <div className="hero-tag">Nursery through Grade 10 · Janakpurdham, Nepal</div>
            <h1>{settings.heroTitle}</h1>
            <p className="hero-lead">{settings.heroText}</p>
            <div className="hero-actions">
              <a href="#admissions" className="btn btn-yellow">
                Book a campus visit
              </a>
              <a href={batchCount > 0 ? "#batches" : "#showcase"} className="btn btn-ghost">
                View Class 10 SEE results
              </a>
            </div>
            {settings.phone2 && (
              <div className="hero-subactions">
                <span className="hero-subactions-label">Direct inquiry:</span>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-wa-pill"
                >
                  <span className="wa-dot" aria-hidden="true" />
                  <span>Chat on WhatsApp ({settings.phone2})</span>
                </a>
              </div>
            )}
          </div>

          <aside className="hero-card" aria-label="Admissions information">
            <div className="eyebrow light">Admissions open 2082/83</div>
            <h2>Visit the school campus</h2>
            <p>Tour our classrooms, meet teachers, and review the academic curriculum.</p>
            <div className="hero-grid">
              <div>
                <small>Early childhood</small>
                Nursery, LKG, UKG
              </div>
              <div>
                <small>Basic & secondary</small>
                Grades 1 to 10
              </div>
            </div>
            <div className="hero-card-actions">
              <a href={`tel:${settings.phone1}`} className="btn hero-call-btn">
                Call office: {settings.phone1}
              </a>
              {settings.phone2 && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp-card"
                >
                  💬 WhatsApp: {settings.phone2}
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="stats" aria-label="School facts">
        <div className="wrap">
          <div className="stat">
            <b>{ESTABLISHED}</b>
            <span>Established in Janakpurdham (30+ Years)</span>
          </div>
          <div className="stat">
            <b>{settings.studentCount}</b>
            <span>Enrolled scholars (Nursery–10)</span>
          </div>
          <div className="stat">
            <b>100%</b>
            <span>SEE Board examination pass rate</span>
          </div>
          <div className="stat">
            <b>{batchCount > 0 ? `${batchCount} batches` : "SEE board"}</b>
            <span>{batchCount > 0 ? "Class 10 honor records published" : "Focused board preparation"}</span>
          </div>
        </div>
      </section>
    </>
  );
}

export function About({ settings }: { settings: Settings }) {
  const photo = imageUrl(settings.aboutPhotoUrl, "about");
  return (
    <section id="about" className="section about">
      <div className="wrap">
        <div className="about-copy">
          <div className="eyebrow">About the school</div>
          <h2 className="h2">A disciplined, nurturing place to learn and grow.</h2>
          
          <div className="about-motto-badge">
            <span className="motto-icon" aria-hidden="true">🏛️</span>
            <span>Knowledge with Character · Discipline with Empathy</span>
          </div>

          <p className="lead" style={{ whiteSpace: "pre-line" }}>
            {settings.aboutText}
          </p>

          <blockquote className="principal-quote">
            <p>
              "Our mission extends beyond board examination scores. We cultivate personal integrity, moral clarity,
              and intellectual curiosity so every child steps out into society as a confident, responsible leader."
            </p>
            <cite>— Leadership Team, Daffodils Public School</cite>
          </blockquote>

          <div className="points">
            <div className="point">
              <div className="point-icon" aria-hidden="true">✓</div>
              <div>
                <b>Qualified faculty.</b> Experienced, certified subject teachers across all primary and secondary grades.
              </div>
            </div>
            <div className="point">
              <div className="point-icon" aria-hidden="true">✓</div>
              <div>
                <b>Moral foundation and discipline.</b> Fostering focus, respect, and personal responsibility as the basis of academic success.
              </div>
            </div>
            <div className="point">
              <div className="point-icon" aria-hidden="true">✓</div>
              <div>
                <b>Student care and safe transit.</b> Dedicated caretakers, medical first aid on site, and reliable school transportation across Janakpurdham.
              </div>
            </div>
          </div>
        </div>

        <div className="about-photo">
          {photo && (
            <div className="about-photo-frame">
              <img
                src={photo}
                alt="Daffodils Public School campus building in Janakpurdham"
                width={1200}
                height={750}
                loading="lazy"
                decoding="async"
              />
              <div className="about-photo-badge">
                <b>Murli Chowk Campus</b>
                <span>Janakpurdham-4, Nepal · Est. 2049 B.S.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const ACADEMIC_STAGES = [
  {
    num: "01",
    phase: "Early Childhood",
    grades: "Nursery · LKG · UKG",
    lead: "A gentle, play-way introduction fostering curiosity, foundational numbers, and fluent spoken phonics.",
    highlights: ["Montessori activity-based play", "Spoken English & phonics routine", "Dedicated care attendants (Didis)"],
    featured: false,
  },
  {
    num: "02",
    phase: "Primary Foundation",
    grades: "Grades 1 to 5",
    lead: "Building rock-solid bilingual literacy, mathematical intuition, and moral discipline.",
    highlights: ["Bilingual instruction (English & Nepali)", "Mathematics, General Science & Social Studies", "Guided reading & neat handwriting"],
    featured: false,
  },
  {
    num: "03",
    phase: "Lower Secondary",
    grades: "Grades 6 to 8",
    lead: "Cultivating practical scientific inquiry, computer programming literacy, and analytical debate.",
    highlights: ["Hands-on science laboratory sessions", "Computer laboratory & coding foundations", "Inter-school quizzes & co-curricular sports"],
    featured: false,
  },
  {
    num: "04",
    phase: "Secondary Board",
    grades: "Grades 9 & 10 (SEE)",
    lead: "Structured, disciplined preparation for the National Secondary Education Examination (SEE).",
    highlights: ["Weekly full-syllabus mock examinations", "Individual faculty academic mentoring", "Consistent 100% board distinction track record"],
    featured: true,
  },
];

export function Academics() {
  return (
    <section id="academics" className="section soft">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Academic Journey</div>
          <h2 className="h2">From foundational early learning to the SEE board examination.</h2>
          <p className="lead" style={{ marginTop: 10 }}>
            Our structured 4-stage academic roadmap ensures every child transitions smoothly from early curiosity
            to national board excellence.
          </p>
        </div>

        <div className="academic-journey-grid">
          {ACADEMIC_STAGES.map((stage) => (
            <article
              key={stage.num}
              className={`academic-card ${stage.featured ? "featured-card" : ""}`}
            >
              <div className="academic-card-top">
                <span className="stage-num">{stage.num}</span>
                <span className="stage-grades">{stage.grades}</span>
              </div>
              <h3 className="academic-phase">{stage.phase}</h3>
              <p className="academic-lead">{stage.lead}</p>
              <ul className="academic-highlights">
                {stage.highlights.map((h) => (
                  <li key={h}>
                    <span className="check" aria-hidden="true">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              {stage.featured && (
                <div className="see-badge-tag">
                  ★ National SEE Board Focus
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FacilityIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("teacher")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    );
  }
  if (lower.includes("condition")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (lower.includes("computer")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    );
  }
  if (lower.includes("wi-fi")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    );
  }
  if (lower.includes("science")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 3h6M10 9l-4 7a2 2 0 0 0 1.7 3h8.6a2 2 0 0 0 1.7-3l-4-7V3h-4v6z" />
      </svg>
    );
  }
  if (lower.includes("audio") || lower.includes("video")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="15" rx="2" />
        <polygon points="10 8 16 11.5 10 15 10 8" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (lower.includes("playground")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <path d="M12 6a6 6 0 0 1 6 6 6 6 0 0 1-6 6" />
      </svg>
    );
  }
  if (lower.includes("transport")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <circle cx="7.5" cy="18.5" r="2.5" />
        <circle cx="16.5" cy="18.5" r="2.5" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  if (lower.includes("medical")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    );
  }
  if (lower.includes("caretaker")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

export function Facilities({ sports, sportsCentre }: { sports: Sport[]; sportsCentre: string }) {
  return (
    <section id="facilities" className="section">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">Campus Facilities</div>
          <h2 className="h2">Infrastructure supporting focused learning and wellbeing.</h2>
          <p className="lead" style={{ marginTop: 10 }}>
            Every classroom and lab at Daffodils is tailored to foster an orderly, productive atmosphere.
          </p>
        </div>

        <div className="facility-cards-grid">
          {FACILITIES.map((f) => (
            <div key={f} className="facility-box">
              <div className="facility-icon-wrap" aria-hidden="true">
                <FacilityIcon name={f} />
              </div>
              <div className="facility-info">
                <b>{f}</b>
                <span>Modern, safe & fully maintained</span>
              </div>
            </div>
          ))}
        </div>

        {sports.length > 0 && (
          <div className="sports-showcase-panel" id="sports">
            <div className="sports-panel-head">
              <div>
                <div className="eyebrow light">Dedicated Sports Centre</div>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>
                  Official Sports Complex at {sportsCentre}
                </h3>
                <p style={{ color: "var(--c-on-dark-muted)", fontSize: 15, marginTop: 4 }}>
                  Comprehensive athletic training grounds for physical fitness, discipline, and competitive district tournaments.
                </p>
              </div>
              <div className="sports-badge-tag">
                ⚽ Multi-Sport Athletic Facility
              </div>
            </div>

            <div className="sport-grid">
              {sports.map((s) => {
                const src = imageUrl(s.photoUrl, "card");
                return (
                  <div key={s.id} className="sport-item">
                    {src ? (
                      <img src={src} alt={s.name} width={640} height={427} loading="lazy" decoding="async" />
                    ) : (
                      <div className="sport-fill" aria-hidden="true" />
                    )}
                    <span className="sport-name">{s.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function News({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;
  return (
    <section id="news" className="section">
      <div className="wrap">
        <div className="section-head">
          <div className="eyebrow">News and notices</div>
          <h2 className="h2">Recent notices from the school office.</h2>
        </div>
        <div className="cards">
          {items.map((n) => (
            <article key={n.id} className="card news-card">
              <div className="date">
                {new Date(`${n.published}T00:00:00Z`).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </div>
              <h3>{n.title}</h3>
              <p>{n.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
