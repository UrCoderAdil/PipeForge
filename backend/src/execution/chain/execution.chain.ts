import { IStageExecutor } from '../factories/stage.factory';

export interface ChainStage {
  name: string;
  executor: IStageExecutor;
  config: any;
  forceFail: boolean;
}

export class ExecutionChainHandler {
  private next: ExecutionChainHandler | null = null;

  constructor(private stage: ChainStage) {}

  setNext(handler: ExecutionChainHandler): ExecutionChainHandler {
    this.next = handler;
    return handler;
  }

  async handle(allLogs: any[]): Promise<{ success: boolean; failedStage?: string }> {
    const result = await this.stage.executor.execute(this.stage.config, this.stage.forceFail);

    for (const log of result.logs) {
      allLogs.push({ time: new Date().toLocaleTimeString(), message: log, stage: this.stage.name });
    }

    if (!result.success) {
      return { success: false, failedStage: this.stage.name };
    }

    if (this.next) {
      return this.next.handle(allLogs);
    }

    return { success: true };
  }
}

export function buildExecutionChain(stages: ChainStage[]): ExecutionChainHandler | null {
  if (stages.length === 0) return null;
  const handlers = stages.map((s) => new ExecutionChainHandler(s));
  for (let i = 0; i < handlers.length - 1; i++) {
    handlers[i].setNext(handlers[i + 1]);
  }
  return handlers[0];
}