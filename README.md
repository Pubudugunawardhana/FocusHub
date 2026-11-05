<div align="center">

# 🎯 FocusHub

**Organize what you learn. Share what you find.**

YouTube learning collections and shareable link bundles in one Next.js app. No separate backend.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io)
[![Neon](https://img.shields.io/badge/Postgres-Neon-00E599?logo=postgresql&logoColor=white)](https://neon.com)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-7C3AED)](https://authjs.dev)

[Features](#-features) · [Quick start](#-quick-start) · [Environment](#-environment-variables) · [Deploy](#-deploy-to-vercel) · [Structure](#-project-structure)

</div>

---

## ✨ Features

### 📺 YouTube Collections
- **Smart collections**: icons and categories are filled in automatically from video titles
- **Add by URL**: video details come from the YouTube Data API v3, with an oEmbed fallback
- **Track progress**: each video is To Watch, Watching or Watched, and every collection shows a progress bar
- **Study mode**: embedded player, drag-and-drop ordering, and Smart Notes with clickable timestamps

### 🔗 Link Bundles
- **One link, many URLs**: share a whole set behind a short `/b/<id>` link
- **Rich previews**: titles, descriptions and favicons are fetched automatically
- **Privacy controls**: optional password (bcrypt) and self-destruct after 1h, 24h or 7d, both enforced on the server
- **Sharing tools**: QR code, copy as text, CSV/TXT export, visited tracking and a view counter

### 👤 Account
- Email and password login with Auth.js v5 (httpOnly cookie session)
- Password reset with a 6-digit email code
- Profile name and picture, password change, and full account deletion
- One dashboard (Overview, Collections, Bundles, Favorites) with **light and dark themes**

---

## 🧱 Tech stack

| Layer | Tools |
|---|---|
| **Framework** | Next.js 16 (App Router, Route Handlers), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, lucide-react icons, next-themes |
| **Data** | Prisma ORM on [Neon](https://neon.com) serverless Postgres |
| **Auth** | Auth.js (NextAuth v5) Credentials provider, bcryptjs |
| **UI extras** | @dnd-kit (drag and drop), qrcode.react, react-youtube |
| **Services** | Nodemailer (SMTP), YouTube Data API, cheerio (link metadata) |

---

## 🚀 Quick start

> **Requirements:** Node.js 20+ and a [Neon](https://neon.com) account (the free plan works).

```bash
# 1. Install dependencies
npm install

# 2. Create .env, then add AUTH_SECRET (and SMTP if needed)
cp .env.example .env

# 3. Pull the Neon connection strings into .env
npx neon@latest env pull

# 4. Create the database tables
npx prisma migrate deploy

# 5. Start the dev server
npm run dev
```

Open **http://localhost:3000** and create an account.

> [!TIP]
> Generate `AUTH_SECRET` with `npx auth secret` or `openssl rand -base64 32`.

> [!NOTE]
> To experiment without touching production data, create a Neon development branch with `neon checkout dev --create`, then run `neon env pull` again.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Generate the Prisma client, apply migrations, then build |
| `npm run build:local` | Build without running migrations |
| `npm start` | Serve the production build |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript checks |
| `npm run db:migrate` | Create a new migration (`prisma migrate dev`) |
| `npm run db:studio` | Browse the data in Prisma Studio |

---

## 🔐 Environment variables

| Name | Required | Description |
|---|:---:|---|
| `DATABASE_URL` | ✅ | Neon **pooled** connection (`-pooler` host), used by the app |
| `DATABASE_URL_UNPOOLED` | ✅ | Neon **direct** connection, used by `prisma migrate` |
| `AUTH_SECRET` | ✅ | Signs session cookies and bundle unlock cookies |
| `YOUTUBE_API_KEY` | ➖ | Optional. Without it, video duration shows as `00:00` |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASS` | 📧 | Needed for password reset emails (Mailtrap, Gmail app password, Resend, ...) |
| `FROM_EMAIL` `FROM_NAME` | 📧 | Sender shown on password reset emails |

`neon deploy` and `neon env pull` write the database variables for the project linked in `neon.ts` / `.neon`.

---

## ▲ Deploy to Vercel

1. Push the repo to GitHub.
2. In Vercel, choose **Add New → Project**, import the repo and keep the **Next.js** preset.
3. Add the [environment variables](#-environment-variables) under **Settings → Environment Variables**.
4. Click **Deploy**.

> [!IMPORTANT]
> `npm run build` runs `prisma generate && prisma migrate deploy && next build`, so every deploy creates or updates the database tables.

---

## 📁 Project structure

```text
FocusHub/
├── prisma/
│   ├── schema.prisma          # User, Collection, Video, Bundle, Link
│   └── migrations/
├── src/
│   ├── auth.ts                # Auth.js setup (Credentials + Prisma)
│   ├── auth.config.ts
│   ├── proxy.ts               # Route protection (Next 16 "middleware")
│   ├── lib/                   # prisma, bundles, youtube, metadata (SSRF-guarded), email, api client
│   ├── components/            # Shared UI
│   └── app/
│       ├── api/               # REST route handlers
│       ├── dashboard/         # Overview, collections, bundles, favorites
│       ├── collections/[id]/  # Collection page (player + notes)
│       ├── edit/[id]/         # Bundle manager
│       └── b/[id]/            # Public share page
└── neon.ts                    # Neon project config
```

---

<div align="center">

Made with ❤️ by **Pubudu Gunawardhana**

</div>
