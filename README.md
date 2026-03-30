# WhatsApp Order Dashboard

> **React + TypeScript frontend for the WhatsApp Order Management platform.**
>
> A responsive, accessible dashboard where shop owners manage WhatsApp orders, update statuses, reply to customers, view conversation history, and connect their WhatsApp Business Account via Meta OAuth.

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Build & Deployment](#build--deployment)
- [Contributing](#contributing)

---

## Overview

This is the frontend of the WhatsApp Order Management system. It connects to the [WhatsApp Order API](https://github.com/S8r2j/whatsapp-order-api) backend and gives shop owners a full management interface:

- **Kanban board** to visualize orders by status in real time
- **Order detail** view with the full WhatsApp conversation thread
- **Customer profiles** with complete order history
- **Settings page** to connect and manage WhatsApp Business Accounts (Meta OAuth)
- **Dashboard overview** with key stats

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 18.3 | UI component framework |
| **TypeScript** | 5.4 | Static type safety |
| **Vite** | 5.2 | Build tool & dev server (HMR, port 3000) |
| **Tailwind CSS** | 3.4 | Utility-first styling |
| **React Router** | 6.23 | Client-side routing with protected routes |
| **TanStack React Query** | 5.40 | Server state — caching, polling, pagination |
| **Zustand** | 4.5 | Client state (auth + UI) with localStorage persistence |
| **Axios** | 1.7 | HTTP client with JWT auth interceptors |
| **react-hook-form** | 7.51 | Form state management |
| **Zod** | 3.23 | Runtime schema validation |
| **Headless UI** | 2.1 | Accessible modals and dialogs |
| **Heroicons** | 2.1 | SVG icon library |
| **react-hot-toast** | 2.4 | Toast notification system |
| **date-fns** | 3.6 | Date formatting and manipulation |

---

## Features

### Order Management
- **Kanban board** — columns for `new`, `confirmed`, `ready`, `delivered`, `cancelled`
- **List view** with filters by status, date range, and customer
- **Order detail page** — full WhatsApp conversation thread, customer info, items, notes
- **Status updates** — one-click status change triggers WhatsApp notification to customer
- **Manual reply** — send a WhatsApp message directly from the dashboard
- **Notes & total** — add internal notes and order total amount

### Customer Management
- Customer list with order count and last activity
- Customer detail page with full profile and order history
- Inline name editing

### Conversations
- Grouped by customer, showing last message preview and timestamp
- Full message thread with inbound/outbound distinction

### WhatsApp Connection (Meta OAuth)
- One-click **Connect WhatsApp** flow via Meta OAuth 2.0
- View and manage connected WhatsApp Business Accounts
- Disconnect / re-connect at any time

### Dashboard
- Key stats: total orders, pending orders, total customers
- Quick-access links to recent orders and pending actions

### Auth
- Register a new shop account
- Login with JWT — token persisted in localStorage via Zustand
- Automatic token injection on every API request (Axios interceptor)
- Protected route wrapper redirects unauthenticated users to `/login`

### UX
- Custom WhatsApp-green brand color + blue accent (configurable in `tailwind.config.js`)
- `pulse-slow` and `slide-in` custom animations
- Toast notifications for all async operations
- Error boundary for graceful failure handling
- Loading states and skeleton screens
- Mobile-responsive layout

---

## Quick Start

**Prerequisites:** Node.js 18+, npm

```bash
# 1. Clone the repo
git clone https://github.com/S8r2j/whatsapp-order-dashboard.git
cd whatsapp-order-dashboard

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local:
#   VITE_API_URL=http://localhost:8000   ← your backend URL

# 4. Start the dev server
npm run dev
# App runs at http://localhost:3000
```

The dev server proxies `/api` requests to the backend automatically (configured in `vite.config.ts`), so CORS is not an issue during local development.

**Make sure the backend is running.** See [whatsapp-order-api](https://github.com/S8r2j/whatsapp-order-api) for setup instructions.

---

## Environment Variables

Create a `.env.local` file (copied from `.env.local.example`). These variables are only set at build time and are safe to be browser-visible — **never put secret keys here**.

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |
| `VITE_APP_NAME` | `WhatsApp Order Manager` | App display name shown in the browser tab and header |

> **Note:** All `VITE_` prefixed variables are embedded into the built JavaScript bundle and are visible to end users. Never store secrets (API keys, passwords) as `VITE_` variables.

---

## Routes

| Route | Page | Auth |
|-------|------|:----:|
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/dashboard` | DashboardPage (stats overview) | ✅ |
| `/dashboard/orders` | OrdersPage (Kanban + list) | ✅ |
| `/dashboard/orders/:id` | OrderDetailPage | ✅ |
| `/dashboard/customers` | CustomersPage | ✅ |
| `/dashboard/customers/:id` | CustomerDetailPage | ✅ |
| `/dashboard/conversations` | ConversationsPage | ✅ |
| `/dashboard/conversations/:customerId` | ConversationDetailPage | ✅ |
| `/dashboard/settings` | SettingsPage (profile, hours, WhatsApp) | ✅ |
| `*` | NotFoundPage | — |

Protected routes are wrapped in `<ProtectedRoute>` which reads auth state from Zustand and redirects to `/login` if no token is present.

---

## Project Structure

```
whatsapp-order-dashboard/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── …
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx  # Sidebar + main content wrapper
│   │   │   ├── Sidebar.tsx          # Navigation links
│   │   │   └── ProtectedRoute.tsx   # Auth guard
│   │   ├── orders/
│   │   │   ├── OrderCard.tsx        # Kanban card
│   │   │   ├── OrderMessages.tsx    # Conversation thread
│   │   │   ├── ReplyModal.tsx       # Send WhatsApp reply
│   │   │   └── StatusBadge.tsx      # Coloured status pill
│   │   ├── connections/
│   │   │   └── WhatsAppConnectionCard.tsx
│   │   └── common/
│   │       ├── ErrorBoundary.tsx
│   │       ├── PageHeader.tsx
│   │       └── LoadingPage.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── orders/
│   │   │   ├── OrdersPage.tsx       # Kanban board view
│   │   │   └── OrderDetailPage.tsx
│   │   ├── customers/
│   │   │   ├── CustomersPage.tsx
│   │   │   └── CustomerDetailPage.tsx
│   │   ├── conversations/
│   │   │   ├── ConversationsPage.tsx
│   │   │   └── ConversationDetailPage.tsx
│   │   ├── settings/
│   │   │   └── SettingsPage.tsx     # Profile, business hours, WhatsApp OAuth
│   │   └── NotFoundPage.tsx
│   ├── hooks/                       # TanStack Query data hooks
│   │   ├── useOrders.ts
│   │   ├── useCustomers.ts
│   │   ├── useShop.ts
│   │   ├── useConnections.ts
│   │   └── useConversations.ts
│   ├── lib/
│   │   ├── api.ts                   # Axios instance + auth interceptors
│   │   ├── auth.ts                  # Auth API calls
│   │   ├── connections.ts           # Connections API calls
│   │   ├── conversations.ts         # Conversations API calls
│   │   ├── queryClient.ts           # TanStack Query client config
│   │   ├── constants.ts             # App-wide constants
│   │   └── utils.ts                 # Date formatting, class helpers
│   ├── store/
│   │   ├── authStore.ts             # Zustand auth store (persisted to localStorage)
│   │   └── uiStore.ts               # Sidebar open/close, theme, etc.
│   ├── types/
│   │   └── index.ts                 # All TypeScript interfaces (Order, Customer, Shop, …)
│   ├── styles/
│   │   └── globals.css              # Tailwind directives + base styles
│   ├── App.tsx                      # Route definitions
│   └── main.tsx                     # React entry point
├── .env.local.example               # Template — copy to .env.local
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts                   # Dev proxy + @ path alias
├── tsconfig.json                    # Strict TypeScript config
├── tailwind.config.js               # Brand colors + custom animations
└── postcss.config.js
```

---

## State Management

### Server State — TanStack React Query

All data fetched from the API (orders, customers, conversations, shop profile) lives in React Query's cache. Key patterns used:

- `useQuery` for all reads with sensible `staleTime` values
- `useMutation` + `queryClient.invalidateQueries` for writes
- Automatic polling where appropriate (e.g. orders page)
- Pagination via `page` + `size` query params

### Client State — Zustand

- **`authStore`** — JWT token, shop ID, login/logout actions. Persisted to `localStorage` so the user stays logged in across refreshes.
- **`uiStore`** — Sidebar open/close state, theme preferences.

---

## API Integration

`src/lib/api.ts` exports a configured Axios instance:

- **Base URL** set from `VITE_API_URL`
- **Request interceptor** reads the JWT from `authStore` and injects `Authorization: Bearer <token>` on every request
- **Response interceptor** handles `401 Unauthorized` by clearing auth state and redirecting to `/login`

---

## Build & Deployment

### Build

```bash
npm run build
# Output: dist/
```

### Vercel (recommended)

1. Import the `whatsapp-order-dashboard` repo in Vercel.
2. Set the root directory to the repo root (no monorepo config needed).
3. Add environment variable: `VITE_API_URL=https://your-backend-url.com`
4. Deploy — Vercel will run `npm run build` automatically.

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Docker / Static Server

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### Production Checklist

- [ ] `VITE_API_URL` points to your production backend HTTPS URL
- [ ] Backend CORS allows your frontend domain
- [ ] SPA fallback configured (Vercel handles this automatically; Nginx / Netlify need a redirect rule)

---

## Contributing

1. Fork the repo and create a feature branch.
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
4. Follow existing TypeScript and Tailwind patterns.
5. Open a PR with a clear description of the change.

---

## License

MIT
