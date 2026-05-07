import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModelRegistryService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.modelVersion.findMany({
      orderBy: [{ name: 'asc' }, { version: 'desc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.modelVersion.findUnique({ where: { id } });
  }

  async promote(id: string, targetStage: string) {
    const model = await this.prisma.modelVersion.findUnique({ where: { id } });
    if (!model) throw new NotFoundException('Model version not found');

    if (targetStage === 'production') {
      await this.prisma.modelVersion.updateMany({
        where: { name: model.name, stage: 'production' },
        data: { stage: 'archived' },
      });
    }

    return this.prisma.modelVersion.update({
      where: { id },
      data: { stage: targetStage, promotedAt: new Date() },
    });
  }

  async rollback(modelName: string) {
    const production = await this.prisma.modelVersion.findFirst({
      where: { name: modelName, stage: 'production' },
    });

    const previous = await this.prisma.modelVersion.findFirst({
      where: { name: modelName, stage: 'archived' },
      orderBy: { promotedAt: 'desc' },
    });

    if (!previous) throw new NotFoundException('No previous version to rollback to');

    if (production) {
      await this.prisma.modelVersion.update({
        where: { id: production.id },
        data: { stage: 'archived' },
      });
    }

    return this.prisma.modelVersion.update({
      where: { id: previous.id },
      data: { stage: 'production', promotedAt: new Date() },
    });
  }
}
