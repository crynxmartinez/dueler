# Dueler - Card Game Builder Platform

> **A modern platform where anyone can create their own card games without coding.**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Repository & Deployment](#repository--deployment)
3. [Tech Stack](#tech-stack)
4. [Visual Mockups](#visual-mockups)
5. [Improvements Over Dulst](#improvements-over-dulst)
6. [Phase 0: Project Setup](#phase-0-project-setup-1-2-days)
7. [Phase 1: Database Schema](#phase-1-database-schema-2-3-days)
8. [Phase 2: Core UI & Layout](#phase-2-core-ui--layout-3-4-days)
9. [Phase 3: Card Editor](#phase-3-card-editor-4-5-days)
10. [Phase 4: Effect Builder](#phase-4-node-based-effect-builder-6-8-days)
11. [Phase 5: Board Editor](#phase-5-board-editor-4-5-days)
12. [Phase 6: Rule Cards](#phase-6-rule-cards-system-5-6-days)
13. [Phase 7: Game Runtime](#phase-7-game-runtime-engine-8-10-days)
14. [Phase 8: Test Play](#phase-8-test-play-mode-4-5-days)
15. [Phase 9: Multiplayer](#phase-9-multiplayer-6-8-days)
16. [Phase 10: Community](#phase-10-community-features-5-7-days)
17. [Future Phases](#future-phases-post-mvp)
18. [Timeline Summary](#timeline-summary)

---

## Project Overview

A platform similar to Dulst where users can create their own card games with a **modern, intuitive interface**. Key differentiators:

- **Node-based visual Effect Builder** (like GHL automation) instead of confusing columns
- **Clean drag-and-drop Board Editor** instead of chaotic overlapping boxes
- **Modern UI/UX** with shadcn/ui and Tailwind
- **Left sidebar navigation** for easy access to all features
- **Full ownership** - self-hosted, open architecture

---

## Repository & Deployment

| Item | Value |
|------|-------|
| **GitHub Repo** | https://github.com/crynxmartinez/dueler.git |
| **Database** | Prisma Postgres (Accelerate) |
| **Hosting** | Vercel (connected to GitHub) |

### Environment Variables (for Vercel)
```env
DATABASE_URL="postgres://d741932b2d5f3b3264b68c0ad313f3636252207262ec8c339dafaa9bc0dd41dc:sk_XRxkTst4HtHwRx8zFuoEf@db.prisma.io:5432/postgres?sslmode=require"
NEXTAUTH_SECRET="[generate-random-secret]"
NEXTAUTH_URL="https://your-domain.vercel.app"
GOOGLE_CLIENT_ID="[your-google-client-id]"
GOOGLE_CLIENT_SECRET="[your-google-client-secret]"
GITHUB_CLIENT_ID="[your-github-client-id]"
GITHUB_CLIENT_SECRET="[your-github-client-secret]"
```

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Framework** | Next.js 14 (App Router) | React framework with SSR |
| **Language** | TypeScript | Type safety |
| **Styling** | Tailwind CSS + shadcn/ui | Modern UI components |
| **Flow Builder** | React Flow | Node-based effect editor |
| **Database** | PostgreSQL + Prisma | Data storage & ORM |
| **Auth** | NextAuth.js (Credentials + OAuth) | Email/password + Google/GitHub |
| **Real-time** | Socket.io | Multiplayer & test sync |
| **Images** | URL links (no upload) | Card images via external URLs |
| **Version Control** | Git + GitHub | Code management |
| **Hosting** | Vercel | Auto-deploy from GitHub |
| **Database Host** | Prisma Postgres | PostgreSQL with Accelerate |
| **Icons** | Lucide React | Modern icon library |
| **Forms** | React Hook Form + Zod | Form handling & validation |
| **State** | Zustand | Lightweight state management |

---

## Visual Mockups

### 🖥️ Dashboard Layout (Left Sidebar)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🎮 DUELER                                              [🔔] [👤 User ▼]    │
├────────────────┬─────────────────────────────────────────────────────────────┤
│                │                                                             │
│  📊 Dashboard  │   MY GAMES                                    [+ New Game] │
│                │   ─────────────────────────────────────────────────────────│
│  🎴 My Games   │                                                             │
│                │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  🌐 Browse     │   │  🎴         │  │  🎴         │  │  🎴         │        │
│                │   │             │  │             │  │             │        │
│  👤 Profile    │   │  Epic TCG   │  │  Battle     │  │  My Card    │        │
│                │   │             │  │  Legends    │  │  Game       │        │
│  ⚙️ Settings   │   │  12 cards   │  │  45 cards   │  │  3 cards    │        │
│                │   │  Draft      │  │  Published  │  │  Draft      │        │
│  ─────────────│   └─────────────┘  └─────────────┘  └─────────────┘        │
│                │                                                             │
│  📖 Docs       │   ┌─────────────┐                                          │
│                │   │             │                                          │
│  💬 Community  │   │  + Create   │                                          │
│                │   │  New Game   │                                          │
│                │   │             │                                          │
│                │   └─────────────┘                                          │
│                │                                                             │
└────────────────┴─────────────────────────────────────────────────────────────┘
```

### 🎮 Game Studio Layout (Left Sidebar)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  🎮 DUELER  ›  Epic TCG                    [💾 Save] [👁️ Preview] [🚀 Publish]│
├────────────────┬─────────────────────────────────────────────────────────────┤
│                │                                                             │
│  ← Back        │   CARDS                                    [+ New Card]    │
│                │   ─────────────────────────────────────────────────────────│
│  ─────────────│   [🔍 Search...        ] [Type ▼] [Class ▼] [Cost ▼]       │
│                │                                                             │
│  🎴 Cards      │   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │
│     All (45)   │   │ ⚔️ 3   │ │ ⚔️ 5   │ │ 🔮 2   │ │ ⚔️ 4   │ │ 🛡️ 6   │  │
│     Units (30) │   │        │ │        │ │        │ │        │ │        │  │
│     Spells (10)│   │ Dragon │ │ Knight │ │ Fire-  │ │ Goblin │ │ Shield │  │
│     Heroes (5) │   │ Rider  │ │ Captain│ │ ball   │ │ Archer │ │ Bearer │  │
│                │   │ 4/5    │ │ 6/4    │ │        │ │ 2/3    │ │ 1/8    │  │
│  ⚡ Effects    │   └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │
│                │                                                             │
│  📜 Rules      │   ┌────────┐ ┌────────┐ ┌────────┐                         │
│     Init (8)   │   │ ⚔️ 7   │ │ 🔮 1   │ │ ⚔️ 2   │                         │
│     Combat (5) │   │        │ │        │ │        │                         │
│     Turn (6)   │   │ Ancient│ │ Heal   │ │ Scout  │                         │
│                │   │ Wyrm   │ │        │ │        │                         │
│  🗺️ Board      │   │ 8/8    │ │        │ │ 1/1    │                         │
│                │   └────────┘ └────────┘ └────────┘                         │
│  📦 Decks      │                                                             │
│                │   Showing 8 of 45 cards                    [1] [2] [3] [>] │
│  ⚙️ Settings   │                                                             │
│                │                                                             │
│  ▶️ Test Play  │                                                             │
│                │                                                             │
└────────────────┴─────────────────────────────────────────────────────────────┘
```

### ⚡ Effect Builder (Node-Based Flow)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Effect Builder: Dragon Rider - Battlecry              [💾 Save] [✕ Close]  │
├────────────────┬─────────────────────────────────────────────────────────────┤
│                │                                                             │
│  NODE PALETTE  │   ┌─────────────────────────────────────────────────────┐  │
│  ─────────────│   │                                                     │  │
│                │   │      ┌──────────────┐                               │  │
│  🎯 Triggers   │   │      │ 🎯 TRIGGER   │                               │  │
│    • invoke    │   │      │ ────────────│                               │  │
│    • damaged   │   │      │ invoke       │                               │  │
│    • destroyed │   │      │ (card played)│                               │  │
│    • repeat    │   │      └──────┬───────┘                               │  │
│                │   │             │                                       │  │
│  ⚡ Actions    │   │             ▼                                       │  │
│    • damage    │   │      ┌──────────────┐                               │  │
│    • heal      │   │      │ 🎯 TARGET    │                               │  │
│    • draw      │   │      │ ────────────│                               │  │
│    • summon    │   │      │ enemy unit   │                               │  │
│    • destroy   │   │      │ random (1)   │                               │  │
│                │   │      └──────┬───────┘                               │  │
│  ❓ Conditions │   │             │                                       │  │
│    • if stat   │   │             ▼                                       │  │
│    • if type   │   │      ┌──────────────┐                               │  │
│    • if class  │   │      │ ⚡ ACTION    │                               │  │
│    • random %  │   │      │ ────────────│                               │  │
│                │   │      │ deal damage  │                               │  │
│  🎯 Targets    │   │      │ amount: 3    │                               │  │
│    • this card │   │      └──────────────┘                               │  │
│    • owner     │   │                                                     │  │
│    • enemy     │   │                                                     │  │
│    • all units │   │   [Zoom: 100%] [Fit] [Center]          [Mini Map]  │  │
│                │   └─────────────────────────────────────────────────────┘  │
│  📦 Variables  │                                                             │
│                │   ─────────────────────────────────────────────────────────│
│  🔄 Loops      │   NODE PROPERTIES                                          │
│                │   ┌─────────────────────────────────────────────────────┐  │
│  ─────────────│   │ 🎯 TARGET: Enemy Unit                                │  │
│                │   │ ─────────────────────────────────────────────────── │  │
│  TEMPLATES     │   │ Location:    [Board           ▼]                    │  │
│    • Draw card │   │ Player:      [Opponent        ▼]                    │  │
│    • Deal dmg  │   │ Type:        [Unit            ▼]                    │  │
│    • Heal      │   │ Selection:   [Random          ▼]                    │  │
│    • Summon    │   │ Count:       [1               ▼]                    │  │
│                │   └─────────────────────────────────────────────────────┘  │
└────────────────┴─────────────────────────────────────────────────────────────┘
```

### 🗺️ Board Editor (Clean Grid Layout)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Board Editor: Epic TCG                                [💾 Save] [👁️ Preview]│
├────────────────┬─────────────────────────────────────────────────────────────┤
│                │                                                             │
│  ZONE PALETTE  │   ┌─────────────────────────────────────────────────────┐  │
│  ─────────────│   │                    OPPONENT SIDE                     │  │
│                │   │  ┌──────┐ ┌──────┐                        ┌──────┐  │  │
│  📦 Zones      │   │  │ Deck │ │ Hero │  ┌────────────────┐   │ Mana │  │  │
│    • Deck      │   │  │  📚  │ │  👤  │  │     Board      │   │  💎  │  │  │
│    • Hand      │   │  └──────┘ └──────┘  │   [5 slots]    │   │ 0/10 │  │  │
│    • Board     │   │                     └────────────────┘   └──────┘  │  │
│    • Hero      │   │  ┌────────────────────────────────────────────┐    │  │
│    • Graveyard │   │  │              Opponent Hand (hidden)        │    │  │
│    • Weapon    │   │  └────────────────────────────────────────────┘    │  │
│    • Mana      │   │                                                     │  │
│                │   │  ═══════════════════════════════════════════════   │  │
│  ─────────────│   │                                                     │  │
│                │   │  ┌────────────────────────────────────────────┐    │  │
│  TEMPLATES     │   │  │                 Your Hand                  │    │  │
│    • Hearthstone│   │  └────────────────────────────────────────────┘    │  │
│    • MTG       │   │                     ┌────────────────┐              │  │
│    • Yu-Gi-Oh  │   │  ┌──────┐ ┌──────┐  │     Board      │   ┌──────┐  │  │
│    • Pokemon   │   │  │ Deck │ │ Hero │  │   [5 slots]    │   │ Mana │  │  │
│    • Custom    │   │  │  📚  │ │  👤  │  └────────────────┘   │  💎  │  │  │
│                │   │  └──────┘ └──────┘                        │ 3/10 │  │  │
│  ─────────────│   │                     YOUR SIDE              └──────┘  │  │
│                │   └─────────────────────────────────────────────────────┘  │
│  PROPERTIES    │                                                             │
│  ─────────────│   ZONE PROPERTIES                                           │
│  Selected:     │   ┌─────────────────────────────────────────────────────┐  │
│  [Board]       │   │ Name:       [Board                    ]             │  │
│                │   │ Type:       [Card Grid        ▼]                    │  │
│  Name: Board   │   │ Owner:      [Player           ▼]                    │  │
│  Capacity: 5   │   │ Capacity:   [5                ]                     │  │
│  Visibility:   │   │ Visibility: [Public           ▼]                    │  │
│  Public        │   │ Mirror:     [✓] Auto-mirror for opponent            │  │
│                │   └─────────────────────────────────────────────────────┘  │
└────────────────┴─────────────────────────────────────────────────────────────┘
```

### 🎮 Game Play View (Test Mode)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Epic TCG - Test Mode                    [🔧 Debug] [↩️ Undo] [🔄 Reset]     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                         OPPONENT (Player 2)                                  │
│    ┌──────┐  ┌──────┐                                          ┌──────┐    │
│    │ 📚   │  │ 👤   │                                          │ 💎   │    │
│    │ 15   │  │ 30HP │                                          │ 5/10 │    │
│    └──────┘  └──────┘                                          └──────┘    │
│                                                                              │
│              ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                            │
│              │ 🂠 │ │ 🂠 │ │ 🂠 │ │ 🂠 │ │ 🂠 │  (5 cards in hand)         │
│              └────┘ └────┘ └────┘ └────┘ └────┘                            │
│                                                                              │
│    ┌─────────────────────────────────────────────────────────────────┐      │
│    │                                                                 │      │
│    │   ┌────────┐              ┌────────┐                           │      │
│    │   │ Goblin │              │ Knight │                           │      │
│    │   │  2/1   │              │  4/3   │                           │      │
│    │   └────────┘              └────────┘                           │      │
│    │                      BOARD                                      │      │
│    │   ┌────────┐  ┌────────┐              ┌────────┐               │      │
│    │   │ Dragon │  │ Shield │              │ Scout  │               │      │
│    │   │  4/5   │  │  1/8   │              │  1/1   │               │      │
│    │   └────────┘  └────────┘              └────────┘               │      │
│    │                                                                 │      │
│    └─────────────────────────────────────────────────────────────────┘      │
│                                                                              │
│    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│    │ Fire-  │ │ Heal   │ │ Ancient│ │ Archer │ │ Shield │                  │
│    │ ball   │ │        │ │ Wyrm   │ │  2/3   │ │ Bash   │                  │
│    │ 🔮 2   │ │ 🔮 1   │ │ ⚔️ 7   │ │ ⚔️ 2   │ │ 🔮 3   │                  │
│    └────────┘ └────────┘ └────────┘ └────────┘ └────────┘                  │
│                                                                              │
│    ┌──────┐  ┌──────┐                                          ┌──────┐    │
│    │ 📚   │  │ 👤   │                                          │ 💎   │    │
│    │ 20   │  │ 28HP │                                          │ 3/10 │    │
│    └──────┘  └──────┘                                          └──────┘    │
│                         YOU (Player 1)                                       │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ Turn 5 │ Your Turn │ [End Turn]        [Open Player 2 Tab]          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 🔐 Authentication Pages

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                              🎮 DUELER                                       │
│                                                                              │
│                    ┌────────────────────────────────┐                        │
│                    │                                │                        │
│                    │         Welcome Back           │                        │
│                    │                                │                        │
│                    │  ┌────────────────────────┐   │                        │
│                    │  │ 📧 Email               │   │                        │
│                    │  └────────────────────────┘   │                        │
│                    │                                │                        │
│                    │  ┌────────────────────────┐   │                        │
│                    │  │ 🔒 Password            │   │                        │
│                    │  └────────────────────────┘   │                        │
│                    │                                │                        │
│                    │  [        Sign In         ]   │                        │
│                    │                                │                        │
│                    │  ─────────── or ───────────   │                        │
│                    │                                │                        │
│                    │  [🔵 Continue with Google  ]   │                        │
│                    │  [⚫ Continue with GitHub  ]   │                        │
│                    │                                │                        │
│                    │  Don't have an account?        │                        │
│                    │  [Sign up]                     │                        │
│                    │                                │                        │
│                    └────────────────────────────────┘                        │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Improvements Over Dulst

### 1. **Effect Builder: Node-Based vs Columns**

| Dulst (Columns) | Dueler (Node-Based) |
|-----------------|---------------------|
| 4 columns side-by-side | Visual flowchart with connected nodes |
| Hard to see effect chain | Clear visual flow of logic |
| Confusing for beginners | Intuitive drag-and-drop |
| Limited branching visibility | Easy to see if/else branches |
| Text-heavy dropdowns | Visual nodes with icons |

### 2. **Board Editor: Clean Grid vs Chaos**

| Dulst (Chaotic) | Dueler (Clean) |
|-----------------|----------------|
| Overlapping colored boxes | Clean grid-based layout |
| No visual hierarchy | Clear player/opponent sides |
| Confusing coordinates | Drag-and-drop with snap |
| Hard to understand | WYSIWYG preview |
| Manual mirroring | Auto-mirror for opponent |

### 3. **Navigation: Left Sidebar**

| Dulst | Dueler |
|-------|--------|
| Top tabs + scattered menus | Consistent left sidebar |
| Context switching confusion | Always visible navigation |
| Hidden features | All features accessible |

### 4. **Additional Improvements**

- **Modern UI** - Clean, dark mode, responsive
- **Better Auth** - Email/password + Google + GitHub
- **Image URLs** - No upload needed, just paste URL
- **Real-time Preview** - See changes instantly
- **Keyboard Shortcuts** - Power user friendly
- **Undo/Redo** - Never lose work
- **Templates** - Start from proven game templates
- **Better Docs** - Inline help and tooltips

---

## Things You Might Have Forgotten (Added)

### 1. **Card Rarity System**
- Common, Rare, Epic, Legendary
- Visual indicators (border colors, effects)
- Deck building limits per rarity

### 2. **Card Sets / Expansions**
- Group cards into sets
- Release new expansions
- Set rotation (standard/wild)

### 3. **Keyword System**
- Define reusable keywords (Rush, Taunt, etc.)
- Keywords auto-apply effects
- Keyword tooltips in-game

### 4. **Game Settings**
- Starting health
- Starting hand size
- Max hand size
- Max board size
- Mana system (gain per turn, max)
- Turn timer options
- Mulligan rules

### 5. **Card Limits**
- Max copies per deck
- Deck size limits
- Class restrictions

### 6. **Import/Export**
- Export game as JSON
- Import game from JSON
- Share game templates

### 7. **Changelog & Versioning**
- Track card changes
- Version history
- Rollback capability

### 8. **Analytics (Future)**
- Card win rates
- Popular decks
- Balance insights

---

## Phase 0: Project Setup (1-2 days)

### 0.1 Initialize Next.js Project
- [ ] Create Next.js 14 project with TypeScript
  ```bash
  npx create-next-app@latest dueler --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
  ```
- [ ] Configure App Router structure
- [ ] Set up path aliases (@/ imports)

### 0.2 Install Core Dependencies
```bash
# UI Components
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
npm install lucide-react

# shadcn/ui (run init then add components)
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label dialog dropdown-menu
npx shadcn-ui@latest add form select textarea toast tabs avatar badge
npx shadcn-ui@latest add sheet sidebar separator skeleton scroll-area

# React Flow (for node-based builder)
npm install reactflow

# Database
npm install prisma @prisma/client

# Authentication
npm install next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# State Management
npm install zustand

# Real-time (for multiplayer)
npm install socket.io-client
```

### 0.3 Configure Prisma
- [ ] Initialize Prisma
  ```bash
  npx prisma init
  ```
- [ ] Create `prisma/prisma.config.ts`:
  ```typescript
  import 'dotenv/config'
  import { defineConfig, env } from 'prisma/config'

  export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
      path: 'prisma/migrations',
    },
    datasource: {
      url: env('DATABASE_URL'),
    },
  })
  ```
- [ ] Set DATABASE_URL in `.env`:
  ```env
  DATABASE_URL="postgres://d741932b2d5f3b3264b68c0ad313f3636252207262ec8c339dafaa9bc0dd41dc:sk_XRxkTst4HtHwRx8zFuoEf@db.prisma.io:5432/postgres?sslmode=require"
  ```
- [ ] Create initial schema (see Phase 1)
- [ ] Run first migration:
  ```bash
  npx prisma migrate dev --name init
  npx prisma generate
  ```

### 0.4 Configure Authentication (NextAuth.js v5)
- [ ] Create `src/lib/auth.ts`:
  ```typescript
  import NextAuth from "next-auth"
  import { PrismaAdapter } from "@auth/prisma-adapter"
  import { prisma } from "@/lib/prisma"
  import Credentials from "next-auth/providers/credentials"
  import Google from "next-auth/providers/google"
  import GitHub from "next-auth/providers/github"
  import bcrypt from "bcryptjs"

  export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      GitHub({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
      Credentials({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          })
          
          if (!user || !user.password) return null
          
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )
          
          if (!isValid) return null
          
          return user
        }
      })
    ],
    session: { strategy: "jwt" },
    pages: {
      signIn: "/login",
      signUp: "/register",
    },
  })
  ```
- [ ] Create auth API route `src/app/api/auth/[...nextauth]/route.ts`
- [ ] Create register API route `src/app/api/auth/register/route.ts`

### 0.5 Set Up Git & Deployment
- [ ] Initialize Git repository:
  ```bash
  git init
  git remote add origin https://github.com/crynxmartinez/dueler.git
  ```
- [ ] Create `.gitignore` (Next.js default + .env)
- [ ] Create `.env.example` with all required variables
- [ ] First commit and push:
  ```bash
  git add .
  git commit -m "Initial project setup"
  git push -u origin main
  ```
- [ ] Connect to Vercel (via Vercel dashboard)
- [ ] Configure environment variables in Vercel:
  - `DATABASE_URL`
  - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
  - `NEXTAUTH_URL`
  - `GOOGLE_CLIENT_ID` (optional, add later)
  - `GOOGLE_CLIENT_SECRET` (optional, add later)
  - `GITHUB_CLIENT_ID` (optional, add later)
  - `GITHUB_CLIENT_SECRET` (optional, add later)
- [ ] Verify deployment works

### 0.6 Project Structure
```
dueler/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── prisma.config.ts    # Prisma configuration
│   └── migrations/         # Database migrations
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Auth pages (public)
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/               # Protected pages
│   │   │   ├── dashboard/page.tsx     # My games list
│   │   │   ├── games/
│   │   │   │   ├── new/page.tsx       # Create new game
│   │   │   │   └── [gameId]/
│   │   │   │       ├── page.tsx       # Game studio
│   │   │   │       ├── cards/page.tsx
│   │   │   │       ├── effects/page.tsx
│   │   │   │       ├── rules/page.tsx
│   │   │   │       ├── board/page.tsx
│   │   │   │       ├── decks/page.tsx
│   │   │   │       └── settings/page.tsx
│   │   │   ├── browse/page.tsx        # Browse public games
│   │   │   ├── profile/page.tsx
│   │   │   └── layout.tsx             # Dashboard layout with sidebar
│   │   ├── play/
│   │   │   └── [matchId]/page.tsx     # Game player
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── games/route.ts
│   │   │   ├── games/[gameId]/
│   │   │   │   ├── route.ts
│   │   │   │   ├── cards/route.ts
│   │   │   │   ├── effects/route.ts
│   │   │   │   ├── rules/route.ts
│   │   │   │   └── board/route.ts
│   │   │   └── matches/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx                   # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── sidebar.tsx            # Left sidebar
│   │   │   ├── header.tsx
│   │   │   └── dashboard-layout.tsx
│   │   ├── cards/
│   │   │   ├── card-list.tsx
│   │   │   ├── card-form.tsx
│   │   │   ├── card-preview.tsx
│   │   │   └── card-grid.tsx
│   │   ├── effects/
│   │   │   ├── effect-builder.tsx     # React Flow canvas
│   │   │   ├── node-palette.tsx
│   │   │   ├── node-properties.tsx
│   │   │   └── nodes/                 # Custom node components
│   │   │       ├── trigger-node.tsx
│   │   │       ├── action-node.tsx
│   │   │       ├── condition-node.tsx
│   │   │       ├── target-node.tsx
│   │   │       └── variable-node.tsx
│   │   ├── board/
│   │   │   ├── board-editor.tsx
│   │   │   ├── zone-palette.tsx
│   │   │   ├── zone-properties.tsx
│   │   │   └── board-preview.tsx
│   │   ├── rules/
│   │   │   ├── rule-list.tsx
│   │   │   └── rule-editor.tsx
│   │   └── game/
│   │       ├── game-board.tsx
│   │       ├── game-card.tsx
│   │       ├── game-hand.tsx
│   │       └── game-controls.tsx
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client singleton
│   │   ├── auth.ts                    # NextAuth configuration
│   │   ├── utils.ts                   # Utility functions (cn, etc.)
│   │   └── validations/               # Zod schemas
│   │       ├── card.ts
│   │       ├── game.ts
│   │       └── auth.ts
│   ├── hooks/
│   │   ├── use-game.ts
│   │   ├── use-cards.ts
│   │   └── use-auth.ts
│   ├── stores/                        # Zustand stores
│   │   ├── game-store.ts
│   │   └── editor-store.ts
│   └── types/
│       ├── game.ts
│       ├── card.ts
│       ├── effect.ts
│       └── board.ts
├── public/
│   └── images/
├── .env
├── .env.example
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 0.7 Initial Files to Create
- [ ] `src/lib/prisma.ts` - Prisma client singleton
- [ ] `src/lib/utils.ts` - Utility functions
- [ ] `src/app/layout.tsx` - Root layout with providers
- [ ] `src/app/page.tsx` - Landing page (redirect to dashboard if logged in)
- [ ] `src/components/layout/sidebar.tsx` - Left sidebar component
- [ ] `src/components/layout/dashboard-layout.tsx` - Dashboard wrapper

---

## Phase 1: Database Schema (2-3 days)

### 1.1 Complete Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER & AUTH
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  password      String?   // Hashed password for credentials auth
  image         String?   // Avatar URL
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  accounts      Account[]
  sessions      Session[]
  games         Game[]
  decks         Deck[]
  matchesAsP1   Match[]   @relation("Player1")
  matchesAsP2   Match[]   @relation("Player2")
}

// NextAuth.js required models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ============================================
// GAME
// ============================================

model Game {
  id          String   @id @default(cuid())
  name        String
  description String?
  slug        String   @unique
  imageUrl    String?  // Game cover image URL
  isPublic    Boolean  @default(false)
  version     Int      @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Game Settings (JSON)
  settings    Json     @default("{}")
  // Settings structure:
  // {
  //   startingHealth: 30,
  //   startingHandSize: 3,
  //   maxHandSize: 10,
  //   maxBoardSize: 7,
  //   startingMana: 0,
  //   maxMana: 10,
  //   manaPerTurn: 1,
  //   turnTimeLimit: 90, // seconds, 0 = no limit
  //   mulliganEnabled: true,
  //   mulliganCount: 3,
  //   deckMinSize: 30,
  //   deckMaxSize: 30,
  //   maxCopiesPerCard: 2,
  //   maxLegendaryPerDeck: 1,
  // }

  // Relations
  ownerId     String
  owner       User        @relation(fields: [ownerId], references: [id])

  cards       Card[]
  cardSets    CardSet[]
  keywords    Keyword[]
  classes     GameClass[]
  effects     Effect[]
  ruleCards   RuleCard[]
  boardLayout BoardLayout?
  decks       Deck[]
  matches     Match[]
}

// ============================================
// CARD SETS / EXPANSIONS
// ============================================

model CardSet {
  id          String   @id @default(cuid())
  name        String
  code        String   // Short code like "CORE", "EXP1"
  description String?
  imageUrl    String?  // Set icon/logo URL
  releaseDate DateTime?
  isActive    Boolean  @default(true) // For set rotation
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  gameId      String
  game        Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)

  cards       Card[]

  @@unique([gameId, code])
}

// ============================================
// GAME CLASSES (e.g., Warrior, Mage)
// ============================================

model GameClass {
  id          String   @id @default(cuid())
  name        String
  description String?
  imageUrl    String?  // Class icon URL
  color       String?  // Hex color for UI
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  gameId      String
  game        Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)

  @@unique([gameId, name])
}

// ============================================
// KEYWORDS (Reusable abilities)
// ============================================

model Keyword {
  id          String   @id @default(cuid())
  name        String   // e.g., "Rush", "Taunt", "Lifesteal"
  description String   // Tooltip text
  hasValue    Boolean  @default(false) // e.g., "Spell Damage +X"
  effectFlow  Json?    // Node-based effect for this keyword
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  gameId      String
  game        Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)

  @@unique([gameId, name])
}

// ============================================
// CARDS
// ============================================

model Card {
  id          String    @id @default(cuid())
  name        String
  type        CardType
  rarity      CardRarity @default(COMMON)
  cost        Int       @default(0)
  attack      Int?
  health      Int?
  description String?   // Card text (may include keyword references)
  flavorText  String?   // Italic flavor text
  imageUrl    String?   // Card art URL
  
  // Classes this card belongs to (stored as JSON array of class names)
  classes     String[]  @default([])
  
  // Keywords on this card (JSON array)
  // Format: [{ "name": "Rush" }, { "name": "Spell Damage", "value": 2 }]
  keywords    Json      @default("[]")
  
  // Custom properties (JSON object)
  // For game-specific stats like "armor", "durability", etc.
  properties  Json      @default("{}")
  
  // Effect flow data (React Flow JSON)
  effectFlow  Json?
  
  // Metadata
  isCollectible Boolean @default(true) // Can be added to decks
  isToken       Boolean @default(false) // Generated during play
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  gameId      String
  game        Game      @relation(fields: [gameId], references: [id], onDelete: Cascade)
  
  setId       String?
  set         CardSet?  @relation(fields: [setId], references: [id])

  deckCards   DeckCard[]

  @@index([gameId, type])
  @@index([gameId, rarity])
}

enum CardType {
  HERO      // Player's hero/avatar
  UNIT      // Creatures/minions
  SPELL     // One-time effects
  EQUIP     // Weapons/equipment
  ADAPT     // Attachments/enchantments
  TWIST     // Traps/secrets
  TOKEN     // Generated cards (not collectible)
}

enum CardRarity {
  COMMON
  RARE
  EPIC
  LEGENDARY
}

// ============================================
// EFFECTS (Reusable Effect Templates)
// ============================================

model Effect {
  id          String   @id @default(cuid())
  name        String
  description String?
  flowData    Json     // Node-based flow data (React Flow JSON)
  category    String?  // For organizing: "damage", "draw", "summon", etc.
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  gameId      String
  game        Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
}

// ============================================
// RULE CARDS (Game Engine Rules)
// ============================================

model RuleCard {
  id          String       @id @default(cuid())
  name          String
  category      RuleCategory
  description   String?
  flowData      Json      // Node-based flow data
  order         Int       @default(0)
  isEnabled     Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  gameId        String
  game          Game      @relation(fields: [gameId], references: [id], onDelete: Cascade)
}

enum RuleCategory {
  INIT           // Match initialization
  PER_TURN       // Per-turn effects
  COMBAT         // Combat system
  DAMAGE         // Damage processing
  CARD_PLAY      // Card play handlers
  ELIGIBILITY    // Play/attack eligibility
  WIN_LOSE       // Victory conditions
  KEYWORDS       // Keyword implementations
  CUSTOM         // User-defined
}

// ============================================
// BOARD LAYOUT
// ============================================

model BoardLayout {
  id          String   @id @default(cuid())
  zones       Json     // Array of zone definitions (see TypeScript interface below)
  background  String?  // Background image URL
  settings    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  gameId      String   @unique
  game        Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
}

// ============================================
// DECKS
// ============================================

model Deck {
  id          String   @id @default(cuid())
  name        String
  description String?
  heroId      String?  // Selected hero card ID
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  gameId      String
  game        Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)

  cards       DeckCard[]
}

model DeckCard {
  id          String @id @default(cuid())
  quantity    Int    @default(1)

  deckId      String
  deck        Deck   @relation(fields: [deckId], references: [id], onDelete: Cascade)

  cardId      String
  card        Card   @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@unique([deckId, cardId])
}

// ============================================
// MATCHES (Game Sessions)
// ============================================

model Match {
  id            String      @id @default(cuid())
  status        MatchStatus @default(WAITING)
  state         Json        @default("{}") // Full game state JSON
  turnNumber    Int         @default(0)
  currentPlayer Int         @default(1) // 1 or 2
  winnerId      String?
  isTestMode    Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  gameId        String
  game          Game        @relation(fields: [gameId], references: [id])

  player1Id     String
  player1       User        @relation("Player1", fields: [player1Id], references: [id])

  player2Id     String?
  player2       User?       @relation("Player2", fields: [player2Id], references: [id])

  @@index([gameId, status])
}

enum MatchStatus {
  WAITING       // Waiting for player 2
  MULLIGAN      // Mulligan phase
  IN_PROGRESS   // Game is active
  COMPLETED     // Game finished
  ABANDONED     // Game was abandoned
}
```

### 1.2 TypeScript Interfaces (for JSON fields)

```typescript
// Zone definition for BoardLayout.zones
interface Zone {
  id: string;
  name: string;           // "board", "hand", "deck", "hero", etc.
  type: "CARD_STACK" | "CARD_GRID" | "SINGLE_CARD" | "INFO_DISPLAY";
  owner: "player" | "opponent" | "neutral";
  position: { x: number; y: number };
  size: { width: number; height: number };
  capacity: number;       // Max cards (-1 for unlimited)
  visibility: "public" | "private" | "owner";
  mirror: boolean;        // Auto-mirror for opponent
  properties: Record<string, any>;
}

// Game settings for Game.settings
interface GameSettings {
  startingHealth: number;      // Default: 30
  startingHandSize: number;    // Default: 3
  maxHandSize: number;         // Default: 10
  maxBoardSize: number;        // Default: 7
  startingMana: number;        // Default: 0
  maxMana: number;             // Default: 10
  manaPerTurn: number;         // Default: 1
  turnTimeLimit: number;       // Seconds, 0 = no limit
  mulliganEnabled: boolean;    // Default: true
  mulliganCount: number;       // Default: 3
  deckMinSize: number;         // Default: 30
  deckMaxSize: number;         // Default: 30
  maxCopiesPerCard: number;    // Default: 2
  maxLegendaryPerDeck: number; // Default: 1
}

// Effect flow data structure (React Flow format)
interface EffectFlow {
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport: { x: number; y: number; zoom: number };
}

interface FlowNode {
  id: string;
  type: "trigger" | "action" | "condition" | "target" | "variable" | "loop";
  position: { x: number; y: number };
  data: Record<string, any>; // Node-specific configuration
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string; // For condition branches: "true" / "false"
}
```

### 1.3 Database Tasks
- [ ] Create complete Prisma schema
- [ ] Set up database indexes for performance
- [ ] Run migrations
- [ ] Create seed data for testing
- [ ] Set up Prisma Studio for debugging

---

## Phase 2: Core UI & Layout (3-4 days)

### 2.1 Layout Components

#### Root Layout (`src/app/layout.tsx`)
- [ ] Theme provider (dark/light mode)
- [ ] Auth session provider
- [ ] Toast provider
- [ ] Global styles

#### Dashboard Layout (`src/app/(dashboard)/layout.tsx`)
```
┌──────────────────────────────────────────────────────────────┐
│  🎮 DUELER                              [🔔] [👤 User ▼]    │
├────────────────┬─────────────────────────────────────────────┤
│                │                                             │
│  LEFT SIDEBAR  │              MAIN CONTENT                   │
│  (240px fixed) │              (flex-1)                       │
│                │                                             │
│  - Dashboard   │                                             │
│  - My Games    │                                             │
│  - Browse      │                                             │
│  - Profile     │                                             │
│  - Settings    │                                             │
│  ─────────────│                                             │
│  - Docs        │                                             │
│  - Community   │                                             │
│                │                                             │
└────────────────┴─────────────────────────────────────────────┘
```

#### Game Studio Layout (`src/app/(dashboard)/games/[gameId]/layout.tsx`)
```
┌──────────────────────────────────────────────────────────────┐
│  🎮 DUELER › Game Name          [💾 Save] [👁️] [🚀 Publish] │
├────────────────┬─────────────────────────────────────────────┤
│                │                                             │
│  ← Back        │              MAIN CONTENT                   │
│  ─────────────│              (Cards/Effects/Rules/etc)      │
│                │                                             │
│  🎴 Cards      │                                             │
│     All (45)   │                                             │
│     Units      │                                             │
│     Spells     │                                             │
│     Heroes     │                                             │
│                │                                             │
│  ⚡ Effects    │                                             │
│  📜 Rules      │                                             │
│  🗺️ Board      │                                             │
│  📦 Decks      │                                             │
│  🏷️ Keywords   │                                             │
│  👥 Classes    │                                             │
│  📁 Sets       │                                             │
│  ⚙️ Settings   │                                             │
│  ─────────────│                                             │
│  ▶️ Test Play  │                                             │
│                │                                             │
└────────────────┴─────────────────────────────────────────────┘
```

### 2.2 Sidebar Component (`src/components/layout/sidebar.tsx`)
- [ ] Collapsible sidebar (mobile responsive)
- [ ] Active state highlighting
- [ ] Nested items (Cards → Units, Spells, etc.)
- [ ] Badge counts (number of cards, etc.)
- [ ] Separator between sections
- [ ] Bottom section for secondary items

```typescript
// Sidebar structure
const dashboardNav = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Gamepad2, label: "My Games", href: "/dashboard/games" },
  { icon: Globe, label: "Browse", href: "/browse" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { type: "separator" },
  { icon: BookOpen, label: "Docs", href: "/docs", external: true },
  { icon: MessageSquare, label: "Community", href: "/community" },
];

const gameStudioNav = (gameId: string) => [
  { icon: ArrowLeft, label: "Back", href: "/dashboard/games" },
  { type: "separator" },
  { 
    icon: Layers, 
    label: "Cards", 
    href: `/games/${gameId}/cards`,
    children: [
      { label: "All", href: `/games/${gameId}/cards` },
      { label: "Units", href: `/games/${gameId}/cards?type=UNIT` },
      { label: "Spells", href: `/games/${gameId}/cards?type=SPELL` },
      { label: "Heroes", href: `/games/${gameId}/cards?type=HERO` },
    ]
  },
  { icon: Zap, label: "Effects", href: `/games/${gameId}/effects` },
  { icon: ScrollText, label: "Rules", href: `/games/${gameId}/rules` },
  { icon: Map, label: "Board", href: `/games/${gameId}/board` },
  { icon: Package, label: "Decks", href: `/games/${gameId}/decks` },
  { icon: Tag, label: "Keywords", href: `/games/${gameId}/keywords` },
  { icon: Users, label: "Classes", href: `/games/${gameId}/classes` },
  { icon: FolderOpen, label: "Sets", href: `/games/${gameId}/sets` },
  { icon: Settings, label: "Settings", href: `/games/${gameId}/settings` },
  { type: "separator" },
  { icon: Play, label: "Test Play", href: `/games/${gameId}/test`, highlight: true },
];
```

### 2.3 Authentication Pages

#### Login Page (`src/app/(auth)/login/page.tsx`)
- [ ] Email/password form
- [ ] "Continue with Google" button
- [ ] "Continue with GitHub" button
- [ ] "Forgot password?" link
- [ ] "Sign up" link
- [ ] Form validation with Zod
- [ ] Error handling (invalid credentials, etc.)
- [ ] Loading states

#### Register Page (`src/app/(auth)/register/page.tsx`)
- [ ] Name, email, password, confirm password
- [ ] Password strength indicator
- [ ] Terms of service checkbox
- [ ] OAuth options (Google, GitHub)
- [ ] Redirect to dashboard on success

#### Auth Layout (`src/app/(auth)/layout.tsx`)
- [ ] Centered card layout
- [ ] Logo at top
- [ ] No sidebar (public pages)

### 2.4 Dashboard Pages

#### Dashboard Home (`src/app/(dashboard)/dashboard/page.tsx`)
- [ ] Welcome message with user name
- [ ] Quick stats (total games, total cards, etc.)
- [ ] Recent games list
- [ ] "Create New Game" CTA

#### My Games (`src/app/(dashboard)/games/page.tsx`)
- [ ] Grid of game cards
- [ ] Search games
- [ ] Filter by status (draft/published)
- [ ] Sort by (name, date, cards)
- [ ] "Create New Game" button
- [ ] Empty state for new users

#### Game Card Component
```
┌─────────────────────────┐
│  [Game Cover Image]     │
│                         │
├─────────────────────────┤
│  Epic TCG               │
│  12 cards • Draft       │
│                         │
│  [Edit] [Play] [•••]    │
└─────────────────────────┘
```
- [ ] Cover image (or placeholder)
- [ ] Game name
- [ ] Card count
- [ ] Status badge (Draft/Published)
- [ ] Quick actions (Edit, Play, Delete)
- [ ] Dropdown menu for more options

#### Create Game Modal
- [ ] Game name input
- [ ] Description textarea
- [ ] Template selection (Blank, Hearthstone-style, MTG-style)
- [ ] Create button
- [ ] Redirect to game studio on success

### 2.5 Common Components

#### Data Table (`src/components/ui/data-table.tsx`)
- [ ] Sortable columns
- [ ] Pagination
- [ ] Row selection
- [ ] Bulk actions
- [ ] Search/filter integration

#### Search Input
- [ ] Debounced search
- [ ] Clear button
- [ ] Search icon

#### Confirmation Dialog
- [ ] Title, description
- [ ] Cancel/Confirm buttons
- [ ] Destructive variant (red confirm)

#### Empty State
- [ ] Icon
- [ ] Title
- [ ] Description
- [ ] Action button

#### Loading States
- [ ] Skeleton loaders for cards
- [ ] Skeleton loaders for tables
- [ ] Full-page loading spinner

### 2.6 Theme & Styling
- [ ] Dark mode by default
- [ ] Light mode toggle
- [ ] Consistent color palette
- [ ] shadcn/ui component customization
- [ ] Responsive breakpoints (mobile, tablet, desktop)

---

## Phase 3: Card Editor (4-5 days)

### 3.1 Card List View (`src/app/(dashboard)/games/[gameId]/cards/page.tsx`)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  CARDS                                                    [+ New Card]   │
├──────────────────────────────────────────────────────────────────────────┤
│  [🔍 Search cards...    ] [Type ▼] [Rarity ▼] [Class ▼] [Set ▼] [Cost ▼]│
│                                                                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│  │ ⚔️ 3   │ │ ⚔️ 5   │ │ 🔮 2   │ │ ⚔️ 4   │ │ 🛡️ 6   │ │ ⚔️ 7   │     │
│  │ [img]  │ │ [img]  │ │ [img]  │ │ [img]  │ │ [img]  │ │ [img]  │     │
│  │ Dragon │ │ Knight │ │ Fire-  │ │ Goblin │ │ Shield │ │ Ancient│     │
│  │ Rider  │ │ Captain│ │ ball   │ │ Archer │ │ Bearer │ │ Wyrm   │     │
│  │ 4/5    │ │ 6/4    │ │        │ │ 2/3    │ │ 1/8    │ │ 8/8    │     │
│  │ [RARE] │ │ [EPIC] │ │[COMMON]│ │[COMMON]│ │ [RARE] │ │[LEGEND]│     │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
│                                                                          │
│  Showing 6 of 45 cards                              [1] [2] [3] [>]     │
└──────────────────────────────────────────────────────────────────────────┘
```

- [ ] Card grid/list view toggle
- [ ] Search by name (debounced)
- [ ] Filter by type, rarity, class, set, cost
- [ ] Sort options (name, cost, attack, health, date)
- [ ] Pagination (12/24/48 per page)
- [ ] Bulk actions (delete, duplicate, move to set)
- [ ] Click card to edit
- [ ] Right-click context menu

### 3.2 Card Form (`src/components/cards/card-form.tsx`)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CREATE NEW CARD                                         [Cancel] [Save]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │                             │  │  BASIC INFO                     │  │
│  │                             │  │  ─────────────────────────────  │  │
│  │                             │  │  Name: [Dragon Rider         ]  │  │
│  │      CARD PREVIEW           │  │  Type: [Unit              ▼]   │  │
│  │                             │  │  Rarity: [Rare            ▼]   │  │
│  │      (Live updates)         │  │  Set: [Core Set           ▼]   │  │
│  │                             │  │                                 │  │
│  │                             │  │  STATS                          │  │
│  │                             │  │  ─────────────────────────────  │  │
│  │                             │  │  Cost: [3  ]                    │  │
│  │                             │  │  Attack: [4  ]  Health: [5  ]   │  │
│  └─────────────────────────────┘  │                                 │  │
│                                   │  IMAGE                          │  │
│                                   │  ─────────────────────────────  │  │
│                                   │  URL: [https://example.com/img] │  │
│                                   │  [Preview] [Clear]              │  │
│                                   │                                 │  │
│                                   │  DESCRIPTION                    │  │
│                                   │  ─────────────────────────────  │  │
│                                   │  [Battlecry: Deal 3 damage to ] │  │
│                                   │  [a random enemy.              ] │  │
│                                   │                                 │  │
│                                   │  Flavor: [The skies tremble...]│  │
│                                   └─────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CLASSES                                          [+ Add Class] │   │
│  │  [Warrior ✕] [Dragon ✕]                                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  KEYWORDS                                       [+ Add Keyword] │   │
│  │  [Rush ✕] [Spell Damage: 2 ✕]                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  EFFECTS                                    [⚡ Open Effect Builder]│
│  │  • Trigger: invoke → Action: deal damage (3) → Target: random enemy│
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Basic Info Section
- [ ] Name input (required)
- [ ] Type selector (Unit, Spell, Equip, Hero, Adapt, Twist)
- [ ] Rarity selector (Common, Rare, Epic, Legendary)
- [ ] Set selector (dropdown of game's sets)

#### Stats Section (conditional based on type)
- [ ] Cost (all types)
- [ ] Attack (Unit, Hero)
- [ ] Health (Unit, Hero)
- [ ] Durability (Equip)
- [ ] Custom properties (key-value pairs)

#### Image Section (URL-based, no upload)
- [ ] Image URL input field
- [ ] "Preview" button to test URL
- [ ] Image preview display
- [ ] "Clear" button
- [ ] Placeholder for missing images
- [ ] URL validation (check if image loads)

#### Description Section
- [ ] Card text textarea (supports keyword highlighting)
- [ ] Flavor text textarea (italic)
- [ ] Character count

#### Classes Section
- [ ] Multi-select with autocomplete
- [ ] Create new class inline
- [ ] Chip display with remove button

#### Keywords Section
- [ ] Dropdown of game's keywords
- [ ] Value input for keywords with values (e.g., "Spell Damage +2")
- [ ] Chip display with remove button

#### Effects Section
- [ ] Summary of current effects
- [ ] "Open Effect Builder" button
- [ ] Effect count badge

### 3.3 Card Preview (`src/components/cards/card-preview.tsx`)
- [ ] Live card preview component (updates as you type)
- [ ] Rarity border colors (white/blue/purple/orange)
- [ ] Card type icons
- [ ] Responsive sizing
- [ ] Hover to enlarge
- [ ] Export as image

### 3.4 Card Effects Link
- [ ] "Edit Effects" button
- [ ] Opens Effect Builder for this card
- [ ] Shows effect summary on card form

### 3.5 API Routes
- [ ] GET /api/games/[gameId]/cards - List cards
- [ ] POST /api/games/[gameId]/cards - Create card
- [ ] GET /api/games/[gameId]/cards/[cardId] - Get card
- [ ] PUT /api/games/[gameId]/cards/[cardId] - Update card
- [ ] DELETE /api/games/[gameId]/cards/[cardId] - Delete card
- [ ] POST /api/games/[gameId]/cards/[cardId]/duplicate - Duplicate card

---

## Phase 4: Node-Based Effect Builder (6-8 days)

### 4.1 React Flow Setup
- [ ] Install and configure React Flow
- [ ] Create flow canvas component
- [ ] Set up custom node types
- [ ] Set up custom edge types
- [ ] Configure controls (zoom, pan, minimap)

### 4.2 Node Types

#### Trigger Node (Blue)
When the effect activates:
- invoke (card played)
- damaged
- destroyed (preDeath, postDeath, legacy)
- repeat (repeatStart, repeatEnd)
- cardDraw, opponentCardDraw
- offensive, defensive
- matchInit, cardInit
- condition (play condition)
- twist triggers
- update (aura)
- button from location
- custom trigger

#### Action Node (Purple)
What happens:
- deal damage
- heal
- change stat
- draw cards
- discard
- destroy card
- summon unit
- create and summon
- send to hand/deck
- conjure
- transform
- silence
- give mana
- add/remove class
- modify text
- target in-play character
- enforce battle
- play card
- custom action

#### Condition Node (Yellow)
If/else branching:
- verify target exists
- compare stat
- check property
- check location
- check player
- check class
- random chance
- custom condition

#### Target Node (Green)
Who is affected:
- this card
- owner / opponent
- card with criteria:
  - location (board, hand, deck, etc.)
  - player (owner, opponent, neutral)
  - type (unit, spell, etc.)
  - class
  - stat comparison
  - first X / last X
- adjacent cards
- random card
- all matching cards
- custom target

#### Variable Node (Orange)
Store and use values:
- assign variable
- get card property
- get player property
- get game property
- count cards
- math operations (+, -, *, /)
- custom value

#### Loop Node (Cyan)
Repeat actions:
- for each card
- repeat X times
- while condition

### 4.3 Node Properties Panel
- [ ] Sidebar panel when node selected
- [ ] Dynamic form based on node type
- [ ] Validation indicators
- [ ] Help text/tooltips

### 4.4 Edge Types
- [ ] Default edge (flow connection)
- [ ] Condition edge (true/false branches)
- [ ] Loop edge (back to loop start)

### 4.5 Flow Validation
- [ ] Check for unconnected nodes
- [ ] Check for missing required properties
- [ ] Check for circular references
- [ ] Display errors/warnings

### 4.6 Flow Serialization
- [ ] Convert flow to JSON for storage
- [ ] Load flow from JSON
- [ ] Version compatibility

### 4.7 Effect Templates
- [ ] Save effect as reusable template
- [ ] Template library
- [ ] Import template into card

### 4.8 UI Features
- [ ] Node palette sidebar (drag to add)
- [ ] Copy/paste nodes
- [ ] Undo/redo
- [ ] Zoom controls
- [ ] Minimap
- [ ] Auto-layout
- [ ] Keyboard shortcuts

---

## Phase 5: Board Editor (4-5 days)

### 5.1 Board Canvas
- [ ] Grid-based canvas
- [ ] Zoom and pan controls
- [ ] Grid snapping
- [ ] Ruler/guides

### 5.2 Zone Components
- [ ] Draggable zone elements
- [ ] Resize handles
- [ ] Zone type icons
- [ ] Zone labels

### 5.3 Zone Types
- [ ] CARD_STACK - Deck, graveyard (stacked cards)
- [ ] CARD_GRID - Board, hand (cards in a row/grid)
- [ ] SINGLE_CARD - Hero, weapon slot
- [ ] INFO_DISPLAY - Mana, health, turn indicator

### 5.4 Zone Properties Panel
- [ ] Name
- [ ] Type
- [ ] Owner (player/opponent/neutral)
- [ ] Position (x, y)
- [ ] Size (width, height)
- [ ] Capacity
- [ ] Visibility
- [ ] Mirror for opponent
- [ ] Custom properties

### 5.5 Templates
- [ ] Hearthstone-style template
- [ ] MTG-style template
- [ ] Yu-Gi-Oh-style template
- [ ] Blank template
- [ ] Save as custom template

### 5.6 Preview
- [ ] Live preview mode
- [ ] Show with sample cards
- [ ] Player 1 / Player 2 view toggle

### 5.7 Auto-Mirror
- [ ] Automatically create opponent zones
- [ ] Mirror positioning
- [ ] Link mirrored zones

---

## Phase 6: Rule Cards System (5-6 days)

### 6.1 Rule Card Categories
Same node-based builder as effects, organized by category:

#### INIT (Match Initialization)
- Game Initialization
- Pre-Play Phase
- Mulligan
- Hero Placement
- Set and Shuffle Deck
- Initial Draw
- matchInit effects

#### PER_TURN (Turn Structure)
- New Turn
- Mana Gain
- Draw Card
- Summoning Recovery (remove summoning sickness)
- Reset Attacks
- Duration Counters
- Repeat Effects
- Turn Timer

#### COMBAT
- Attack Declaration
- Battle Calculations
- Battle Damage
- Combat Resolution

#### DAMAGE
- Damage Calculation
- Apply Damage
- Damage Effects (poison, lifesteal)
- Death Check

#### CARD_PLAY
- Play Unit
- Play Spell
- Play Equip
- Play Twist
- Play from Graveyard (Dust)

#### ELIGIBILITY
- Set Play Eligibility (mana check)
- Set Attack Eligibility
- Set Attack Target Eligibility
- Set Power Eligibility

#### WIN_LOSE
- Check Win Condition
- Check Lose Condition
- Fatigue
- Deck Out

#### KEYWORDS
- Define keyword behaviors
- Snipe, Rush, Vanguard, etc.

### 6.2 Rule Card List
- [ ] Organized by category
- [ ] Enable/disable toggle
- [ ] Execution order (drag to reorder)
- [ ] Clone from template

### 6.3 Rule Card Editor
- [ ] Same node-based builder as effects
- [ ] Additional trigger types for rules:
  - match start
  - specific trigger
  - unique trigger
  - custom action
- [ ] Define player context (each player, turn player, etc.)

### 6.4 Default Rule Templates
- [ ] Provide default rules for common game types
- [ ] Hearthstone-style defaults
- [ ] MTG-style defaults
- [ ] User can modify or replace

---

## Phase 7: Game Runtime Engine (8-10 days)

### 7.1 Game State Structure
```typescript
interface GameState {
  matchId: string;
  gameId: string;
  status: "waiting" | "mulligan" | "playing" | "ended";
  turnNumber: number;
  currentPlayer: 1 | 2;
  turnStartTime: number;
  
  players: {
    1: PlayerState;
    2: PlayerState;
  };
  
  zones: {
    [zoneId: string]: ZoneState;
  };
  
  stack: EffectStackItem[]; // Effects waiting to resolve
  history: GameAction[];    // Action log
  
  variables: Record<string, any>; // Game-wide variables
}

interface PlayerState {
  odId: string;
  odname: string;
  mana: number;
  maxMana: number;
  overload: number;
  fatigue: number;
  // Custom properties
  [key: string]: any;
}

interface ZoneState {
  id: string;
  owner: 1 | 2 | null;
  cards: CardInstance[];
}

interface CardInstance {
  instanceId: string;  // Unique per match
  cardId: string;      // Reference to Card definition
  owner: 1 | 2;
  controller: 1 | 2;
  position: number;
  faceUp: boolean;
  
  // Current stats (may differ from base)
  currentStats: {
    cost: number;
    attack: number;
    health: number;
    maxHealth: number;
    [key: string]: any;
  };
  
  // Status flags
  canAttack: boolean;
  attacksLeft: number;
  summoningSickness: boolean;
  
  // Applied effects
  modifiers: Modifier[];
}
```

### 7.2 Flow Interpreter
- [ ] Parse flow JSON into executable structure
- [ ] Execute trigger nodes
- [ ] Execute action nodes
- [ ] Evaluate condition nodes
- [ ] Resolve target nodes
- [ ] Handle variable nodes
- [ ] Process loops

### 7.3 Event System
- [ ] Event emitter for game events
- [ ] Event types:
  - cardPlayed
  - cardDamaged
  - cardDestroyed
  - cardDrawn
  - cardDiscarded
  - turnStart
  - turnEnd
  - attackDeclared
  - statChanged
  - etc.
- [ ] Event listeners (for twist cards, etc.)

### 7.4 Targeting System
- [ ] Resolve target criteria
- [ ] Filter cards by location, type, class, stats
- [ ] Handle player selection (UI prompt)
- [ ] Random selection
- [ ] Adjacent cards

### 7.5 Effect Stack
- [ ] Queue effects for resolution
- [ ] Priority/ordering
- [ ] Interrupts (twist cards)
- [ ] Stack resolution

### 7.6 State Management
- [ ] Immutable state updates
- [ ] State snapshots for undo
- [ ] State validation
- [ ] State serialization (for saving/loading)

### 7.7 API Routes
- [ ] POST /api/matches - Create match
- [ ] GET /api/matches/[matchId] - Get match state
- [ ] POST /api/matches/[matchId]/action - Submit action
- [ ] POST /api/matches/[matchId]/concede - Concede match

---

## Phase 8: Test Play Mode (4-5 days)

### 8.1 Test Play Flow
1. Creator clicks "Play Test" in Game Studio
2. Creates test match (isTestMode: true)
3. Opens game view as Player 1
4. Shows "Open Player 2" button
5. Clicking opens new tab with same match as Player 2
6. Both tabs sync via WebSocket

### 8.2 Game UI Components
- [ ] Game board renderer (uses BoardLayout)
- [ ] Card display components
- [ ] Hand component
- [ ] Deck/graveyard components
- [ ] Hero/weapon display
- [ ] Mana display
- [ ] Turn indicator
- [ ] End turn button
- [ ] Action log

### 8.3 Interaction Handling
- [ ] Card hover (show details)
- [ ] Card click (select)
- [ ] Drag and drop (play cards)
- [ ] Target selection (arrows)
- [ ] Attack declaration
- [ ] Ability activation

### 8.4 WebSocket Sync
- [ ] Socket.io server setup
- [ ] Match room management
- [ ] State synchronization
- [ ] Action broadcasting
- [ ] Reconnection handling

### 8.5 Test Features
- [ ] Debug panel (view full state)
- [ ] Force draw card
- [ ] Set mana
- [ ] Skip turn
- [ ] Undo last action
- [ ] Reset match

---

## Phase 9: Multiplayer (6-8 days)

### 9.1 Lobby System
- [ ] Create game lobby
- [ ] Join game lobby
- [ ] Lobby list (public games)
- [ ] Invite link
- [ ] Lobby chat

### 9.2 Matchmaking
- [ ] Quick match (random opponent)
- [ ] Ranked matching (future)
- [ ] Friend challenges

### 9.3 Deck Selection
- [ ] Select deck before match
- [ ] Deck validation (card limits, etc.)
- [ ] Random deck option

### 9.4 Real-time Sync
- [ ] Optimistic updates
- [ ] Conflict resolution
- [ ] Latency compensation
- [ ] Disconnection handling
- [ ] Reconnection with state restore

### 9.5 Turn Timer
- [ ] Configurable turn time
- [ ] Timer display
- [ ] Auto-end turn on timeout
- [ ] Rope animation

### 9.6 Spectator Mode
- [ ] Watch ongoing matches
- [ ] Delayed broadcast (prevent cheating)
- [ ] Spectator chat

---

## Phase 10: Community Features (5-7 days)

### 10.1 Game Browser
- [ ] Browse public games
- [ ] Search and filter
- [ ] Game preview cards
- [ ] Play count, ratings

### 10.2 User Profiles
- [ ] Profile page
- [ ] Created games list
- [ ] Play statistics
- [ ] Avatar customization

### 10.3 Deck Sharing
- [ ] Public deck library
- [ ] Deck import/export (code)
- [ ] Deck copying

### 10.4 Social Features
- [ ] Follow users
- [ ] Activity feed
- [ ] Comments on games
- [ ] Ratings/reviews

### 10.5 Game Versioning
- [ ] Version history
- [ ] Changelog
- [ ] Rollback to previous version
- [ ] Fork a game

---

## Future Phases (Post-MVP)

### Phase 11: AI Opponents
- Basic AI (random valid moves)
- Smart AI (threat evaluation)
- Configurable difficulty
- AI deck building

### Phase 12: Mobile Support
- Responsive design
- Touch controls
- PWA support

### Phase 13: Monetization
- Premium features
- Game creator subscriptions
- Marketplace for assets

### Phase 14: Advanced Features
- Card crafting system
- Achievements
- Tournaments
- Leaderboards
- Card trading

---

## Timeline Summary

| Phase | Description | Duration | Cumulative |
|-------|-------------|----------|------------|
| 0 | Project Setup | 2 days | 2 days |
| 1 | Database Schema | 3 days | 5 days |
| 2 | Core UI | 4 days | 9 days |
| 3 | Card Editor | 5 days | 14 days |
| 4 | Effect Builder | 8 days | 22 days |
| 5 | Board Editor | 5 days | 27 days |
| 6 | Rule Cards | 6 days | 33 days |
| 7 | Game Runtime | 10 days | 43 days |
| 8 | Test Play | 5 days | 48 days |
| 9 | Multiplayer | 8 days | 56 days |
| 10 | Community | 7 days | **63 days** |

**MVP (Phases 0-8): ~48 days (~7 weeks)**
**Full Platform (Phases 0-10): ~63 days (~9 weeks)**

---

## Getting Started

To begin development:

```bash
# Clone the repository
git clone https://github.com/[username]/cardforge.git
cd cardforge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

---

## Notes

- All dates are estimates and may vary based on complexity discovered during development
- Each phase should be completed and tested before moving to the next
- Regular commits and deployments to catch issues early
- User feedback should be incorporated throughout development
