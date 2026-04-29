import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { PipelineDirector } from './builders/pipeline.director';

@Injectable()
export class PipelinesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.pipeline.findMany({
      where: { userId },
      include: { stages: { orderBy: { orderIndex: 'asc' } }, _count: { select: { executions: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pipeline = await this.prisma.pipeline.findUnique({
      where: { id },
      include: { stages: { orderBy: { orderIndex: 'asc' } }, executions: { orderBy: { startedAt: 'desc' }, take: 5 } },
    });
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    return pipeline;
  }

  async create(userId: string, dto: CreatePipelineDto) {
    const { stages, ...pipelineData } = dto;
    return this.prisma.pipeline.create({
      data: {
        ...pipelineData,
        userId,
        stages: stages
          ? {
              create: stages.map((s, i) => ({
                name: s.name,
                type: s.type || s.name.toLowerCase(),
                orderIndex: i,
                config: s.config || {},
                decorators: s.decorators || [],
              })),
            }
          : undefined,
      },
      include: { stages: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async update(id: string, dto: Partial<CreatePipelineDto>) {
    const { stages, ...pipelineData } = dto;

    if (stages) {
      await this.prisma.stage.deleteMany({ where: { pipelineId: id } });
      await this.prisma.stage.createMany({
        data: stages.map((s, i) => ({
          pipelineId: id,
          name: s.name,
          type: s.type || s.name.toLowerCase(),
          orderIndex: s.orderIndex ?? i,
          config: s.config || {},
          decorators: s.decorators || [],
        })),
      });
    }

    return this.prisma.pipeline.update({
      where: { id },
      data: pipelineData,
      include: { stages: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async delete(id: string) {
    return this.prisma.pipeline.delete({ where: { id } });
  }

  async clone(id: string, userId: string) {
    const original = await this.findOne(id);
    return this.prisma.pipeline.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        provider: original.provider,
        userId,
        stages: {
          create: original.stages.map((s) => ({
            name: s.name,
            type: s.type,
            orderIndex: s.orderIndex,
            config: s.config as any,
            decorators: s.decorators as any,
          })),
        },
      },
      include: { stages: true },
    });
  }

  async createFromTemplate(template: string, userId: string) {
    let config;
    switch (template) {
      case 'node': config = PipelineDirector.buildNodeAppPipeline('Node App Pipeline'); break;
      case 'docker': config = PipelineDirector.buildDockerServicePipeline('Docker Service Pipeline'); break;
      case 'fullqa': config = PipelineDirector.buildFullQAPipeline('Full QA Pipeline'); break;
      case 'quickdeploy': config = PipelineDirector.buildQuickDeployPipeline('Quick Deploy Pipeline'); break;
      default: throw new NotFoundException('Template not found');
    }

    return this.prisma.pipeline.create({
      data: {
        name: config.name,
        description: config.description,
        provider: config.provider,
        userId,
        stages: { create: config.stages },
      },
      include: { stages: { orderBy: { orderIndex: 'asc' } } },
    });
  }
}