"use client";

import { usePathname } from "next/navigation";

type Item = { href: string; label: string; badge?: number };

export default function AdminNav({ items }: { items: Item[] }) {
  // On the admin subdomain the address bar has no /admin prefix; compare without it.
  const raw = usePathname() || "/";
  const path = raw.startsWith("/admin") ? raw : `/admin${raw === "/" ? "" : raw}`;
  return (
    <nav className="a-nav" aria-label="Admin">
      {items.map((it) => {
        const active = it.href === "/admin" ? path === "/admin" : path === it.href || path.startsWith(`${it.href}/`);
        return (
          <a key={it.href} href={it.href} aria-current={active ? "page" : undefined}>
            <span>{it.label}</span>
            {it.badge ? <span className="a-count">{it.badge}</span> : null}
          </a>
        );
      })}
    </nav>
  );
}
