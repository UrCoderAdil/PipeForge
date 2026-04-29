import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RollbackService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async rollback(executionId: string) {
    const execution = await this.prisma.execution.findUnique({
      where: { id: executionId },
      include: { pipeline: true },
    });
    if (!execution) throw new Error('Execution not found');

    await this.prisma.pipeline.update({
      where: { id: execution.pipelineId },
      data: { status: 'rollback' },
    });

    this.eventEmitter.emit('execution.rollback', { executionId, pipelineId: execution.pipelineId });

    await new Promise((r) => setTimeout(r, 3000));

    const logs = [
      ...(execution.logs as any[]),
      { time: new Date().toLocaleTimeString(), message: '[Rollback] Detecting failure point', stage: 'Rollback' },
      { time: new Date().toLocaleTimeString(), message: '[Rollback] Locating stable snapshot', stage: 'Rollback' },
      { time: new Date().toLocaleTimeString(), message: '[Rollback] Restoring previous configuration', stage: 'Rollback' },
      { time: new Date().toLocaleTimeString(), message: '[Rollback] Restarting deployment', stage: 'Rollback' },
      { time: new Date().toLocaleTimeString(), message: '[Rollback] Rollback completed successfully', stage: 'Rollback' },
    ];

    await this.prisma.execution.update({
      where: { id: executionId },
      data: { status: 'rollback', logs: logs as any },
    });

    await this.prisma.pipeline.update({
      where: { id: execution.pipelineId },
      data: { status: 'idle' },
    });

    await this.prisma.notification.create({
      data: {
        title: 'Rollback Completed',
        message: `${execution.pipeline.name} rolled back successfully`,
        type: 'warning',
      },
    });

    this.eventEmitter.emit('execution.rollback.complete', { executionId });

    return { success: true, message: 'Rollback completed' };
  }
}