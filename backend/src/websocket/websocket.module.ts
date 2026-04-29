import { Module } from '@nestjs/common';
import { ExecutionGateway } from './execution.gateway';

@Module({
  providers: [ExecutionGateway],
})
export class WebsocketModule {}