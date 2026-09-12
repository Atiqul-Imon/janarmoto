# জানার মতো (janarmoto.com)

Bangla editorial **frontend** for [janarmoto.com](https://janarmoto.com). The Laravel API lives in a **separate** folder: `../janarmoto-api`.

## Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4, React Compiler
- Hind Siliguri + Noto Serif Bengali
- Laravel API (`NEXT_PUBLIC_API_URL`) + mock content fallback

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL
- `NEXT_PUBLIC_API_URL` — `http://localhost:8000/api` when Laravel is running

Backend setup is in `../janarmoto-api/README.md`.

## Vercel

Set these environment variables on the project:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL (`https://janarmoto.com` or the Vercel URL)
- `NEXT_PUBLIC_API_URL` — public Laravel API, e.g. `https://api.janarmoto.com/api`

Do not point Vercel at `localhost`. If the API URL is empty, the site builds with mock articles.

On Laravel, set `FRONTEND_URL` to the live site origin and `APP_URL` to the public API origin.
