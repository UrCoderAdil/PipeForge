import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { DataValidationService } from './data-validation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('data-validation')
export class DataValidationController {
  constructor(private readonly service: DataValidationService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post('run')
  run(@Body() body: { datasetName: string; pipelineId?: string }) {
    return this.service.run(body.datasetName, body.pipelineId);
  }
}
