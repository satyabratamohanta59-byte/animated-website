# FocusOS — Animated Website

A premium animated web experience built with Next.js 16, Framer Motion, GSAP, and Three.js. Features a cinematic coffee brand landing page at the root, and a full productivity app (focus timer, dashboard, AI coach, gamification) behind authentication.

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion · GSAP · Three.js / React Three Fiber |
| Auth | Clerk |
| Database | Supabase (PostgreSQL + RLS) |
| State | Zustand · TanStack Query |
| Rich Text | Tiptap |
| Analytics | PostHog |

---

## Prerequisites

Make sure you have the following installed before starting:

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9+ (comes with Node.js)
- A terminal (PowerShell, Command Prompt, or any Unix shell)

Check your versions:

```bash
node -v
npm -v
```

---

## Quick Start — View the Animated Landing Page

The animated coffee landing page works **without any accounts or API keys**. Just follow these steps:

### Step 1 — Clone the repository

```bash
git clone https://github.com/satyabratamohanta59-byte/animated-website.git
```

### Step 2 — Navigate into the project folder

```bash
cd animated-website/focusos
```

### Step 3 — Install dependencies

```bash
npm install
```

This may take a minute. It installs all animation libraries, UI components, and Next.js.

### Step 4 — Create the environment file

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# Mac / Linux
cp .env.example .env.local
```

> If there is no `.env.example`, create a new file named `.env.local` in the `focusos/` folder. Leave it empty for now — the landing page works without any keys.

### Step 5 — Start the development server

```bash
npm run dev
```

You should see output like:

```
▲ Next.js 16.2.9
- Local:   http://localhost:3000
```

### Step 6 — Open the website

Open your browser and go to:

```
http://localhost:3000
```

You will see the **animated coffee brand landing page** — a cinematic multi-stage scroll experience with particle effects, smooth transitions, and motion-driven storytelling.

---

## Exploring the Full App (Optional)

The dashboard, focus timer, AI coach, and gamification system require Clerk (auth) and Supabase (database). Follow these steps to unlock the full experience.

### 1. Set up Clerk

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. From the Clerk dashboard, copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (pick any region and password)
3. From **Project Settings → API**, copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run the database migrations — go to **SQL Editor** in Supabase and paste and run each file in order from `focusos/supabase/migrations/`:
   - `001_initial_schema.sql`
   - `002_indexes.sql`
   - `003_rls_policies.sql`
   - `004_functions.sql`
   - `005_clerk_integration.sql`

### 3. Fill in your `.env.local`

Open `focusos/.env.local` and add:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# OpenAI (optional — needed for AI Coach feature)
OPENAI_API_KEY=sk-...
```

### 4. Restart the dev server

```bash
# Stop with Ctrl+C, then:
npm run dev
```

Now visit `http://localhost:3000` and sign up to access the full app at `/app/dashboard`.

---

## App Routes

| Route | What you see |
|---|---|
| `/` | Animated coffee landing page |
| `/sign-in` | Login page (Clerk) |
| `/sign-up` | Register page (Clerk) |
| `/onboarding` | First-time setup flow |
| `/app/dashboard` | Main dashboard with stats & XP |
| `/app/focus` | Focus / Pomodoro timer |
| `/app/goals` | Goal tracking |
| `/app/notes` | Rich text notes (Tiptap editor) |
| `/app/analytics` | Activity heatmap & insights |
| `/app/achievements` | Gamification & badges |
| `/app/coach` | AI productivity coach |
| `/app/settings` | Profile & preferences |

---

## Project Structure

```
animated-website/
└── focusos/                  # Main Next.js application
    ├── src/
    │   ├── app/              # App Router pages & layouts
    │   │   ├── (auth)/       # Sign-in / sign-up pages
    │   │   ├── (marketing)/  # Landing page layout
    │   │   └── app/          # Protected app pages
    │   ├── components/
    │   │   ├── coffee/       # Animated landing page
    │   │   ├── dashboard/    # Dashboard widgets
    │   │   ├── motion/       # Reusable animation components
    │   │   ├── layout/       # Sidebar, topbar, command palette
    │   │   └── ui/           # Base UI components (shadcn-style)
    │   ├── lib/
    │   │   ├── animation/    # GSAP helpers & Framer variants
    │   │   └── supabase/     # Supabase client (browser + server)
    │   ├── stores/           # Zustand global state
    │   └── types/            # TypeScript types & DB schema
    ├── supabase/
    │   └── migrations/       # SQL migration files (run in order)
    └── public/               # Static assets & hero video
```

---

## Common Issues

**Port already in use**
```bash
# Kill whatever is on port 3000
npx kill-port 3000
npm run dev
```

**`node_modules` errors after cloning**
```bash
rm -rf node_modules
npm install
```

**Clerk redirect errors**
Make sure all four `NEXT_PUBLIC_CLERK_*` URL variables are set in `.env.local`.

**Supabase 401 / RLS errors**
Ensure all 5 migration files have been run in order in the Supabase SQL Editor.

---

## Build for Production

```bash
npm run build
npm run start
```

The production build will be served at `http://localhost:3000`.

---

## License

MIT
