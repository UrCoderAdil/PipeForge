# PipeForge — CI/CD Pipeline Simulator

### *Design • Build • Deploy • Monitor*

> **A Premium SaaS-inspired Mini CI/CD Pipeline Simulator** built for Software Design & Architecture coursework, demonstrating enterprise-grade software patterns, SOLID principles, and layered architecture.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Live Demo Credentials](#2-live-demo-credentials)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Complete Folder Structure](#5-complete-folder-structure)
6. [Software Design Patterns](#6-software-design-patterns)
   - 6.1 Builder Pattern
   - 6.2 Factory Method Pattern
   - 6.3 Abstract Factory Pattern
   - 6.4 Adapter Pattern
   - 6.5 Decorator Pattern
   - 6.6 Composite Pattern
   - 6.7 Chain of Responsibility
   - 6.8 Command Pattern
   - 6.9 State Pattern
   - 6.10 Observer Pattern
   - 6.11 Plugin Architecture
7. [SOLID Principles](#7-solid-principles)
8. [Database Schema](#8-database-schema)
9. [REST API Reference](#9-rest-api-reference)
10. [WebSocket Events](#10-websocket-events)
11. [Core Features](#11-core-features)
12. [Setup & Installation](#12-setup--installation)
13. [How to Run](#13-how-to-run)

---

## 1. Project Overview

**PipeForge** simulates the workflow of modern DevOps tools like Jenkins, GitHub Actions, and GitLab CI/CD — but with a clean, architecture-focused implementation designed for academic study.

Users can:
- Visually **design** deployment pipelines with a drag-and-drop builder
- **Configure** each stage (timeout, retries, environment) with decorators
- **Run** simulated CI/CD workflows stage-by-stage
- **Monitor** execution in real time via WebSocket live logs
- **Simulate failures** at any stage and trigger automatic rollback
- **Analyze** deployment metrics with interactive charts
- **Manage** plugin extensions from a marketplace
- **Switch** cloud deployment providers (AWS / Azure / GCP)

---

## 2. Live Demo Credentials

```
URL:      http://localhost:3000
Email:    admin@pipeforge.dev
Password: admin123
```

---

## 3. Technology Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **NestJS** | 11.x | Modular server framework (MVC + DI) |
| **Prisma ORM** | 5.x | Type-safe database access |
| **PostgreSQL** | 17 | Relational database (via Docker) |
| **Socket.IO** | 4.x | Real-time WebSocket communication |
| **Passport + JWT** | — | Authentication & authorization |
| **bcrypt** | — | Secure password hashing |
| **EventEmitter2** | — | Observer pattern / event bus |
| **class-validator** | — | DTO input validation |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.x | React full-stack framework (App Router) |
| **TypeScript** | 5.x | Static typing |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **shadcn/ui** | — | Accessible UI component library |
| **Zustand** | — | Client-side state management |
| **Recharts** | — | Dashboard analytics charts |
| **dnd-kit** | — | Drag-and-drop pipeline builder |
| **Socket.io-client** | — | WebSocket live log consumption |
| **React Hook Form + Zod** | — | Form validation |
| **Sonner** | — | Toast notifications |
| **next-themes** | — | Dark/light mode |

### Infrastructure
| Tool | Purpose |
|---|---|
| **Docker** | Containerized PostgreSQL database |
| **docker-compose** | Multi-service orchestration |

---

## 4. System Architecture

PipeForge uses a **monorepo structure** with strict separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER CLIENT                       │
│  Next.js App Router  ─────────────  Socket.IO Client     │
│  (React + Zustand)                  (Live Logs)          │
└───────────────────┬─────────────────────┬───────────────┘
                    │ HTTP REST            │ WebSocket
                    ▼                      ▼
┌─────────────────────────────────────────────────────────┐
│                    NESTJS BACKEND                        │
│                                                          │
│  ┌──────────┐  ┌───────────┐  ┌───────────────────┐    │
│  │   Auth   │  │ Pipelines │  │ Execution Engine  │    │
│  │  Module  │  │  Module   │  │  (Chain+State+Cmd) │   │
│  └──────────┘  └───────────┘  └───────────────────┘    │
│                                                          │
│  ┌──────────┐  ┌───────────┐  ┌───────────────────┐    │
│  │ Rollback │  │  Plugins  │  │   Providers       │    │
│  │  Module  │  │  Module   │  │ (AWS/Azure/GCP)   │    │
│  └──────────┘  └───────────┘  └───────────────────┘    │
│                                                          │
│  ┌──────────┐  ┌───────────┐  ┌───────────────────┐    │
│  │ Metrics  │  │   Notifs  │  │  WebSocket        │    │
│  │  Module  │  │  Module   │  │  Gateway          │    │
│  └──────────┘  └───────────┘  └───────────────────┘    │
│                                                          │
│              EventEmitter2 (Observer Bus)                │
└───────────────────────┬─────────────────────────────────┘
                        │ Prisma ORM
                        ▼
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL (Docker port 5433)               │
│  User | Pipeline | Stage | Execution | Plugin | Notif   │
└─────────────────────────────────────────────────────────┘
```

### Architectural Patterns Used
- **Layered Architecture** — Controller → Service → Repository (Prisma)
- **Dependency Injection** — NestJS IoC container wires all services
- **Repository Pattern** — PrismaService abstracts all DB access
- **Event-Driven Architecture** — EventEmitter2 decouples execution from notifications/WebSocket
- **Plugin Architecture** — Dynamically loadable plugins via IPlugin interface
- **MVC-inspired Frontend** — Pages (View) → Stores (Model) → Services (Controller)

---

## 5. Complete Folder Structure

```
c:\code\sdaproject\
│
├── frontend/                          ← Next.js App
│   └── src/
│       ├── app/
│       │   ├── layout.tsx             ← Root layout + ThemeProvider
│       │   ├── page.tsx               ← Root redirect (login/dashboard)
│       │   ├── login/page.tsx         ← JWT login form
│       │   └── (dashboard)/           ← Auth-protected route group
│       │       ├── layout.tsx         ← Auth guard wrapper
│       │       ├── dashboard/page.tsx ← KPI cards + Recharts
│       │       ├── pipelines/page.tsx ← CRUD pipeline list
│       │       ├── builder/page.tsx   ← Drag-drop builder
│       │       ├── executions/page.tsx← Live log viewer
│       │       ├── plugins/page.tsx   ← Plugin marketplace
│       │       └── settings/page.tsx  ← Theme + provider config
│       │
│       ├── components/
│       │   ├── shared/
│       │   │   ├── Sidebar.tsx        ← Navigation sidebar
│       │   │   └── Navbar.tsx         ← Top bar + notifications
│       │   └── ui/                    ← shadcn components
│       │
│       ├── stores/                    ← Zustand state stores
│       │   ├── auth.store.ts          ← User auth + token
│       │   ├── pipeline.store.ts      ← Builder state
│       │   └── notification.store.ts  ← Unread count
│       │
│       ├── services/
│       │   └── api.ts                 ← Axios client + all API calls
│       ├── hooks/
│       │   └── useSocket.ts           ← Socket.IO hook
│       ├── providers/
│       │   └── theme-provider.tsx     ← next-themes wrapper
│       └── types/
│           └── index.ts               ← Shared TypeScript interfaces
│
├── backend/                           ← NestJS App
│   ├── src/
│   │   ├── main.ts                    ← Bootstrap: CORS, prefix, port
│   │   ├── app.module.ts              ← Root module
│   │   │
│   │   ├── prisma/                    ← Global DB service
│   │   ├── auth/                      ← JWT login, guards, strategy
│   │   │
│   │   ├── pipelines/
│   │   │   ├── builders/              ← Builder + Director patterns
│   │   │   ├── composite/             ← Composite pattern
│   │   │   ├── dto/
│   │   │   ├── pipelines.service.ts
│   │   │   └── pipelines.controller.ts
│   │   │
│   │   ├── execution/
│   │   │   ├── factories/             ← Factory Method (StageFactory)
│   │   │   ├── decorators/            ← Decorator pattern (wrappers)
│   │   │   ├── chain/                 ← Chain of Responsibility
│   │   │   ├── commands/              ← Command pattern
│   │   │   ├── states/                ← State pattern
│   │   │   ├── execution.service.ts   ← Core execution engine
│   │   │   └── execution.controller.ts
│   │   │
│   │   ├── rollback/                  ← Rollback engine
│   │   ├── notifications/             ← Alert management
│   │   ├── websocket/                 ← Socket.IO gateway (Observer)
│   │   ├── plugins/                   ← Plugin architecture
│   │   ├── providers/
│   │   │   ├── adapters/              ← Adapter pattern (AWS/Azure/GCP)
│   │   │   └── factories/             ← Abstract Factory pattern
│   │   └── metrics/                   ← Analytics aggregation
│   │
│   └── prisma/
│       ├── schema.prisma              ← Database models
│       └── seed.ts                    ← Demo data seeder
│
├── docker-compose.yml                 ← PostgreSQL container
└── .env                               ← Environment variables
```

---

## 6. Software Design Patterns

This is the most academically important section. Every pattern listed below is **fully implemented** in the codebase with real working code.

---

### 6.1 Builder Pattern *(Creational)*

**File:** `backend/src/pipelines/builders/pipeline.builder.ts`

**Intent:** Separate the construction of a complex object from its representation, so the same construction process can create different representations.

**Why PipeForge uses it:** Pipelines vary greatly in complexity. A Quick Deploy pipeline has 2 stages while a Full QA pipeline has 5+. The Builder handles this variation elegantly without needing different constructors.

**Implementation:**

```typescript
// PipelineBuilder — fluent API for constructing pipelines step-by-step
export class PipelineBuilder {
  private config: PipelineConfig = { name: '', provider: 'AWS', stages: [] };
  private stageIndex = 0;

  setName(name: string): PipelineBuilder {
    this.config.name = name;
    return this; // enables method chaining
  }

  addBuildStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Build', type: 'build',
      orderIndex: this.stageIndex++,
      config: config || { timeout: 60, retries: 2 },
      decorators: ['logging', 'retry'],
    });
    return this;
  }

  addDeployStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Deploy', type: 'deploy',
      orderIndex: this.stageIndex++,
      config: config || { region: 'us-east-1', replicas: 3 },
      decorators: ['logging', 'notification'],
    });
    return this;
  }

  build(): PipelineConfig {
    if (!this.config.name) throw new Error('Pipeline name is required');
    return { ...this.config };
  }
}
```

**Usage with Director:**

```typescript
// PipelineDirector — encapsulates common construction sequences
export class PipelineDirector {
  static buildFullQAPipeline(name: string): PipelineConfig {
    return new PipelineBuilder()
      .setName(name)
      .setProvider('AWS')
      .addBuildStage()
      .addTestStage()
      .addSecurityScan()
      .addDeployStage()
      .addMonitorStage()
      .build();
  }
}
```

**Templates available via Director:**
- `node` → Build → Test → Deploy
- `docker` → Build → Test → Deploy (Docker/GCP)
- `fullqa` → Build → Test → Security → Deploy → Monitor
- `quickdeploy` → Build → Deploy

---

### 6.2 Factory Method Pattern *(Creational)*

**File:** `backend/src/execution/factories/stage.factory.ts`

**Intent:** Define an interface for creating an object, but let subclasses decide which class to instantiate.

**Why PipeForge uses it:** The execution engine must create a different executor depending on the stage type (`build`, `test`, `deploy`, etc.) without being coupled to those classes.

**Implementation:**

```typescript
// IStageExecutor — the product interface
export interface IStageExecutor {
  execute(config: any, forceFail?: boolean): Promise<{
    success: boolean; logs: string[]; duration: number
  }>;
  getName(): string;
}

// Concrete products
export class BuildStageExecutor implements IStageExecutor {
  getName() { return 'Build'; }
  async execute(config: any, forceFail = false) {
    // simulates npm install, compilation, etc.
    if (forceFail) return { success: false, logs: ['[Build] ERROR: Compilation failed'], duration: ... };
    return { success: true, logs: ['[Build] Build successful'], duration: ... };
  }
}

export class DeployStageExecutor implements IStageExecutor {
  getName() { return 'Deploy'; }
  async execute(config: any, forceFail = false) {
    // simulates container push, replica scaling
  }
}

// 7 executors total: Build, Test, Security, Deploy, Monitor, Lint, Package

// The Factory — decides which executor to create
export class StageFactory {
  private static executors: Record<string, new () => IStageExecutor> = {
    build: BuildStageExecutor,
    test: TestStageExecutor,
    security: SecurityStageExecutor,
    deploy: DeployStageExecutor,
    monitor: MonitorStageExecutor,
    lint: LintStageExecutor,
    package: PackageStageExecutor,
  };

  static create(type: string): IStageExecutor {
    const ExecutorClass = this.executors[type.toLowerCase()] || BuildStageExecutor;
    return new ExecutorClass(); // factory decision
  }
}
```

**Used in execution engine:**
```typescript
// ExecutionService — calls factory without knowing concrete type
const executor = StageFactory.create(stage.type); // → BuildStageExecutor, TestStageExecutor, etc.
```

**Open/Closed Principle:** To add a `LintStageExecutor`, you only add a new class and register it in the map — the engine never changes.

---

### 6.3 Abstract Factory Pattern *(Creational)*

**File:** `backend/src/providers/factories/cloud.factory.ts`

**Intent:** Provide an interface for creating families of related objects without specifying concrete classes.

**Why PipeForge uses it:** Each cloud provider (AWS, Azure, GCP) is a family of related services. The Abstract Factory ensures the entire family is created consistently.

**Implementation:**

```typescript
// Abstract Factory interface
export interface ICloudProviderFactory {
  createDeploymentClient(): ICloudProvider;
  getProviderName(): string;
}

// Concrete factories — one per cloud provider family
export class AWSFactory implements ICloudProviderFactory {
  createDeploymentClient() { return new AWSAdapter(); }
  getProviderName() { return 'AWS'; }
}

export class AzureFactory implements ICloudProviderFactory {
  createDeploymentClient() { return new AzureAdapter(); }
  getProviderName() { return 'Azure'; }
}

export class GCPFactory implements ICloudProviderFactory {
  createDeploymentClient() { return new GCPAdapter(); }
  getProviderName() { return 'GCP'; }
}

// Resolver — selects the right factory at runtime
export class CloudFactoryResolver {
  static resolve(provider: string): ICloudProviderFactory {
    switch (provider.toUpperCase()) {
      case 'AWS':   return new AWSFactory();
      case 'AZURE': return new AzureFactory();
      case 'GCP':   return new GCPFactory();
      default:      return new AWSFactory();
    }
  }
}
```

**Usage:**
```typescript
const factory = CloudFactoryResolver.resolve("AWS");
const deployClient = factory.createDeploymentClient();
await deployClient.deploy({ region: 'us-east-1', replicas: 3 });
```

---

### 6.4 Adapter Pattern *(Structural)*

**File:** `backend/src/providers/adapters/cloud.adapter.ts`

**Intent:** Convert the interface of a class into another interface that clients expect. Lets incompatible interfaces work together.

**Why PipeForge uses it:** AWS, Azure, and GCP all have completely different native APIs. The Adapter normalizes them behind a single `ICloudProvider` interface.

**Implementation:**

```typescript
// Target interface — what the execution engine expects
export interface ICloudProvider {
  deploy(config: any): Promise<{ success: boolean; message: string }>;
  rollback(config: any): Promise<{ success: boolean; message: string }>;
  monitor(config: any): Promise<{ healthy: boolean; latency: number }>;
  getProviderName(): string;
}

// Adaptee — AWS native client (incompatible raw API)
class AwsNativeClient {
  async deploy(region: string, image: string, replicas: number) {
    return { taskArn: `arn:aws:ecs:${region}:123:task/abc`, replicas };
  }
}

// Adapter — wraps AWS native into ICloudProvider
export class AWSAdapter implements ICloudProvider {
  private client = new AwsNativeClient();
  getProviderName() { return 'AWS'; }

  async deploy(config: any) {
    // Translates ICloudProvider.deploy() → aws.deploy()
    const result = await this.client.deploy(config.region, 'app:latest', config.replicas);
    return { success: true, message: `AWS ECS deployed ${result.replicas} replicas` };
  }
}

// Similarly: AzureAdapter wraps azure.launchContainer()
// Similarly: GCPAdapter wraps gcp.runService()
```

**Result:** The execution engine always calls `provider.deploy(config)` — it never knows whether it's AWS, Azure, or GCP.

---

### 6.5 Decorator Pattern *(Structural)*

**File:** `backend/src/execution/decorators/stage.decorators.ts`

**Intent:** Attach additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing.

**Why PipeForge uses it:** Users can toggle optional behaviors (logging, retry, notifications, metrics) per stage without modifying the core executor.

**Implementation:**

```typescript
// Base component interface
export interface IStageExecutor { execute(config, forceFail?): Promise<...>; }

// Abstract decorator — wraps another executor
abstract class StageDecorator implements IStageExecutor {
  constructor(protected wrappee: IStageExecutor) {}
  getName() { return this.wrappee.getName(); }
  abstract execute(config: any, forceFail?: boolean): Promise<...>;
}

// Concrete decorators
export class LoggingDecorator extends StageDecorator {
  async execute(config: any, forceFail?: boolean) {
    console.log(`[LOG] Starting ${this.getName()}`);
    const result = await this.wrappee.execute(config, forceFail); // delegate
    console.log(`[LOG] ${this.getName()} → ${result.success ? 'PASS' : 'FAIL'}`);
    return result;
  }
}

export class RetryDecorator extends StageDecorator {
  constructor(wrappee: IStageExecutor, private maxRetries = 2) { super(wrappee); }

  async execute(config: any, forceFail?: boolean) {
    let result = await this.wrappee.execute(config, forceFail);
    if (result.success) return result;
    // Auto-retry on failure
    for (let i = 0; i < this.maxRetries; i++) {
      result = await this.wrappee.execute(config, false); // retry without forceFail
      if (result.success) return result;
    }
    return result;
  }
}

export class MetricsDecorator extends StageDecorator {
  async execute(config: any, forceFail?: boolean) {
    const result = await this.wrappee.execute(config, forceFail);
    result.logs.push(`[Metrics] Duration: ${result.duration}ms`);
    return result;
  }
}

// Helper — stacks decorators based on user configuration
export function applyDecorators(executor: IStageExecutor, decorators: string[]): IStageExecutor {
  let wrapped = executor;
  for (const dec of decorators) {
    switch (dec) {
      case 'logging':      wrapped = new LoggingDecorator(wrapped); break;
      case 'retry':        wrapped = new RetryDecorator(wrapped); break;
      case 'metrics':      wrapped = new MetricsDecorator(wrapped); break;
      case 'notification': wrapped = new NotificationDecorator(wrapped); break;
      case 'security':     wrapped = new SecurityDecorator(wrapped); break;
    }
  }
  return wrapped;
}
```

**Stacking example:**
```typescript
// A Build stage with logging + retry wraps like Russian dolls:
new RetryDecorator(
  new LoggingDecorator(
    new BuildStageExecutor()
  )
)
// Each execute() call passes through every decorator layer
```

---

### 6.6 Composite Pattern *(Structural)*

**File:** `backend/src/pipelines/composite/stage.composite.ts`

**Intent:** Compose objects into tree structures to represent part-whole hierarchies. Clients treat individual objects and compositions uniformly.

**Why PipeForge uses it:** A QA stage group (Unit Test + Integration Test + Security Test) can be treated as a single stage by the engine.

**Implementation:**

```typescript
// Component interface — uniform treatment
export interface IStageComponent {
  getName(): string;
  execute(): Promise<{ success: boolean; logs: string[] }>;
}

// Leaf — a single indivisible stage
export class LeafStage implements IStageComponent {
  constructor(private name: string, private type: string) {}
  getName() { return this.name; }
  async execute() {
    return { success: true, logs: [`[${this.type}] ${this.name} completed`] };
  }
}

// Composite — a group of stages treated as one
export class CompositeStageGroup implements IStageComponent {
  private children: IStageComponent[] = [];
  constructor(private groupName: string) {}
  getName() { return this.groupName; }
  add(component: IStageComponent) { this.children.push(component); }

  async execute() {
    const allLogs: string[] = [`[Group] Starting ${this.groupName}`];
    for (const child of this.children) {
      const result = await child.execute();
      allLogs.push(...result.logs);
      if (!result.success) return { success: false, logs: allLogs }; // fail fast
    }
    return { success: true, logs: allLogs };
  }
}
```

**Usage:**
```typescript
const qaGroup = new CompositeStageGroup('QA Suite');
qaGroup.add(new LeafStage('Unit Test', 'test'));
qaGroup.add(new LeafStage('Integration Test', 'test'));
qaGroup.add(new LeafStage('Security Scan', 'security'));

// The engine calls qaGroup.execute() — same as calling any single stage
await qaGroup.execute();
```

---

### 6.7 Chain of Responsibility *(Behavioral)*

**File:** `backend/src/execution/chain/execution.chain.ts`

**Intent:** Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request. Chain the receiving objects and pass the request along the chain.

**Why PipeForge uses it:** Pipeline stages execute sequentially. Each stage decides whether to pass control to the next. If a stage fails, the chain stops.

**Implementation:**

```typescript
export class ExecutionChainHandler {
  private next: ExecutionChainHandler | null = null;

  constructor(private stage: ChainStage) {}

  // Links handler to the next in chain
  setNext(handler: ExecutionChainHandler): ExecutionChainHandler {
    this.next = handler;
    return handler; // allows fluent chaining
  }

  async handle(allLogs: any[]): Promise<{ success: boolean; failedStage?: string }> {
    // Each handler processes its own stage
    const result = await this.stage.executor.execute(this.stage.config, this.stage.forceFail);

    for (const log of result.logs) {
      allLogs.push({ time: new Date().toLocaleTimeString(), message: log, stage: this.stage.name });
    }

    if (!result.success) {
      return { success: false, failedStage: this.stage.name }; // STOP chain
    }

    // Pass to next handler if exists
    if (this.next) {
      return this.next.handle(allLogs);
    }

    return { success: true }; // End of chain — all stages passed
  }
}

// Builder utility — creates the chain from an array of stages
export function buildExecutionChain(stages: ChainStage[]): ExecutionChainHandler | null {
  if (stages.length === 0) return null;
  const handlers = stages.map(s => new ExecutionChainHandler(s));
  for (let i = 0; i < handlers.length - 1; i++) {
    handlers[i].setNext(handlers[i + 1]); // link Build → Test → Deploy → Monitor
  }
  return handlers[0]; // return head of chain
}
```

**Flow:**
```
Build Handler → Test Handler → Deploy Handler → Monitor Handler
   ↓ pass          ↓ pass          ↓ FAIL
                              [chain stops, rollback triggered]
```

---

### 6.8 Command Pattern *(Behavioral)*

**File:** `backend/src/execution/commands/execution.commands.ts`

**Intent:** Encapsulate a request as an object, thereby letting you parameterize clients with different requests, queue operations, and support undo.

**Why PipeForge uses it:** Pipeline operations (start execution, rollback, retry) become undoable commands tracked by an `ExecutionManager`.

**Implementation:**

```typescript
// Command interface
export interface ICommand {
  execute(): Promise<any>;
  undo?(): Promise<any>;
}

// Concrete commands
export class ExecutePipelineCommand implements ICommand {
  constructor(
    private pipelineId: string,
    private executionService: any,
    private options: any,
  ) {}

  async execute() {
    return this.executionService.runPipeline(this.pipelineId, this.options);
  }
}

export class RollbackCommand implements ICommand {
  constructor(private executionId: string, private rollbackService: any) {}

  async execute() {
    return this.rollbackService.rollback(this.executionId);
  }
}

// Invoker — manages command history for undo support
export class ExecutionManager {
  private history: ICommand[] = [];

  async invoke(command: ICommand): Promise<any> {
    const result = await command.execute();
    this.history.push(command); // stored for potential undo
    return result;
  }

  async undoLast(): Promise<any> {
    const last = this.history.pop();
    if (last?.undo) return last.undo();
  }
}
```

---

### 6.9 State Pattern *(Behavioral)*

**File:** `backend/src/execution/states/pipeline.state.ts`

**Intent:** Allow an object to alter its behavior when its internal state changes.

**Why PipeForge uses it:** A pipeline behaves differently depending on whether it's `Idle`, `Running`, `Failed`, etc. The State pattern eliminates chains of `if/else` for state-dependent behavior.

**Implementation:**

```typescript
// State interface
export interface IPipelineState {
  getType(): PipelineStateType;
  canStart(): boolean;    // can a new execution be triggered?
  canCancel(): boolean;   // can current execution be cancelled?
  canRollback(): boolean; // is rollback available?
  getLabel(): string;     // display label
  getColor(): string;     // UI color hint
}

// Concrete states — each defines its own behavior
export class IdleState implements IPipelineState {
  getType() { return 'idle' as const; }
  canStart()    { return true;  } // can start
  canCancel()   { return false; } // nothing to cancel
  canRollback() { return false; } // nothing to rollback
  getLabel() { return 'Idle'; }
  getColor() { return 'gray'; }
}

export class RunningState implements IPipelineState {
  getType() { return 'running' as const; }
  canStart()    { return false; } // already running
  canCancel()   { return true;  } // can be cancelled
  canRollback() { return false; } // can't rollback mid-run
  getLabel() { return 'Running'; }
  getColor() { return 'blue'; }
}

export class FailedState implements IPipelineState {
  getType() { return 'failed' as const; }
  canStart()    { return true; }  // can retry
  canCancel()   { return false; }
  canRollback() { return true; }  // rollback available
  getLabel() { return 'Failed'; }
  getColor() { return 'red'; }
}

// Context — manages transitions
export class PipelineStateContext {
  private state: IPipelineState;

  constructor(initialState: PipelineStateType = 'idle') {
    this.state = this.createState(initialState);
  }

  transition(newState: PipelineStateType): void {
    this.state = this.createState(newState); // transition
  }

  getState() { return this.state; }
}
```

**State transitions in the execution engine:**
```
Idle ──[start]──► Running ──[all stages pass]──► Success
                      │
                   [stage fails]
                      │
                      ▼
                   Failed ──[rollback triggered]──► Rollback ──► Idle
```

---

### 6.10 Observer Pattern *(Behavioral)*

**Files:**
- `backend/src/websocket/execution.gateway.ts` — Observer (listener)
- `backend/src/execution/execution.service.ts` — Subject (emitter)

**Intent:** Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

**Why PipeForge uses it:** When a stage completes, multiple systems need to know: the WebSocket gateway (to push to browser), the metrics service, the notifications service, the audit trail. The Observer pattern decouples the execution engine from all these consumers.

**Implementation:**

```typescript
// Subject (Observable) — ExecutionService
// Emits events without knowing who is listening
@Injectable()
export class ExecutionService {
  constructor(private eventEmitter: EventEmitter2) {}

  private async runExecution(executionId: string, pipeline: any, options: any) {
    // ...stage loop...

    // Emit events — subject notifies all observers
    this.eventEmitter.emit('execution.started',       { executionId, pipelineId });
    this.eventEmitter.emit('execution.stage',         { executionId, stageName, status: 'running' });
    this.eventEmitter.emit('execution.log',           { executionId, message, time, stage });
    this.eventEmitter.emit('execution.success',       { executionId, pipelineId });
    this.eventEmitter.emit('execution.failed',        { executionId, failedStage });
    this.eventEmitter.emit('execution.rollback',      { executionId });
  }
}

// Observer — ExecutionGateway
// Listens for events and pushes to WebSocket clients
@WebSocketGateway({ cors: { origin: '*' } })
export class ExecutionGateway {
  @WebSocketServer() server: Server;

  @OnEvent('execution.started')
  handleExecutionStarted(payload: any) {
    this.server.emit('execution:start', payload); // push to all browsers
  }

  @OnEvent('execution.log')
  handleLog(payload: any) {
    this.server.emit('execution:log', payload); // live log streaming
  }

  @OnEvent('execution.failed')
  handleFailed(payload: any) {
    this.server.emit('execution:failed', payload);
  }
}
```

**Event flow:**
```
ExecutionService.emit('execution.log')
    │
    ├──► ExecutionGateway → WebSocket → Browser (live logs)
    ├──► NotificationsService → creates DB notification
    └──► MetricsService → updates counters
```

---

### 6.11 Plugin Architecture

**File:** `backend/src/plugins/plugins.service.ts`

**Intent:** Allow new functionality to be added to the system without modifying existing code, by loading implementations of a common interface at runtime.

**Why PipeForge uses it:** Slack notifier, Discord alerts, Email notifier, AI Advisor, etc. are loaded dynamically — the core system is unaware of their internal implementations.

**Implementation:**

```typescript
// Plugin contract — every plugin must implement this
export interface IPlugin {
  init(): void;
  execute(context: any): Promise<void>;
  destroy(): void;
}

// Concrete plugins
export class SlackNotifierPlugin implements IPlugin {
  init()    { console.log('[Slack] Plugin initialized'); }
  async execute(ctx: any) { /* send Slack message */ }
  destroy() { console.log('[Slack] Plugin unloaded'); }
}

export class EmailNotifierPlugin implements IPlugin {
  init()    { /* connect SMTP */ }
  async execute(ctx: any) { /* send email */ }
  destroy() { /* close connection */ }
}

// Plugin registry — maps name to instance
@Injectable()
export class PluginsService {
  private pluginRegistry: Record<string, IPlugin> = {
    'Slack Notifier':  new SlackNotifierPlugin(),
    'Email Notifier':  new EmailNotifierPlugin(),
    'Discord Alerts':  new DiscordAlertPlugin(),
  };

  async toggle(id: string) {
    const plugin = await this.prisma.plugin.findUnique({ where: { id } });
    const updated = await this.prisma.plugin.update({
      where: { id }, data: { enabled: !plugin.enabled }
    });

    const instance = this.pluginRegistry[plugin.name];
    if (instance) {
      if (updated.enabled) instance.init();    // lifecycle: start
      else                 instance.destroy(); // lifecycle: stop
    }
    return updated;
  }
}
```

---

## 7. SOLID Principles

### S — Single Responsibility Principle
Every module has exactly one reason to change:

| Module | Single Responsibility |
|---|---|
| `AuthModule` | Only handles login, JWT, guards |
| `PipelinesModule` | Only handles pipeline CRUD |
| `ExecutionModule` | Only runs pipeline stages |
| `RollbackModule` | Only handles rollback logic |
| `NotificationsModule` | Only manages alerts |
| `MetricsModule` | Only aggregates analytics |
| `PluginsModule` | Only manages plugin lifecycle |

### O — Open/Closed Principle
The execution engine is **open for extension, closed for modification**:
- Adding a new stage type: create `LintStageExecutor`, register in `StageFactory.executors` map → **engine code unchanged**
- Adding a new decorator: create `AuditDecorator`, add case in `applyDecorators()` → **engine code unchanged**
- Adding a new cloud provider: create `DigitalOceanAdapter` + `DOFactory` → **engine code unchanged**

### L — Liskov Substitution Principle
Any `IStageExecutor` implementation can replace another without breaking the engine:
```typescript
// ExecutionService works identically whether executor is:
const executor: IStageExecutor = StageFactory.create('build');   // BuildStageExecutor
const executor: IStageExecutor = StageFactory.create('deploy');  // DeployStageExecutor
// Both substitutable — engine just calls executor.execute()
```

### I — Interface Segregation Principle
Focused, minimal interfaces:
```typescript
IStageExecutor   { execute(), getName() }          // only execution concern
ICloudProvider   { deploy(), rollback(), monitor() } // only cloud concern
IPlugin          { init(), execute(), destroy() }   // only plugin lifecycle
IStageComponent  { getName(), execute() }           // only composite concern
ICommand         { execute(), undo?() }             // only command concern
IPipelineState   { canStart(), canCancel(), ... }   // only state concern
```
No interface forces implementors to depend on methods they don't use.

### D — Dependency Inversion Principle
High-level modules depend on abstractions, not concretions:
```typescript
// ExecutionService depends on IStageExecutor interface, not BuildStageExecutor
const executor: IStageExecutor = StageFactory.create(stage.type);
executor.execute(config); // polymorphic — never knows the concrete class

// Cloud providers injected via factory, never directly
const provider: ICloudProvider = CloudFactoryResolver.resolve(pipeline.provider);
provider.deploy(config); // works for AWS, Azure, GCP equally
```

---

## 8. Database Schema

```
┌──────────┐     ┌────────────┐     ┌──────────┐
│   User   │────►│  Pipeline  │────►│  Stage   │
│──────────│     │────────────│     │──────────│
│ id (PK)  │     │ id (PK)    │     │ id (PK)  │
│ email    │     │ name       │     │ name     │
│ password │     │ description│     │ type     │
│ role     │     │ provider   │     │ orderIndex│
│ createdAt│     │ status     │     │ config   │
└──────────┘     │ userId (FK)│     │decorators│
                 │ createdAt  │     │pipelineId│
                 └──────┬─────┘     └──────────┘
                        │
                        ▼
                 ┌────────────┐
                 │ Execution  │
                 │────────────│
                 │ id (PK)    │
                 │ status     │
                 │ duration   │
                 │ logs (JSON)│
                 │ provider   │
                 │ forceFail  │
                 │ failStage  │
                 │ pipelineId │
                 └────────────┘

┌──────────────┐     ┌──────────────┐
│    Plugin    │     │ Notification │
│──────────────│     │──────────────│
│ id (PK)      │     │ id (PK)      │
│ name         │     │ title        │
│ description  │     │ message      │
│ category     │     │ type         │
│ enabled      │     │ read         │
│ config (JSON)│     │ createdAt    │
└──────────────┘     └──────────────┘
```

---

## 9. REST API Reference

Base URL: `http://localhost:4000/api/v1`

All routes except `/auth/login` require: `Authorization: Bearer <JWT_TOKEN>`

### Authentication
| Method | Route | Description |
|---|---|---|
| POST | `/auth/login` | Login → returns JWT token |
| GET | `/auth/me` | Get current user profile |
| POST | `/auth/logout` | Logout (client clears token) |

### Pipelines
| Method | Route | Description |
|---|---|---|
| GET | `/pipelines` | List all pipelines for user |
| GET | `/pipelines/:id` | Get single pipeline with stages |
| POST | `/pipelines` | Create new pipeline |
| PATCH | `/pipelines/:id` | Update pipeline and stages |
| DELETE | `/pipelines/:id` | Delete pipeline |
| POST | `/pipelines/:id/clone` | Clone pipeline |
| POST | `/pipelines/template/:name` | Create from template (`node`, `docker`, `fullqa`, `quickdeploy`) |

### Execution
| Method | Route | Description |
|---|---|---|
| POST | `/execution/start/:pipelineId` | Start pipeline execution |
| GET | `/execution/history` | Get all execution history |
| GET | `/execution/:id` | Get single execution with logs |
| POST | `/execution/rollback/:executionId` | Trigger rollback |

### Plugins
| Method | Route | Description |
|---|---|---|
| GET | `/plugins` | List all plugins |
| PATCH | `/plugins/:id/toggle` | Enable/disable plugin |

### Notifications
| Method | Route | Description |
|---|---|---|
| GET | `/notifications` | Get all notifications |
| PATCH | `/notifications/:id/read` | Mark single as read |
| PATCH | `/notifications/all/read` | Mark all as read |

### Metrics
| Method | Route | Description |
|---|---|---|
| GET | `/metrics/dashboard` | KPI cards + chart data + recent activity |

---

## 10. WebSocket Events

Connect to: `ws://localhost:4000`

### Server → Client Events

| Event | Payload | Description |
|---|---|---|
| `execution:start` | `{ executionId, pipelineId }` | Pipeline execution started |
| `execution:stage` | `{ executionId, stageName, status, stageIndex }` | Stage status changed |
| `execution:log` | `{ executionId, time, message, stage }` | New log line |
| `execution:success` | `{ executionId, pipelineId }` | All stages passed |
| `execution:failed` | `{ executionId, failedStage }` | Stage failed |
| `execution:rollback` | `{ executionId, pipelineId }` | Rollback started |
| `execution:rollback:complete` | `{ executionId }` | Rollback complete |

### Example log payload
```json
{
  "executionId": "abc-123",
  "time": "14:23:45",
  "message": "[Build] Build successful",
  "stage": "Build"
}
```

---

## 11. Core Features

### Feature 1 — JWT Authentication
- Demo admin pre-seeded: `admin@pipeforge.dev` / `admin123`
- JWT token stored in `localStorage` via Zustand persisted store
- All API requests send `Authorization: Bearer <token>` via Axios interceptor
- Expired/invalid tokens automatically redirect to `/login`

### Feature 2 — Premium Dashboard
- **8 KPI Cards:** Total Pipelines, Running, Successful, Failed, Rollbacks, Avg Deploy Time, Active Plugins, Success Rate
- **Area Chart:** Monthly deployments (success vs failed)
- **Pie Chart:** Provider distribution (AWS / Azure / GCP)
- **Bar Chart:** Deployment outcomes by month
- **Activity Feed:** Latest 6 notifications with timestamps

### Feature 3 — Visual Pipeline Builder
- Drag-and-drop stage reordering with `@dnd-kit/sortable`
- Stage library panel: 9 stage types available
- Per-stage configuration: timeout, retries
- Per-stage decorator toggles: logging, retry, notification, security, metrics
- 4 pre-built templates via the PipelineDirector

### Feature 4 — Execution Engine
- Sequential stage execution with real delays (simulates real work)
- State machine tracks lifecycle: `Idle → Running → Success/Failed → Rollback`
- Factory creates correct executor per stage type
- Decorators wrap executors based on user configuration
- All logs streamed live via WebSocket

### Feature 5 — Failure Simulation
- **Force Fail** toggle in the execution request body
- Specify which stage to fail: Build, Test, Security, Deploy, Monitor
- Stage intentionally returns `success: false`
- Failure triggers automatic rollback sequence

### Feature 6 — Rollback Engine
```
Failure detected
  → Pipeline status → 'rollback'
  → WebSocket event emitted
  → Simulated rollback steps logged
  → Pipeline status → 'idle'
  → Success notification created
```

### Feature 7 — Live Log Viewer
- Execution page connects to Socket.IO on mount
- `execution:log` events appended to log array in real time
- Terminal-style monospace display with color coding (green=success, red=error, orange=rollback)
- Stage progress bar shows each stage's current status
- Auto-scroll to latest log line

### Feature 8 — Plugin Marketplace
- 8 plugins across 5 categories: notification, security, analytics, ai, deployment
- Toggle switches enable/disable plugins
- Plugin lifecycle: `init()` on enable, `destroy()` on disable
- Visual indicators: category icons, active/inactive badges

### Feature 9 — Dark / Light Theme
- `next-themes` manages theme preference
- Toggle button in every Navbar
- Persists across browser sessions

---

## 12. Setup & Installation

### Prerequisites
- Node.js v22+
- Docker Desktop (running)
- npm

### Install global tools
```bash
npm install -g @nestjs/cli
```

### Clone and install

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install
```

---

## 13. How to Run

### Step 1 — Start PostgreSQL (Docker)
```bash
# From project root
docker compose up -d
```
> PostgreSQL runs on **port 5433** (5432 is reserved for local PostgreSQL)

### Step 2 — Run database migration + seed
```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### Step 3 — Start Backend
```bash
cd backend
npm run start:dev
```
> API available at: `http://localhost:4000`

### Step 4 — Start Frontend
```bash
cd frontend
npm run dev
```
> App available at: `http://localhost:3000`

### Step 5 — Login
```
http://localhost:3000/login
Email:    admin@pipeforge.dev
Password: admin123
```

---

## Environment Variables

### `backend/.env`
```env
DATABASE_URL="postgresql://pipeforge:pipeforge123@127.0.0.1:5433/pipeforge"
JWT_SECRET="supersecretkey"
JWT_EXPIRES_IN="1d"
PORT=4000
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

---

## Design Pattern Summary Table

| Pattern | Category | File | Role in PipeForge |
|---|---|---|---|
| **Builder** | Creational | `pipelines/builders/pipeline.builder.ts` | Constructs pipelines step-by-step via fluent API |
| **Director** | Creational | `pipelines/builders/pipeline.director.ts` | Encodes reusable pipeline construction sequences |
| **Factory Method** | Creational | `execution/factories/stage.factory.ts` | Creates correct stage executor by type string |
| **Abstract Factory** | Creational | `providers/factories/cloud.factory.ts` | Creates cloud provider families (AWS/Azure/GCP) |
| **Adapter** | Structural | `providers/adapters/cloud.adapter.ts` | Normalizes incompatible cloud provider APIs |
| **Decorator** | Structural | `execution/decorators/stage.decorators.ts` | Adds logging/retry/metrics to stages dynamically |
| **Composite** | Structural | `pipelines/composite/stage.composite.ts` | Groups stages into tree structures |
| **Chain of Responsibility** | Behavioral | `execution/chain/execution.chain.ts` | Passes execution through ordered stage handlers |
| **Command** | Behavioral | `execution/commands/execution.commands.ts` | Encapsulates execute/rollback as undoable objects |
| **State** | Behavioral | `execution/states/pipeline.state.ts` | Models pipeline lifecycle as distinct state objects |
| **Observer** | Behavioral | `websocket/execution.gateway.ts` | Decouples engine from WebSocket/notifications |
| **Plugin** | Architectural | `plugins/plugins.service.ts` | Dynamic extension without modifying core |

---

*PipeForge — Built with enterprise architecture patterns for Software Design & Architecture coursework.*
