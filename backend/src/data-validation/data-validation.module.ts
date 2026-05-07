import { Module } from '@nestjs/common';
import { DataValidationController } from './data-validation.controller';
import { DataValidationService } from './data-validation.service';

@Module({
  controllers: [DataValidationController],
  providers: [DataValidationService],
  exports: [DataValidationService],
})
export class DataValidationModule {}
