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
}