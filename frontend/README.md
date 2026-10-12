# Acquisitions Frontend — Architecture, Planning & Feature Roadmap

A modern, scalable, feature-driven React + TypeScript frontend designed specifically for the Acquisitions backend API.

---

## 1. System Overview & Architectural Principles

The frontend is built to pair with the Express 5 + PostgreSQL (Neon) + Arcjet backend. It is designed around the **Vertical Slice (Feature-Driven) Architecture** to ensure maintainability, independent team scalability, and zero cross-module spaghetti dependencies as new domain entities (acquisitions, deals, documents) are added.

### Core Architectural Pillars

1. **Feature-Driven Modularity (Vertical Slices)**:
   Code is organized by business feature (`features/auth`, `features/users`, `features/acquisitions`) rather than arbitrary technical types. Each feature encapsulates its own API calls, UI components, custom hooks, schemas, and types.
2. **Server State vs. Client State Separation**:
   - **Server State (TanStack Query v5)**: Caching, background refetching, deduping, and optimistic mutations.
   - **Client State (Zustand)**: Ephemeral UI states (sidebar toggles, active modal, active filters).
3. **End-to-End Schema Validation**:
   Frontend validation is driven by **Zod** paired with **React Hook Form**, directly matching the backend validation schemas ([`src/validations/`](file:///home/mangesh/acquisition-main/src/validations)).
4. **Resilient Security Integration**:
   Built to handle Arcjet rate-limiting (`429`), bot/shield blocks (`403`), and `httpOnly` cookie authentication with `withCredentials: true`.
5. **Zero Hydration Mismatch & Fast Iteration**:
   Powered by **Vite** with strict TypeScript, providing instant Hot Module Replacement (HMR) and optimized build times.

---

## 2. Directory Structure Blueprint

```
frontend/
├── public/                       # Static public assets
├── src/
│   ├── app/                      # App-wide routing, providers, and initialization
│   │   ├── App.tsx               # Root application component
│   │   ├── router.tsx            # Route definitions & guards
│   │   └── providers.tsx         # QueryClientProvider, ToastProvider, AuthProvider
│   │
│   ├── assets/                   # Images, logos, global SVG icons
│   │
│   ├── components/               # Global shared reusable UI primitives
│   │   ├── ui/                   # Button, Input, Modal, Badge, Table, Card, Toast
│   │   ├── layout/               # AppShell, Navbar, Sidebar, PageHeader
│   │   └── feedback/             # LoadingSpinner, ErrorBoundary, EmptyState
│   │
│   ├── config/                   # Global configuration & environment constants
│   │   └── env.ts
│   │
│   ├── features/                 # VERTICAL SLICES (Domain features)
│   │   │
│   │   ├── auth/                 # Feature: Authentication & Session
│   │   │   ├── api/              # authApi.ts (login, register, logout, me)
│   │   │   ├── components/       # LoginForm, SignupForm, ProtectedRoute, RoleGuard
│   │   │   ├── hooks/            # useAuth, useSession
│   │   │   ├── schemas/          # authSchemas.ts (Zod)
│   │   │   ├── store/            # authStore.ts (Zustand session state)
│   │   │   └── types/            # auth.types.ts
│   │   │
│   │   ├── users/                # Feature: User Profile & Admin Management
│   │   │   ├── api/              # usersApi.ts (getAllUsers, getUserById, updateUser, deleteUser)
│   │   │   ├── components/       # UsersTable, UserEditModal, UserDeleteDialog, ProfileCard
│   │   │   ├── hooks/            # useUsersQuery, useUpdateUser, useDeleteUser
│   │   │   ├── schemas/          # usersSchemas.ts (Zod)
│   │   │   └── types/            # users.types.ts
│   │   │
│   │   └── acquisitions/         # Feature: Acquisition Deals & Pipeline (Domain Core)
│   │       ├── api/              # acquisitionsApi.ts (CRUD pipeline endpoints)
│   │       ├── components/       # PipelineBoard, DealCard, MetricStats, CreateDealModal
│   │       ├── hooks/            # useAcquisitions, useDealMutations
│   │       ├── schemas/          # acquisitionSchemas.ts
│   │       └── types/            # acquisition.types.ts
│   │
│   ├── hooks/                    # Global utility hooks (useDebounce, useMediaQuery)
│   │
│   ├── lib/                      # Infrastructure libraries & SDK wrappers
│   │   ├── api-client.ts         # Axios/Fetch client with interceptors & withCredentials: true
│   │   └── utils.ts              # Classnames merger, currency/date formatters
│   │
│   ├── types/                    # Common API & generic response types
│   │   └── api.types.ts
│   │
│   ├── index.css                 # Tailwind CSS styles & design tokens
│   └── main.tsx                  # Vite application entry point
│
├── index.html                    # Root HTML document
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler configuration
├── tsconfig.app.json             # App-specific TS rules
├── tsconfig.node.json            # Node/Vite TS rules
├── vite.config.ts                # Vite config (proxy to backend port 3000, path aliases)
└── README.md                     # This document
```

---

## 3. Technology Stack Selection

| Component             | Technology                       | Rationale                                                                                        |
| :-------------------- | :------------------------------- | :----------------------------------------------------------------------------------------------- |
| **Bundler & Runtime** | **Vite + React 19 + TypeScript** | Instant build speed, modern ESM, strict type checking.                                           |
| **Routing**           | **React Router v7**              | Standard declarative routing with nested layouts and route guards.                               |
| **Server State**      | **TanStack Query v5**            | Declarative caching, deduplication, automatic background retries, and optimistic updates.        |
| **Client State**      | **Zustand**                      | Minimalist global store for session profile and active UI states.                                |
| **Styling & Design**  | **Tailwind CSS + Lucide Icons**  | Utility-first CSS for responsive, accessible dashboards with dark-mode ready tokens.             |
| **Form Handling**     | **React Hook Form + Zod**        | Controlled form performance with zero unnecessary re-renders; mirrors backend Zod schemas.       |
| **HTTP Client**       | **Axios**                        | Interceptor support for automatic credential handling and centralized Arcjet rate limit capture. |

---

## 4. Feature Implementation Roadmap & Status Tracking

Each feature has been systematically targeted, verified against the backend API architecture, and marked as **[x] Done**.

### Feature Tracking Table

| ID     | Feature Slice                       | Key Endpoints / Responsibility                                                             | Status       |
| :----- | :---------------------------------- | :----------------------------------------------------------------------------------------- | :----------- |
| **F0** | **Foundation & Scaffolding**        | Vite, TS, Tailwind, API Client (`withCredentials: true`), Layout Shell, Toast/Error system | [x] **Done** |
| **F1** | **Auth & Session Management**       | `/api/auth/sign-in`, `/api/auth/sign-up`, `/api/auth/sign-out`, Session check, Role Guards | [x] **Done** |
| **F2** | **User Profile Self-Service**       | `/api/users/:id` (GET, PUT self), Profile view, Edit Name/Email with Zod validation        | [x] **Done** |
| **F3** | **Admin User Management**           | `/api/users` (GET all), `/api/users/:id` (PUT role, DELETE), Admin Table & Dialogs         | [x] **Done** |
| **F4** | **Arcjet Security & Rate-Limit UX** | Global 429/403 interceptor, Rate Limit countdown banner, Shield challenge feedback         | [x] **Done** |
| **F5** | **Acquisitions Pipeline & Metrics** | Pipeline stages (Lead, Due Diligence, Offer, Closed), Metrics cards, Deal creation         | [x] **Done** |
| **F6** | **Containerization & Nginx Proxy**  | Multi-stage Dockerfile, Nginx reverse proxy configuration, Docker Compose integration      | [x] **Done** |

---

## 5. Detailed Feature Specifications & Verification

### F0: Foundation & Infrastructure

- [x] Initialized `package.json`, Vite configuration with `@/` path alias and `/api` proxy to `http://localhost:3000`.
- [x] Configured Tailwind CSS, design tokens, and core UI components (Button, Input, Card, Badge, Modal, Toast).
- [x] Implemented `api-client.ts` with `withCredentials: true`, standard timeout, and Arcjet security event emitter.
- [x] Implemented global application shell with Navigation bar, responsive Sidebar, and user status header.

### F1: Authentication & Session Management

- [x] Zod schemas for Sign-in and Sign-up matching backend (`signupSchema`, `signInSchema`).
- [x] Sign-in page with email/password inputs, loading state, and error handling.
- [x] Sign-up page with validation and role default (`user`).
- [x] Zustand `authStore` to hold the authenticated user identity and role.
- [x] Route guards: `<ProtectedRoute />` and `<RoleGuard allowedRoles={['admin']} />`.
- [x] Sign-out trigger with cookie clearance.

### F2: User Profile & Self-Service Management

- [x] Fetch current user profile via `/api/users/:id`.
- [x] Profile editing form for Name and Email with instant Zod validation.
- [x] Prevent non-admin role mutation on the client side (mirroring backend security).
- [x] Success/Error notification feedback.

### F3: Admin User Management

- [x] Accessible data table displaying all users (`fetchAllUsers`) with search and role badges.
- [x] Role modifier modal allowing administrators to elevate/demote user roles.
- [x] Delete user modal with safety safeguards (cannot delete self).
- [x] Query invalidation to automatically refresh user list on mutation.

### F4: Arcjet Security & Rate-Limiting UX

- [x] Axios interceptor catching status `429` (Rate limit exceeded) and `403` (Shield/Bot blocked).
- [x] Visual rate-limit toast alert notifying the user of their tier limit (Guest: 5/min, User: 10/min, Admin: 20/min).
- [x] Automated 60-second backoff indicator banner (`RateLimitBanner.tsx`).

### F5: Acquisitions Pipeline & Deal Management

- [x] Pipeline Kanban/Stage view for acquisition prospects (Sourcing, Evaluation, Due Diligence, Negotiation, Closed).
- [x] High-level overview KPI metrics: Total Deal Value, Active Targets, Average Deal Size, Win Rate.
- [x] Deal creation modal (`CreateDealModal.tsx`) and stage transition updates.

### F6: Containerization & Production Build

- [x] Multi-stage `frontend/Dockerfile` building production bundle via Vite and serving via `nginx:alpine`.
- [x] Nginx configuration (`frontend/nginx.conf`) with SPA routing and `/api/` reverse proxy to Express.
- [x] Verified full production bundle build (`npm run build` passing with 0 TypeScript/Vite errors).

---

## 6. How to Run & Build

### Local Development

```bash
cd frontend
npm run dev
# Starts local development server on http://localhost:5173 with API proxy to port 3000
```

### Production Build

```bash
cd frontend
npm run build
# Compiles strict TypeScript and produces optimized production artifacts in dist/
```
