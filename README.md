# 🏫 Daffodils Public School Website & Admin Panel

<div align="center">
  <p><strong>A modern, full-stack Next.js web application and staff administrative portal for Daffodils Public School.</strong></p>

  <p>
    <a href="https://ritikthakur22.github.io/dps-site/"><img src="https://img.shields.io/badge/GitHub_Pages-Live_Demo-success?style=flat-square&logo=github" alt="GitHub Pages" /></a>
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Neon-Postgres-00E599?style=flat-square&logo=postgresql&logoColor=black" alt="Neon Postgres" />
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-Proprietary%20%2F%20Demonstration-red?style=flat-square" alt="License: Proprietary / Demonstration" /></a>
    <a href="https://www.ritikthakur.com.np"><img src="https://img.shields.io/badge/Author-Ritik%20Thakur-blue?style=flat-square" alt="Author: Ritik Thakur" /></a>
  </p>
</div>

---

🌐 **Live Demo (GitHub Pages):** [https://ritikthakur22.github.io/dps-site/](https://ritikthakur22.github.io/dps-site/)

---

One Next.js 15 app, two addresses:

| Address | Who | What |
| --- | --- | --- |
| `daffodils.com` | Everyone | Public promotion site. No login. Static pages, very fast. |
| `admin.daffodils.com` | School staff (login) | Simple panel to update the site. On the main domain, `/admin` returns 404. |

Everything uses free plans: Neon Postgres, Cloudinary, Cloudflare DNS, and a free host (see Deploy).

## What staff can change (no coding)

Every admin screen shows **"Where this shows"** with an **Open on website** button, so staff see exactly what they are changing. Every save goes live within a few seconds.

| Admin menu | On the website |
| --- | --- |
| Website text | Headline, text under it, "Admissions open 2083" label, student count, About text and photo, phones, email, address, sports centre address, Facebook link |
| Class 10 batches | Home page: year tabs, top 15 by SEE GPA with rank. `/batches/2081`: the full batch. Each student: name, GPA, photo, optional "Now: MBBS at …" (hidden when empty). Batches can be hidden while being typed in. |
| Featured students | Home page "Our students": up to 10 (limit enforced in the database), with order, show/hide |
| Sports | Sports centre cards with a photo each, with order |
| Gallery | Upload up to 20 photos at once. Newest 8 on the home page, all on `/gallery` |
| News | Home page "News and notices" (newest 6 shown; section hidden when empty) |
| Inquiries | Admission form submissions, with Call button and status (New, Called, Visited, Admitted, Closed) |
| Accounts (owners only) | Add staff, set new passwords, turn accounts off |
| My password | Change own password |

The dashboard shows counts and a "Recent changes" log of who changed what.

Fixed in code (rarely change): Academics section, Facilities list, admission form fields, colours and layout.

## Run locally

```bash
npm install
cp .env.example .env.local          # fill DATABASE_URL and AUTH_SECRET; add STORAGE=local to test photos without Cloudinary
npm run db:migrate                  # creates tables (safe to run again)
npm run admin:create -- ritik "Ritik Thakur"   # first owner account; asks for a password
npm run dev
```

Public site: http://localhost:3000. Admin: http://localhost:3000/admin (leave `ADMIN_HOST` empty locally).

## Deploy (free)

1. **Database:** create a free Neon project. Copy the *pooled* connection string into `DATABASE_URL`, then run `npm run db:migrate` and `npm run admin:create` once from your computer.
2. **Photos:** create a free Cloudinary account and set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Photos are shrunk in the browser before upload and resized by Cloudinary when shown.
3. **Host:** Netlify's free plan allows commercial use and supports Next.js (including instant updates after saving). Vercel's free Hobby plan does *not* allow commercial use, which includes paid developers, so use Vercel Pro or Netlify for a paid client project. Check both providers' current terms before choosing.
   Set the env vars from `.env.example`. Add both domains (`daffodils.com` and `admin.daffodils.com`) to the same site. Set `ADMIN_HOST=admin.daffodils.com` and `NEXT_PUBLIC_SITE_URL=https://daffodils.com`.
4. **Cloudflare DNS:** point both names at the host. Turn on "Always use HTTPS". Optional: a rate-limit rule on `/api/inquiry`.
5. Your Render cron ping is not needed for this site. Pages are static and the admin talks to Neon directly.

## Security

- Admin only on the admin subdomain; `noindex` and `no-store` headers on admin pages.
- Passwords hashed with bcrypt. Signed, httpOnly session cookie (7 days). Every page and every save re-checks the account in the database, so turning off an account or changing a password signs out old sessions at once.
- Sign-in lockout: 5 wrong passwords per username (or 20 per network) in 15 minutes.
- Two roles: owner (accounts) and editor (content and inquiries).
- All input validated on the server (zod + database checks). Photos must really be JPG, PNG or WebP (checked by file content), max 5 MB.
- Public inquiry form: size limit, validation, hidden spam trap, max 3 per network per 10 minutes. IP addresses are stored only as a salted hash.
- Security headers and Content Security Policy in `next.config.mjs` (inline scripts allowed because Next.js needs them).

## Tested

`npm run build` passes with no type errors. A browser test (Playwright, 46 checks, all passing) covered:

- sign-in, wrong password, lockout
- adding a batch, adding 17 students (with a 6.7 MB photo that is shrunk before upload), shared ranks for equal GPA, edit and delete with confirmation, hiding and showing a batch
- featured students, sports photos and order, uploading 3 gallery photos at once, news, website text
- non-image files and bad GPA or email are rejected
- every change appearing on the public site at once
- inquiry from the public form reaching the admin, with status change
- editor role limits, and a turned-off account being signed out
- no sideways scrolling on a phone and no browser script errors

## Later (easy to add)

- Excel import for a whole batch (SheetJS, free).
- Move photos to Cloudflare R2: add a branch in `lib/storage.ts`; nothing else changes.
- Replace `components/site/Logo.tsx` with the real logo.

## Project map

```
app/(site)/            public pages: home, /batches/[year], /gallery
app/admin/             admin panel (login + (panel)/* screens), _actions = server actions
app/api/inquiry        public admission form endpoint
components/site, components/admin
lib/                   db, content queries, auth, sessions, photo storage, settings defaults
middleware.ts          admin subdomain routing and login guard
db/schema.sql          tables (run with npm run db:migrate)
scripts/               migrate, create-admin
```

## 📄 License & Terms of Use

This project and source code are developed and owned exclusively by **Ritik Thakur** and provided under the [Daffodils Public School Software License & Demonstration Agreement](LICENSE).

- **Demonstration & Evaluation:** Permitted for prospective clients, institutions, and evaluators strictly to view and assess the demonstration deployment and codebase.
- **Strict Prohibition:** Unauthorized copying, selling, reselling, sublicensing, commercial deployment, or redistribution to third parties without prior written authorization from the author is strictly prohibited.

For commercial licensing, client deployments, or authorization inquiries, contact [Ritik Thakur](https://www.ritikthakur.com.np).

Developed by [Ritik Thakur](https://www.ritikthakur.com.np).

