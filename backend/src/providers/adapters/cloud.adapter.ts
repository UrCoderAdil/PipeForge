export interface ICloudProvider {
  deploy(config: any): Promise<{ success: boolean; message: string }>;
  rollback(config: any): Promise<{ success: boolean; message: string }>;
  monitor(config: any): Promise<{ healthy: boolean; latency: number }>;
  getProviderName(): string;
}

class AwsNativeClient {
  async deploy(region: string, image: string, replicas: number) {
    await new Promise((r) => setTimeout(r, 500));
    return { taskArn: `arn:aws:ecs:${region}:123:task/abc`, replicas };
  }
  async rollback(taskArn: string) {
    return { rolled: true };
  }
}

class AzureNativeClient {
  async launchContainer(location: string, image: string, instances: number) {
    await new Promise((r) => setTimeout(r, 600));
    return { deploymentId: `azure-${Date.now()}`, instances };
  }
  async rollbackContainer(deploymentId: string) {
    return { rolledBack: true };
  }
}

class GcpNativeClient {
  async runService(project: string, region: string, image: string) {
    await new Promise((r) => setTimeout(r, 400));
    return { serviceUrl: `https://${region}-${project}.run.app`, revision: `v${Date.now()}` };
  }
  async rollbackRevision(serviceUrl: string) {
    return { reverted: true };
  }
}

export class AWSAdapter implements ICloudProvider {
  private client = new AwsNativeClient();
  getProviderName() { return 'AWS'; }

  async deploy(config: any) {
    const result = await this.client.deploy(config.region || 'us-east-1', 'app:latest', config.replicas || 3);
    return { success: true, message: `AWS ECS deployed ${result.replicas} replicas in ${config.region || 'us-east-1'}` };
  }

  async rollback(config: any) {
    await this.client.rollback(config.taskArn || 'arn:aws:ecs:task/default');
    return { success: true, message: 'AWS ECS task rolled back' };
  }

  async monitor(config: any) {
    return { healthy: true, latency: Math.floor(Math.random() * 30) + 10 };
  }
}

export class AzureAdapter implements ICloudProvider {
  private client = new AzureNativeClient();
  getProviderName() { return 'Azure'; }

  async deploy(config: any) {
    const result = await this.client.launchContainer(config.region || 'eastus', 'app:latest', config.replicas || 2);
    return { success: true, message: `Azure Container Instance launched (ID: ${result.deploymentId})` };
  }

  async rollback(config: any) {
    await this.client.rollbackContainer(config.deploymentId || 'azure-default');
    return { success: true, message: 'Azure container rolled back' };
  }

  async monitor(config: any) {
    return { healthy: true, latency: Math.floor(Math.random() * 40) + 15 };
  }
}

export class GCPAdapter implements ICloudProvider {
  private client = new GcpNativeClient();
  getProviderName() { return 'GCP'; }

  async deploy(config: any) {
    const result = await this.client.runService('pipeforge', config.region || 'us-central1', 'app:latest');
    return { success: true, message: `GCP Cloud Run deployed at ${result.serviceUrl}` };
  }

  async rollback(config: any) {
    await this.client.rollbackRevision(config.serviceUrl || 'https://app.run.app');
    return { success: true, message: 'GCP Cloud Run revision rolled back' };
  }

  async monitor(config: any) {
    return { healthy: true, latency: Math.floor(Math.random() * 25) + 8 };
  }
}