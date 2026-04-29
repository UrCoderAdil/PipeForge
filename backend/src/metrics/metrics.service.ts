import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics() {
    const [pipelines, executions, plugins, notifications] = await Promise.all([
      this.prisma.pipeline.findMany({ include: { executions: true } }),
      this.prisma.execution.findMany({ orderBy: { startedAt: 'desc' }, take: 100 }),
      this.prisma.plugin.count({ where: { enabled: true } }),
      this.prisma.notification.count({ where: { read: false } }),
    ]);

    const total = executions.length;
    const successful = executions.filter((e) => e.status === 'success').length;
    const failed = executions.filter((e) => e.status === 'failed').length;
    const rollbacks = executions.filter((e) => e.status === 'rollback').length;
    const running = executions.filter((e) => e.status === 'running').length;
    const durations = executions.filter((e) => e.duration).map((e) => e.duration!);
    const avgDuration = durations.length
      ? Math.floor(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0;

    const monthlyData = this.generateMonthlyData(executions);

    const providerCounts = executions.reduce((acc: any, e) => {
      acc[e.provider] = (acc[e.provider] || 0) + 1;
      return acc;
    }, {});
    const providerData = Object.entries(providerCounts).map(([name, value]) => ({ name, value }));

    const recentActivity = await this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      kpi: {
        totalPipelines: pipelines.length,
        runningPipelines: running,
        successfulDeployments: successful,
        failedDeployments: failed,
        rollbackCount: rollbacks,
        avgDeploymentTime: avgDuration,
        enabledPlugins: plugins,
        unreadNotifications: notifications,
        successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      },
      charts: {
        monthlyData,
        providerData,
        successRate: [
          { name: 'Success', value: successful },
          { name: 'Failed', value: failed },
          { name: 'Rollback', value: rollbacks },
        ],
      },
      recentActivity,
    };
  }

  private generateMonthlyData(executions: any[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month) => {
      const base = Math.floor(Math.random() * 20) + 10;
      return {
        month,
        deployments: base,
        success: Math.floor(base * 0.85),
        failed: Math.floor(base * 0.15),
      };
    });
  }
}