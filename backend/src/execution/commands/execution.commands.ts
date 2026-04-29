export interface ICommand {
  execute(): Promise<any>;
  undo?(): Promise<any>;
}

export class ExecutePipelineCommand implements ICommand {
  constructor(
    private pipelineId: string,
    private executionService: any,
    private options: any,
  ) {}

  async execute() {
    return this.executionService.runPipeline(this.pipelineId, this.options);
  }
}

export class RollbackCommand implements ICommand {
  constructor(
    private executionId: string,
    private rollbackService: any,
  ) {}

  async execute() {
    return this.rollbackService.rollback(this.executionId);
  }
}

export class ExecutionManager {
  private history: ICommand[] = [];

  async invoke(command: ICommand): Promise<any> {
    const result = await command.execute();
    this.history.push(command);
    return result;
  }

  async undoLast(): Promise<any> {
    const last = this.history.pop();
    if (last?.undo) {
      return last.undo();
    }
  }
}