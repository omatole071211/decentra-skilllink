# SkillLink

**Trade what you know. Learn what you need.** SkillLink is a campus skill-exchange concept that helps students find peers for reciprocal learning, project support, and collaboration.

This repository contains a runnable, seeded demonstration of the product. It combines a React dashboard, an Express/tRPC API, a rule-based matchmaking engine, and a Drizzle/MySQL schema. Most dashboard content is sample data held in the client or in-memory API; it is not yet a complete persistent multi-user service.

## Evaluator Quick Start

### Requirements

- Node.js 22 LTS
- pnpm 10 (the repository pins `pnpm@10.18.0` through Corepack)

### Run locally

From the project root:

```powershell
corepack enable
corepack prepare pnpm@10.18.0 --activate
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The local demonstration does not require database credentials or an OAuth account. If port 3000 is already occupied, start the server on another port in PowerShell:

```powershell
$env:PORT = "3001"
pnpm dev
```

### Suggested evaluation walkthrough

1. Start on **Overview** to see the sample contribution metrics and recommended reciprocal match.
2. Open **Discover matches** to compare direct and reciprocal suggestions, inspect match rationale, and try the filters.
3. Use **My requests** and **New request** to explore the request flow and local skill extraction.
4. Open **Active exchanges** to review the sample exchange lifecycle, then **Exchange history** and **Profile & record** for completion and reputation views.
5. Visit **Campus network** for course circles, the campus noticeboard, and institution directory.

All dashboard sections are available from the sidebar. They can also be opened directly at `/matches`, `/requests`, `/exchanges`, `/history`, `/campus`, and `/profile`.

## Product Features

- **Skill profiles and goals:** Sample student profiles, skill inventory, proficiency levels, learning goals, and visibility settings.
- **Match discovery:** A local matchmaking engine ranks direct and reciprocal matches and supports department, proficiency, availability, and modality filters.
- **Explainable recommendations:** Match cards show the skills exchanged and a readable rationale, with icebreakers available in the detail view.
- **Request workflow:** Create a sample request and extract skill keywords locally from its text. This is a lightweight taxonomy/keyword demo, not a call to a hosted LLM.
- **Exchange and trust flows:** Demonstration views for proposals, scheduling, completion, peer feedback, and contribution history.
- **Campus ecosystem:** Sample departments, learning circles, opportunities, and campus directory data.
- **Typed API:** Express health endpoint and modular tRPC routers for matches, campus, notifications, exchanges, feedback, and reputation.
- **Relational schema:** Drizzle models and migrations for users, profiles, skills, requests, matches, exchanges, feedback, and contribution records.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Express + Vite development server (`PORT` defaults to `3000`). |
| `pnpm check` | Run the TypeScript compiler without emitting files. |
| `pnpm test` | Run the Vitest test suite. |
| `pnpm build` | Build the web client and production server bundle. |
| `pnpm start` | Serve the production build (`pnpm build` must run first). |
| `pnpm db:migrate` | Apply the checked-in Drizzle migrations. |
| `pnpm db:push` | Generate and apply schema changes. |

Run the quality checks before submitting:

```powershell
pnpm check
pnpm test
pnpm build
```

The health endpoint is available at `GET /api/health` and returns `{"status":"ok"}` when the server is ready.

## Optional Database Configuration

The seeded demo can run without a database. Database migration commands require a reachable MySQL-compatible database and `DATABASE_URL`. Put the connection string in a local `.env` file (do not commit credentials):

```dotenv
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DATABASE
```

Then run `pnpm db:migrate`. The current dashboard and sample API responses are not yet wired to persist every interaction to these tables.

Platform OAuth and platform API features also need their corresponding server environment values. The app can be evaluated in preview mode without them; the sign-in control reports that platform login is unavailable when it is not configured.

## Production Build and Docker

Build and run the production server locally:

```powershell
pnpm build
pnpm start
```

The server listens on port `3000` by default and serves the built client. A Docker image can be built from the included `Dockerfile`:

```powershell
docker build -t skilllink .
docker run --rm -p 3000:3000 skilllink
```

## Project Structure

```text
client/src/pages/Home.tsx       Dashboard and product sections
client/src/lib/matchmakingEngine.ts  Match scoring and explanations
server/routers.ts               Express-mounted tRPC API
server/_core/index.ts           HTTP server, health endpoint, and Vite setup
drizzle/schema.ts               Drizzle/MySQL data models
drizzle/                         SQL migrations and snapshots
```

## API Overview

The tRPC API is mounted at `/api/trpc`:

| Router | Current demo operations |
| --- | --- |
| `match` | Recommendations and match explanations |
| `campus` | Campus circles and noticeboard directory |
| `notifications` | Inbox and mark-as-read mutation |
| `exchanges` | Sample exchange list and completion mutation |
| `feedback` | Recent feedback signals |
| `reputation` | Contribution summary and milestones |

## Current Demo Boundaries

- Sample people, activity, and campus directory content are fictional demonstration data.
- The request parser uses local keyword matching; it does not require an external AI key.
- Some interface actions update local component state or in-memory API data and reset when the app/server restarts.
- Database tables and migration tooling are present, but full persistence, campus identity verification, and production OAuth require additional configuration and integration.
