# SkillLink — Student Skill Exchange Platform

> **The campus network for trading what you know for what you want to learn.**

SkillLink is a college-first peer skill exchange workspace that connects students to collaborate, teach, and learn from each other. It replaces opaque rating systems and generic social feeds with a transparent, reciprocal exchange model grounded in contribution evidence.

---

## ✨ Features

### 🧭 Dashboard & Navigation
- **Overview** — At-a-glance metrics: active exchanges, reputation score, match count
- **Discover Matches** — Reciprocal and direct match recommendations with AI-generated explanations
- **My Requests** — Natural-language request submission parsed into structured skill chips
- **Active Exchanges** — Full collaboration lifecycle: propose → accept → schedule → complete
- **Exchange History** — Transparent record of skills contributed and learned (not a star rating)
- **Profile & Contribution Record** — Portfolio built from evidence of real collaboration

### 🤝 Intelligent Matchmaking
- **Reciprocal matching** — Finds bidirectional matches where each student offers what the other needs
- **Direct matching** — Surfaces peers for one-way knowledge transfer or mentorship
- **Match explanations** — Personalized human-readable rationale for every recommendation
- **Filters** — Narrow by department, proficiency tier, exchange modality, and availability

### 📝 Exchange Lifecycle
- Peer-to-peer collaboration proposals with tailored agendas
- Session scheduling with external meeting link support (Google Meet, Zoom, Teams, etc.)
- Exchange status tracking: `pending → accepted → scheduled → in_progress → completed`
- Mutual confirmation and formal completion with structured feedback

### ⭐ Reputation & Feedback
- Three-pillar peer evaluation: **Helpfulness**, **Reliability**, **Communication**
- Dynamic Contribution Record updated after every completed exchange
- Written testimonials and verified skill badges
- Full exchange history including incomplete or rescheduled sessions

### 🏫 Campus-Focused
- Institutional email-based student verification
- Department and course-linked discovery circles
- Campus Commons noticeboard for hackathon team formation and peer-led workshops

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, TailwindCSS v4, Wouter (routing) |
| **UI Components** | Radix UI primitives, shadcn/ui, Lucide icons |
| **Animations** | Framer Motion |
| **Data Fetching** | tRPC v11, TanStack Query v5 |
| **Backend** | Express 4, Node.js |
| **Database ORM** | Drizzle ORM (MySQL / local JSON fallback) |
| **Auth** | JWT sessions via `jose`, cookie-based session management |
| **Forms** | React Hook Form + Zod validation |
| **Build** | Vite 7, esbuild, pnpm workspaces |
| **Testing** | Vitest |

---

## 🗄 Database Schema

Defined with **Drizzle ORM** targeting **MySQL**. Falls back automatically to a local `.data/db.json` file when no `DATABASE_URL` is set — making local development zero-config.

| Table | Purpose |
|---|---|
| `users` | Auth accounts with role (`user` / `admin`) |
| `student_profiles` | Academic metadata, contact handles, visibility controls |
| `skills` | Categorized skill catalog |
| `user_skills` | Skill-to-user join with proficiency levels |
| `learning_goals` | Wishlist of skills a student wants to acquire |
| `skill_requests` | Free-form & structured collaboration requests |
| `matches` | Matchmaking graph with type (`Direct` / `Reciprocal`) and compatibility score |
| `exchanges` | Full state-machine lifecycle for peer collaboration sessions |
| `peer_feedback` | Multi-dimensional ratings per completed exchange |
| `contribution_records` | Aggregated reputation cache per student |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) ≥ 18
- [pnpm](https://pnpm.io/) ≥ 10 (`npm install -g pnpm`)

### Installation

```bash
git clone https://github.com/omatole071211/decentra-skilllink.git
cd decentra-skilllink
pnpm install
```

### Environment Setup

Copy the example environment file and configure as needed:

```bash
cp .env.example .env
```

```env
# Optional: connect to a MySQL database
# DATABASE_URL=mysql://root:password@localhost:3306/skilllink

# JWT session signing secret
SESSION_SECRET=your-secret-here

# Server port (default: 3000)
PORT=3000
```

> If `DATABASE_URL` is not set, the app automatically uses a persistent local store at `.data/db.json`. No database required for local development.

### Development

```bash
pnpm dev          # Start dev server (default port 3000)
```

### Build & Production

```bash
pnpm build        # Build client (Vite) + server (esbuild) → dist/
pnpm start        # Serve production build
```

### Database

```bash
pnpm db:migrate   # Apply checked-in Drizzle migrations
pnpm db:push      # Generate and apply new schema changes
```

### Other Commands

```bash
pnpm check        # TypeScript type checking
pnpm test         # Run Vitest test suite
pnpm format       # Run Prettier
```

---

## 📁 Project Structure

```
decentra-skilllink/
├── client/
│   ├── src/
│   │   ├── App.tsx                  # Route map and global providers
│   │   ├── index.css                # Design tokens & editorial layout utilities
│   │   ├── pages/
│   │   │   ├── Home.tsx             # Main SkillLink dashboard (all views)
│   │   │   └── Auth.tsx             # Sign in / Sign up pages
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx  # Responsive sidebar shell
│   │   │   ├── AIChatBox.tsx        # AI-assisted request parsing
│   │   │   ├── ScoreArc.tsx         # Animated reputation arc
│   │   │   ├── TiltCard.tsx         # 3D hover-tilt match cards
│   │   │   ├── CountUp.tsx          # Animated metric counter
│   │   │   └── ScrollReveal.tsx     # Scroll-triggered fade-in
│   │   └── lib/
│   │       └── matchmakingEngine.ts # Client-side matching logic
├── server/
│   ├── _core/                       # tRPC server, auth middleware, SDK
│   ├── routers.ts                   # API: auth.signup / login / logout / getProfile
│   ├── db.ts                        # Drizzle + local JSON fallback data layer
│   ├── auth.ts                      # Password hashing (PBKDF2)
│   └── storage.ts                   # S3-compatible file storage
├── drizzle/
│   ├── schema.ts                    # Full database schema (all 10 tables)
│   ├── relations.ts                 # Drizzle relational query config
│   └── migrations/                  # SQL migration files
├── shared/
│   └── const.ts                     # Shared constants (cookie name, token TTLs)
├── .env.example                     # Environment variable template
├── vite.config.ts                   # Vite + Tailwind build config
├── drizzle.config.ts                # Drizzle Kit configuration
└── plan.md                          # Design system & architecture decisions
```

---

## 🎨 Design System

SkillLink uses an **Editorial Campus Commons** design language — warm, print-inspired, and built for practical collaboration density.

| Token | Value | Usage |
|---|---|---|
| Warm paper | `#F6F3EC` | Canvas background |
| Deep ink | `#17221E` | Navigation, key actions |
| Signal lime | `#C6F36B` | Reciprocity arrows, completion indicators |
| Muted blue | `#BFD7EE` | Learning requests, secondary info |

**Typography:** `DM Sans` for body copy · `Space Grotesk` for headings and metrics

**Animations:** 180 ms ease-out lifts on hover, count-up metrics on mount, scroll-triggered reveals — no looping decorations.

---

## 🗺 Application Routes

| Route | View |
|---|---|
| `/` or `/dashboard` | Overview dashboard |
| `/matches` | Discover matches |
| `/requests` | My skill requests |
| `/exchanges` | Active exchanges |
| `/history` | Exchange history |
| `/profile` | Profile & contribution record |
| `/login` or `/auth` | Sign in |
| `/signup` | Sign up |

---

## 🔮 Roadmap

- [ ] LLM-powered skill extraction from natural-language requests
- [ ] Vector-based semantic skill similarity matching
- [ ] Real-time in-app notifications (collaboration proposals, session reminders)
- [ ] OAuth2 integration (institutional SSO)
- [ ] Campus noticeboard for hackathon team formation
- [ ] Multi-campus tenant support with department scoping
