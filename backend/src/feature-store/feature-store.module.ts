import { Module } from '@nestjs/common';
import { FeatureStoreController } from './feature-store.controller';
import { FeatureStoreService } from './feature-store.service';

@Module({
  controllers: [FeatureStoreController],
  providers: [FeatureStoreService],
  exports: [FeatureStoreService],
})
export class FeatureStoreModule {}
