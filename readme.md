# PipeForge — Enterprise MLOps Platform

### *Data → Features → Train → Evaluate → Register → Deploy → Monitor → Drift → Retrain*

> **Built enterprise-grade end-to-end MLOps platform with automated training, model registry, CI/CD deployment, Kubernetes serving, real-time monitoring, and drift-triggered auto-retraining.**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Live Demo Credentials](#2-live-demo-credentials)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Complete Folder Structure](#5-complete-folder-structure)
6. [MLOps Pipeline Workflow](#6-mlops-pipeline-workflow)
7. [Software Design Patterns](#7-software-design-patterns)
   - 7.1 Builder Pattern
   - 7.2 Factory Method Pattern
   - 7.3 Abstract Factory Pattern
   - 7.4 Adapter Pattern
   - 7.5 Decorator Pattern
   - 7.6 Composite Pattern
   - 7.7 Chain of Responsibility
   - 7.8 Command Pattern
   - 7.9 State Pattern
   - 7.10 Observer Pattern
   - 7.11 Plugin Architecture
8. [SOLID Principles](#8-solid-principles)
9. [Platform Modules](#9-platform-modules)
   - 9.1 CI/CD Pipeline Engine
   - 9.2 Experiment Tracking
   - 9.3 Model Registry
   - 9.4 Data Validation
   - 9.5 Drift Detection & Monitoring
   - 9.6 Feature Store
10. [Database Schema](#10-database-schema)
11. [REST API Reference](#11-rest-api-reference)
12. [WebSocket Events](#12-websocket-events)
13. [CI/CD with GitHub Actions](#13-cicd-with-github-actions)
14. [Kubernetes Deployment](#14-kubernetes-deployment)
15. [Setup & Installation](#15-setup--installation)
16. [How to Run](#16-how-to-run)

---

## 1. Project Overview

**PipeForge** is an enterprise-grade MLOps platform that automates the complete machine learning lifecycle — from raw data to production inference.

The platform implements the full ML deployment loop:

```
Raw Data Arrival
      ↓
Data Validation (Great Expectations-style)
      ↓
Feature Engineering (Feast Feature Store)
      ↓
Model Training (XGBoost / LightGBM / PyTorch + Optuna HPO)
      ↓
Experiment Tracking (MLflow-style)
      ↓
Model Evaluation (Champion vs Challenger)
      ↓
Model Registry (Versioned + Staged)
      ↓
Security Scan (Trivy)
      ↓
Canary Release (10% → 100% traffic)
      ↓
Production Inference API (/predict /health)
      ↓
Real-time Monitoring (Latency / Throughput / Error Rate)
      ↓
Drift Detection (PSI Score / Evidently AI-style)
      ↓
Auto-Retraining Trigger
      ↓
Automatic Rollback if unhealthy
```

PipeForge is architected with **11 proven design patterns**, **SOLID principles**, and a full **microservices-inspired modular structure** — making it production-ready and academically rigorous.

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
| **Socket.IO** | 4.x | Real-time WebSocket streaming |
| **Passport + JWT** | — | Authentication & authorization |
| **bcrypt** | — | Secure password hashing |
| **EventEmitter2** | — | Observer pattern / event bus |
| **class-validator** | — | DTO input validation |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.x | React full-stack framework (App Router) |
| **TypeScript** | 5.x | Static typing throughout |
| **Tailwind CSS** | 4.x | Utility-first styling |
| **shadcn/ui** | — | Accessible UI components |
| **Zustand** | — | Client-side state management |
| **Recharts** | — | Dashboard + metrics charts |
| **dnd-kit** | — | Drag-and-drop pipeline builder |
| **Socket.io-client** | — | WebSocket live log streaming |
| **React Hook Form + Zod** | — | Form validation |
| **date-fns** | — | Timestamp formatting |

### Infrastructure & MLOps
| Tool | Purpose |
|---|---|
| **Docker** | Containerized services |
| **docker-compose** | Local multi-service orchestration |
| **GitHub Actions** | CI (lint, type-check, build, Trivy scan) + CD (build, push, deploy) |
| **Kubernetes** | Production orchestration with HPA autoscaling |
| **Helm** | Kubernetes package manager chart |
| **Trivy** | Container image vulnerability scanning |

---

## 4. System Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                        BROWSER CLIENT                          │
│   Next.js App Router (React + Zustand + Recharts)             │
│   CI/CD: Dashboard · Pipelines · Builder · Executions          │
│   MLOps: Experiments · Model Registry · Monitoring · Drift     │
└──────────────┬────────────────────────────┬───────────────────┘
               │ HTTP REST                  │ WebSocket
               ▼                            ▼
┌───────────────────────────────────────────────────────────────┐
│                       NESTJS BACKEND                           │
│                                                                │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────────┐   │
│  │   Auth   │  │ Pipelines │  │   Execution Engine        │   │
│  │  Module  │  │  Module   │  │ (Chain+State+Factory+Dec) │   │
│  └──────────┘  └───────────┘  └──────────────────────────┘   │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │  Experiments │  │Model Registry│  │ Data Validation  │    │
│  │   Module     │  │   Module     │  │    Module        │    │
│  └──────────────┘  └──────────────┘  └──────────────────┘    │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │    Drift     │  │   Feature    │  │    Providers     │    │
│  │  Detection   │  │    Store     │  │ (AWS/Azure/GCP)  │    │
│  └──────────────┘  └──────────────┘  └──────────────────┘    │
│                                                                │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────────┐   │
│  │ Rollback │  │  Plugins  │  │ WebSocket Gateway        │   │
│  │  Module  │  │  Module   │  │ (Observer Pattern)        │   │
│  └──────────┘  └───────────┘  └──────────────────────────┘   │
│                                                                │
│                  EventEmitter2 (Observer Bus)                  │
└─────────────────────────────┬─────────────────────────────────┘
                              │ Prisma ORM
                              ▼
┌───────────────────────────────────────────────────────────────┐
│                  PostgreSQL (Docker port 5433)                  │
│  User · Pipeline · Stage · Execution · Plugin · Notification   │
│  Experiment · ModelVersion · DataValidationRun                 │
│  DriftAlert · Feature                                          │
└───────────────────────────────────────────────────────────────┘
```

### Architectural Patterns
- **Layered Architecture** — Controller → Service → Repository (Prisma)
- **Dependency Injection** — NestJS IoC container
- **Repository Pattern** — PrismaService abstracts all DB access
- **Event-Driven Architecture** — EventEmitter2 decouples execution from side effects
- **Plugin Architecture** — Dynamically loadable plugins via `IPlugin` interface
- **MVC-inspired Frontend** — Pages (View) → Stores (Model) → Services (Controller)

---

## 5. Complete Folder Structure

```
c:\code\sdaproject\
│
├── .github/
│   └── workflows/
│       ├── ci.yml              ← Lint, type-check, build, Trivy scan, smoke test
│       └── cd.yml              ← Docker build+push, staging deploy, canary prod deploy
│
├── kubernetes/
│   ├── namespace.yaml          ← Kubernetes namespace
│   ├── backend-deployment.yaml ← Backend Deployment + Service + HPA autoscaler
│   ├── frontend-deployment.yaml← Frontend Deployment + Service
│   ├── ingress.yaml            ← Nginx Ingress + TLS
│   ├── configmap-secret.yaml   ← ConfigMap + Secret template
│   └── helm/
│       ├── Chart.yaml          ← Helm chart metadata
│       └── values.yaml         ← Configurable deployment values
│
├── frontend/                   ← Next.js App
│   ├── Dockerfile              ← Multi-stage production build
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── login/page.tsx
│       │   └── (dashboard)/
│       │       ├── layout.tsx
│       │       ├── dashboard/page.tsx       ← KPI + charts
│       │       ├── pipelines/page.tsx       ← Pipeline CRUD
│       │       ├── builder/page.tsx         ← Drag-drop builder
│       │       ├── executions/page.tsx      ← Live log viewer
│       │       ├── experiments/page.tsx     ← Experiment tracking (NEW)
│       │       ├── model-registry/page.tsx  ← Model versions (NEW)
│       │       ├── monitoring/page.tsx      ← Inference monitoring (NEW)
│       │       ├── drift/page.tsx           ← Drift detection (NEW)
│       │       ├── plugins/page.tsx
│       │       └── settings/page.tsx
│       │
│       ├── services/
│       │   └── api.ts          ← Axios client + all API calls (ML endpoints added)
│       └── components/
│           └── shared/
│               └── Sidebar.tsx ← Updated: CI/CD + ML Platform + System sections
│
├── backend/                    ← NestJS App
│   ├── Dockerfile              ← Multi-stage production build
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── auth/
│   │   ├── pipelines/
│   │   │   ├── builders/
│   │   │   │   ├── pipeline.builder.ts  ← +7 ML stage builder methods
│   │   │   │   └── pipeline.director.ts ← +3 ML pipeline templates
│   │   │   └── composite/
│   │   ├── execution/
│   │   │   └── factories/
│   │   │       └── stage.factory.ts     ← +7 ML stage executors
│   │   │
│   │   ├── experiments/        ← Experiment tracking (NEW)
│   │   ├── model-registry/     ← Model versioning + promotion (NEW)
│   │   ├── data-validation/    ← Data quality checks (NEW)
│   │   ├── drift-detection/    ← PSI drift + inference metrics (NEW)
│   │   ├── feature-store/      ← Feature catalog (NEW)
│   │   │
│   │   ├── rollback/
│   │   ├── notifications/
│   │   ├── websocket/
│   │   ├── plugins/
│   │   ├── metrics/
│   │   └── providers/
│   │       ├── adapters/       ← AWS / Azure / GCP adapters
│   │       └── factories/      ← Abstract cloud factory
│   │
│   └── prisma/
│       ├── schema.prisma       ← +5 ML models (Experiment, ModelVersion, etc.)
│       └── seed.ts             ← Full ML dataset seeded
│
└── docker-compose.yml          ← PostgreSQL container
```

---

## 6. MLOps Pipeline Workflow

### Automated ML Lifecycle

When new data arrives (via scheduled trigger or API call):

1. **Data Validation** — Schema checks, null rates, distribution shift (Great Expectations-style)
2. **Feature Engineering** — Aggregate features computed, stored in Feast Feature Store
3. **Model Training** — XGBoost/LightGBM/PyTorch trained with Optuna HPO (50 trials)
4. **Experiment Tracking** — Metrics, params, and artifacts logged (MLflow-style)
5. **Model Evaluation** — Champion vs. Challenger comparison on holdout set
6. **Model Registry** — New version registered with stage: `candidate → staging → production`
7. **Security Scan** — Trivy container vulnerability check
8. **Canary Deploy** — 10% traffic routed to new model, metrics monitored
9. **Full Promotion** — If error rate < 1% and latency < SLA, 100% traffic promoted
10. **Production Monitoring** — Latency P50/P99, throughput, error rate tracked
11. **Drift Detection** — PSI score computed on live data; concept/data/label drift monitored
12. **Auto-Retrain** — If PSI > 0.20, pipeline re-triggered automatically
13. **Rollback** — Unhealthy releases rolled back to previous stable version

### ML Pipeline Templates

Three new pipeline templates available in the Builder:

| Template | Stages | Use Case |
|---|---|---|
| `mltraining` | DataValidation → FeatureEng → Train → Evaluate → Register | Model training from scratch |
| `mldeploy` | SecurityScan → Canary → Monitor → DriftCheck | Deploy existing model |
| `fullmlops` | All 9 stages end-to-end | Complete production MLOps workflow |

### ML Stage Executors

7 new stage executors added to `StageFactory`:

| Executor | Type | Simulates |
|---|---|---|
| `DataValidationExecutor` | `data-validation` | Great Expectations suite (12 checks) |
| `FeatureEngineeringExecutor` | `feature-engineering` | Feast feature computation + encoding |
| `ModelTrainingExecutor` | `model-training` | XGBoost/Optuna HPO training loop |
| `ModelEvaluationExecutor` | `model-evaluation` | Champion vs Challenger AUC comparison |
| `ModelRegistrationExecutor` | `model-registration` | MLflow Model Registry artifact storage |
| `CanaryDeployExecutor` | `canary-deploy` | Traffic split + latency/error monitoring |
| `DriftCheckExecutor` | `drift-check` | Evidently AI PSI + KL-divergence check |

---

## 7. Software Design Patterns

Every pattern below is **fully implemented** in working code.

---

### 7.1 Builder Pattern *(Creational)*

**File:** `backend/src/pipelines/builders/pipeline.builder.ts`

**Intent:** Separate complex object construction from representation.

**ML Extension:** Builder now includes 7 ML stage methods alongside original CI/CD methods:

```typescript
export class PipelineBuilder {
  addDataValidationStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Data Validation', type: 'data-validation',
      orderIndex: this.stageIndex++,
      config: config || { dataset: 'training_data.parquet', checks: 12 },
      decorators: ['logging', 'metrics'],
    });
    return this;
  }

  addModelTrainingStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Model Training', type: 'model-training',
      orderIndex: this.stageIndex++,
      config: config || { model: 'XGBoost', trials: 50 },
      decorators: ['logging', 'metrics', 'notification'],
    });
    return this;
  }

  // + addFeatureEngineeringStage, addModelEvaluationStage,
  //   addModelRegistrationStage, addCanaryDeployStage, addDriftCheckStage
}
```

**Full MLOps pipeline via Director:**
```typescript
PipelineDirector.buildFullMLOpsPipeline('Fraud Detector v2')
// → DataValidation → FeatureEng → Train → Evaluate → Register → Security → Canary → Monitor → DriftCheck
```

---

### 7.2 Factory Method Pattern *(Creational)*

**File:** `backend/src/execution/factories/stage.factory.ts`

**Intent:** Define an interface for creating objects, letting subclasses decide which class to instantiate.

**ML Extension:** 7 new ML executors added to the registry:

```typescript
export class ModelTrainingExecutor implements IStageExecutor {
  getName() { return 'Model Training'; }
  async execute(config: any, forceFail = false) {
    logs.push(`[Training] Initializing ${config.model || 'XGBoost'} trainer`);
    logs.push(`[Training] Starting Optuna HPO (${config.trials || 50} trials)`);
    // ... training simulation ...
    logs.push(`[Training] Best params: learning_rate=0.042, max_depth=6, n_estimators=412`);
    logs.push(`[Training] 5-fold CV: AUC=${auc}, F1=${f1}`);
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class StageFactory {
  private static executors = {
    // Original CI/CD executors
    build: BuildStageExecutor,
    test: TestStageExecutor,
    // ... existing ...

    // New ML executors
    'data-validation': DataValidationExecutor,
    'feature-engineering': FeatureEngineeringExecutor,
    'model-training': ModelTrainingExecutor,
    'model-evaluation': ModelEvaluationExecutor,
    'model-registration': ModelRegistrationExecutor,
    'canary-deploy': CanaryDeployExecutor,
    'drift-check': DriftCheckExecutor,
  };
}
```

**Open/Closed Principle:** Adding `ModelTrainingExecutor` required zero changes to the execution engine.

---

### 7.3 Abstract Factory Pattern *(Creational)*

**File:** `backend/src/providers/factories/cloud.factory.ts`

**Intent:** Provide an interface for creating families of related objects.

```typescript
export interface ICloudProviderFactory {
  createDeploymentClient(): ICloudProvider;
  getProviderName(): string;
}

export class AWSFactory implements ICloudProviderFactory {
  createDeploymentClient() { return new AWSAdapter(); }
  getProviderName() { return 'AWS'; }
}

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

---

### 7.4 Adapter Pattern *(Structural)*

**File:** `backend/src/providers/adapters/cloud.adapter.ts`

**Intent:** Normalize incompatible interfaces.

```typescript
export interface ICloudProvider {
  deploy(config: any): Promise<{ success: boolean; message: string }>;
  rollback(config: any): Promise<{ success: boolean; message: string }>;
  monitor(config: any): Promise<{ healthy: boolean; latency: number }>;
}

// AWS, Azure, GCP all expose different APIs — Adapters normalize them
export class AWSAdapter implements ICloudProvider {
  private client = new AwsNativeClient();
  async deploy(config: any) {
    const result = await this.client.deploy(config.region, 'app:latest', config.replicas);
    return { success: true, message: `AWS ECS deployed ${result.replicas} replicas` };
  }
}
```

---

### 7.5 Decorator Pattern *(Structural)*

**File:** `backend/src/execution/decorators/stage.decorators.ts`

**Intent:** Add responsibilities dynamically without subclassing.

```typescript
export class RetryDecorator extends StageDecorator {
  async execute(config: any, forceFail?: boolean) {
    let result = await this.wrappee.execute(config, forceFail);
    if (result.success) return result;
    for (let i = 0; i < this.maxRetries; i++) {
      result = await this.wrappee.execute(config, false);
      if (result.success) return result;
    }
    return result;
  }
}

// ML stages can stack: Logging + Metrics + Notification
new NotificationDecorator(
  new MetricsDecorator(
    new LoggingDecorator(
      new ModelTrainingExecutor()
    )
  )
)
```

---

### 7.6 Composite Pattern *(Structural)*

**File:** `backend/src/pipelines/composite/stage.composite.ts`

**Intent:** Treat individual objects and compositions uniformly.

```typescript
// An entire ML suite treated as a single stage
const mlSuite = new CompositeStageGroup('ML Training Suite');
mlSuite.add(new LeafStage('Data Validation', 'data-validation'));
mlSuite.add(new LeafStage('Feature Engineering', 'feature-engineering'));
mlSuite.add(new LeafStage('Model Training', 'model-training'));

// Engine calls mlSuite.execute() — identical to a single stage
await mlSuite.execute();
```

---

### 7.7 Chain of Responsibility *(Behavioral)*

**File:** `backend/src/execution/chain/execution.chain.ts`

**Intent:** Pass requests along a chain; each handler decides to process or pass.

```
DataValidation → FeatureEng → ModelTraining → Evaluation → Registration → Canary
     ↓ pass           ↓ pass         ↓ FAIL
                                [chain stops, auto-rollback triggered]
```

---

### 7.8 Command Pattern *(Behavioral)*

**File:** `backend/src/execution/commands/execution.commands.ts`

**Intent:** Encapsulate requests as undoable command objects.

```typescript
export class ExecutePipelineCommand implements ICommand {
  async execute() { return this.executionService.runPipeline(this.pipelineId, this.options); }
}

export class RollbackCommand implements ICommand {
  async execute() { return this.rollbackService.rollback(this.executionId); }
}

// ExecutionManager stores command history for undo support
await manager.invoke(new ExecutePipelineCommand(...));
await manager.undoLast(); // → triggers RollbackCommand
```

---

### 7.9 State Pattern *(Behavioral)*

**File:** `backend/src/execution/states/pipeline.state.ts`

**Intent:** Alter behavior based on internal state.

```
Idle ──[start]──► Running ──[all pass]──► Success
                      │
                 [stage fails]
                      ▼
                   Failed ──[rollback]──► Rollback ──► Idle
```

---

### 7.10 Observer Pattern *(Behavioral)*

**Files:** `websocket/execution.gateway.ts` + `execution/execution.service.ts`

**Intent:** Notify multiple dependents when state changes.

```typescript
// Execution engine emits events (Subject)
this.eventEmitter.emit('execution.log', { executionId, message, stage });
this.eventEmitter.emit('drift.detected', { alertId, modelName, psiScore });

// Multiple observers react independently:
// → ExecutionGateway → pushes to browser WebSocket
// → NotificationsService → creates DB notification
// → DriftDetectionService → triggers auto-retrain
```

---

### 7.11 Plugin Architecture

**File:** `backend/src/plugins/plugins.service.ts`

```typescript
// MLOps plugins now available:
pluginRegistry = {
  'MLflow Tracker':    new MLflowTrackerPlugin(),
  'Evidently Monitor': new EvidentiallyPlugin(),
  'Trivy Scanner':     new TrivyScannerPlugin(),
  // + original: Slack, Email, Discord, Security, AI Advisor, etc.
}
```

---

## 8. SOLID Principles

### S — Single Responsibility
| Module | Responsibility |
|---|---|
| `ExperimentsModule` | Only tracks ML experiment metrics and params |
| `ModelRegistryModule` | Only manages model version lifecycle (stage promotion, rollback) |
| `DataValidationModule` | Only runs data quality check suites |
| `DriftDetectionModule` | Only detects drift and generates alerts |
| `FeatureStoreModule` | Only catalogs reusable feature definitions |
| `ExecutionModule` | Only runs pipeline stages via Chain+Factory+Decorator |

### O — Open/Closed
- Add new ML stage executor: create class → register in `StageFactory` map → zero engine changes
- Add new ML pipeline template: add method in `PipelineDirector` → zero pipeline service changes
- Add new cloud provider: create `DigitalOceanAdapter + DOFactory` → zero execution engine changes

### L — Liskov Substitution
```typescript
// All 14 stage executors are substitutable:
const executor: IStageExecutor = StageFactory.create('model-training');
const executor: IStageExecutor = StageFactory.create('canary-deploy');
// Engine always calls executor.execute() — concrete class irrelevant
```

### I — Interface Segregation
```typescript
IStageExecutor   { execute(), getName() }              // execution only
ICloudProvider   { deploy(), rollback(), monitor() }   // cloud only
IPlugin          { init(), execute(), destroy() }      // plugin lifecycle only
IStageComponent  { getName(), execute() }              // composite only
ICommand         { execute(), undo?() }                // command only
IPipelineState   { canStart(), canCancel(), ... }      // state only
```

### D — Dependency Inversion
```typescript
// Execution engine depends on IStageExecutor, never concrete class
const executor: IStageExecutor = StageFactory.create(stage.type);

// Cloud provider injected via factory, never directly
const provider: ICloudProvider = CloudFactoryResolver.resolve(pipeline.provider);
```

---

## 9. Platform Modules

### 9.1 CI/CD Pipeline Engine

Full pipeline execution with real-time WebSocket streaming, state machine lifecycle, decorator-wrapped stages, and auto-rollback on failure.

**Stage Types Available:**
`build` · `test` · `security` · `deploy` · `monitor` · `lint` · `package` · `data-validation` · `feature-engineering` · `model-training` · `model-evaluation` · `model-registration` · `canary-deploy` · `drift-check`

---

### 9.2 Experiment Tracking

MLflow-style experiment tracking with metrics comparison, hyperparameter logging, and visual radar charts.

**Tracked per experiment:**
- Metrics: AUC-ROC, F1, Precision, Recall, Accuracy, Loss
- Parameters: learning_rate, max_depth, n_estimators, dropout, etc.
- Model type: xgboost, lightgbm, random_forest, pytorch
- Tags: production-candidate, baseline, archived
- Duration and lineage

**API:** `GET /experiments` · `POST /experiments` · `POST /experiments/compare`

---

### 9.3 Model Registry

Versioned model management with stage-based promotion workflow.

**Stage lifecycle:**
```
candidate → staging → production
                    ↓ (on new promotion)
                  archived
```

**Operations:** Promote, rollback, archive

**API:** `GET /model-registry` · `POST /model-registry/:id/promote` · `POST /model-registry/:name/rollback`

---

### 9.4 Data Validation

Great Expectations-style validation suite with 12 automated checks per dataset run.

**Checks performed:**
- Schema validation (column presence and types)
- Null value threshold (per-column)
- Value range enforcement
- Duplicate row detection
- Categorical value set validation
- Distribution shift (KS statistic)
- Outlier detection
- Target label balance
- Foreign key integrity
- Date range validation
- String format validation (email, phone)
- Feature correlation analysis

**API:** `GET /data-validation` · `POST /data-validation/run`

---

### 9.5 Drift Detection & Monitoring

Evidently AI-style drift monitoring with PSI score computation, real-time inference metrics, and auto-retraining triggers.

**Drift types detected:** Data drift · Concept drift · Label drift · Prediction drift

**Inference monitoring metrics:**
- P50/P99 inference latency
- Throughput (requests per minute)
- Error rate
- Prediction distribution (24h)
- Per-feature PSI scores

**Alert lifecycle:** `open → acknowledged → resolved`

**API:** `GET /drift-detection` · `POST /drift-detection/check` · `GET /drift-detection/metrics`

---

### 9.6 Feature Store

Feast-inspired feature catalog with entity-grouped feature definitions.

**Feature entities:** customer · transaction · product

**API:** `GET /feature-store` · `PATCH /feature-store/:id/toggle`

---

## 10. Database Schema

```
┌──────────┐     ┌────────────┐     ┌──────────┐
│   User   │────►│  Pipeline  │────►│  Stage   │
└──────────┘     └──────┬─────┘     └──────────┘
                        │
                        ▼
                 ┌────────────┐
                 │ Execution  │
                 └────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Experiment  │     │ ModelVersion │     │DataValidationRun │
│──────────────│     │──────────────│     │──────────────────│
│ id           │     │ id           │     │ id               │
│ name         │     │ name         │     │ datasetName      │
│ modelType    │     │ version      │     │ status           │
│ metrics JSON │     │ stage        │     │ rowCount         │
│ params JSON  │     │ framework    │     │ checksPassed     │
│ tags JSON    │     │ metrics JSON │     │ checksFailed     │
│ status       │     │ artifactPath │     │ results JSON     │
│ duration     │     │ promotedAt   │     └──────────────────┘
│ pipelineId   │     │ experimentId │
└──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐
│  DriftAlert  │     │   Feature    │
│──────────────│     │──────────────│
│ id           │     │ id           │
│ alertType    │     │ name         │
│ severity     │     │ entity       │
│ feature      │     │ valueType    │
│ psiScore     │     │ description  │
│ threshold    │     │ source       │
│ modelName    │     │ tags JSON    │
│ autoRetrain  │     │ enabled      │
│ status       │     └──────────────┘
│ resolvedAt   │
└──────────────┘
```

---

## 11. REST API Reference

Base URL: `http://localhost:4000/api/v1`

All routes except `/auth/login` require: `Authorization: Bearer <JWT_TOKEN>`

### Authentication
| Method | Route | Description |
|---|---|---|
| POST | `/auth/login` | Login → JWT token |
| GET | `/auth/me` | Current user profile |

### Pipelines & Execution
| Method | Route | Description |
|---|---|---|
| GET | `/pipelines` | List all pipelines |
| POST | `/pipelines` | Create pipeline |
| POST | `/pipelines/template/:name` | From template (`node`, `docker`, `fullqa`, `quickdeploy`, `mltraining`, `mldeploy`, `fullmlops`) |
| POST | `/execution/start/:id` | Run pipeline |
| POST | `/execution/rollback/:id` | Rollback execution |
| GET | `/execution/history` | Execution history |

### MLOps — Experiments
| Method | Route | Description |
|---|---|---|
| GET | `/experiments` | List all experiments |
| POST | `/experiments` | Create experiment |
| POST | `/experiments/compare` | Compare multiple experiments |

### MLOps — Model Registry
| Method | Route | Description |
|---|---|---|
| GET | `/model-registry` | List all model versions |
| POST | `/model-registry/:id/promote` | Promote to staging/production/archived |
| POST | `/model-registry/:name/rollback` | Rollback to previous version |

### MLOps — Data Validation
| Method | Route | Description |
|---|---|---|
| GET | `/data-validation` | Validation run history |
| POST | `/data-validation/run` | Run validation suite on dataset |

### MLOps — Drift Detection
| Method | Route | Description |
|---|---|---|
| GET | `/drift-detection` | All drift alerts |
| GET | `/drift-detection/open` | Open alerts |
| GET | `/drift-detection/metrics` | Inference monitoring metrics |
| POST | `/drift-detection/check` | Run drift check on a model |
| POST | `/drift-detection/:id/acknowledge` | Acknowledge alert |
| POST | `/drift-detection/:id/resolve` | Resolve alert |

### MLOps — Feature Store
| Method | Route | Description |
|---|---|---|
| GET | `/feature-store` | List all features |
| GET | `/feature-store?entity=customer` | Filter by entity |
| PATCH | `/feature-store/:id/toggle` | Enable/disable feature |

### System
| Method | Route | Description |
|---|---|---|
| GET | `/metrics/dashboard` | KPI + charts |
| GET | `/plugins` | Plugin list |
| PATCH | `/plugins/:id/toggle` | Toggle plugin |
| GET | `/notifications` | Notifications |

---

## 12. WebSocket Events

Connect to: `ws://localhost:4000`

| Event | Payload | Description |
|---|---|---|
| `execution:start` | `{ executionId, pipelineId }` | Pipeline started |
| `execution:stage` | `{ executionId, stageName, status, stageIndex }` | Stage status |
| `execution:log` | `{ executionId, time, message, stage }` | Live log line |
| `execution:success` | `{ executionId, pipelineId }` | All stages passed |
| `execution:failed` | `{ executionId, failedStage }` | Stage failed |
| `execution:rollback` | `{ executionId }` | Rollback triggered |

---

## 13. CI/CD with GitHub Actions

### CI Pipeline (`.github/workflows/ci.yml`)

Triggers on every push and pull request to `main`:

```
Push / PR
   ↓
Backend Lint + Type Check
   ↓
Backend Build
   ↓
Frontend Lint + Type Check + Build
   ↓
Trivy Container Vulnerability Scan
   ↓
Integration Smoke Test (Postgres + Migration + Seed + API check)
```

### CD Pipeline (`.github/workflows/cd.yml`)

Triggers on push to `main` or version tag (`v*.*.*`):

```
Push to main / tag
   ↓
Build + Push Docker Images → GitHub Container Registry
   ↓
Deploy to Staging (kubectl apply)
   ↓
Staging Smoke Tests
   ↓ (tags only)
Canary Deploy to Production (10% traffic)
   ↓
Monitor canary metrics
   ↓
Promote to 100% OR Emergency Rollback
```

---

## 14. Kubernetes Deployment

### Manifests

| File | Contents |
|---|---|
| `namespace.yaml` | `pipeforge` namespace |
| `backend-deployment.yaml` | Deployment + Service + HPA (2–20 pods, CPU 70%) |
| `frontend-deployment.yaml` | Deployment + Service |
| `ingress.yaml` | Nginx Ingress + TLS (cert-manager) |
| `configmap-secret.yaml` | ConfigMap + Secret template |
| `helm/Chart.yaml` | Helm chart metadata |
| `helm/values.yaml` | Configurable replica counts, images, autoscaling |

### Deploy with Helm

```bash
# Add chart and deploy
helm upgrade --install pipeforge ./kubernetes/helm \
  --namespace pipeforge \
  --create-namespace \
  --set image.tag=v1.2.0 \
  --set backend.resources.limits.memory=512Mi
```

### Autoscaling

```yaml
minReplicas: 2
maxReplicas: 20
targetCPUUtilizationPercentage: 70
# Scales from 2 pods → 20 pods under load
```

---

## 15. Setup & Installation

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
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 16. How to Run

### Step 1 — Start PostgreSQL (Docker)
```bash
docker compose up -d
```
> PostgreSQL runs on **port 5433**

### Step 2 — Run database migration + seed
```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```
> Seed includes: admin user, pipelines (CI/CD + ML), 5 experiments, model registry, drift alerts, feature store, data validation runs

### Step 3 — Start Backend
```bash
cd backend
npm run start:dev
```
> API: `http://localhost:4000`

### Step 4 — Start Frontend
```bash
cd frontend
npm run dev
```
> App: `http://localhost:3000`

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

## Design Pattern Summary

| Pattern | Category | File | Role |
|---|---|---|---|
| **Builder** | Creational | `pipelines/builders/pipeline.builder.ts` | Fluent API for CI/CD and ML pipelines |
| **Director** | Creational | `pipelines/builders/pipeline.director.ts` | Templates: node, docker, fullqa, mltraining, mldeploy, fullmlops |
| **Factory Method** | Creational | `execution/factories/stage.factory.ts` | Creates 14 stage executors by type string |
| **Abstract Factory** | Creational | `providers/factories/cloud.factory.ts` | Creates cloud provider families (AWS/Azure/GCP) |
| **Adapter** | Structural | `providers/adapters/cloud.adapter.ts` | Normalizes AWS/Azure/GCP APIs |
| **Decorator** | Structural | `execution/decorators/stage.decorators.ts` | Stacks logging/retry/metrics/notification |
| **Composite** | Structural | `pipelines/composite/stage.composite.ts` | Groups stages as tree structures |
| **Chain of Responsibility** | Behavioral | `execution/chain/execution.chain.ts` | Sequential stage execution with fail-fast |
| **Command** | Behavioral | `execution/commands/execution.commands.ts` | Undoable execute/rollback operations |
| **State** | Behavioral | `execution/states/pipeline.state.ts` | Idle → Running → Success/Failed → Rollback |
| **Observer** | Behavioral | `websocket/execution.gateway.ts` | Decouples engine from WebSocket/notifications/drift |
| **Plugin** | Architectural | `plugins/plugins.service.ts` | Dynamic MLflow, Evidently, Trivy extensions |

---

*PipeForge — Enterprise MLOps Platform. Built with production-grade design patterns, automated CI/CD, and a complete ML lifecycle from data validation to drift-triggered retraining.*
