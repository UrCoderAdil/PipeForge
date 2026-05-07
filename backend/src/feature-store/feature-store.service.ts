import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeatureStoreService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.feature.findMany({
      orderBy: { entity: 'asc' },
    });
  }

  findByEntity(entity: string) {
    return this.prisma.feature.findMany({
      where: { entity },
      orderBy: { name: 'asc' },
    });
  }

  toggle(id: string) {
    return this.prisma.feature.findUnique({ where: { id } }).then((f) => {
      if (!f) throw new Error('Feature not found');
      return this.prisma.feature.update({
        where: { id },
        data: { enabled: !f.enabled },
      });
    });
  }

  getStats() {
    return this.prisma.feature.groupBy({
      by: ['entity'],
      _count: { id: true },
    });
  }
}
