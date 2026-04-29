import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

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

  console.log('Admin user:', admin.email);

  // Seed plugins (only if none exist)
  const existingPlugins = await prisma.plugin.count();
  if (existingPlugins === 0) {
    await prisma.plugin.createMany({
      data: [
        { name: 'Slack Notifier', description: 'Send deployment notifications to Slack channels', category: 'notification', enabled: false },
        { name: 'Email Notifier', description: 'Send deployment reports via email', category: 'notification', enabled: true },
        { name: 'Discord Alerts', description: 'Post alerts to Discord webhooks', category: 'notification', enabled: false },
        { name: 'Advanced Security Scan', description: 'Deep vulnerability scanning with OWASP rules', category: 'security', enabled: true },
        { name: 'AI Deployment Advisor', description: 'AI-powered deployment risk analysis', category: 'ai', enabled: false },
        { name: 'Performance Analyzer', description: 'Post-deploy performance benchmarking', category: 'analytics', enabled: false },
        { name: 'GitHub Integration', description: 'Trigger pipelines from GitHub webhooks', category: 'integration', enabled: true },
        { name: 'Kubernetes Deployer', description: 'Deploy to Kubernetes clusters', category: 'deployment', enabled: false },
      ],
    });
    console.log('Plugins seeded');
  }

  // Seed pipelines (only if none exist for this user)
  const existingPipelines = await prisma.pipeline.count({ where: { userId: admin.id } });
  if (existingPipelines === 0) {
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

    await prisma.pipeline.create({
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

    await prisma.pipeline.create({
      data: {
        name: 'Quick Deploy GCP',
        description: 'Fast GCP deployment pipeline',
        provider: 'GCP',
        status: 'success',
        userId: admin.id,
        stages: {
          create: [
            { name: 'Build', type: 'build', orderIndex: 0, config: { timeout: 30 }, decorators: ['logging'] },
            { name: 'Deploy', type: 'deploy', orderIndex: 1, config: { region: 'us-central1', replicas: 1 }, decorators: ['logging', 'notification'] },
          ],
        },
      },
    });

    // Seed a sample completed execution
    await prisma.execution.create({
      data: {
        status: 'success',
        duration: 127,
        provider: 'AWS',
        pipelineId: pipeline1.id,
        finishedAt: new Date(),
        logs: [
          { time: '12:10:21', message: '[Build] Initializing build environment', stage: 'Build' },
          { time: '12:10:23', message: '[Build] Installing dependencies', stage: 'Build' },
          { time: '12:10:26', message: '[Build] Build successful', stage: 'Build' },
          { time: '12:10:27', message: '[Test] Starting test runner', stage: 'Unit Test' },
          { time: '12:10:31', message: '[Test] All tests passed (42/42)', stage: 'Unit Test' },
          { time: '12:10:33', message: '[Security] Scanning dependencies', stage: 'Security Scan' },
          { time: '12:10:35', message: '[Security] No critical vulnerabilities found', stage: 'Security Scan' },
          { time: '12:10:37', message: '[Deploy] Preparing deployment to us-east-1', stage: 'Deploy' },
          { time: '12:10:42', message: '[Deploy] Deployment successful', stage: 'Deploy' },
          { time: '12:10:43', message: '[Monitor] Health check passed', stage: 'Health Check' },
        ],
      },
    });

    console.log('Pipelines and executions seeded');
  }

  // Seed notifications
  const existingNotifs = await prisma.notification.count();
  if (existingNotifs === 0) {
    await prisma.notification.createMany({
      data: [
        { title: 'Pipeline Deployed', message: 'Production Deploy completed successfully in 127s', type: 'success' },
        { title: 'Security Scan Failed', message: 'Vulnerability found in dependency — rollback triggered', type: 'error' },
        { title: 'Rollback Triggered', message: 'API Service rolled back to previous stable version', type: 'warning' },
        { title: 'Plugin Enabled', message: 'Advanced Security Scan plugin is now active', type: 'info' },
        { title: 'AWS Adapter Selected', message: 'Cloud provider switched to AWS us-east-1', type: 'info' },
      ],
    });
    console.log('Notifications seeded');
  }

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
