# PipeForge — Examiner Demo & Viva Guide

Use this document to run a **complete, coherent demo** and to prepare for **oral questions**. The main project overview lives in [`readme.md`](readme.md); this file is the **script and talking points**.

---

## 1. Before you demo (checklist)

Do these in order so nothing fails on camera.

| Step | What to do |
|------|------------|
| 1 | **Docker Desktop** is running. |
| 2 | From repo root: `docker compose up -d` (PostgreSQL on **port 5433**). |
| 3 | Backend: `cd backend` → `npx prisma migrate dev` (if DB is fresh) → `npx prisma db seed`. |
| 4 | Backend: `npm run start:dev` → API at **http://localhost:4000**. |
| 5 | Frontend: `cd frontend` → `npm run dev` → app at **http://localhost:3000**. |
| 6 | Confirm `backend/.env` and `frontend/.env.local` match the root [`readme.md`](readme.md) (DATABASE_URL, JWT, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`). |

**Login (seeded user)**

- URL: **http://localhost:3000/login**
- Email: **admin@pipeforge.dev**
- Password: **admin123**

If the UI shows network errors, the backend is not up or the API URL in `.env.local` is wrong.

---

## 2. Suggested demo flow (~10–15 minutes)

Tell the examiner the **story**: *“This is an enterprise-style MLOps platform: CI/CD-style pipelines plus ML lifecycle modules, with real-time execution logs and a documented API.”*

### A. Login and dashboard (1–2 min)

1. Open **http://localhost:3000**, sign in with the credentials above.
2. Go to **Dashboard** — explain that KPIs and charts are driven by **`GET /metrics/dashboard`** (aggregated platform view).
3. One sentence: *“Frontend is Next.js; backend is NestJS with JWT on protected routes.”*

### B. Pipelines and templates (2–3 min)

1. Open **Pipelines** — show **seeded pipelines** (CI/CD and ML-related).
2. Mention **templates** from the API: e.g. `mltraining`, `mldeploy`, `fullmlops` (see [`readme.md`](readme.md) REST section).
3. If your UI exposes “create from template”, use it; otherwise say templates are **`POST /api/v1/pipelines/template/:name`**.

### C. Builder (2 min)

1. Open **Builder** — drag-and-drop pipeline construction.
2. Viva hook: *“This mirrors how real orchestrators compose stages; our execution engine runs an ordered list of stage types.”*

### D. Live execution (3–4 min) — highest impact

1. Open **Executions** (or start a run from Pipelines, depending on UI).
2. **Start a pipeline** and show **live logs**.
3. Say clearly: *“Logs stream over **WebSocket** (Socket.IO); the execution service emits events and the gateway pushes to the client.”*  
   - Connect URL in docs: **`http://localhost:4000`** (same host as API for WS).
4. Optional: mention **rollback** — **`POST /api/v1/execution/rollback/:executionId`** — ties to **Command** and **State** patterns (see §4).

### E. MLOps modules (3–4 min)

Walk these pages in any order; each maps to a **Nest module + REST API**:

| Page | What to say in one line |
|------|-------------------------|
| **Experiments** | Experiment tracking (metrics/params); compare runs. |
| **Model Registry** | Versioned models, stages (e.g. candidate → staging → production), promote/rollback. |
| **Monitoring** | Inference-style monitoring (latency, throughput, errors). |
| **Drift** | Drift alerts and checks; link to retraining story. |
| **Plugins** | Pluggable integrations (toggle, extend behaviour). |
| **Settings** | User/platform preferences as relevant. |

If asked *“Is this real ML?”*: answer honestly — *“The platform simulates realistic stages and metrics for demonstration; the architecture is what you’d extend with real training/serving jobs.”*

### F. Close (30 sec)

Summarise: **Auth**, **REST API**, **WebSockets**, **Postgres + Prisma**, **modular NestJS**, **Next.js dashboard**, **design patterns** (next section).

---

## 3. “One slide” architecture (for viva)

You should be able to draw or describe this from memory:

```
Browser (Next.js) ──HTTP REST──► NestJS API (/api/v1)
       │                              │
       └── WebSocket (Socket.IO) ─────┘
                                      │
                               Prisma ─► PostgreSQL
```

- **JWT**: sent as `Authorization: Bearer …` after login (`POST /auth/login`).
- **Modules**: Auth, Pipelines, Execution, Experiments, Model Registry, Data Validation, Drift, Feature Store, Plugins, Notifications, WebSocket gateway, etc.

---

## 4. Design patterns — names + where they live

Examiners often ask *“Which patterns did you use?”* Use this table (paths from repo root).

| Pattern | Role in PipeForge | Primary location |
|--------|-------------------|------------------|
| **Builder** | Fluent construction of pipelines (stages, order, config) | `backend/src/pipelines/builders/pipeline.builder.ts` |
| **Director** | Template pipelines (node, docker, ML templates, etc.) | `backend/src/pipelines/builders/pipeline.director.ts` |
| **Factory Method** | `StageFactory` picks executor by stage **type** string | `backend/src/execution/factories/stage.factory.ts` |
| **Abstract Factory** | Cloud provider families (AWS / Azure / GCP) | `backend/src/providers/factories/cloud.factory.ts` |
| **Adapter** | Normalise cloud APIs behind one interface | `backend/src/providers/adapters/cloud.adapter.ts` |
| **Decorator** | Cross-cutting stage behaviour (logging, retry, metrics) | `backend/src/execution/decorators/stage.decorators.ts` |
| **Composite** | Treat a group of stages as one unit | `backend/src/pipelines/composite/stage.composite.ts` |
| **Chain of Responsibility** | Ordered stage execution, fail-fast | `backend/src/execution/chain/execution.chain.ts` |
| **Command** | Encapsulate execute / rollback | `backend/src/execution/commands/execution.commands.ts` |
| **State** | Pipeline/execution lifecycle states | `backend/src/execution/states/pipeline.state.ts` |
| **Observer / events** | Decouple engine from WS, notifications, drift | `EventEmitter2` + e.g. `backend/src/websocket/` + execution service |
| **Plugin** | Optional behaviours registered at runtime | `backend/src/plugins/plugins.service.ts` |

**SOLID** (short): single-purpose modules; **open/closed** via new executors in the factory map; **dependency inversion** (engine depends on interfaces / abstractions, not concrete cloud clients).

---

## 5. Likely viva questions — concise answers

**Q: Why NestJS?**  
Modular boundaries (modules, DI), fits enterprise APIs, easy to add Auth, WebSockets, and Prisma.

**Q: Why Prisma?**  
Type-safe DB access, migrations, seeding for reproducible demos.

**Q: How does authentication work?**  
Login returns JWT; frontend stores token (e.g. `localStorage`); Axios interceptor attaches `Authorization` header; 401 clears session and redirects to login.

**Q: How do WebSockets relate to HTTP?**  
HTTP for CRUD and commands; WebSockets for **push** (live logs, execution events) so the UI updates without polling.

**Q: How would you put this in production?**  
HTTPS, secrets management, hardened JWT, DB backups, rate limits, real job queue/workers for long ML jobs, K8s/Helm (see [`readme.md`](readme.md) Kubernetes section).

**Q: What was the hardest part?**  
Pick something true for you: e.g. coordinating **state + events + WS**, or keeping **stage types** extensible via the factory.

**Q: What would you add next?**  
Real artifact store (S3), Kubernetes job executor, RBAC, audit log, integration tests for execution chain.

---

## 6. API quick reference (for demo backup)

Base: **`http://localhost:4000/api/v1`**

- Auth: `POST /auth/login`, `GET /auth/me`
- Pipelines: `GET/POST /pipelines`, `POST /pipelines/template/:name`
- Execution: `POST /execution/start/:id`, `GET /execution/history`, `POST /execution/rollback/:id`
- ML: `/experiments`, `/model-registry`, `/data-validation`, `/drift-detection`, `/feature-store`
- Dashboard: `GET /metrics/dashboard`

Full tables: [`readme.md`](readme.md) §11.

---

## 7. If something goes wrong during the demo

| Symptom | Likely cause | Fix |
|--------|----------------|-----|
| `Network Error` in browser | Backend down or wrong `NEXT_PUBLIC_API_URL` | Start backend; check `.env.local` |
| Prisma / DB errors | Postgres not running or wrong port | `docker compose up -d`; check `DATABASE_URL` (**5433**) |
| Empty DB | No migrate/seed | `npx prisma migrate dev` + `npx prisma db seed` |
| WS not updating | Firewall or wrong WS URL | Match `NEXT_PUBLIC_WS_URL` to backend host/port |

---

## 8. Optional closing line for examiner

*"PipeForge demonstrates a full-stack MLOps *platform* shape: modular backend, authenticated API, real-time execution feedback, and ML governance screens — implemented with explicit design patterns so the codebase stays extensible."*

Good luck with your demo and viva.
