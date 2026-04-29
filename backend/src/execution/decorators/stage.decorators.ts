import { IStageExecutor } from '../factories/stage.factory';

abstract class StageDecorator implements IStageExecutor {
  constructor(protected wrappee: IStageExecutor) {}
  getName(): string { return this.wrappee.getName(); }
  abstract execute(config: any, forceFail?: boolean): Promise<{ success: boolean; logs: string[]; duration: number }>;
}

export class LoggingDecorator extends StageDecorator {
  async execute(config: any, forceFail?: boolean) {
    const ts = new Date().toLocaleTimeString();
    console.log(`[LOG] ${ts} - Starting ${this.getName()}`);
    const result = await this.wrappee.execute(config, forceFail);
    console.log(`[LOG] ${ts} - ${this.getName()} ${result.success ? 'PASS' : 'FAIL'}`);
    return result;
  }
}

export class RetryDecorator extends StageDecorator {
  constructor(wrappee: IStageExecutor, private maxRetries = 2) {
    super(wrappee);
  }

  async execute(config: any, forceFail?: boolean) {
    let lastResult = await this.wrappee.execute(config, forceFail);
    if (lastResult.success) return lastResult;

    for (let i = 0; i < this.maxRetries; i++) {
      lastResult.logs.push(`[Retry] Attempt ${i + 2} of ${this.maxRetries + 1}`);
      const retry = await this.wrappee.execute(config, false);
      if (retry.success) {
        return { ...retry, logs: [...lastResult.logs, ...retry.logs] };
      }
    }
    return lastResult;
  }
}

export class SecurityDecorator extends StageDecorator {
  async execute(config: any, forceFail?: boolean) {
    const result = await this.wrappee.execute(config, forceFail);
    result.logs.push(`[Security] Stage ${this.getName()} audited at ${new Date().toISOString()}`);
    return result;
  }
}

export class MetricsDecorator extends StageDecorator {
  async execute(config: any, forceFail?: boolean) {
    const result = await this.wrappee.execute(config, forceFail);
    result.logs.push(`[Metrics] Duration: ${result.duration}ms, Status: ${result.success ? 'SUCCESS' : 'FAILURE'}`);
    return result;
  }
}

export class NotificationDecorator extends StageDecorator {
  async execute(config: any, forceFail?: boolean) {
    const result = await this.wrappee.execute(config, forceFail);
    result.logs.push(`[Notify] Stage ${this.getName()} notification sent`);
    return result;
  }
}

export function applyDecorators(executor: IStageExecutor, decorators: string[]): IStageExecutor {
  let wrapped = executor;
  for (const dec of decorators) {
    switch (dec.toLowerCase()) {
      case 'logging': wrapped = new LoggingDecorator(wrapped); break;
      case 'retry': wrapped = new RetryDecorator(wrapped); break;
      case 'security': wrapped = new SecurityDecorator(wrapped); break;
      case 'metrics': wrapped = new MetricsDecorator(wrapped); break;
      case 'notification': wrapped = new NotificationDecorator(wrapped); break;
    }
  }
  return wrapped;
}