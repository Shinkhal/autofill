# Autofill — web frontend

A Next.js App Router workspace for candidate profiles, private resumes, job applications, reusable answers and ATS reviews.

## Running locally

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Use Node.js 24 for running the included TypeScript API client tests. Run the [Autofill backend](https://github.com/Shinkhal/Autofill-backend) separately. Its `CLIENT_URL` must match the web origin (default `http://localhost:3000`), and Google OAuth must be configured on the backend. Set `NEXT_PUBLIC_API_URL` to the backend origin (default `http://localhost:5000`). For deployed environments use same-site HTTPS when possible so browsers can accept the refresh cookie.

## Backend compatibility

Compared with backend main at `09eb2a4` (P0 + P1 merged).

| Feature | Contract |
| --- | --- |
| Sign-in | `/auth/google`, `/auth-success#code=...`, `POST /auth/exchange` |
| Session | `POST /auth/refresh`, `GET /auth/me`, `POST /auth/logout`, session list/revoke and logout-all |
| Profile | `GET/PUT /api/user/me`, `GET /api/user/me/completion` |
| Resume library | `/api/resume` upload/list, detail, download, parse, apply, rename and delete |
| Job discovery | `GET /api/listjobs` paginated search |
| Application tracker | `/api/jobs` CRUD, `/api/jobs/stats` |
| Answer bank | `/api/answers` CRUD and paginated list |
| ATS review | `/api/ats/analyze`, `/api/ats/history` list/detail/delete |

Google OAuth is the supported authentication method; legacy Firebase email/password and Apple login are removed. Access tokens stay in memory; the backend owns refresh cookies. Resume parsing and ATS analysis require explicit consent; applying parsed data requires review.

## Verification

```bash
npm test
npm run typecheck
npm run build
```

Live OAuth, MongoDB, Gemini and cookie behavior require a configured running backend. Extension-side mapping and submission are outside this web frontend.
