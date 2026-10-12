# Scalable Frontend Architecture Specification

This document details the architectural conventions, state management model, security boundaries, and coding standards for the Acquisitions frontend application.

---

## 1. Vertical Slice (Feature-First) Organization

Rather than grouping files by type (`components/`, `hooks/`, `services/`), code is organized by **business feature slices**:

```
src/features/<feature-name>/
├── api/             # API caller functions & TanStack Query hooks (queries/mutations)
├── components/      # UI components exclusive to this feature
├── hooks/           # Custom React hooks exclusive to this feature
├── schemas/         # Zod schemas for forms and data validation
├── store/           # (Optional) Feature-specific client state
└── types/           # TypeScript types and interfaces for this feature
```

### Rules of Engagement:

1. **Feature Self-Containment**: A feature should own its internal components and logic.
2. **Cross-Feature Imports**: If Feature A needs a component from Feature B, that component must either be promoted to `src/components/` or exported through Feature B's public index (`src/features/<feature-name>/index.ts`).
3. **Shared Components**: Global components in `src/components/ui/` must be headless, unstyled primitives or reusable design-system tokens with zero business knowledge.

---

## 2. State Management Architecture

We enforce a strict separation between **Server State** and **Client State**:

```
┌─────────────────────────────────────────────────────────────┐
│                       UI Components                         │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     Server State (Async)            Client State (Sync)
               │                              │
               ▼                              ▼
    ┌──────────────────────┐       ┌──────────────────────┐
    │  TanStack Query v5   │       │       Zustand        │
    │  - Cache / Invalidate│       │  - Active Modals     │
    │  - Auto-refetch      │       │  - Sidebar state     │
    │  - Optimistic update │       │  - Current User Auth │
    └──────────────────────┘       └──────────────────────┘
```

### Server State Guidelines:

- Every REST query must use `useQuery` with structured query keys: `['users']`, `['users', userId]`, `['acquisitions']`.
- Every mutation (`useMutation`) must explicitly invalidate or update relevant cache keys on success:
  ```typescript
  queryClient.invalidateQueries({ queryKey: ['users'] });
  ```

### Client State Guidelines:

- Reserved strictly for transient UI state or session credentials that don't belong in URL search params.
- Filter states and pagination must live in **URL search parameters** so views are shareable and bookmarkable.

---

## 3. Security & Backend Integration

### 1. Cookie Authentication

- The backend sets an `httpOnly`, `sameSite: strict` cookie named `token`.
- JavaScript cannot directly read this cookie.
- All outgoing requests must include `withCredentials: true`.
- The frontend verifies user session upon startup by calling `/api/users/:id` or an auth bootstrap endpoint.

### 2. Arcjet Security Interception

- **429 (Rate Limit)**: Arcjet limits requests per minute by role (Guest: 5, User: 10, Admin: 20). The HTTP client interceptor triggers a warning toast notifying the user to slow down.
- **403 (Shield / Bot)**: Captures security violations and displays an actionable notice.

---

## 4. Coding & Formatting Standards

- **Language**: TypeScript with `strict: true`.
- **Imports**: Absolute aliases via `@/` mapping to `./src/*`.
- **Components**: Functional components with named exports.
- **Forms**: Controlled via `react-hook-form` and validated using `zodResolver(schema)`.
