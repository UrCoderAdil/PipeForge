import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { StageFactory } from './factories/stage.factory';
import { applyDecorators } from './decorators/stage.decorators';
import { PipelineStateContext } from './states/pipeline.state';

@Injectable()
export class ExecutionService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async startExecution(pipelineId: string, options: { forceFail?: boolean; failStage?: string } = {}) {
    const pipeline = await this.prisma.pipeline.findUnique({
      where: { id: pipelineId },
      include: { stages: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!pipeline) throw new Error('Pipeline not found');

    const execution = await this.prisma.execution.create({
      data: {
        pipelineId,
        status: 'running',
        forceFail: options.forceFail || false,
        failStage: options.failStage,
        logs: [],
        provider: pipeline.provider,
      },
    });

    await this.prisma.pipeline.update({ where: { id: pipelineId }, data: { status: 'running' } });

    this.eventEmitter.emit('execution.started', { executionId: execution.id, pipelineId });
    this.runExecution(execution.id, pipeline, options).catch(console.error);

    return execution;
  }

  private async runExecution(executionId: string, pipeline: any, options: any) {
    const allLogs: any[] = [];
    const startTime = Date.now();
    const stateCtx = new PipelineStateContext('running');

    try {
      const chainStages = pipeline.stages.map((stage: any) => {
        const executor = StageFactory.create(stage.type);
        const decorated = applyDecorators(executor, (stage.decorators as string[]) || []);
        const shouldFail =
          options.forceFail &&
          options.failStage &&
          stage.name.toLowerCase().includes(options.failStage.toLowerCase());
        return {
          name: stage.name,
          executor: decorated,
          config: stage.config,
          forceFail: shouldFail || false,
        };
      });

      let currentStageIndex = 0;
      for (const chainStage of chainStages) {
        this.eventEmitter.emit('execution.stage', {
          executionId,
          stageName: chainStage.name,
          status: 'running',
          stageIndex: currentStageIndex,
        });

        const result = await chainStage.executor.execute(chainStage.config, chainStage.forceFail);

        for (const log of result.logs) {
          const logEntry = { time: new Date().toLocaleTimeString(), message: log, stage: chainStage.name };
          allLogs.push(logEntry);
          this.eventEmitter.emit('execution.log', { executionId, ...logEntry });
        }

        const stageStatus = result.success ? 'success' : 'failed';
        this.eventEmitter.emit('execution.stage', {
          executionId,
          stageName: chainStage.name,
          status: stageStatus,
          stageIndex: currentStageIndex,
        });

        if (!result.success) {
          stateCtx.transition('failed');
          await this.finalizeExecution(executionId, pipeline.id, 'failed', allLogs, Date.now() - startTime);

          this.eventEmitter.emit('execution.failed', {
            executionId,
            pipelineId: pipeline.id,
            failedStage: chainStage.name,
          });

          await this.prisma.notification.create({
            data: {
              title: 'Pipeline Failed',
              message: `${pipeline.name} failed at ${chainStage.name}`,
              type: 'error',
            },
          });
          return;
        }
        currentStageIndex++;
      }

      stateCtx.transition('success');
      await this.finalizeExecution(executionId, pipeline.id, 'success', allLogs, Date.now() - startTime);

      this.eventEmitter.emit('execution.success', { executionId, pipelineId: pipeline.id });

      await this.prisma.notification.create({
        data: {
          title: 'Pipeline Succeeded',
          message: `${pipeline.name} deployed successfully`,
          type: 'success',
        },
      });
    } catch (err) {
      await this.finalizeExecution(executionId, pipeline.id, 'failed', allLogs, Date.now() - startTime);
    }
  }

  private async finalizeExecution(
    executionId: string,
    pipelineId: string,
    status: string,
    logs: any[],
    duration: number,
  ) {
    await this.prisma.execution.update({
      where: { id: executionId },
      data: { status, logs: logs as any, duration: Math.floor(duration / 1000), finishedAt: new Date() },
    });
    await this.prisma.pipeline.update({
      where: { id: pipelineId },
      data: { status },
    });
  }

  async getHistory() {
    return this.prisma.execution.findMany({
      include: { pipeline: { select: { name: true, provider: true } } },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });
  }

  async getOne(id: string) {
    return this.prisma.execution.findUnique({
      where: { id },
      include: { pipeline: { include: { stages: { orderBy: { orderIndex: 'asc' } } } } },
    });
  }
}