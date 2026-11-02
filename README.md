# Susi Air

A pilot dashboard with three screens (Sign in, Home, Schedule). The backend is a NestJS API in `nest/`, and the frontend is a Nuxt 3 app in `nuxt/`.

- Frontend: https://susi-nu.vercel.app
- Backend: https://susiair-api-kornelius.onrender.com
- Demo account: `johndoe` / `susiairtest`

The backend runs on a free plan that sleeps when idle, so the first request can take up to a minute. Opening `/health` on the backend URL wakes it up.

## How to set up and run

You need Node.js 24.21 or newer.

### Backend (`nest/`)

```bash
cd nest
npm install
cp .env.example .env
npm run start:dev
```

The API runs on `http://localhost:3001`. To run the tests, use `npm test`. For a production build, use `npm run build` and then `npm run start:prod`.

### Frontend (`nuxt/`)

```bash
cd nuxt
npm install
cp .env.example .env
npm run dev
```

The app runs on `http://localhost:3000`. Start the backend first, because every screen loads its data from the API.

## Required environment variables

### Backend (`nest/.env`)

| Variable | Required | Example | Purpose |
|---|---|---|---|
| `APP_TODAY` | yes | `2026-05-15` | The fixed "today" used by all logic |
| `JWT_SECRET` | yes | any string of 16+ characters | Used to sign login tokens |
| `JWT_EXPIRES_IN` | no | `1h` | Token lifetime |
| `CORS_ORIGIN` | no | `http://localhost:3000` | Allowed frontend origins, separated by commas |
| `PORT` | no | `3001` | Port to listen on |

### Frontend (`nuxt/.env`)

| Variable | Required | Example | Purpose |
|---|---|---|---|
| `NUXT_PUBLIC_API_BASE` | yes | `http://localhost:3001` | Backend URL. It is read at build time, so set it before deploying |

## Main choices and the reasons behind them

- Dates before the first record count as 0. The brief leaves this open. A window that reaches back before 27 Dec 2024 simply has no hours there, which matches how days without flights are already treated, so there is no special case. With today set to 15 May 2026 this never shows on screen, but unit tests cover it.
- The brief leaves this open too. The data runs to 31 May, so I show it as a projection (dashed line, tagged "Projected") instead of treating the future as 0, which would throw away data that was provided on purpose. The brief also says some 1w or 1m periods go above the red line. In the 1m chart, 8 May already does (102.2 hours against a limit of 100) with either reading. The 1w chart, though, only crosses its limit when the future data is used (18 to 21 May, peaking at 44.7 hours against a limit of 40), and so does 21 May in the 1m chart (100.9 hours).
- Backend structure. The brief asks for separate modules, controllers, services and DTOs, input validation, a global exception filter and an auth guard. On top of that, the guard is global and a route opts out with @Public(), so a new endpoint is protected by default. Validation also rejects unknown fields. The JSON files are loaded into memory at startup, which the brief allows, so there is no database to set up.
- Calculations are plain functions. The brief does not ask for this. The logic lives in *.logic.ts files and the Nest services only call them. This keeps the logic easy to test (49 unit tests) and avoids a problem with loading the ESM Nest packages in Jest.
- The frontend is a single page app (ssr: false). The brief only says Nuxt 3. The token lives in the browser and all data comes from the API, so server rendering would add risk with no benefit.
- The chart is hand-written SVG. The brief says what the chart should show (limit line, centered today marker, Y max per range) but not how to build it. I also needed a dashed projected part and red points over the limit, and drawing it directly from the API data was easier than configuring a chart library.
- One Pinia store per area and one API helper. The brief requires Pinia, but not how to split it. Each part of the home page loads and fails on its own. The helper adds the token, gives every error the same shape, retries when the free server is waking up, and sends the user to the login page when the token expires.
- The API sends the derived values. The brief says the document badge state comes from the API and gives the rule for the tick or remaining duties. I also return daysRemaining, is_complete and count_remaining, so the frontend only chooses colors and labels and does not repeat the rules.

## What I would change with more time

- Mark a rolling window as incomplete when it reaches back before the first record, so the screen can warn that the real hours may be higher. For now those dates count as 0, which under-reports hours if the pilot flew before the data begins.
- Add OpenAPI documentation generated from the DTOs.
- Use an httpOnly cookie session with refresh tokens, and rate limit the login endpoint. Right now the token is in a cookie that scripts can read, which is fine for a demo but not for production.
- Move the data into a real database and support more than one pilot.
- Build the Logbook and the duty detail screens, which are placeholders for now.
- Host the logo and avatar myself. The avatar is currently generated by an external service because the data has none.
- Use a paid backend instance so it never sleeps.