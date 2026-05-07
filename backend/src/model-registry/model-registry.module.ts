import { Module } from '@nestjs/common';
import { ModelRegistryController } from './model-registry.controller';
import { ModelRegistryService } from './model-registry.service';

@Module({
  controllers: [ModelRegistryController],
  providers: [ModelRegistryService],
  exports: [ModelRegistryService],
})
export class ModelRegistryModule {}
