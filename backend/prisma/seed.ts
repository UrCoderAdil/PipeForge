import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pipeforge.dev' },
    update: {},
    create: {
      email: 'admin@pipeforge.dev',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const plugins = [
    { name: 'Slack Notifier', description: 'Send deployment notifications to Slack channels', category: 'notification', enabled: false },
    { name: 'Email Notifier', description: 'Send deployment reports via email', category: 'notification', enabled: true },
    { name: 'Discord Alerts', description: 'Post alerts to Discord webhooks', category: 'notification', enabled: false },
    { name: 'Advanced Security Scan', description: 'Deep vulnerability scanning with OWASP rules', category: 'security', enabled: true },
    { name: 'AI Deployment Advisor', description: 'AI-powered deployment risk analysis', category: 'ai', enabled: false },
    { name: 'Performance Analyzer', description: 'Post-deploy performance benchmarking', category: 'analytics', enabled: false },
    { name: 'GitHub Integration', description: 'Trigger pipelines from GitHub webhooks', category: 'integration', enabled: true },
    { name: 'Kubernetes Deployer', description: 'Deploy to Kubernetes clusters', category: 'deployment', enabled: false },
  ];

  for (const plugin of plugins) {
    await prisma.plugin.upsert({
      where: { id: plugin.name },
      update: {},
      create: plugin as any,
    });
  }

  const pipeline1 = await prisma.pipeline.create({
    data: {
      name: 'Production Deploy',
      description: 'Main production deployment pipeline',
      provider: 'AWS',
      status: 'idle',
      userId: admin.id,
      stages: {
        create: [
          { name: 'Build', type: 'build', orderIndex: 0, config: { timeout: 60, retries: 2 }, decorators: ['logging', 'retry'] },
          { name: 'Unit Test', type: 'test', orderIndex: 1, config: { timeout: 120, retries: 1 }, decorators: ['logging'] },
          { name: 'Security Scan', type: 'security', orderIndex: 2, config: { level: 'high' }, decorators: ['logging', 'metrics'] },
          { name: 'Deploy', type: 'deploy', orderIndex: 3, config: { region: 'us-east-1', replicas: 3 }, decorators: ['logging', 'notification'] },
          { name: 'Health Check', type: 'monitor', orderIndex: 4, config: { url: '/health', retries: 3 }, decorators: ['logging'] },
        ],
      },
    },
  });

  const pipeline2 = await prisma.pipeline.create({
    data: {
      name: 'API Service Pipeline',
      description: 'Backend API service pipeline',
      provider: 'Azure',
      status: 'idle',
      userId: admin.id,
      stages: {
        create: [
          { name: 'Build', type: 'build', orderIndex: 0, config: { timeout: 45, retries: 2 }, decorators: ['logging'] },
          { name: 'Integration Test', type: 'test', orderIndex: 1, config: { timeout: 180 }, decorators: ['logging', 'metrics'] },
          { name: 'Package', type: 'package', orderIndex: 2, config: { format: 'docker' }, decorators: ['logging'] },
          { name: 'Deploy', type: 'deploy', orderIndex: 3, config: { region: 'eastus', replicas: 2 }, decorators: ['logging', 'notification'] },
        ],
      },
    },
  });

  await prisma.execution.create({
    data: {
      status: 'success',
      duration: 127,
      provider: 'AWS',
      pipelineId: pipeline1.id,
      finishedAt: new Date(),
      logs: [
        { time: '12:10:21', message: 'Build started', stage: 'Build' },
        { time: '12:10:26', message: 'Build complete', stage: 'Build' },
        { time: '12:10:27', message: 'Unit tests running', stage: 'Unit Test' },
        { time: '12:10:31', message: 'Tests passed (42/42)', stage: 'Unit Test' },
        { time: '12:10:35', message: 'Deploying container', stage: 'Deploy' },
        { time: '12:10:42', message: 'Deployment complete', stage: 'Deploy' },
      ],
    },
  });

  await prisma.notification.createMany({
    data: [
      { title: 'Pipeline Deployed', message: 'Production Deploy completed successfully', type: 'success' },
      { title: 'Security Scan Failed', message: 'Vulnerability found in dependency', type: 'error' },
      { title: 'Rollback Triggered', message: 'API Service rolled back to v2.1', type: 'warning' },
      { title: 'Plugin Installed', message: 'Advanced Security Scan plugin enabled', type: 'info' },
    ],
  });

  console.log('Seed complete. Admin:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());