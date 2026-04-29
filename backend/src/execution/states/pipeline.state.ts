export type PipelineStateType = 'idle' | 'running' | 'paused' | 'failed' | 'rollback' | 'success' | 'cancelled';

export interface IPipelineState {
  getType(): PipelineStateType;
  canStart(): boolean;
  canCancel(): boolean;
  canRollback(): boolean;
  getLabel(): string;
  getColor(): string;
}

export class IdleState implements IPipelineState {
  getType() { return 'idle' as const; }
  canStart() { return true; }
  canCancel() { return false; }
  canRollback() { return false; }
  getLabel() { return 'Idle'; }
  getColor() { return 'gray'; }
}

export class RunningState implements IPipelineState {
  getType() { return 'running' as const; }
  canStart() { return false; }
  canCancel() { return true; }
  canRollback() { return false; }
  getLabel() { return 'Running'; }
  getColor() { return 'blue'; }
}

export class SuccessState implements IPipelineState {
  getType() { return 'success' as const; }
  canStart() { return true; }
  canCancel() { return false; }
  canRollback() { return true; }
  getLabel() { return 'Success'; }
  getColor() { return 'green'; }
}

export class FailedState implements IPipelineState {
  getType() { return 'failed' as const; }
  canStart() { return true; }
  canCancel() { return false; }
  canRollback() { return true; }
  getLabel() { return 'Failed'; }
  getColor() { return 'red'; }
}

export class RollbackState implements IPipelineState {
  getType() { return 'rollback' as const; }
  canStart() { return false; }
  canCancel() { return false; }
  canRollback() { return false; }
  getLabel() { return 'Rolling Back'; }
  getColor() { return 'orange'; }
}

export class PipelineStateContext {
  private state: IPipelineState;

  constructor(initialState: PipelineStateType = 'idle') {
    this.state = this.createState(initialState);
  }

  transition(newState: PipelineStateType): void {
    this.state = this.createState(newState);
  }

  private createState(type: PipelineStateType): IPipelineState {
    const states: Record<PipelineStateType, IPipelineState> = {
      idle: new IdleState(),
      running: new RunningState(),
      success: new SuccessState(),
      failed: new FailedState(),
      rollback: new RollbackState(),
      paused: new IdleState(),
      cancelled: new IdleState(),
    };
    return states[type] || new IdleState();
  }

  getState() { return this.state; }
  getStateType() { return this.state.getType(); }
}