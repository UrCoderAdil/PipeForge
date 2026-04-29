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
  ],
})
export class AppModule {}