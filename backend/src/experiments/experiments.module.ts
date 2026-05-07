import { Module } from '@nestjs/common';
import { ExperimentsController } from './experiments.controller';
import { ExperimentsService } from './experiments.service';

@Module({
  controllers: [ExperimentsController],
  providers: [ExperimentsService],
  exports: [ExperimentsService],
})
export class ExperimentsModule {}
