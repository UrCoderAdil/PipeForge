import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DriftDetectionService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  findAll() {
    return this.prisma.driftAlert.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  getOpen() {
    return this.prisma.driftAlert.findMany({
      where: { status: 'open' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acknowledge(id: string) {
    return this.prisma.driftAlert.update({
      where: { id },
      data: { status: 'acknowledged' },
    });
  }

  async resolve(id: string) {
    return this.prisma.driftAlert.update({
      where: { id },
      data: { status: 'resolved', resolvedAt: new Date() },
    });
  }

  async runCheck(modelName: string) {
    const psiScore = parseFloat((Math.random() * 0.35).toFixed(4));
    const threshold = 0.2;
    const isDrifted = psiScore > threshold;

    if (isDrifted) {
      const alert = await this.prisma.driftAlert.create({
        data: {
          alertType: 'data',
          severity: psiScore > 0.3 ? 'high' : 'medium',
          feature: ['age_bucket', 'transaction_velocity', 'geo_region', 'credit_score'][Math.floor(Math.random() * 4)],
          psiScore,
          threshold,
          modelName,
          description: `Data drift detected in ${modelName}. PSI score ${psiScore} exceeds threshold ${threshold}. Auto-retraining pipeline triggered.`,
          autoRetrain: true,
          status: 'open',
        },
      });

      this.eventEmitter.emit('drift.detected', { alertId: alert.id, modelName, psiScore });

      await this.prisma.notification.create({
        data: {
          title: 'Drift Alert',
          message: `Data drift detected in ${modelName} (PSI: ${psiScore}) — auto-retraining triggered`,
          type: 'warning',
        },
      });

      return alert;
    }

    return { status: 'nominal', modelName, psiScore, threshold, message: 'No drift detected' };
  }

  getMetrics() {
    return {
      inferenceLatencyP50: Math.floor(Math.random() * 20) + 15,
      inferenceLatencyP99: Math.floor(Math.random() * 80) + 80,
      throughputRpm: Math.floor(Math.random() * 500) + 1200,
      errorRate: parseFloat((Math.random() * 0.5).toFixed(3)),
      predictionDist: this.generatePredictionDistribution(),
      featureDrift: this.generateFeatureDrift(),
    };
  }

  private generatePredictionDistribution() {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${String(i).padStart(2, '0')}:00`,
      positive: Math.floor(Math.random() * 50) + 10,
      negative: Math.floor(Math.random() * 200) + 300,
    }));
    return hours;
  }

  private generateFeatureDrift() {
    const features = ['age_bucket', 'credit_score', 'transaction_velocity', 'geo_region', 'device_type', 'time_of_day'];
    return features.map((f) => ({
      feature: f,
      psi: parseFloat((Math.random() * 0.25).toFixed(4)),
      status: Math.random() > 0.8 ? 'drifted' : 'stable',
    }));
  }
}
