import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ModelRegistryService } from './model-registry.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('model-registry')
export class ModelRegistryController {
  constructor(private readonly service: ModelRegistryService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/promote')
  promote(@Param('id') id: string, @Body() body: { stage: string }) {
    return this.service.promote(id, body.stage);
  }

  @Post(':modelName/rollback')
  rollback(@Param('modelName') modelName: string) {
    return this.service.rollback(modelName);
  }
}
