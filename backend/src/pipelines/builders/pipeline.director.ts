import { PipelineBuilder, PipelineConfig } from './pipeline.builder';

export class PipelineDirector {
  static buildNodeAppPipeline(name: string): PipelineConfig {
    return new PipelineBuilder()
      .setName(name)
      .setProvider('AWS')
      .setDescription('Node.js application deployment pipeline')
      .addBuildStage()
      .addTestStage()
      .addDeployStage()
      .build();
  }

  static buildFullQAPipeline(name: string): PipelineConfig {
    return new PipelineBuilder()
      .setName(name)
      .setProvider('AWS')
      .setDescription('Full QA pipeline with security and monitoring')
      .addBuildStage()
      .addTestStage()
      .addSecurityScan()
      .addDeployStage()
      .addMonitorStage()
      .build();
  }

  static buildDockerServicePipeline(name: string): PipelineConfig {
    return new PipelineBuilder()
      .setName(name)
      .setProvider('GCP')
      .setDescription('Docker service deployment pipeline')
      .addBuildStage({ timeout: 90, retries: 3 })
      .addTestStage({ timeout: 60 })
      .addDeployStage({ region: 'us-central1', replicas: 2 })
      .build();
  }

  static buildQuickDeployPipeline(name: string): PipelineConfig {
    return new PipelineBuilder()
      .setName(name)
      .setProvider('Azure')
      .setDescription('Quick deploy without full test suite')
      .addBuildStage()
      .addDeployStage()
      .build();
  }

  static buildMLTrainingPipeline(name: string): PipelineConfig {
    return new PipelineBuilder()
      .setName(name)
      .setProvider('AWS')
      .setDescription('End-to-end ML training pipeline: validate → engineer → train → evaluate → register')
      .addDataValidationStage()
      .addFeatureEngineeringStage()
      .addModelTrainingStage()
      .addModelEvaluationStage()
      .addModelRegistrationStage()
      .build();
  }

  static buildMLDeployPipeline(name: string): PipelineConfig {
    return new PipelineBuilder()
      .setName(name)
      .setProvider('AWS')
      .setDescription('ML model deployment with canary release and drift monitoring')
      .addSecurityScan()
      .addCanaryDeployStage()
      .addMonitorStage()
      .addDriftCheckStage()
      .build();
  }

  static buildFullMLOpsPipeline(name: string): PipelineConfig {
    return new PipelineBuilder()
      .setName(name)
      .setProvider('AWS')
      .setDescription('Full MLOps pipeline: data → features → train → evaluate → register → canary → monitor → drift')
      .addDataValidationStage()
      .addFeatureEngineeringStage()
      .addModelTrainingStage()
      .addModelEvaluationStage()
      .addModelRegistrationStage()
      .addSecurityScan()
      .addCanaryDeployStage()
      .addMonitorStage()
      .addDriftCheckStage()
      .build();
  }
}