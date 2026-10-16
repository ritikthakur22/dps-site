"use client";

import { FormEvent, useState } from "react";
import { GRADES, getWhatsAppUrl } from "@/lib/site";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "ok" } | { kind: "error"; message: string };

export default function Admissions({ phone1, phone2, email }: { phone1: string; phone2: string; email: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const waUrl = getWhatsAppUrl(
    phone2 || phone1,
    "Namaste Daffodils School, I am interested in admission for my child. Please share admission details and fee structure."
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: data.get("parentName"),
          phone: data.get("phone"),
          grade: data.get("grade"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        setStatus({ kind: "error", message: body?.error ?? "Something went wrong. Please call the school." });
        return;
      }
      form.reset();
      setStatus({ kind: "ok" });
    } catch {
      setStatus({ kind: "error", message: "Network problem. Please try again or call the school." });
    }
  }

  return (
    <section id="admissions" className="section admissions">
      <div className="wrap">
        <div className="adm-copy">
          <div className="eyebrow light">Admissions open 2082/83</div>
          <h2 className="h2">Visit us once. Then decide your child's future.</h2>
          <p className="lead">
            Send an inquiry or call our administration office directly. We will schedule a personalized campus tour,
            introduce our teaching faculty, and explain the admission guidelines and curriculum.
          </p>

          <ol className="steps">
            <li>
              <b>Step 1 · </b>Send the quick inquiry form or message us on WhatsApp
            </li>
            <li>
              <b>Step 2 · </b>Our admissions counselor confirms your personalized campus visit
            </li>
            <li>
              <b>Step 3 · </b>Tour the classrooms, science labs, library & sports complex
            </li>
            <li>
              <b>Step 4 · </b>Submit documents, complete verification & secure enrollment
            </li>
          </ol>

          <div className="contact-lines">
            <div className="contact-line-item">
              <span className="contact-label">Telephone:</span>
              <a href={`tel:${phone1}`} className="contact-val">
                {phone1}
              </a>
              {phone2 && (
                <>
                  <span className="sep">/</span>
                  <a href={`tel:${phone2}`} className="contact-val">
                    {phone2}
                  </a>
                </>
              )}
            </div>

            {phone2 && (
              <div className="contact-line-item" style={{ marginTop: 8 }}>
                <span className="contact-label">WhatsApp:</span>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-val"
                  style={{ color: "#25d366", fontWeight: 700 }}
                >
                  💬 Chat on WhatsApp ({phone2})
                </a>
              </div>
            )}

            <div className="contact-line-item" style={{ marginTop: 8 }}>
              <span className="contact-label">Email:</span>
              <a href={`mailto:${email}`} className="contact-val">
                {email}
              </a>
            </div>

            <div className="office-hours">
              Office Hours: Sunday – Friday, 9:00 AM – 3:30 PM (Saturday Closed)
            </div>
          </div>
        </div>

        <div className="adm-form-wrap">
          <form className="form" onSubmit={onSubmit}>
            <div className="form-head">
              <h3>Admission Inquiry</h3>
              <p>Fill in your details below and our team will get in touch promptly.</p>
            </div>

            <div className="field">
              <label htmlFor="parentName">Parent or guardian name *</label>
              <input
                id="parentName"
                name="parentName"
                type="text"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                placeholder="e.g. Ramesh Kumar Jha"
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Mobile phone number *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                inputMode="tel"
                pattern="[0-9+\-\s()]{7,18}"
                autoComplete="tel"
                placeholder="e.g. 9844039877 or 041-425701"
              />
              <span className="field-hint">Nepali mobile (98XXXXXXXX) or landline with area code.</span>
            </div>

            <div className="field">
              <label htmlFor="grade">Class applying for *</label>
              <select id="grade" name="grade" required defaultValue="Nursery">
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="message">Questions or notes (optional)</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                maxLength={500}
                placeholder="e.g. Interested in school transport, hostel, or fee structure..."
              />
            </div>

            <div className="hp" aria-hidden="true">
              <label htmlFor="website">Leave this empty</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <button type="submit" className="btn btn-yellow form-submit-btn" disabled={status.kind === "sending"}>
              {status.kind === "sending" ? <span>Submitting inquiry...</span> : <span>Submit admission inquiry</span>}
            </button>

            <div className="form-trust-points">
              <span>✓ Free campus tour</span>
              <span>✓ Meet subject teachers</span>
              <span>✓ 24-hr response</span>
            </div>

            <div aria-live="polite">
              {status.kind === "ok" && (
                <div className="notice ok">
                  <strong>Inquiry submitted successfully!</strong>
                  <p>Our admissions desk will contact you shortly on the provided phone number.</p>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp notice-wa-btn"
                  >
                    💬 Message us now on WhatsApp for instant confirmation
                  </a>
                </div>
              )}
              {status.kind === "error" && <p className="notice err">{status.message}</p>}
            </div>

            <div className="form-divider">
              <span>OR</span>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp-outline fast-wa-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>Instant WhatsApp Inquiry ({phone2 || phone1})</span>
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}
