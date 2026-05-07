import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pipeforge.dev' },
    update: {},
    create: {
      email: 'admin@pipeforge.dev',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user:', admin.email);

  // Seed plugins (only if none exist)
  const existingPlugins = await prisma.plugin.count();
  if (existingPlugins === 0) {
    await prisma.plugin.createMany({
      data: [
        { name: 'Slack Notifier', description: 'Send deployment notifications to Slack channels', category: 'notification', enabled: false },
        { name: 'Email Notifier', description: 'Send deployment reports via email', category: 'notification', enabled: true },
        { name: 'Discord Alerts', description: 'Post alerts to Discord webhooks', category: 'notification', enabled: false },
        { name: 'Advanced Security Scan', description: 'Deep vulnerability scanning with OWASP rules', category: 'security', enabled: true },
        { name: 'AI Deployment Advisor', description: 'AI-powered deployment risk analysis', category: 'ai', enabled: false },
        { name: 'Performance Analyzer', description: 'Post-deploy performance benchmarking', category: 'analytics', enabled: false },
        { name: 'GitHub Integration', description: 'Trigger pipelines from GitHub webhooks', category: 'integration', enabled: true },
        { name: 'Kubernetes Deployer', description: 'Deploy to Kubernetes clusters', category: 'deployment', enabled: false },
      ],
    });
    console.log('Plugins seeded');
  }

  // Seed pipelines (only if none exist for this user)
  const existingPipelines = await prisma.pipeline.count({ where: { userId: admin.id } });
  if (existingPipelines === 0) {
    const pipeline1 = await prisma.pipeline.create({
      data: {
        name: 'Production Deploy',
        description: 'Main production deployment pipeline',
        provider: 'AWS',
        status: 'idle',
        userId: admin.id,
        stages: {
          create: [
            { name: 'Build', type: 'build', orderIndex: 0, config: { timeout: 60, retries: 2 }, decorators: ['logging', 'retry'] },
            { name: 'Unit Test', type: 'test', orderIndex: 1, config: { timeout: 120, retries: 1 }, decorators: ['logging'] },
            { name: 'Security Scan', type: 'security', orderIndex: 2, config: { level: 'high' }, decorators: ['logging', 'metrics'] },
            { name: 'Deploy', type: 'deploy', orderIndex: 3, config: { region: 'us-east-1', replicas: 3 }, decorators: ['logging', 'notification'] },
            { name: 'Health Check', type: 'monitor', orderIndex: 4, config: { url: '/health', retries: 3 }, decorators: ['logging'] },
          ],
        },
      },
    });

    await prisma.pipeline.create({
      data: {
        name: 'API Service Pipeline',
        description: 'Backend API service pipeline',
        provider: 'Azure',
        status: 'idle',
        userId: admin.id,
        stages: {
          create: [
            { name: 'Build', type: 'build', orderIndex: 0, config: { timeout: 45, retries: 2 }, decorators: ['logging'] },
            { name: 'Integration Test', type: 'test', orderIndex: 1, config: { timeout: 180 }, decorators: ['logging', 'metrics'] },
            { name: 'Package', type: 'package', orderIndex: 2, config: { format: 'docker' }, decorators: ['logging'] },
            { name: 'Deploy', type: 'deploy', orderIndex: 3, config: { region: 'eastus', replicas: 2 }, decorators: ['logging', 'notification'] },
          ],
        },
      },
    });

    await prisma.pipeline.create({
      data: {
        name: 'Quick Deploy GCP',
        description: 'Fast GCP deployment pipeline',
        provider: 'GCP',
        status: 'success',
        userId: admin.id,
        stages: {
          create: [
            { name: 'Build', type: 'build', orderIndex: 0, config: { timeout: 30 }, decorators: ['logging'] },
            { name: 'Deploy', type: 'deploy', orderIndex: 1, config: { region: 'us-central1', replicas: 1 }, decorators: ['logging', 'notification'] },
          ],
        },
      },
    });

    // Seed a sample completed execution
    await prisma.execution.create({
      data: {
        status: 'success',
        duration: 127,
        provider: 'AWS',
        pipelineId: pipeline1.id,
        finishedAt: new Date(),
        logs: [
          { time: '12:10:21', message: '[Build] Initializing build environment', stage: 'Build' },
          { time: '12:10:23', message: '[Build] Installing dependencies', stage: 'Build' },
          { time: '12:10:26', message: '[Build] Build successful', stage: 'Build' },
          { time: '12:10:27', message: '[Test] Starting test runner', stage: 'Unit Test' },
          { time: '12:10:31', message: '[Test] All tests passed (42/42)', stage: 'Unit Test' },
          { time: '12:10:33', message: '[Security] Scanning dependencies', stage: 'Security Scan' },
          { time: '12:10:35', message: '[Security] No critical vulnerabilities found', stage: 'Security Scan' },
          { time: '12:10:37', message: '[Deploy] Preparing deployment to us-east-1', stage: 'Deploy' },
          { time: '12:10:42', message: '[Deploy] Deployment successful', stage: 'Deploy' },
          { time: '12:10:43', message: '[Monitor] Health check passed', stage: 'Health Check' },
        ],
      },
    });

    console.log('Pipelines and executions seeded');
  }

  // Seed notifications
  const existingNotifs = await prisma.notification.count();
  if (existingNotifs === 0) {
    await prisma.notification.createMany({
      data: [
        { title: 'Pipeline Deployed', message: 'Production Deploy completed successfully in 127s', type: 'success' },
        { title: 'Security Scan Failed', message: 'Vulnerability found in dependency — rollback triggered', type: 'error' },
        { title: 'Rollback Triggered', message: 'API Service rolled back to previous stable version', type: 'warning' },
        { title: 'Plugin Enabled', message: 'Advanced Security Scan plugin is now active', type: 'info' },
        { title: 'AWS Adapter Selected', message: 'Cloud provider switched to AWS us-east-1', type: 'info' },
      ],
    });
    console.log('Notifications seeded');
  }

  // Seed ML Experiments
  const existingExperiments = await prisma.experiment.count();
  if (existingExperiments === 0) {
    await prisma.experiment.createMany({
      data: [
        {
          name: 'fraud-detector-xgb-v12',
          description: 'XGBoost with Optuna HPO — 50 trials',
          status: 'completed',
          modelType: 'xgboost',
          params: { learning_rate: 0.042, max_depth: 6, n_estimators: 412, subsample: 0.82, colsample_bytree: 0.74 },
          metrics: { auc: 0.9143, f1: 0.8821, precision: 0.8934, recall: 0.8712, accuracy: 0.9267, loss: 0.1342 },
          tags: ['production-candidate', 'optuna', 'fraud'],
          duration: 487,
          finishedAt: new Date(Date.now() - 3600000),
        },
        {
          name: 'fraud-detector-lgbm-v8',
          description: 'LightGBM with feature selection',
          status: 'completed',
          modelType: 'lightgbm',
          params: { learning_rate: 0.031, max_depth: 7, n_estimators: 380, num_leaves: 63 },
          metrics: { auc: 0.9081, f1: 0.8734, precision: 0.8812, recall: 0.8658, accuracy: 0.9198, loss: 0.1521 },
          tags: ['baseline', 'lightgbm', 'fraud'],
          duration: 312,
          finishedAt: new Date(Date.now() - 86400000),
        },
        {
          name: 'fraud-detector-rf-v5',
          description: 'Random Forest ensemble baseline',
          status: 'completed',
          modelType: 'random_forest',
          params: { n_estimators: 200, max_depth: 12, min_samples_split: 4 },
          metrics: { auc: 0.8893, f1: 0.8512, precision: 0.8634, recall: 0.8394, accuracy: 0.9021, loss: 0.2103 },
          tags: ['baseline', 'ensemble'],
          duration: 218,
          finishedAt: new Date(Date.now() - 172800000),
        },
        {
          name: 'churn-predictor-pytorch-v3',
          description: 'Deep learning churn model with attention',
          status: 'completed',
          modelType: 'pytorch',
          params: { learning_rate: 0.0003, batch_size: 64, epochs: 25, dropout: 0.3, hidden_layers: 3 },
          metrics: { auc: 0.9312, f1: 0.8976, precision: 0.9102, recall: 0.8854, accuracy: 0.9421, loss: 0.0982 },
          tags: ['deep-learning', 'churn', 'attention'],
          duration: 724,
          finishedAt: new Date(Date.now() - 259200000),
        },
        {
          name: 'fraud-detector-xgb-v11',
          description: 'Previous champion — XGBoost v11',
          status: 'completed',
          modelType: 'xgboost',
          params: { learning_rate: 0.038, max_depth: 5, n_estimators: 350, subsample: 0.79 },
          metrics: { auc: 0.9012, f1: 0.8698, precision: 0.8801, recall: 0.8598, accuracy: 0.9134, loss: 0.1687 },
          tags: ['archived', 'fraud'],
          duration: 421,
          finishedAt: new Date(Date.now() - 604800000),
        },
      ],
    });
    console.log('Experiments seeded');
  }

  // Seed Model Registry
  const existingModels = await prisma.modelVersion.count();
  if (existingModels === 0) {
    await prisma.modelVersion.createMany({
      data: [
        {
          name: 'fraud-detector',
          version: 12,
          stage: 'production',
          framework: 'xgboost',
          metrics: { auc: 0.9143, f1: 0.8821, precision: 0.8934, recall: 0.8712 },
          artifactPath: 's3://mlops-models/fraud-detector/v12/model.pkl',
          description: 'XGBoost champion model — promoted via canary at 10% traffic',
          promotedAt: new Date(Date.now() - 3600000),
        },
        {
          name: 'fraud-detector',
          version: 11,
          stage: 'archived',
          framework: 'xgboost',
          metrics: { auc: 0.9012, f1: 0.8698, precision: 0.8801, recall: 0.8598 },
          artifactPath: 's3://mlops-models/fraud-detector/v11/model.pkl',
          description: 'Previous production model — archived on v12 promotion',
          promotedAt: new Date(Date.now() - 604800000),
        },
        {
          name: 'fraud-detector',
          version: 13,
          stage: 'staging',
          framework: 'lightgbm',
          metrics: { auc: 0.9081, f1: 0.8734, precision: 0.8812, recall: 0.8658 },
          artifactPath: 's3://mlops-models/fraud-detector/v13/model.pkl',
          description: 'LightGBM challenger — pending production promotion evaluation',
        },
        {
          name: 'churn-predictor',
          version: 3,
          stage: 'production',
          framework: 'pytorch',
          metrics: { auc: 0.9312, f1: 0.8976, precision: 0.9102, recall: 0.8854 },
          artifactPath: 's3://mlops-models/churn-predictor/v3/model.pt',
          description: 'PyTorch attention model in production',
          promotedAt: new Date(Date.now() - 259200000),
        },
        {
          name: 'churn-predictor',
          version: 2,
          stage: 'archived',
          framework: 'xgboost',
          metrics: { auc: 0.8934, f1: 0.8612, precision: 0.8723, recall: 0.8504 },
          artifactPath: 's3://mlops-models/churn-predictor/v2/model.pkl',
          description: 'Previous churn model — XGBoost baseline',
        },
      ],
    });
    console.log('Model registry seeded');
  }

  // Seed Data Validation Runs
  const existingValidations = await prisma.dataValidationRun.count();
  if (existingValidations === 0) {
    await prisma.dataValidationRun.createMany({
      data: [
        {
          datasetName: 'fraud_training_2024_q4.parquet',
          status: 'passed',
          rowCount: 142500,
          checksPassed: 12,
          checksFailed: 0,
          results: [
            { check: 'Schema validation', status: 'passed', message: 'All 28 columns present' },
            { check: 'Null value threshold', status: 'passed', message: 'Null rate 0.8% < 5%' },
            { check: 'Outlier detection', status: 'passed', message: '0.04% outliers within threshold' },
            { check: 'Distribution shift', status: 'passed', message: 'KS statistic 0.04 < 0.1' },
            { check: 'Target label balance', status: 'passed', message: 'Class ratio 1:23' },
          ],
        },
        {
          datasetName: 'fraud_training_2024_q3.parquet',
          status: 'warning',
          rowCount: 138200,
          checksPassed: 10,
          checksFailed: 2,
          results: [
            { check: 'Schema validation', status: 'passed', message: 'All columns present' },
            { check: 'Null value threshold', status: 'failed', message: 'age column: 6.2% nulls > threshold 5%' },
            { check: 'Distribution shift', status: 'failed', message: 'KS statistic 0.14 > 0.1 for geo_region' },
          ],
        },
      ],
    });
    console.log('Data validation runs seeded');
  }

  // Seed Drift Alerts
  const existingDrift = await prisma.driftAlert.count();
  if (existingDrift === 0) {
    await prisma.driftAlert.createMany({
      data: [
        {
          alertType: 'data',
          severity: 'high',
          feature: 'transaction_velocity',
          psiScore: 0.3241,
          threshold: 0.2,
          modelName: 'fraud-detector',
          status: 'resolved',
          description: 'Data drift in transaction_velocity — Black Friday traffic spike caused distribution shift',
          autoRetrain: true,
          resolvedAt: new Date(Date.now() - 86400000),
        },
        {
          alertType: 'data',
          severity: 'medium',
          feature: 'geo_region',
          psiScore: 0.2187,
          threshold: 0.2,
          modelName: 'fraud-detector',
          status: 'acknowledged',
          description: 'Moderate drift in geo_region feature — new market expansion detected',
          autoRetrain: false,
        },
        {
          alertType: 'concept',
          severity: 'medium',
          feature: 'all',
          psiScore: 0.1923,
          threshold: 0.2,
          modelName: 'churn-predictor',
          status: 'open',
          description: 'Concept drift approaching threshold — prediction confidence declining',
          autoRetrain: false,
        },
      ],
    });
    console.log('Drift alerts seeded');
  }

  // Seed Feature Store
  const existingFeatures = await prisma.feature.count();
  if (existingFeatures === 0) {
    await prisma.feature.createMany({
      data: [
        { name: 'customer_ltv_90d', entity: 'customer', valueType: 'float', description: 'Customer lifetime value over 90 days', source: 'aggregations', tags: ['revenue', 'engagement'], enabled: true },
        { name: 'transaction_velocity_7d', entity: 'customer', valueType: 'float', description: 'Number of transactions in last 7 days', source: 'raw_events', tags: ['behavior', 'fraud'], enabled: true },
        { name: 'avg_transaction_amount_30d', entity: 'customer', valueType: 'float', description: 'Average transaction amount over 30 days', source: 'aggregations', tags: ['spending'], enabled: true },
        { name: 'churn_score', entity: 'customer', valueType: 'float', description: 'Predicted churn probability score', source: 'model_output', tags: ['churn', 'ml'], enabled: true },
        { name: 'fraud_risk_score', entity: 'transaction', valueType: 'float', description: 'Real-time fraud risk score', source: 'model_output', tags: ['fraud', 'ml', 'realtime'], enabled: true },
        { name: 'geo_region_encoded', entity: 'transaction', valueType: 'int', description: 'Ordinal encoded geographic region', source: 'raw_events', tags: ['location'], enabled: true },
        { name: 'device_fingerprint_hash', entity: 'transaction', valueType: 'string', description: 'Hashed device fingerprint', source: 'raw_events', tags: ['device', 'fraud'], enabled: true },
        { name: 'product_popularity_rank', entity: 'product', valueType: 'int', description: 'Product popularity rank (7d rolling)', source: 'aggregations', tags: ['product', 'ranking'], enabled: true },
        { name: 'category_conversion_rate', entity: 'product', valueType: 'float', description: 'Category-level conversion rate', source: 'aggregations', tags: ['product', 'conversion'], enabled: true },
        { name: 'session_duration_avg', entity: 'customer', valueType: 'float', description: 'Average session duration in seconds', source: 'raw_events', tags: ['engagement'], enabled: true },
        { name: 'days_since_last_purchase', entity: 'customer', valueType: 'int', description: 'Days since last completed purchase', source: 'raw_events', tags: ['recency', 'churn'], enabled: true },
        { name: 'credit_score_band', entity: 'customer', valueType: 'int', description: 'Credit score band (1-10)', source: 'user_attributes', tags: ['credit', 'risk'], enabled: true },
      ],
    });
    console.log('Feature store seeded');
  }

  // Add ML-specific plugins
  const mlPluginNames = ['MLflow Tracker', 'Evidently Monitor', 'Trivy Scanner'];
  for (const name of mlPluginNames) {
    const exists = await prisma.plugin.findFirst({ where: { name } });
    if (!exists) {
      await prisma.plugin.create({
        data: {
          name,
          description:
            name === 'MLflow Tracker' ? 'Track experiments, parameters, and model artifacts with MLflow' :
            name === 'Evidently Monitor' ? 'Monitor data and concept drift in production with Evidently AI' :
            'Container image vulnerability scanning with Trivy',
          category: name === 'Trivy Scanner' ? 'security' : 'analytics',
          enabled: name === 'MLflow Tracker',
        },
      });
    }
  }

  // Seed ML pipelines
  const existingMlPipelines = await prisma.pipeline.findFirst({ where: { name: 'Fraud Detection MLOps', userId: admin.id } });
  if (!existingMlPipelines) {
    await prisma.pipeline.create({
      data: {
        name: 'Fraud Detection MLOps',
        description: 'End-to-end fraud detection model training and deployment',
        provider: 'AWS',
        status: 'success',
        userId: admin.id,
        stages: {
          create: [
            { name: 'Data Validation', type: 'data-validation', orderIndex: 0, config: { dataset: 'fraud_training_2024_q4.parquet', checks: 12 }, decorators: ['logging', 'metrics'] },
            { name: 'Feature Engineering', type: 'feature-engineering', orderIndex: 1, config: { features: 47 }, decorators: ['logging', 'metrics'] },
            { name: 'Model Training', type: 'model-training', orderIndex: 2, config: { model: 'XGBoost', trials: 50 }, decorators: ['logging', 'metrics', 'notification'] },
            { name: 'Model Evaluation', type: 'model-evaluation', orderIndex: 3, config: {}, decorators: ['logging', 'metrics'] },
            { name: 'Model Registration', type: 'model-registration', orderIndex: 4, config: { version: 12 }, decorators: ['logging', 'notification'] },
            { name: 'Canary Deploy', type: 'canary-deploy', orderIndex: 5, config: { canaryPct: 10 }, decorators: ['logging', 'metrics', 'notification'] },
            { name: 'Drift Check', type: 'drift-check', orderIndex: 6, config: {}, decorators: ['logging', 'metrics'] },
          ],
        },
      },
    });

    await prisma.pipeline.create({
      data: {
        name: 'Churn Predictor Retrain',
        description: 'Auto-retrain triggered by drift detection',
        provider: 'GCP',
        status: 'idle',
        userId: admin.id,
        stages: {
          create: [
            { name: 'Data Validation', type: 'data-validation', orderIndex: 0, config: { dataset: 'churn_data_latest.parquet', checks: 10 }, decorators: ['logging', 'metrics'] },
            { name: 'Feature Engineering', type: 'feature-engineering', orderIndex: 1, config: { features: 31 }, decorators: ['logging'] },
            { name: 'Model Training', type: 'model-training', orderIndex: 2, config: { model: 'PyTorch', trials: 30 }, decorators: ['logging', 'metrics', 'notification'] },
            { name: 'Model Evaluation', type: 'model-evaluation', orderIndex: 3, config: {}, decorators: ['logging', 'metrics'] },
            { name: 'Model Registration', type: 'model-registration', orderIndex: 4, config: { version: 4 }, decorators: ['logging', 'notification'] },
          ],
        },
      },
    });
    console.log('ML pipelines seeded');
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
