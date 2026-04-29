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
  };

  static create(type: string): IStageExecutor {
    const key = type.toLowerCase();
    const ExecutorClass = this.executors[key] || BuildStageExecutor;
    return new ExecutorClass();
  }
}