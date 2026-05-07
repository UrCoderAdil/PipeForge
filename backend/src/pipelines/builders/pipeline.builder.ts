export interface StageConfig {
  name: string;
  type: string;
  orderIndex: number;
  config: Record<string, any>;
  decorators?: string[];
}

export interface PipelineConfig {
  name: string;
  description?: string;
  provider: string;
  stages: StageConfig[];
}

export class PipelineBuilder {
  private config: PipelineConfig = {
    name: '',
    provider: 'AWS',
    stages: [],
  };
  private stageIndex = 0;

  setName(name: string): PipelineBuilder {
    this.config.name = name;
    return this;
  }

  setDescription(description: string): PipelineBuilder {
    this.config.description = description;
    return this;
  }

  setProvider(provider: string): PipelineBuilder {
    this.config.provider = provider;
    return this;
  }

  addBuildStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Build',
      type: 'build',
      orderIndex: this.stageIndex++,
      config: config || { timeout: 60, retries: 2 },
      decorators: ['logging', 'retry'],
    });
    return this;
  }

  addTestStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Unit Test',
      type: 'test',
      orderIndex: this.stageIndex++,
      config: config || { timeout: 120, retries: 1 },
      decorators: ['logging'],
    });
    return this;
  }

  addSecurityScan(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Security Scan',
      type: 'security',
      orderIndex: this.stageIndex++,
      config: config || { level: 'high' },
      decorators: ['logging', 'metrics'],
    });
    return this;
  }

  addDeployStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Deploy',
      type: 'deploy',
      orderIndex: this.stageIndex++,
      config: config || { region: 'us-east-1', replicas: 3 },
      decorators: ['logging', 'notification'],
    });
    return this;
  }

  addMonitorStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Health Check',
      type: 'monitor',
      orderIndex: this.stageIndex++,
      config: config || { url: '/health', retries: 3 },
      decorators: ['logging'],
    });
    return this;
  }

  addDataValidationStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Data Validation',
      type: 'data-validation',
      orderIndex: this.stageIndex++,
      config: config || { dataset: 'training_data.parquet', checks: 12, features: 28 },
      decorators: ['logging', 'metrics'],
    });
    return this;
  }

  addFeatureEngineeringStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Feature Engineering',
      type: 'feature-engineering',
      orderIndex: this.stageIndex++,
      config: config || { features: 47 },
      decorators: ['logging', 'metrics'],
    });
    return this;
  }

  addModelTrainingStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Model Training',
      type: 'model-training',
      orderIndex: this.stageIndex++,
      config: config || { model: 'XGBoost', trials: 50 },
      decorators: ['logging', 'metrics', 'notification'],
    });
    return this;
  }

  addModelEvaluationStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Model Evaluation',
      type: 'model-evaluation',
      orderIndex: this.stageIndex++,
      config: config || {},
      decorators: ['logging', 'metrics'],
    });
    return this;
  }

  addModelRegistrationStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Model Registration',
      type: 'model-registration',
      orderIndex: this.stageIndex++,
      config: config || {},
      decorators: ['logging', 'notification'],
    });
    return this;
  }

  addCanaryDeployStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Canary Deploy',
      type: 'canary-deploy',
      orderIndex: this.stageIndex++,
      config: config || { canaryPct: 10 },
      decorators: ['logging', 'metrics', 'notification'],
    });
    return this;
  }

  addDriftCheckStage(config?: Record<string, any>): PipelineBuilder {
    this.config.stages.push({
      name: 'Drift Check',
      type: 'drift-check',
      orderIndex: this.stageIndex++,
      config: config || {},
      decorators: ['logging', 'metrics'],
    });
    return this;
  }

  addStage(stage: StageConfig): PipelineBuilder {
    this.config.stages.push({ ...stage, orderIndex: this.stageIndex++ });
    return this;
  }

  build(): PipelineConfig {
    if (!this.config.name) throw new Error('Pipeline name is required');
    return { ...this.config };
  }
}