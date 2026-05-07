import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PipelinesModule } from './pipelines/pipelines.module';
import { ExecutionModule } from './execution/execution.module';
import { RollbackModule } from './rollback/rollback.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WebsocketModule } from './websocket/websocket.module';
import { PluginsModule } from './plugins/plugins.module';
import { MetricsModule } from './metrics/metrics.module';
import { ExperimentsModule } from './experiments/experiments.module';
import { ModelRegistryModule } from './model-registry/model-registry.module';
import { DataValidationModule } from './data-validation/data-validation.module';
import { DriftDetectionModule } from './drift-detection/drift-detection.module';
import { FeatureStoreModule } from './feature-store/feature-store.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    PipelinesModule,
    ExecutionModule,
    RollbackModule,
    NotificationsModule,
    WebsocketModule,
    PluginsModule,
    MetricsModule,
    ExperimentsModule,
    ModelRegistryModule,
    DataValidationModule,
    DriftDetectionModule,
    FeatureStoreModule,
  ],
})
export class AppModule {}