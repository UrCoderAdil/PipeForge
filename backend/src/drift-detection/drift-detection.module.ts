import { Module } from '@nestjs/common';
import { DriftDetectionController } from './drift-detection.controller';
import { DriftDetectionService } from './drift-detection.service';

@Module({
  controllers: [DriftDetectionController],
  providers: [DriftDetectionService],
  exports: [DriftDetectionService],
})
export class DriftDetectionModule {}
