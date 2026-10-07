# Product Requirements Document (PRD)

# Acquisitions API — v1.0 (Current State)

|                       |                                           |
| --------------------- | ----------------------------------------- |
| **Product**           | Acquisitions Backend API                  |
| **Version described** | 1.0.0 (as implemented in this repository) |
| **Document status**   | Baseline PRD of current work              |
| **Author**            | Mangesh                                   |
| **Last updated**      | 2026-10-07                                |

---

## 1. Overview

Acquisitions is a REST API backend for an acquisitions system. It provides user
registration, session-based authentication, and role-aware user management,
exposed as a JSON API for web/mobile clients.

The codebase is a deployment-focused reference implementation: it demonstrates a
clean layered Express architecture with modern tooling (ESM, Drizzle ORM,
Zod, Arcjet), Docker-based development/production workflows, and CI pipelines
for tests, linting, and image publishing.

### 1.1 Goals

- **G1** — Provide secure authentication (signup/signin/signout) using JWT in httpOnly cookies.
- **G2** — Provide CRUD-style user management with role-based authorization (user/admin).
- **G3** — Enforce input validation, rate limiting, bot/shield protection, and secure HTTP headers on every request.
- **G4** — Deliver a reproducible dev/prod environment via Docker Compose and CI/CD via GitHub Actions.
- **G5** — Maintain a layered, testable code structure that can be extended with new resources quickly.

### 1.2 Non-Goals (v1)

- Frontend/UI of any kind.
- Password reset, email verification, OAuth/social login.
- Audit trails, notifications, or reporting.
- Multi-tenant or "acquisition record" domain entities (not yet implemented — see Roadmap).

### 1.3 Target Users

| Persona          | Description                                                                             |
| ---------------- | --------------------------------------------------------------------------------------- |
| **Guest**        | Unauthenticated caller; limited to public endpoints under a strict rate limit.          |
| **User**         | Authenticated end user; can read their own profile and update their own information.    |
| **Admin**        | Authenticated administrator; can list/read/update any user, change roles, delete users. |
| **Operator/Dev** | Engineer running, deploying, and extending the service.                                 |

---

## 2. Scope of Current Implementation

### 2.1 Functional Requirements

#### Authentication

| ID    | Requirement                                                                                         | Status      |
| ----- | --------------------------------------------------------------------------------------------------- | ----------- |
| FR-A1 | Register a user with `name`, `email`, `password`, optional `role` (`user`/`admin`, default `user`). | Implemented |
| FR-A2 | Sign in with `email` + `password`; verify with bcrypt (10 rounds).                                  | Implemented |
| FR-A3 | On successful signup/signin, issue a JWT (1-day expiry) as an httpOnly `token` cookie.              | Implemented |
| FR-A4 | Sign out by clearing the `token` cookie.                                                            | Implemented |
| FR-A5 | Reject duplicate email registration with `409`.                                                     | Implemented |
| FR-A6 | Validate all auth payloads with Zod (`signupSchema`, `signInSchema`).                               | Implemented |

#### User management

| ID    | Requirement                                                                                                     | Status                                   |
| ----- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| FR-U1 | List all users — requires authentication.                                                                       | Implemented (see NFR/Security gap SEC-2) |
| FR-U2 | Get a user by numeric ID — requires authentication.                                                             | Implemented                              |
| FR-U3 | Update a user (name/email/role) — owner may update self; admin may update anyone; only admin may change `role`. | Implemented                              |
| FR-U4 | Delete a user — admin only; admin cannot delete themselves.                                                     | Implemented                              |
| FR-U5 | Validate `:id` (positive integer) and update payloads with Zod.                                                 | Implemented                              |

#### Platform

| ID    | Requirement                                                                                                                | Status      |
| ----- | -------------------------------------------------------------------------------------------------------------------------- | ----------- |
| FR-P1 | Health endpoint `GET /health` returning status, timestamp, uptime.                                                         | Implemented |
| FR-P2 | Root `GET /` and `GET /api` status messages.                                                                               | Implemented |
| FR-P3 | `404` JSON response for unknown routes.                                                                                    | Implemented |
| FR-P4 | Structured logging to console + `logs/combined.log` / `logs/error.log` via Winston, with Morgan HTTP access logs piped in. | Implemented |

### 2.2 API Reference (current)

Base URL: `http://localhost:3000`

| Method   | Path                 | Auth   | Role        | Description                   |
| -------- | -------------------- | ------ | ----------- | ----------------------------- |
| `GET`    | `/`                  | —      | —           | Service greeting              |
| `GET`    | `/health`            | —      | —           | Health check                  |
| `GET`    | `/api`               | —      | —           | API status message            |
| `POST`   | `/api/auth/sign-up`  | —      | —           | Register, sets `token` cookie |
| `POST`   | `/api/auth/sign-in`  | —      | —           | Login, sets `token` cookie    |
| `POST`   | `/api/auth/sign-out` | —      | —           | Clears `token` cookie         |
| `GET`    | `/api/users`         | Cookie | any         | List all users                |
| `GET`    | `/api/users/:id`     | Cookie | any         | Get user by ID                |
| `PUT`    | `/api/users/:id`     | Cookie | owner/admin | Update user                   |
| `DELETE` | `/api/users/:id`     | Cookie | admin       | Delete user                   |

**Response conventions:** JSON bodies; `200` success, `201` created, `400`
validation failure (with `details`), `401` unauthenticated, `403` forbidden /
rate-limited, `404` not found, `409` conflict, `500` server error.

### 2.3 Data Model

**Table: `users`** (Drizzle schema `src/models/users.model.js`, migration `drizzle/0000_wide_crystal.sql`)

| Column       | Type         | Constraints                     |
| ------------ | ------------ | ------------------------------- |
| `id`         | serial       | PK                              |
| `name`       | varchar(255) | NOT NULL, UNIQUE                |
| `email`      | varchar(255) | NOT NULL, UNIQUE                |
| `password`   | varchar(255) | NOT NULL, UNIQUE ⚠️ (see SEC-4) |
| `role`       | varchar(50)  | NOT NULL, default `'user'`      |
| `created_at` | timestamp    | default now()                   |
| `updated_at` | timestamp    | default now()                   |

### 2.4 Non-Functional Requirements

#### Security (NFR-SEC)

| ID    | Requirement                                         | Implementation                                                                                                                                                                                                       |
| ----- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-1 | Passwords stored hashed, never logged or returned.  | bcrypt cost 10 (`src/services/auth.service.js`)                                                                                                                                                                      |
| SEC-2 | Role-based access control on privileged operations. | `authenticateToken` + `requireRole` (`src/middleware/auth.middleware.js`); ⚠️ gaps listed in §5                                                                                                                      |
| SEC-3 | Secure HTTP headers, CORS, cookie parsing.          | helmet, cors, cookie-parser (`src/app.js`)                                                                                                                                                                           |
| SEC-4 | Rate limiting, bot detection, attack shielding.     | Arcjet: per-role sliding window (admin 20/min, user 10/min, guest 5/min) + shield + detectBot (`src/middleware/security.middleware.js`, `src/config/arcjet.js`); rules run `LIVE` in production, `DRY_RUN` otherwise |
| SEC-5 | Secrets supplied via environment, never hardcoded.  | dotenv + `.env*` files; ⚠️ violations listed in §5                                                                                                                                                                   |
| SEC-6 | All input validated before use.                     | Zod schemas in `src/validations/`                                                                                                                                                                                    |

#### Reliability & Error Handling (NFR-REL)

- Controllers wrap logic in `try/catch` and forward unknown errors via `next(error)`.
- Validation failures return `400` with formatted details (`formatValidationError`).
- Known business errors are mapped to specific status codes (`404`, `409`, `401`).
- ⚠️ No global Express error handler and no centralized async error wrapper — see §5.

#### Performance (NFR-PERF)

- Stateless JWT sessions (no session store) → horizontally scalable.
- Neon serverless Postgres over HTTP (`drizzle-orm/neon-http`) — connectionless, cold-start friendly.
- Arcjet sliding-window limits protect backend from abuse.

#### Observability (NFR-OBS)

- Winston: console + rotating file logs (`logs/`).
- Morgan `combined` format piped into Winston.
- `/health` endpoint for liveness probing.
- GitHub Actions test summary and coverage artifact upload.

#### Quality (NFR-QUAL)

- ESLint 9 flat config + Prettier enforced in CI (`lint-and-format.yml`).
- Jest + Supertest integration tests for health/status/404 routes (`tests/app.test.js`); coverage reported to `coverage/`.
- CI runs tests on push/PR to `main` and `staging` (`test.yml`).
- Docker image built and pushed by CI (`docker-build-and-push.yml`).

---

## 3. Architecture

### 3.1 Technology Stack

| Layer       | Choice                                        |
| ----------- | --------------------------------------------- |
| Runtime     | Node.js ≥ 20, ES modules (`"type": "module"`) |
| Framework   | Express 5.1                                   |
| Database    | PostgreSQL (Neon serverless)                  |
| ORM         | Drizzle ORM + drizzle-kit (migrations)        |
| Auth        | jsonwebtoken + bcrypt, httpOnly cookies       |
| Validation  | Zod 4                                         |
| Security    | Arcjet (shield/bot/rate-limit), helmet, cors  |
| Logging     | Winston + Morgan                              |
| Testing     | Jest 30 + Supertest                           |
| Lint/Format | ESLint 9 + Prettier                           |
| Containers  | Docker, docker-compose (dev/prod)             |
| CI/CD       | GitHub Actions                                |

### 3.2 Layered Design

```
HTTP Request
   │
   ▼
app.js ──► global middleware (helmet → cors → body parsers → cookie-parser
   │        → morgan/winston → arcjet security)
   ▼
routes/      URL + method → controller binding, route-level middleware
   ▼
controllers/ Zod validation, req/res shaping, authz checks, status codes
   ▼
services/    business logic + Drizzle DB operations
   ▼
models/      Drizzle table schemas → PostgreSQL
```

Supporting modules: `config/` (database, logger, arcjet), `utils/` (jwt,
cookies, formatting), `validations/` (Zod schemas).

### 3.3 Module Resolution

Path aliases via `package.json` `imports`: `#src/*`, `#config/*`, `#models/*`,
`#middleware/*`, `#controllers/*`, `#routes/*`, `#services/*`, `#utils/*`,
`#validations/*`. All source files must use aliases, not relative paths.

### 3.4 Request Lifecycle (example: `PUT /api/users/5`)

1. `src/index.js` loads dotenv → `src/server.js` starts listener.
2. Global middleware runs; Arcjet applies role-based rate limit (role resolved from cookie after auth — see §5 SEC-1 note).
3. `user.routes.js` → `authenticateToken` decodes `token` cookie into `req.user`.
4. `users.controllers.js:updateUserById` validates `:id` and body via Zod.
5. Authorization: self-or-admin, admin-only role changes.
6. `user.service.js:updateUser` performs Drizzle update.
7. JSON response with updated user (password excluded).

### 3.5 Environment & Deployment

| Aspect       | Development                                                | Production                          |
| ------------ | ---------------------------------------------------------- | ----------------------------------- |
| Run          | `npm run dev` (`node --watch`) or `npm run dev:docker`     | `npm start` / `npm run prod:docker` |
| DB           | Neon Local proxy at `neon-local:5432` (ephemeral branches) | Neon cloud over HTTPS               |
| Arcjet       | `DRY_RUN` (logs only)                                      | `LIVE` (enforced)                   |
| Compose file | `docker-compose.dev.yml`                                   | `docker-compose.prod.yml`           |
| Env file     | `.env.development`                                         | `.env.production`                   |

**Required env vars:** `PORT`, `NODE_ENV`, `LOG_LEVEL`, `DATABASE_URL`,
`JWT_SECRET`, `ARCJET_KEY` (+ optional `ARCJET_ENV`).

**Database workflow:** edit `src/models/*` → `npm run db:generate` →
`npm run db:migrate` → (optional) `npm run db:studio`.

**CI/CD:** `test.yml` (Jest on Node 20, coverage artifact),
`lint-and-format.yml` (ESLint + Prettier check),
`docker-build-and-push.yml` (image publish).

---

## 4. Success Metrics

| Metric                                   | Target                                    |
| ---------------------------------------- | ----------------------------------------- |
| CI test suite passing on `main`          | 100% of runs                              |
| Lint/format clean on `main`              | 100% of runs                              |
| Health endpoint response time            | < 100 ms p95                              |
| Rate-limit enforced for guests           | ≤ 5 req/min                               |
| Code coverage on critical paths          | ≥ 70% (currently reported in `coverage/`) |
| Time to add a new resource (model→route) | < 1 hour following §2 layering            |

---

## 5. Known Issues & Gaps (Current State)

These are defects or gaps observed in the current codebase. Items marked
**FIXED** were resolved in the Phase 0 stabilization pass (see commit refs).

| ID         | Severity    | Issue                                                                                                                                                       | Location                                                                           | Status                                                                                                    |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **BUG-1**  | **Blocker** | Syntax error `process.env.NODE_ENV = == 'development'` prevents the app from booting at all (`node --check` fails).                                         | `src/config/database.js:5`                                                         | **FIXED** `777913c`                                                                                       |
| **SEC-1**  | High        | Signup accepts `role` from the request body → anyone can self-register as `admin` (privilege escalation).                                                   | `src/validations/auth.validation.js:6`, `src/controllers/auth.controller.js:19-22` | **FIXED** `1c3077f`                                                                                       |
| **SEC-2**  | High        | `GET /api/users` (list all) is documented "admin only" but only requires authentication — any user can enumerate all users. Route never uses `requireRole`. | `src/routes/user.routes.js:14`                                                     | **FIXED** `de90259`                                                                                       |
| **SEC-3**  | High        | Real secrets committed to the repo (Neon API key, Arcjet key) in env files tracked by git.                                                                  | `.env`, `.env.development`, `.env.production`                                      | **FIXED** `3a9e715` — templates scrubbed to placeholders, `.env.example` added, `.env` remains gitignored |
| **SEC-4**  | Medium      | `password` column is declared `.unique()` — wrong semantics and may leak via unique-constraint errors.                                                      | `src/models/users.model.js:7`                                                      | **FIXED** `67dd65f` (migration `drizzle/0001`)                                                            |
| **SEC-5**  | Medium      | JWT secret falls back to a hardcoded default string when `JWT_SECRET` is unset.                                                                             | `src/utils/jwt.js:4-5`                                                             | **FIXED** `67dd65f` — fails fast in production                                                            |
| **SEC-6**  | Medium      | Arcjet rate-limit rules in `app.js` run _before_ auth middleware, so `req.user` is always undefined → everyone is limited as `guest`.                       | `src/app.js:77`, `src/middleware/security.middleware.js:7`                         | Open                                                                                                      |
| **BUG-2**  | Medium      | `signup` catch block never calls `next(e)` for unexpected errors → request hangs with no response.                                                          | `src/controllers/auth.controller.js:43-48`                                         | **FIXED** `9bd504b`                                                                                       |
| **BUG-3**  | Medium      | No global error handler / 500 fallback registered on the app; several code paths assume `next` handles everything.                                          | `src/app.js`                                                                       | **FIXED** `9bd504b`                                                                                       |
| **BUG-4**  | Low         | `prod:docker` script points to `./script/prod.sh` but directory is `scripts/` → command fails.                                                              | `package.json:44`                                                                  | **FIXED** `f359c7e`                                                                                       |
| **BUG-5**  | Low         | `authenticateUser` comment claims "user without password" but the spread keeps `password` in the returned object.                                           | `src/services/auth.service.js:49`                                                  | Open                                                                                                      |
| **TECH-1** | Low         | ~50 lines of dead commented-out code at top of `app.js`.                                                                                                    | `src/app.js:1-51`                                                                  | **FIXED** `f359c7e`                                                                                       |
| **TECH-2** | Low         | Test coverage limited to 3 platform endpoints; no tests for auth, users, middleware, or services.                                                           | `tests/app.test.js`                                                                | Open                                                                                                      |
| **TECH-3** | Low         | Inconsistent import alias usage (`#src/services/...` vs `#services/...`).                                                                                   | `src/controllers/users.controllers.js:13`                                          | **FIXED** `f359c7e`                                                                                       |
| **TECH-4** | Low         | `updated_at` never maintained on updates (no auto-update timestamp).                                                                                        | `src/services/user.service.js`                                                     | Open                                                                                                      |
| **DOCS-1** | Low         | `WARP.md` states "no tests are set up" — outdated. `acquisition.md` is empty.                                                                               | repo root                                                                          | Open                                                                                                      |

---

## 6. Roadmap (Proposed Phases)

### Phase 0 — Stabilize ✅ Complete

- [x] Fix BUG-1 (database config syntax) and BUG-2/BUG-3 (error handling).
- [x] Fix SEC-1: remove `role` from public signup schema; assign `user` by default server-side.
- [x] Fix SEC-2: apply `requireRole(['admin'])` to `GET /api/users`.
- [x] Rotate and remove committed secrets (SEC-3); templates scrubbed, `.env` gitignored.
- [x] Fix BUG-4 script path; remove dead code (TECH-1); fix password constraint (SEC-4); harden JWT secret (SEC-5).

**Remaining from Phase 0 review:** none. Open items are Phase 1+ (SEC-6, BUG-5, TECH-2, TECH-4, DOCS-1).

### Phase 1 — Quality hardening

- Global Express error handler + consistent error envelope.
- Unit tests for services/utils; integration tests for all auth and user endpoints.
- CI job that runs `node --check`/build validation before tests.
- Password reset / change-password endpoints.

### Phase 2 — Domain features (the "Acquisitions" product)

- Acquisition/Deal resource: models, CRUD, ownership, status workflow.
- Associations: users ↔ acquisitions (owner, assignee).
- Pagination, sorting, filtering on list endpoints.

### Phase 3 — Operations & scale

- Metrics (Prometheus/OTel), request IDs, correlation logging.
- DB seeding and factory scripts for staging.
- Kubernetes manifests (project keywords already declare `k8s` intent).
- API versioning (`/api/v1`) and OpenAPI spec generation.

---

## 7. Appendix — Key Files

| Concern                       | File                                                                   |
| ----------------------------- | ---------------------------------------------------------------------- |
| App wiring / middleware order | `src/app.js`                                                           |
| Server bootstrap              | `src/index.js`, `src/server.js`                                        |
| DB connection                 | `src/config/database.js`                                               |
| Schema                        | `src/models/users.model.js`                                            |
| Auth logic                    | `src/services/auth.service.js`, `src/controllers/auth.controller.js`   |
| User logic                    | `src/services/user.service.js`, `src/controllers/users.controllers.js` |
| Auth middleware               | `src/middleware/auth.middleware.js`                                    |
| Rate limit / bot defense      | `src/middleware/security.middleware.js`, `src/config/arcjet.js`        |
| Validation schemas            | `src/validations/*.js`                                                 |
| Migrations                    | `drizzle/`                                                             |
| CI pipelines                  | `.github/workflows/`                                                   |
| Dev/Prod docs                 | `README.md`, `WARP.md`, `DOCKER.md`                                    |
