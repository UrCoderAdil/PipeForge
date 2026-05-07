import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExperimentsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.experiment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.experiment.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    description?: string;
    modelType: string;
    params?: Record<string, any>;
    tags?: string[];
  }) {
    const metrics = this.generateMetrics(data.modelType);
    const duration = Math.floor(Math.random() * 600) + 120;
    return this.prisma.experiment.create({
      data: {
        name: data.name,
        description: data.description,
        modelType: data.modelType,
        params: data.params || this.generateParams(data.modelType),
        metrics,
        tags: data.tags || [],
        status: 'completed',
        duration,
        finishedAt: new Date(),
      },
    });
  }

  async compare(ids: string[]) {
    return this.prisma.experiment.findMany({
      where: { id: { in: ids } },
      orderBy: { createdAt: 'desc' },
    });
  }

  private generateMetrics(modelType: string) {
    const base = modelType === 'pytorch' ? 0.02 : 0;
    return {
      auc: parseFloat((0.872 + Math.random() * 0.05 + base).toFixed(4)),
      f1: parseFloat((0.841 + Math.random() * 0.05).toFixed(4)),
      precision: parseFloat((0.856 + Math.random() * 0.04).toFixed(4)),
      recall: parseFloat((0.828 + Math.random() * 0.05).toFixed(4)),
      accuracy: parseFloat((0.891 + Math.random() * 0.04).toFixed(4)),
      loss: parseFloat((0.12 + Math.random() * 0.08).toFixed(4)),
    };
  }

  private generateParams(modelType: string) {
    if (modelType === 'xgboost' || modelType === 'lightgbm') {
      return {
        learning_rate: parseFloat((0.01 + Math.random() * 0.09).toFixed(4)),
        max_depth: Math.floor(Math.random() * 4) + 4,
        n_estimators: Math.floor(Math.random() * 300) + 100,
        subsample: parseFloat((0.7 + Math.random() * 0.3).toFixed(2)),
        colsample_bytree: parseFloat((0.6 + Math.random() * 0.4).toFixed(2)),
        min_child_weight: Math.floor(Math.random() * 5) + 1,
      };
    }
    if (modelType === 'pytorch') {
      return {
        learning_rate: parseFloat((0.0001 + Math.random() * 0.001).toFixed(5)),
        batch_size: [32, 64, 128][Math.floor(Math.random() * 3)],
        epochs: Math.floor(Math.random() * 30) + 10,
        dropout: parseFloat((0.1 + Math.random() * 0.3).toFixed(2)),
        hidden_layers: Math.floor(Math.random() * 3) + 2,
      };
    }
    return {
      n_estimators: Math.floor(Math.random() * 200) + 50,
      max_depth: Math.floor(Math.random() * 10) + 5,
      min_samples_split: Math.floor(Math.random() * 5) + 2,
    };
  }
}
