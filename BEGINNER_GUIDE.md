# 🚀 PipeForge — Beginner's Guide to Enterprise MLOps

> **Welcome to PipeForge!** This guide walks you through everything you need to know to build, deploy, and manage machine learning models in production.

---

## Table of Contents

1. [What is PipeForge?](#what-is-pipeforge)
2. [Why Use PipeForge?](#why-use-pipeforge)
3. [Quick Start (5 Minutes)](#quick-start-5-minutes)
4. [Platform Architecture](#platform-architecture)
5. [Complete ML Workflow](#complete-ml-workflow)
6. [Core Features Explained](#core-features-explained)
7. [Step-by-Step Usage Guide](#step-by-step-usage-guide)
8. [Common Use Cases](#common-use-cases)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

---

## What is PipeForge?

**PipeForge** is an **enterprise-grade MLOps (Machine Learning Operations) platform** that automates the entire lifecycle of machine learning models — from data preparation to production deployment and beyond.

### The Problem It Solves

Building ML models is challenging. Even harder is managing them in production:

- ❌ How do you train models consistently?
- ❌ How do you track which version is in production?
- ❌ How do you detect when models become outdated?
- ❌ How do you automatically retrain when performance drops?
- ❌ How do you safely deploy new versions without breaking production?

**PipeForge solves all these problems automatically.**

### What It Does (In Simple Terms)

```
Your Data → Clean & Validate → Extract Features → Train Model 
    ↓
Track Experiments → Compare Results → Register Best Model 
    ↓
Deploy to Production → Monitor Performance → Detect Drift 
    ↓
Automatically Retrain → Safe Rollout → Back to Production
```

---

## Why Use PipeForge?

### 🎯 Key Benefits

| Benefit | What It Means |
|---------|--------------|
| **Automate Everything** | Stop running manual training scripts. PipeForge pipelines run automatically. |
| **Never Deploy Bad Models** | Experiment tracking ensures only validated models reach production. |
| **Track Versions** | Know exactly which model version is running and when it was trained. |
| **Detect Problems Early** | Real-time monitoring and drift detection catch performance issues before users do. |
| **Safe Deployments** | Canary releases (10% → 100% traffic) test new models safely. |
| **Auto-Recovery** | If a new model performs poorly, automatically rollback to the previous version. |
| **Production-Ready** | Enterprise-grade security, Kubernetes support, and microservices architecture. |

### 📊 Real-World Scenarios

**Scenario 1: E-Commerce Product Recommendation**
- Your recommendation model drifts when seasonal trends change
- PipeForge detects drift → triggers retraining → deploys new model safely
- No manual intervention needed

**Scenario 2: Credit Risk Scoring**
- You want to test a new model on 10% of customers first
- PipeForge's canary deployment gradually increases to 100% if healthy
- Business decision-makers see metrics in real-time dashboard

**Scenario 3: Fraud Detection**
- Your fraud model needs monitoring 24/7
- PipeForge tracks latency, accuracy, and error rates
- Alerts you if anything looks wrong

---

## Quick Start (5 Minutes)

### 1. Start the Platform

```bash
cd c:\code\sdaproject

# Start all services (database, backend, frontend)
docker-compose up -d

# Wait for services to start (30-45 seconds)
docker ps
```

### 2. Access the Dashboard

Open your browser and navigate to:

```
http://localhost:3000
```

### 3. Login with Demo Credentials

```
Email:    admin@pipeforge.dev
Password: admin123
```

### 4. You Should See

- 📊 **Dashboard** — Overview of all pipelines and models
- 🔧 **Pipelines** — Automated ML workflows
- 📈 **Experiments** — Historical model training runs
- 📦 **Model Registry** — Deployed models and versions
- 🚨 **Monitoring** — Real-time model performance metrics
- 🔄 **Drift Detection** — Automatic alerts when models degrade

**Congratulations! PipeForge is running.** 🎉

---

## Platform Architecture

### How PipeForge Works (High Level)

```
┌─────────────────────────────────────────────────────────────┐
│                    USER DASHBOARD                           │
│              (Web Interface in Your Browser)                 │
│  - Create pipelines                                         │
│  - View experiments                                         │
│  - Monitor models                                           │
│  - Check drift alerts                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP API + WebSocket (Real-time Updates)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              PIPEFORGE BACKEND (Brain)                      │
│                   (NestJS Server)                           │
│                                                             │
│  - Pipeline Execution Engine                               │
│  - Experiment Tracking                                     │
│  - Model Registry                                          │
│  - Data Validation                                         │
│  - Drift Detection                                         │
│  - Auto-Retraining Logic                                   │
│  - Notification System                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Prisma ORM
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              DATABASE (Memory)                              │
│         (PostgreSQL - Stores all configurations)            │
│                                                             │
│  - Users & authentication                                  │
│  - Pipeline definitions & executions                       │
│  - Model versions & metadata                               │
│  - Experiment results                                      │
│  - Drift detection records                                 │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Purpose | Example |
|-----------|---------|---------|
| **Pipeline Engine** | Executes ML workflows step-by-step | Load data → Validate → Feature engineer → Train |
| **Execution System** | Tracks each pipeline run | Run #1, #2, #3... with timing & logs |
| **Experiment Tracker** | Logs model training details | Model A: 95% accuracy, 42 features used |
| **Model Registry** | Manages model versions | v1.0 (staging), v1.1 (production), v0.9 (archived) |
| **Data Validator** | Checks data quality | Missing values? Outliers? Schema mismatches? |
| **Drift Detector** | Watches for model degradation | "Model accuracy dropped 3% → needs retraining" |
| **Rollback System** | Reverts to previous version if needed | Auto-downgrade to v1.0 if v1.1 fails |

---

## Complete ML Workflow

This is the **complete journey** of a machine learning model in PipeForge:

### Phase 1️⃣ **Data Ingestion & Preparation**

```
Raw data arrives (CSV, database, API)
          ↓
[DATA VALIDATION MODULE]
  - Check for missing values
  - Detect outliers
  - Validate schema
  - Flag data quality issues
          ↓
✅ Data passed validation
```

**You See In Dashboard:** Data validation report with pass/fail status

---

### Phase 2️⃣ **Feature Engineering**

```
Cleaned data
          ↓
[FEATURE STORE]
  - Extract relevant features
  - Normalize values
  - Create new derived features
          ↓
✅ Feature matrix ready for training
```

**You See In Dashboard:** Feature statistics, count, types

---

### Phase 3️⃣ **Model Training & Experimentation**

```
Feature matrix
          ↓
[EXECUTION ENGINE]
  - Split into train/test sets
  - Train multiple model variants (A/B/C)
  - Hyperparameter tuning with Optuna
          ↓
[EXPERIMENT TRACKER]
  - Log all metrics (accuracy, precision, recall, F1)
  - Record parameters used
  - Store training artifacts
          ↓
✅ Experiments completed
```

**You See In Dashboard:**
- 📊 Experiment comparison table
- 📈 Metrics graphs
- 🏆 "Best model achieved 96.5% accuracy with 42 features"

---

### Phase 4️⃣ **Model Evaluation & Selection**

```
Multiple trained models
          ↓
[CHAMPION vs CHALLENGER]
  - Compare new model (Challenger) vs current production (Champion)
  - Statistical significance testing
  - Business metric alignment
          ↓
Decision: Deploy Challenger? Or keep Champion?
```

**You See In Dashboard:**
- Side-by-side metric comparison
- Recommendation (✅ Deploy or ❌ Keep Current)

---

### Phase 5️⃣ **Model Registry & Versioning**

```
Approved model
          ↓
[MODEL REGISTRY]
  - Register as model version (v2.0)
  - Set stage: Staging → Production
  - Store metadata & lineage
          ↓
✅ Model registered and ready
```

**You See In Dashboard:**
- Model v2.0 in "Staging" stage
- Metadata: Training date, dataset used, metrics

---

### Phase 6️⃣ **Secure Deployment**

```
Model in Staging
          ↓
[CANARY DEPLOYMENT]
  - Route 10% of traffic to new model v2.0
  - Monitor metrics for 1 hour
  - Gradually increase: 10% → 50% → 100%
  - Or rollback if issues detected
          ↓
✅ Model safely in production
```

**You See In Dashboard:**
- Real-time traffic distribution (v1.0: 90%, v2.0: 10%)
- Live health metrics
- Rollback button (always available)

---

### Phase 7️⃣ **Production Monitoring & Alerts**

```
Model running in production
          ↓
[MONITORING MODULE]
  - Track predictions/second (throughput)
  - Track average response time (latency)
  - Track error rate
  - Track prediction distribution
          ↓
Real-time dashboard updates every 5 seconds
```

**You See In Dashboard:**
- 📊 Live performance charts
- 🟢 "Healthy" indicator
- ⚠️ Alert: "Latency increased 40%"

---

### Phase 8️⃣ **Drift Detection & Alert**

```
Production metrics over time
          ↓
[DRIFT DETECTOR]
  - Compare new data distribution to training data
  - Calculate Population Stability Index (PSI)
  - Detect if model inputs have changed
          ↓
ALERT: "Model drift detected! Model accuracy predicted to drop 5%"
```

**You See In Dashboard:**
- 🔴 Red flag: "Drift Alert"
- Recommendation: "Trigger retraining"

---

### Phase 9️⃣ **Auto-Retraining & Rollback**

```
Drift detected + Retraining triggered
          ↓
[AUTOMATIC RETRAINING]
  - Run pipeline with latest data
  - Compare new model to current production model
  - If better: Deploy as v2.1 (canary again)
  - If worse: Keep running v2.0, alert engineer
          ↓
✅ Cycle repeats (or manual intervention)
```

**You See In Dashboard:**
- Retraining status: "In Progress"
- Automatically deploy when ready
- Or manual review required

---

### Phase 🔟 **Lifecycle Management**

```
Models accumulate over time
          ↓
[MODEL REGISTRY]
  - v1.0: Archived (old)
  - v1.5: Staging (being tested)
  - v2.0: Production (active)
  - v2.1: Production (canary - 5%)
          ↓
You can:
  - Compare any two versions
  - Rollback instantly
  - Archive outdated models
  - View full lineage
```

**You See In Dashboard:**
- Model history timeline
- One-click rollback to any version
- Version metadata & comparison

---

## Core Features Explained

### 🔧 **1. Pipeline Builder**

**What:** Drag-and-drop interface to create ML workflows

**How to Use:**
1. Navigate to **Pipelines** → **Create New Pipeline**
2. Drag stages onto canvas:
   - Data Loader
   - Validator
   - Feature Engineer
   - Model Trainer
   - Evaluator
   - Registry
3. Connect stages with arrows
4. Set parameters (learning rate, batch size, etc.)
5. Click **Save & Run**

**Example Pipeline:**
```
[Load CSV Data] → [Validate Data] → [Extract Features] 
    → [Train XGBoost] → [Evaluate Model] → [Register if Good]
```

---

### 📊 **2. Experiment Tracking**

**What:** Automatically logs and compares every training run

**What Gets Logged:**
- ✅ Metrics (accuracy, precision, recall, F1, AUC)
- ✅ Parameters (learning rate, tree depth, features used)
- ✅ Training time
- ✅ Dataset size & shape
- ✅ Git commit hash (if available)
- ✅ Tags (e.g., "production-candidate")

**Use Cases:**
- "Show me all experiments from last week"
- "Compare accuracy of Model A vs Model B"
- "Which hyperparameters gave best results?"

**How to Access:**
1. Go to **Experiments** tab
2. Click any experiment to see details
3. Compare side-by-side with another experiment

---

### 📦 **3. Model Registry**

**What:** Central repository for all model versions

**Stages:**
- 🟡 **Staging** — Being tested
- 🟢 **Production** — Actively serving predictions
- ⚪ **Archived** — No longer used

**What You Can Do:**
- ✅ View all versions of a model
- ✅ Transition version through stages
- ✅ Add descriptions & tags
- ✅ Rollback to previous version (1-click)
- ✅ Compare two versions side-by-side
- ✅ View complete lineage (trained date, dataset, metrics)

**Example:**
```
Model: "churn-prediction"
  ├─ v1.0 (Archived)
  │  └─ Accuracy: 92%, Date: Jan 1, 2026
  ├─ v1.5 (Staging)
  │  └─ Accuracy: 94%, Date: Feb 15, 2026 ← Being tested
  └─ v2.0 (Production)
     └─ Accuracy: 95.5%, Date: Mar 1, 2026 ← Live now
```

---

### ✅ **4. Data Validation**

**What:** Automated quality checks on incoming data

**Checks Include:**
- Missing values (nulls)
- Data type mismatches
- Outliers & anomalies
- Schema validation
- Range validation (e.g., age 0-150)
- Uniqueness constraints

**Example Alert:**
```
⚠️ Validation Failed
  - Missing values in 'income' column: 2.3% (expected max 1%)
  - 15 negative ages found (invalid data)
  - Schema mismatch: 'email' expected string, got null
  
Action: Review source data before training
```

---

### 🔄 **5. Drift Detection & Monitoring**

**What:** Watches for model degradation in production

**Monitors:**
- 📉 **Data Drift** — Input distribution changed
- 📊 **Prediction Drift** — Output distribution changed
- ⏱️ **Latency** — Predictions getting slower
- 🚫 **Error Rate** — More failures happening
- 📈 **Business Metrics** — Sales, CTR, conversion declining

**Alert Example:**
```
🔴 DRIFT ALERT
  Model: churn-prediction (v2.0)
  Metric: Accuracy
  
  Baseline (Training): 95.5%
  Current (Last 24h):  92.1%
  Change: -3.4% 🔻
  
  Population Stability Index (PSI): 0.18 (High)
  
  Recommended Action: Trigger retraining
```

---

### 🎯 **6. Canary Deployment**

**What:** Safely roll out new models to a percentage of users

**Timeline:**
```
Hour 0:     v1.0: 100% traffic → v1.0: 90%, v2.0: 10% ✨ (v2.0 new)
Hour 1:     Monitoring v2.0... ✅ metrics look good
Hour 2:     v1.0: 50%, v2.0: 50% (gradual increase)
Hour 3:     v1.0: 25%, v2.0: 75%
Hour 4:     v1.0: 0%, v2.0: 100% ✅ (v2.0 now fully deployed)
```

**Safety Nets:**
- Auto-rollback if error rate > threshold
- Manual rollback button (1-click)
- Metrics compared before/after

---

### 🔐 **7. Authentication & Authorization**

**What:** Secure access control for team members

**Features:**
- ✅ User roles (Admin, Data Scientist, MLOps, Viewer)
- ✅ Fine-grained permissions
- ✅ API keys for automation
- ✅ JWT token-based auth
- ✅ Audit logs

---

### 🔔 **8. Notifications & Alerts**

**What:** Keep you informed about important events

**Alert Types:**
- ✅ Pipeline execution failed
- ✅ Model training completed
- ✅ Drift detected
- ✅ Model performance degraded
- ✅ Deployment rollback

**Channels:** Email, Dashboard (more coming)

---

## Step-by-Step Usage Guide

### Tutorial 1: Create Your First Pipeline

**Objective:** Build a simple ML pipeline that trains a model on sample data

#### Step 1: Access Pipeline Builder

```
1. Open http://localhost:3000
2. Navigate to "Pipelines" from sidebar
3. Click "Create New Pipeline"
4. Name it: "My First ML Pipeline"
5. Description: "Training a churn prediction model"
```

#### Step 2: Add Pipeline Stages

Drag these stages onto the canvas in order:

1. **Data Loader**
   - Source: "Sample CSV"
   - File: churn_data.csv

2. **Data Validator**
   - Enable all checks
   - Max null percentage: 5%

3. **Feature Engineer**
   - Select features: age, tenure, monthly_charges, total_charges
   - Normalization: yes
   - Feature scaling: StandardScaler

4. **Model Trainer**
   - Algorithm: XGBoost
   - Test split: 0.2 (80/20)
   - Hyperparameters:
     - learning_rate: 0.1
     - max_depth: 6
     - n_estimators: 100

5. **Model Evaluator**
   - Metrics: Accuracy, Precision, Recall, F1

6. **Model Registry**
   - Register if accuracy > 90%

#### Step 3: Run Pipeline

```
1. Click "Save & Run"
2. Wait for completion (2-5 minutes)
3. See real-time logs in dashboard
4. View results:
   ✅ Data: 5000 records loaded
   ✅ Validation: 98% passed
   ✅ Features: 15 extracted
   ✅ Model: XGBoost trained
   ✅ Accuracy: 94.2% 🎉
   ✅ Model registered as v1.0
```

#### Step 4: View Results

```
Go to:
- Experiments → See training metrics
- Model Registry → See model v1.0 (Staging)
```

---

### Tutorial 2: Deploy Model to Production

**Objective:** Move your trained model from Staging to Production using canary deployment

#### Step 1: Access Model Registry

```
1. Go to "Model Registry" in sidebar
2. Find your model "My First Model"
3. Click on it to see versions
4. You should see v1.0 (Staging)
```

#### Step 2: Review Model

```
1. Click "v1.0" card
2. Review metrics:
   - Accuracy: 94.2%
   - Precision: 92.1%
   - Recall: 91.5%
   - F1: 91.8%
3. Review metadata (training date, dataset, etc.)
4. Click "View Details" for full lineage
```

#### Step 3: Transition to Production (Canary)

```
1. Click "Transition to Production"
2. Select deployment strategy: "Canary"
3. Set canary parameters:
   - Initial traffic: 10%
   - Duration: 30 minutes
   - Health check: Every 5 minutes
   - Auto-increase interval: 10 minutes
4. Click "Start Canary Deployment"
```

#### Step 4: Monitor Canary Deployment

```
Dashboard shows in real-time:
- Traffic split: Old model 90%, New model 10%
- New model metrics vs old model
- Health status: ✅ Good
- Time remaining: 25 minutes
- Option: Pause, Increase to 100%, or Rollback
```

#### Step 5: Confirm Deployment

```
After canary completes (30 minutes):
- New model now at 100% traffic
- Old model completely replaced
- View audit log showing deployment history
```

---

### Tutorial 3: Set Up Monitoring & Drift Alerts

**Objective:** Monitor your production model and get alerted if it degrades

#### Step 1: Configure Monitoring

```
1. Go to "Monitoring" tab
2. Select your model: "My First Model (v1.0)"
3. Set monitoring parameters:
   - Metric to monitor: Accuracy
   - Baseline (from training): 94.2%
   - Warning threshold: < 92% (drop > 2.2%)
   - Critical threshold: < 90% (drop > 4.2%)
   - Check frequency: Every hour
```

#### Step 2: Configure Drift Detection

```
1. Go to "Settings" → "Drift Detection"
2. Select drift detection method: "PSI" (Population Stability Index)
3. Set parameters:
   - Baseline data: Training dataset
   - Current data: Last 24 hours of predictions
   - PSI threshold: 0.15 (high drift)
   - Alert on drift: Yes
```

#### Step 3: Set Up Alerts

```
1. Go to "Notifications"
2. Create alert:
   - Trigger: "Drift Detected"
   - Channel: Email
   - Recipients: your-email@company.com
   - Message: Custom message
3. Create another:
   - Trigger: "Accuracy < 90%"
   - Channel: Email, Dashboard
```

#### Step 4: Test Alert (Optional)

```
1. Simulate drift by uploading test data with different distribution
2. You should receive alert within 5 minutes
3. Dashboard shows red flag
```

---

### Tutorial 4: Investigate & Retrain

**Objective:** When drift is detected, investigate and trigger retraining

#### Step 1: View Drift Alert

```
Dashboard shows:
🔴 Drift Alert - Model: "My First Model"
   Detected: 2:30 PM today
   PSI Score: 0.18 (High)
   
   Action buttons:
   - View Details
   - Review Data
   - Trigger Retrain
```

#### Step 2: Investigate

```
1. Click "View Details"
2. See:
   - Current data distribution vs baseline
   - Which features drifted most
   - Sample predictions on new data
3. Click "Review Data"
4. Examine:
   - Raw data sample
   - Data quality check results
   - Outliers detected
```

#### Step 3: Decide & Retrain

```
1. Options:
   a) Trigger automatic retraining
   b) Wait and monitor more
   c) Ignore alert (mark as known drift)
   
2. Click "Trigger Retrain"
3. Select pipeline: "My First ML Pipeline"
4. Review retraining parameters
5. Click "Start Retraining"
```

#### Step 4: Monitor Retraining

```
1. Pipeline runs with latest data
2. Real-time logs show progress
3. New model trained and evaluated
4. Results compared to production model v1.0:
   
   v1.0 (Current): Accuracy 94.2%
   v1.1 (New):     Accuracy 95.1% ✅ Better!
   
5. Options:
   - Auto-deploy v1.1 (canary)
   - Manual review
   - Archive v1.1 (discard)
```

#### Step 5: Deploy New Version

```
Same as Tutorial 2:
1. New version v1.1 transitions to Staging
2. Review metrics
3. Deploy with canary (10% → 100%)
4. Monitor for 30 minutes
5. Confirm deployment
```

---

## Common Use Cases

### Use Case 1: E-Commerce Recommendation

**Goal:** Recommend products to customers

**PipeForge Setup:**
```
Data Source → User behavior (clicks, purchases)
Pipeline → Extract features (age, purchase history, category preference)
        → Train collaborative filtering model
        → Evaluate on A/B test metrics (CTR, conversion)
        → Deploy to recommendation API

Monitoring → Track CTR, conversion rate, revenue per user
          → Alert if CTR drops > 5%

Drift → Track if user behavior changes (seasonal trends)
     → Retrain when drift detected
     → Gradually roll out new recommendations
```

**Dashboard View:**
- 📈 Revenue metrics: "$1.2M last week"
- 🔴 Alert: "CTR down 3% yesterday"
- 🎯 Recommendation model accuracy: 87%

---

### Use Case 2: Credit Scoring

**Goal:** Approve/deny loan applications

**PipeForge Setup:**
```
Data Source → Application data (income, credit history, employment)
Pipeline → Validate (credit score 300-850, income > 0)
        → Feature engineer (debt-to-income ratio, age groups)
        → Train logistic regression model
        → Evaluate on fairness metrics (no bias against protected groups)
        → Deploy to lending API

Monitoring → Track approval rate, default rate, bias
          → Alert if defaults spike or fairness degrades

Compliance → Audit logs of every decision
          → Model explainability (which features matter)
```

**PipeForge Benefits:**
- ✅ Consistent decisions (model + rules)
- ✅ Audit trail (who approved what and why)
- ✅ Quick retraining if rules change
- ✅ Alert if discrimination detected

---

### Use Case 3: Fraud Detection

**Goal:** Identify fraudulent transactions in real-time

**PipeForge Setup:**
```
Data Source → Real transactions (amount, merchant, time)
Pipeline → Extract temporal features (time of day, weekend)
        → Aggregate features (customer spending history)
        → Train random forest model
        → Evaluate on fraud detection metrics (precision, recall)
        → Deploy to transaction API

Monitoring → Track false positives (legitimate blocked), false negatives (fraud missed)
          → Alert if fraud catch rate drops

Retraining → Daily with latest fraud labels
          → Keep up with evolving fraud tactics
          → Canary deploy for safety
```

**Key Feature:** Real-time predictions with sub-100ms latency

---

### Use Case 4: Churn Prediction

**Goal:** Predict which customers will leave and target retention

**PipeForge Setup:**
```
Data Source → Customer data (tenure, usage, support tickets)
Pipeline → Calculate churn features (usage trend, support sentiment)
        → Train gradient boosting model
        → Evaluate on future churn rate (AUC, precision at cutoff)
        → Deploy to customer API

Monitoring → Track if predicted churners actually churn (calibration)
          → Alert if model predictions diverge from reality

Action Loop → Identify predicted churners
           → Offer retention incentives
           → Measure incentive effectiveness
           → Feed back into model (new features)
```

**ROI Example:**
- Model identifies 100 likely churners
- Offer retention incentive ($50 credit)
- 60 stay (prevent $50k churn)
- 40 leave anyway (costs only $2k incentive)
- **Net ROI: $48k from this one batch**

---

## Troubleshooting

### Problem 1: Pipeline Hangs or Takes Too Long

**Symptoms:**
- Pipeline running for > 30 minutes
- No recent log updates

**Solution:**
```
1. Check PostgreSQL is running:
   docker ps | grep postgres
   
2. Check backend logs:
   docker logs pipeforge-backend
   
3. Restart if needed:
   docker restart pipeforge-backend
   
4. Increase timeout in pipeline settings:
   Settings → Pipelines → Timeout: 60 minutes
```

---

### Problem 2: Model Accuracy Dropped Unexpectedly

**Symptoms:**
- New model v2.0 has 10% lower accuracy than v1.0

**Investigation:**
```
1. Check drift detection:
   Monitoring → Drift → View drift analysis
   
2. Review data quality:
   Data Validation → Latest run results
   
3. Compare training data:
   - Is the data different?
   - Are there more outliers?
   - Is the schema changed?
   
4. Roll back to v1.0:
   Model Registry → Select v1.0 → Transition to Production
   (Can rollback instantly, no downtime)
```

---

### Problem 3: Deployment Failed - Rollback Happened

**Symptoms:**
- Received notification: "Model v2.0 deployment failed, rolled back to v1.0"

**Investigation:**
```
1. Check error logs:
   Deployments → v2.0 → View logs
   
2. Common issues:
   - Latency too high (model slower than v1.0)
   - Error rate spiked (prediction failures)
   - Resource exhausted (out of memory)
   
3. Fix and redeploy:
   - Optimize model (prune, compress)
   - Add more resources (increase container CPU/memory)
   - Use smaller model architecture
```

---

### Problem 4: Cannot Access Dashboard

**Symptoms:**
- "Cannot reach localhost:3000"
- Connection refused

**Solution:**
```
1. Check frontend is running:
   docker ps | grep frontend
   
2. Check logs:
   docker logs pipeforge-frontend
   
3. Restart frontend:
   docker-compose restart frontend
   
4. Ensure port 3000 is not in use:
   Windows: netstat -ano | findstr :3000
   Kill process if needed:
   taskkill /PID <PID> /F
```

---

### Problem 5: Database Connection Error

**Symptoms:**
- Error: "Cannot connect to PostgreSQL"
- Logs show: "connect ECONNREFUSED 127.0.0.1:5432"

**Solution:**
```
1. Check database is running:
   docker ps | grep postgres
   
2. If not running:
   docker-compose up -d postgres
   
3. Wait 10 seconds for database to start
   
4. Restart backend:
   docker-compose restart backend
   
5. Verify connection:
   docker exec pipeforge-db psql -U pipeforge -d pipeforge -c "SELECT 1"
```

---

## Next Steps

### 🎓 Learn More

1. **Advanced Pipeline Design** → [Backend Advanced Guide](backend/README.md)
2. **API Documentation** → [REST API Reference](backend/README.md#api-reference)
3. **Custom Plugins** → [Plugin Development](backend/src/plugins/README.md)

### 🚀 Production Deployment

1. **Kubernetes** → [Kubernetes Setup](kubernetes/README.md)
2. **Environment Variables** → [Configuration Guide](backend/.env.example)
3. **Security** → [Security Best Practices](docs/SECURITY.md)

### 🤝 Get Help

- **Issues/Bugs** → GitHub Issues
- **Feature Requests** → GitHub Discussions
- **Questions** → Documentation or Community Chat

### 📚 Recommended Learning Path

```
Week 1: Basics
  ✅ Tutorial 1: Create first pipeline
  ✅ Tutorial 2: Deploy to production
  ✅ Tutorial 3: Monitor & alerts
  
Week 2: Advanced
  ✅ Set up custom data sources
  ✅ Create custom features
  ✅ Configure auto-retraining
  
Week 3: Production
  ✅ Deploy to Kubernetes
  ✅ Set up multi-region failover
  ✅ Configure team permissions
  
Week 4: Mastery
  ✅ Build custom plugins
  ✅ Integrate with your systems
  ✅ Implement MLOps best practices
```

---

## Key Takeaways

🎯 **PipeForge enables you to:**

1. ✅ **Automate** the entire ML lifecycle
2. ✅ **Standardize** model training & deployment
3. ✅ **Monitor** production models 24/7
4. ✅ **Detect** problems automatically
5. ✅ **Retrain** models on schedule or when needed
6. ✅ **Deploy** safely with canary rollouts
7. ✅ **Rollback** instantly if issues arise
8. ✅ **Track** every model version and decision
9. ✅ **Collaborate** as a team with audit logs
10. ✅ **Scale** to enterprise production use

---

## Support & Community

- 📧 **Email:** support@pipeforge.dev
- 💬 **Chat:** [Community Slack](#)
- 📖 **Docs:** [Full Documentation](#)
- 🐛 **Issues:** [GitHub Issues](#)

---

**Happy ML Ops! 🚀**

*Last Updated: May 7, 2026*
