export interface IStageComponent {
  getName(): string;
  execute(): Promise<{ success: boolean; logs: string[] }>;
}

export class LeafStage implements IStageComponent {
  constructor(private name: string, private type: string) {}

  getName(): string {
    return this.name;
  }

  async execute(): Promise<{ success: boolean; logs: string[] }> {
    const duration = Math.random() * 2000 + 1000;
    await new Promise((r) => setTimeout(r, duration));
    return {
      success: true,
      logs: [`[${this.type}] ${this.name} started`, `[${this.type}] ${this.name} completed`],
    };
  }
}

export class CompositeStageGroup implements IStageComponent {
  private children: IStageComponent[] = [];

  constructor(private groupName: string) {}

  getName(): string {
    return this.groupName;
  }

  add(component: IStageComponent): void {
    this.children.push(component);
  }

  async execute(): Promise<{ success: boolean; logs: string[] }> {
    const allLogs: string[] = [`[Group] Starting ${this.groupName}`];
    for (const child of this.children) {
      const result = await child.execute();
      allLogs.push(...result.logs);
      if (!result.success) {
        return { success: false, logs: allLogs };
      }
    }
    allLogs.push(`[Group] ${this.groupName} completed`);
    return { success: true, logs: allLogs };
  }
}