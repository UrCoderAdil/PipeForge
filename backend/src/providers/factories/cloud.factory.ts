import { ICloudProvider, AWSAdapter, AzureAdapter, GCPAdapter } from '../adapters/cloud.adapter';

export interface ICloudProviderFactory {
  createDeploymentClient(): ICloudProvider;
  getProviderName(): string;
}

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

export class CloudFactoryResolver {
  static resolve(provider: string): ICloudProviderFactory {
    switch (provider.toUpperCase()) {
      case 'AWS': return new AWSFactory();
      case 'AZURE': return new AzureFactory();
      case 'GCP': return new GCPFactory();
      default: return new AWSFactory();
    }
  }
}