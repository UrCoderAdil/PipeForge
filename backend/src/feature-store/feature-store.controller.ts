import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { FeatureStoreService } from './feature-store.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('feature-store')
export class FeatureStoreController {
  constructor(private readonly service: FeatureStoreService) {}

  @Get()
  findAll(@Query('entity') entity?: string) {
    if (entity) return this.service.findByEntity(entity);
    return this.service.findAll();
  }

  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.service.toggle(id);
  }
}
