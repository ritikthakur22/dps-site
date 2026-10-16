"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import MobileActionBar from "./MobileActionBar";
import { getWhatsAppUrl } from "@/lib/site";

const NAV = [
  { label: "About", href: "/#about" },
  { label: "Academics", href: "/#academics" },
  { label: "Facilities", href: "/#facilities" },
  { label: "Class 10", href: "/#batches" },
  { label: "Students", href: "/#showcase" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Admissions", href: "/#admissions" },
];

export default function Header({
  phone1,
  phone2,
  email,
  address,
}: {
  phone1: string;
  phone2: string;
  email: string;
  address: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 30);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waUrl = getWhatsAppUrl(
    phone2 || phone1,
    "Namaste Daffodils Public School, I would like to inquire about admissions."
  );

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <div className="topbar-address">{address}</div>
          <div className="topbar-contacts">
            <span>
              Office: <a href={`tel:${phone1}`}>{phone1}</a>
            </span>
            {phone2 && (
              <>
                <span className="topbar-sep">·</span>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="topbar-wa"
                  title="Direct WhatsApp Inquiry"
                >
                  <span className="wa-dot" aria-hidden="true" />
                  WhatsApp: {phone2}
                </a>
              </>
            )}
            <span className="topbar-sep">·</span>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      </div>
      <header className={`header ${scrolled ? "scrolled" : ""}`}>
        <div className="wrap">
          <a href="/" className="brand" aria-label="Daffodils Public School home">
            <Logo size={44} />
            <span className="brand-name">
              Daffodils
              <span className="brand-sub">Public School</span>
            </span>
          </a>
          <div className="header-right-group">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="header-wa-icon"
              aria-label="Direct WhatsApp message"
              title="Message on WhatsApp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-controls="site-nav"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
          <nav id="site-nav" aria-label="Main navigation" className={open ? "nav open" : "nav"}>
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <div className="nav-mobile-footer">
              <a href={`tel:${phone1}`} className="btn btn-navy" style={{ width: "100%", justifyContent: "center" }}>
                📞 Call Office: {phone1}
              </a>
              {phone2 && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  💬 Chat on WhatsApp
                </a>
              )}
            </div>
          </nav>
          <a href="/#admissions" className="btn btn-yellow header-cta">
            Book a campus visit
          </a>
        </div>
      </header>
      <MobileActionBar phone1={phone1} phone2={phone2} />
    </>
  );
}
