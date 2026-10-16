import { SCHOOL_NAME, getWhatsAppUrl, type Settings } from "@/lib/site";
import Logo from "./Logo";

export default function Footer({ settings }: { settings: Settings }) {
  const waUrl = getWhatsAppUrl(settings.phone2 || settings.phone1);
  return (
    <footer id="contact" className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <Logo size={38} />
              <div>
                <div className="name" style={{ fontSize: 18, lineHeight: 1.15 }}>{SCHOOL_NAME}</div>
                <div style={{ fontSize: 12, color: "#fbd38d", fontWeight: 600 }}>
                  Janakpurdham, Nepal
                </div>
              </div>
            </div>
            <p style={{ maxWidth: 320, fontSize: 14, color: "var(--c-on-dark-muted)" }}>
              Providing academic foundation, character development, and discipline from Nursery to Grade 10 since 2049 B.S.
            </p>
            {settings.facebookUrl && (
              <p style={{ marginTop: 14 }}>
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#fbd38d", fontWeight: 600, fontSize: 14 }}
                >
                  Official Facebook page
                </a>
              </p>
            )}
          </div>

          <div>
            <h4>Campus address</h4>
            <p>{settings.address}</p>
            <p style={{ marginTop: 4, fontSize: 13, color: "var(--c-on-dark-muted)" }}>
              Near Murli Chowk, Ward 4, Janakpurdham
            </p>
          </div>

          <div>
            <h4>Admissions office</h4>
            <p>
              <a href={`tel:${settings.phone1}`}>{settings.phone1}</a>
              {settings.phone2 && (
                <>
                  {" / "}
                  <a href={`tel:${settings.phone2}`}>{settings.phone2}</a>
                </>
              )}
              {settings.phone2 && (
                <>
                  <br />
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#25d366", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4 }}
                  >
                    💬 WhatsApp: {settings.phone2}
                  </a>
                </>
              )}
              <br />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
            <p style={{ marginTop: 4, fontSize: 13, color: "var(--c-on-dark-muted)" }}>
              Office hours: Sunday to Friday, 9:00 AM – 3:30 PM
            </p>
          </div>

          <div>
            <h4>Sports centre</h4>
            <p>{settings.sportsCentre}</p>
            <p style={{ marginTop: 16 }}>
              <a
                href="/admin"
                style={{
                  display: "inline-block",
                  fontSize: 12,
                  color: "var(--c-on-dark-muted)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  padding: "5px 12px",
                  borderRadius: "4px",
                }}
              >
                Staff admin portal
              </a>
            </p>
          </div>
        </div>

        <div className="copy">
          © {new Date().getFullYear()} {SCHOOL_NAME}. All rights reserved. Janakpurdham, Dhanusha District, Nepal.
        </div>
      </div>
    </footer>
  );
}
