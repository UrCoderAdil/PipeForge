export interface IStageExecutor {
  execute(config: any, forceFail?: boolean): Promise<{ success: boolean; logs: string[]; duration: number }>;
  getName(): string;
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export class BuildStageExecutor implements IStageExecutor {
  getName() { return 'Build'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    logs.push('[Build] Initializing build environment');
    await sleep(800);
    logs.push(`[Build] Installing dependencies (timeout: ${config.timeout || 60}s)`);
    await sleep(1000);
    if (forceFail) {
      logs.push('[Build] ERROR: Compilation failed - syntax error in module');
      return { success: false, logs, duration: Date.now() - start };
    }
    logs.push('[Build] Compiling source files...');
    await sleep(600);
    logs.push('[Build] Build successful');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class TestStageExecutor implements IStageExecutor {
  getName() { return 'Test'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    logs.push('[Test] Starting test runner');
    await sleep(600);
    logs.push('[Test] Running unit tests...');
    await sleep(1200);
    if (forceFail) {
      logs.push('[Test] FAIL: 3 tests failed (assertion error)');
      return { success: false, logs, duration: Date.now() - start };
    }
    logs.push(`[Test] All tests passed (${Math.floor(Math.random() * 50) + 20}/42)`);
    await sleep(400);
    logs.push(`[Test] Coverage: ${Math.floor(Math.random() * 20) + 78}%`);
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class SecurityStageExecutor implements IStageExecutor {
  getName() { return 'Security Scan'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    logs.push('[Security] Scanning dependencies for vulnerabilities');
    await sleep(1000);
    logs.push('[Security] Running OWASP checks');
    await sleep(800);
    if (forceFail) {
      logs.push('[Security] CRITICAL: CVE-2024-1234 found in lodash@4.17.20');
      return { success: false, logs, duration: Date.now() - start };
    }
    logs.push('[Security] No critical vulnerabilities found');
    logs.push(`[Security] Security scan passed (level: ${config.level || 'medium'})`);
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class DeployStageExecutor implements IStageExecutor {
  getName() { return 'Deploy'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    logs.push(`[Deploy] Preparing deployment to ${config.region || 'us-east-1'}`);
    await sleep(600);
    logs.push('[Deploy] Pushing container image');
    await sleep(1500);
    if (forceFail) {
      logs.push('[Deploy] ERROR: Deployment failed - insufficient resources');
      return { success: false, logs, duration: Date.now() - start };
    }
    logs.push(`[Deploy] Scaling to ${config.replicas || 3} replicas`);
    await sleep(800);
    logs.push('[Deploy] Health checks passing');
    logs.push('[Deploy] Deployment successful');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class MonitorStageExecutor implements IStageExecutor {
  getName() { return 'Monitor'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    logs.push('[Monitor] Starting post-deploy health check');
    await sleep(600);
    logs.push(`[Monitor] Checking endpoint: ${config.url || '/health'}`);
    await sleep(800);
    if (forceFail) {
      logs.push(`[Monitor] ERROR: Health check failed after ${config.retries || 3} retries`);
      return { success: false, logs, duration: Date.now() - start };
    }
    logs.push(`[Monitor] Response: 200 OK (latency: ${Math.floor(Math.random() * 50) + 10}ms)`);
    logs.push('[Monitor] All monitors healthy');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class LintStageExecutor implements IStageExecutor {
  getName() { return 'Lint'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    logs.push('[Lint] Running ESLint analysis');
    await sleep(600);
    if (forceFail) {
      logs.push('[Lint] ERROR: 5 linting errors found');
      return { success: false, logs, duration: Date.now() - start };
    }
    logs.push('[Lint] No linting errors');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class PackageStageExecutor implements IStageExecutor {
  getName() { return 'Package'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    logs.push(`[Package] Building ${config.format || 'docker'} image`);
    await sleep(1200);
    if (forceFail) {
      logs.push('[Package] ERROR: Docker build failed');
      return { success: false, logs, duration: Date.now() - start };
    }
    logs.push('[Package] Image built successfully');
    logs.push('[Package] Pushing to registry');
    await sleep(600);
    logs.push('[Package] Package complete');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class DataValidationExecutor implements IStageExecutor {
  getName() { return 'Data Validation'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    const dataset = config.dataset || 'training_data.parquet';
    logs.push(`[DataValidation] Loading dataset: ${dataset}`);
    await sleep(700);
    logs.push(`[DataValidation] Running Great Expectations suite (${config.checks || 12} checks)`);
    await sleep(1000);
    if (forceFail) {
      logs.push('[DataValidation] FAIL: Schema mismatch — expected column "feature_age" not found');
      logs.push('[DataValidation] FAIL: 8.3% null values exceed threshold of 5%');
      return { success: false, logs, duration: Date.now() - start };
    }
    const rows = config.rows || Math.floor(Math.random() * 50000) + 100000;
    logs.push(`[DataValidation] Row count: ${rows.toLocaleString()} (within expected range)`);
    logs.push(`[DataValidation] Schema validation passed (${config.features || 28} features)`);
    logs.push(`[DataValidation] Null check passed — max 1.2% missing values`);
    logs.push(`[DataValidation] Outlier detection: 0.04% anomalies flagged`);
    logs.push('[DataValidation] All checks passed. Data quality: GOOD');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class FeatureEngineeringExecutor implements IStageExecutor {
  getName() { return 'Feature Engineering'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    logs.push('[FeatureEng] Connecting to Feature Store (Redis + Feast)');
    await sleep(500);
    logs.push('[FeatureEng] Computing aggregate features (7d, 30d, 90d windows)');
    await sleep(1200);
    if (forceFail) {
      logs.push('[FeatureEng] ERROR: Feature computation timeout after 30s');
      return { success: false, logs, duration: Date.now() - start };
    }
    const featureCount = config.features || 47;
    logs.push(`[FeatureEng] Generated ${featureCount} features from raw events`);
    logs.push('[FeatureEng] Normalizing numeric features (StandardScaler)');
    await sleep(600);
    logs.push('[FeatureEng] Encoding categorical features (OrdinalEncoder)');
    await sleep(400);
    logs.push(`[FeatureEng] Feature matrix shape: (${config.rows || 142_500}, ${featureCount})`);
    logs.push('[FeatureEng] Writing features to offline store');
    await sleep(500);
    logs.push('[FeatureEng] Feature engineering complete');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class ModelTrainingExecutor implements IStageExecutor {
  getName() { return 'Model Training'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    const modelType = config.model || 'XGBoost';
    logs.push(`[Training] Initializing ${modelType} trainer`);
    await sleep(600);
    logs.push(`[Training] Starting Optuna hyperparameter search (${config.trials || 50} trials)`);
    await sleep(800);
    if (forceFail) {
      logs.push('[Training] ERROR: OOM — insufficient GPU memory (need 16GB, have 8GB)');
      return { success: false, logs, duration: Date.now() - start };
    }
    logs.push(`[Training] Trial 12/50 — AUC: 0.871, F1: 0.834`);
    await sleep(600);
    logs.push(`[Training] Trial 31/50 — AUC: 0.893, F1: 0.861 ← best so far`);
    await sleep(500);
    logs.push(`[Training] Trial 50/50 — search complete`);
    const auc = (0.88 + Math.random() * 0.05).toFixed(3);
    const f1 = (0.84 + Math.random() * 0.05).toFixed(3);
    logs.push(`[Training] Best params: learning_rate=0.042, max_depth=6, n_estimators=412`);
    logs.push(`[Training] 5-fold cross-validation: AUC=${auc}, F1=${f1}`);
    await sleep(700);
    logs.push('[Training] Saving model artifact to MLflow registry');
    logs.push('[Training] Training complete');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class ModelEvaluationExecutor implements IStageExecutor {
  getName() { return 'Model Evaluation'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    logs.push('[Evaluation] Loading challenger model from registry');
    await sleep(500);
    logs.push('[Evaluation] Loading champion (production) model baseline');
    await sleep(400);
    logs.push('[Evaluation] Running evaluation on holdout set (20% split)');
    await sleep(1000);
    if (forceFail) {
      logs.push('[Evaluation] FAIL: Challenger AUC 0.821 < champion AUC 0.873 — promotion blocked');
      return { success: false, logs, duration: Date.now() - start };
    }
    const challengerAuc = (0.88 + Math.random() * 0.04).toFixed(3);
    const championAuc = (0.87 + Math.random() * 0.02).toFixed(3);
    logs.push(`[Evaluation] Champion AUC: ${championAuc} | Challenger AUC: ${challengerAuc}`);
    logs.push(`[Evaluation] F1: ${(0.85 + Math.random() * 0.04).toFixed(3)} | Precision: ${(0.86 + Math.random() * 0.03).toFixed(3)} | Recall: ${(0.84 + Math.random() * 0.04).toFixed(3)}`);
    logs.push('[Evaluation] Bias audit: no significant demographic disparities detected');
    await sleep(400);
    logs.push('[Evaluation] Challenger outperforms champion — promotion approved');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class ModelRegistrationExecutor implements IStageExecutor {
  getName() { return 'Model Registration'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    const version = config.version || Math.floor(Math.random() * 10) + 2;
    logs.push(`[Registry] Registering model v${version} to MLflow Model Registry`);
    await sleep(600);
    if (forceFail) {
      logs.push('[Registry] ERROR: Signature mismatch — model input schema changed');
      return { success: false, logs, duration: Date.now() - start };
    }
    logs.push('[Registry] Computing model signature and input schema');
    await sleep(400);
    logs.push(`[Registry] Storing artifact: s3://mlops-models/fraud-detector/v${version}/model.pkl`);
    await sleep(700);
    logs.push(`[Registry] Model v${version} → stage: Staging`);
    logs.push('[Registry] Lineage recorded: experiment → training run → model version');
    logs.push('[Registry] Registration complete');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class CanaryDeployExecutor implements IStageExecutor {
  getName() { return 'Canary Deploy'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    const canaryPct = config.canaryPct || 10;
    logs.push(`[Canary] Initiating canary release (${canaryPct}% traffic)`);
    await sleep(600);
    logs.push('[Canary] Deploying challenger model to inference service');
    await sleep(1000);
    if (forceFail) {
      logs.push('[Canary] ERROR: P99 latency 2.4s > SLA threshold 1.0s — canary aborted');
      logs.push('[Canary] Rolling back to previous model version');
      return { success: false, logs, duration: Date.now() - start };
    }
    logs.push(`[Canary] Routing ${canaryPct}% traffic to challenger model`);
    await sleep(800);
    logs.push(`[Canary] P50 latency: ${Math.floor(Math.random() * 30) + 20}ms | P99: ${Math.floor(Math.random() * 100) + 80}ms`);
    logs.push(`[Canary] Error rate: ${(Math.random() * 0.3).toFixed(2)}% (threshold: 1%)`);
    logs.push('[Canary] Health metrics nominal — expanding to 100% traffic');
    await sleep(500);
    logs.push('[Canary] Canary deployment successful. Model promoted to Production');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class DriftCheckExecutor implements IStageExecutor {
  getName() { return 'Drift Check'; }
  async execute(config: any, forceFail = false) {
    const logs: string[] = [];
    const start = Date.now();
    logs.push('[DriftCheck] Running Evidently AI analysis on last 7 days of predictions');
    await sleep(700);
    if (forceFail) {
      logs.push('[DriftCheck] ALERT: Data drift detected — PSI score 0.32 exceeds threshold 0.20');
      logs.push('[DriftCheck] Features drifted: age_bucket, transaction_velocity, geo_region');
      logs.push('[DriftCheck] Triggering auto-retraining pipeline');
      return { success: false, logs, duration: Date.now() - start };
    }
    const psi = (Math.random() * 0.12 + 0.03).toFixed(3);
    logs.push(`[DriftCheck] Data drift PSI: ${psi} (threshold: 0.20) ✓`);
    logs.push(`[DriftCheck] Concept drift KL-divergence: ${(Math.random() * 0.05 + 0.01).toFixed(4)} ✓`);
    logs.push('[DriftCheck] Prediction distribution stable');
    logs.push('[DriftCheck] No drift detected — model health: NOMINAL');
    return { success: true, logs, duration: Date.now() - start };
  }
}

export class StageFactory {
  private static executors: Record<string, new () => IStageExecutor> = {
    build: BuildStageExecutor,
    test: TestStageExecutor,
    security: SecurityStageExecutor,
    deploy: DeployStageExecutor,
    monitor: MonitorStageExecutor,
    lint: LintStageExecutor,
    package: PackageStageExecutor,
    'unit test': TestStageExecutor,
    'integration test': TestStageExecutor,
    'security scan': SecurityStageExecutor,
    'health check': MonitorStageExecutor,
    'smoke test': MonitorStageExecutor,
    'data validation': DataValidationExecutor,
    'feature engineering': FeatureEngineeringExecutor,
    'model training': ModelTrainingExecutor,
    'model evaluation': ModelEvaluationExecutor,
    'model registration': ModelRegistrationExecutor,
    'canary deploy': CanaryDeployExecutor,
    'drift check': DriftCheckExecutor,
    'data-validation': DataValidationExecutor,
    'feature-engineering': FeatureEngineeringExecutor,
    'model-training': ModelTrainingExecutor,
    'model-evaluation': ModelEvaluationExecutor,
    'model-registration': ModelRegistrationExecutor,
    'canary-deploy': CanaryDeployExecutor,
    'drift-check': DriftCheckExecutor,
  };

  static create(type: string): IStageExecutor {
    const key = type.toLowerCase();
    const ExecutorClass = this.executors[key] || BuildStageExecutor;
    return new ExecutorClass();
  }
}