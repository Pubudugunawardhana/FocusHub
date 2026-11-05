# FocusHub

One Next.js app that merges **FocusTube (YouTube Collection Manager)** and **URL Bundle Creator**. There is no separate backend: every API is a Next.js Route Handler, so the whole thing deploys to Vercel as a single project.

## Features

**YouTube Collections**
- Collections with icons and categories, filled in automatically from video titles
- Add a video by URL (YouTube Data API v3 with an oEmbed fallback)
- Status per video (To Watch / Watching / Watched) and progress for each collection
- Drag-and-drop reordering, an embedded player, and Smart Notes with clickable timestamps

**Link Bundles**
- Share many links behind one short link (`/b/<id>`). Title, description and favicon are fetched automatically.
- Optional password (bcrypt) and self-destruct after 1h, 24h or 7d. Both are enforced on the server.
- Drag-and-drop links, "visited" progress and a view counter
- Share modal with copy link, QR code, copy as text, and CSV/TXT export

**Account**
- Email and password login (NextAuth v5, httpOnly cookie session)
- Forgot password with a 6-digit email code
- Profile name and picture, password change, account deletion (removes all of the user's data)
- One dashboard (Overview, YouTube Collections, Link Bundles, Favorites) with light and dark themes

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma + PostgreSQL · NextAuth v5 · @dnd-kit

## Local development

```bash
npm install
cp .env.example .env              # then fill in the values
npx prisma migrate dev            # creates the tables
npm run dev                       # http://localhost:3000
```

Generate `AUTH_SECRET` with `npx auth secret` or `openssl rand -base64 32`.

## Environment variables

| Name | Required | Notes |
|---|---|---|
| `DATABASE_URL` | yes | Postgres connection string (pooled is fine) |
| `DIRECT_URL` | yes | Direct (non-pooled) connection, used by `prisma migrate`. Can be the same as `DATABASE_URL`. |
| `AUTH_SECRET` | yes | Signs session cookies and bundle unlock cookies |
| `YOUTUBE_API_KEY` | no | Without it, video duration shows as `00:00` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`, `FROM_NAME` | for password reset | Any SMTP provider (Mailtrap, Gmail app password, Resend, ...) |

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Create a Postgres database. Neon, Vercel Postgres (Storage tab) and Supabase all work. Copy its pooled and direct connection strings.
3. On Vercel, choose **Add New → Project**, import the repo, and keep the **Next.js** preset.
4. Add the environment variables above under **Settings → Environment Variables**.
5. Deploy. The build command (`npm run build`) runs `prisma generate && prisma migrate deploy && next build`, so the database tables are created or updated on every deploy.

## Project layout

```
prisma/schema.prisma        User, Collection, Video, Bundle, Link
src/auth.ts, auth.config.ts NextAuth (Credentials + Prisma)
src/proxy.ts                Route protection (Next 16 "middleware")
src/lib/                    prisma, bundles service, youtube, metadata (SSRF-guarded), email, api client
src/app/api/...             REST route handlers
src/app/dashboard/...       Overview, collections, bundles, favorites
src/app/collections/[id]    YouTube collection page (player + notes)
src/app/edit/[id]           Bundle manager
src/app/b/[id]              Public share page
```

Made by Pubudu Gunawardhana.
